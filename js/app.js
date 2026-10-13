// Start aplikacji, wybór modułu zapisu, zakładki i odświeżanie widoku.
//
// Każda zmiana danych to trzy kroki: zapis przez moduł storage, a dopiero
// po udanym zapisie aktualizacja stanu i ponowne narysowanie bieżącego widoku.

// Moduł zapisu. W wersji z bazą podmieniamy tu import na storage-supabase.js.
import * as storage from "./storage-local.js";
import { createBlock } from "./model.js";
import { todayString } from "./dates.js";
import * as todayView from "./views/today.js";
import * as progressView from "./views/progress.js";
import * as tasksView from "./views/tasks.js";

// Zakładki: nazwa zakładki (data-tab i id sekcji w index.html) → widok.
const VIEWS = {
  today: todayView,
  progress: progressView,
  tasks: tasksView,
};

// Cały stan aplikacji w jednym obiekcie.
const state = {
  data: null,       // { version, tasks, blocks } z modułu zapisu
  tab: "today",     // bieżąca zakładka
};

// Operacje na danych, które widoki mogą wywołać.
// Widoki nie znają modułu zapisu, więc nie zależą od tego, gdzie leżą dane.
const actions = {
  addBlock,
};

const errorBox = document.getElementById("error");
const errorText = document.getElementById("error-text");
const retryButton = document.getElementById("error-retry");

// Co zrobić po kliknięciu „Spróbuj ponownie”.
let retryAction = null;

// Pokazuje komunikat o błędzie z przyciskiem „Spróbuj ponownie”.
function showError(message, retry) {
  errorText.textContent = message;
  // Jeśli wcześniejszy błąd wciąż czeka na ponowienie, nie gubimy go:
  // „Spróbuj ponownie” powtórzy obie operacje.
  const previousRetry = retryAction;
  if (previousRetry === null) {
    retryAction = retry;
  } else {
    retryAction = () => {
      previousRetry();
      retry();
    };
  }
  errorBox.hidden = false;
}

function hideError() {
  errorBox.hidden = true;
  retryAction = null;
}

retryButton.addEventListener("click", () => {
  const retry = retryAction;
  hideError();
  retry();
});

// Dzień, dla którego ostatnio narysowaliśmy widok.
let renderedDay = null;

// Rysuje od nowa bieżącą zakładkę, a pozostałe chowa.
function render() {
  if (state.data === null) {
    return; // dane jeszcze się nie wczytały
  }
  for (const [name, view] of Object.entries(VIEWS)) {
    const section = document.getElementById(name);
    const button = document.querySelector(`[data-tab="${name}"]`);
    const isCurrent = name === state.tab;

    section.hidden = !isCurrent;
    if (isCurrent) {
      button.setAttribute("aria-current", "page");
      view.render(section, state, actions);
    } else {
      button.removeAttribute("aria-current");
    }
  }
  renderedDay = todayString();
}

for (const button of document.querySelectorAll("[data-tab]")) {
  button.addEventListener("click", () => {
    state.tab = button.dataset.tab;
    render();
  });
}

// Przypięta karta bywa otwarta przez noc. Co minutę sprawdzamy, czy zaczął się
// nowy dzień; jeśli tak, rysujemy widok od nowa, żeby „Dziś” nie pokazywało wczoraj.
setInterval(() => {
  if (todayString() !== renderedDay) {
    render();
  }
}, 60 * 1000);

// Zapisuje blok 25 minut wybranego zadania z bieżącą datą i godziną.
async function addBlock(taskId) {
  const block = createBlock({ taskId });
  await saveBlock(block);
}

// Stan zmieniamy dopiero po udanym zapisie, żeby kafelek nigdy nie pokazał
// bloku, którego nie ma w pamięci. Przy błędzie „Spróbuj ponownie” zapisuje
// ten sam blok, z godziną pierwotnego kliknięcia.
async function saveBlock(block) {
  try {
    await storage.addBlock(block);
  } catch (error) {
    const task = state.data.tasks.find((candidate) => candidate.id === block.taskId);
    showError(`Nie udało się zapisać bloku (${task.name}, ${block.time}). ${error.message}`, () => saveBlock(block));
    return;
  }
  state.data.blocks.push(block);
  render();
}

// Napis „Wczytywanie…” z index.html. Chowamy go dopiero na samym końcu startu:
// jeśli start przerwie nieprzewidziany błąd, napis zostaje i mówi, co zrobić.
const loadingNotice = document.getElementById("loading");

async function start() {
  try {
    state.data = await storage.load();
  } catch (error) {
    showError(`Nie udało się wczytać danych. ${error.message}`, start);
    loadingNotice.hidden = true;
    return;
  }
  render();
  loadingNotice.hidden = true;
}

start();

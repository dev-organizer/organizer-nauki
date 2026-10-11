// Start aplikacji, wybór modułu zapisu, zakładki i odświeżanie widoku.
//
// Każda zmiana danych to trzy kroki: aktualizacja stanu,
// zapis przez moduł storage, ponowne narysowanie bieżącego widoku.

// Moduł zapisu. W kroku 10 podmieniamy tu import na storage-supabase.js.
import * as storage from "./storage-local.js";
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
  data: null,    // { version, tasks, blocks } z modułu zapisu
  tab: "today",  // bieżąca zakładka
};

const errorBox = document.getElementById("error");
const errorText = document.getElementById("error-text");
const retryButton = document.getElementById("error-retry");

// Co zrobić po kliknięciu „Spróbuj ponownie”.
let retryAction = null;

// Pokazuje komunikat o błędzie z przyciskiem „Spróbuj ponownie”.
function showError(message, retry) {
  errorText.textContent = message;
  retryAction = retry;
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
      view.render(section, state);
    } else {
      button.removeAttribute("aria-current");
    }
  }
}

for (const button of document.querySelectorAll("[data-tab]")) {
  button.addEventListener("click", () => {
    state.tab = button.dataset.tab;
    render();
  });
}

async function start() {
  try {
    state.data = await storage.load();
  } catch (error) {
    showError(`Nie udało się wczytać danych. ${error.message}`, start);
    return;
  }
  render();
}

start();

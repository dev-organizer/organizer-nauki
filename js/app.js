// Start aplikacji, wybór modułu zapisu, zakładki i odświeżanie widoku.
//
// Każda zmiana danych to trzy kroki: zapis przez moduł storage, a dopiero
// po udanym zapisie aktualizacja stanu i ponowne narysowanie bieżącego widoku.

// Moduł zapisu. W wersji z bazą podmieniamy tu import na storage-supabase.js.
import * as storage from "./storage-local.js";
import { createBlock, parseBackup, dataSummaryText, exportFileName, damagedFileName } from "./model.js";
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
  data: null,            // { version, tasks, blocks } z modułu zapisu
  tab: "today",          // bieżąca zakładka
  loadError: null,       // { message, rawText }, gdy zapisanych danych nie da się odczytać
  lastExportDate: null,  // data ostatniego eksportu "RRRR-MM-DD" albo null
  importOffer: null,     // { fileName, data }: plik kopii czekający na „Tak / Nie”
  backupNotice: null,    // { text, isError }: komunikat po eksporcie albo imporcie
};

// Operacje na danych, które widoki mogą wywołać.
// Widoki nie znają modułu zapisu, więc nie zależą od tego, gdzie leżą dane.
const actions = {
  addBlock,
  exportData,
  chooseImportFile,
  confirmImport,
  cancelImport,
  downloadDamagedData,
  retryLoad: start,
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

const nav = document.querySelector("nav");
const damagedSection = document.getElementById("damaged");

// Dzień, dla którego ostatnio narysowaliśmy widok.
let renderedDay = null;

// Rysuje od nowa bieżącą zakładkę, a pozostałe chowa.
// Gdy zapisanych danych nie da się odczytać, zamiast zakładek rysuje panel z pobraniem
// uszkodzonych danych i importem kopii.
function render() {
  if (state.data === null) {
    if (state.loadError !== null) {
      nav.hidden = true;
      damagedSection.hidden = false;
      tasksView.renderDamaged(damagedSection, state, actions);
    }
    return; // dane jeszcze się nie wczytały
  }
  nav.hidden = false;
  damagedSection.hidden = true;

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
    if (state.tab !== button.dataset.tab) {
      state.tab = button.dataset.tab;
      // Wyjście z zakładki działa jak „Nie” w potwierdzeniu importu i chowa stare komunikaty.
      state.importOffer = null;
      state.backupNotice = null;
    }
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

// ---------------------------------------------------------------------------
// Kopia zapasowa (F7): eksport, import i pobranie uszkodzonych danych.

// Pobiera tekst jako plik. Przeglądarka zapisuje go w folderze pobranych plików.
function downloadFile(fileName, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  // Adres pliku zwalniamy chwilę później: tuż po kliknięciu przeglądarka może go jeszcze czytać.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Pobiera wszystkie dane jako plik organizer-nauki-RRRR-MM-DD.json.
async function exportData() {
  let data;
  try {
    data = await storage.exportAll();
  } catch (error) {
    showError(`Nie udało się przygotować kopii. ${error.message}`, exportData);
    return;
  }
  const today = todayString();
  const fileName = exportFileName(today);
  // Wcięcia sprawiają, że plik da się przeczytać w Notatniku.
  downloadFile(fileName, JSON.stringify(data, null, 2), "application/json");

  state.importOffer = null;
  state.backupNotice = {
    text: `Pobieranie kopii: ${fileName}. Przeglądarka zapisuje ją w folderze pobranych plików (zwykle „Pobrane”).`,
    isError: false,
  };
  await rememberExport(today);
}

// Zapamiętuje datę eksportu dla „Ostatnia kopia: …”.
async function rememberExport(date) {
  try {
    await storage.saveLastExportDate(date);
  } catch (error) {
    showError(`Kopia się pobrała, ale nie udało się zapamiętać jej daty. ${error.message}`, () => rememberExport(date));
    render();
    return;
  }
  state.lastExportDate = date;
  render();
}

// Pobiera surowy tekst uszkodzonych danych, żeby dało się je później odratować.
function downloadDamagedData() {
  const fileName = damagedFileName(todayString());
  downloadFile(fileName, state.loadError.rawText, "text/plain");
  state.backupNotice = {
    text: `Pobieranie uszkodzonych danych: ${fileName}. Przeglądarka zapisuje je w folderze pobranych plików (zwykle „Pobrane”).`,
    isError: false,
  };
  render();
}

const importInput = document.getElementById("import-file");

// Otwiera okno wyboru pliku kopii. Potwierdzenie importu pokazuje się w zakładce „Zadania”,
// także po kliknięciu „Masz kopię? Importuj” na ekranie „Dziś” (a przy uszkodzonych
// danych w panelu zamiast zakładek).
function chooseImportFile() {
  if (state.data !== null) {
    state.tab = "tasks";
  }
  state.importOffer = null;
  state.backupNotice = null;
  render();
  // Bez wyczyszczenia ponowny wybór tego samego pliku nie dałby zdarzenia "change".
  importInput.value = "";
  importInput.click();
}

importInput.addEventListener("change", () => {
  const file = importInput.files[0];
  if (file !== undefined) {
    readImportFile(file);
  }
});

// Czyta i sprawdza wybrany plik, ale jeszcze niczego nie zapisuje: dobry plik czeka
// na potwierdzenie, a zły daje komunikat, które pole i dlaczego.
async function readImportFile(file) {
  try {
    const data = parseBackup(await file.text());
    state.importOffer = { fileName: file.name, data };
  } catch (error) {
    state.backupNotice = {
      text: `Nie da się zaimportować pliku ${file.name}. ${error.message} Obecne dane są bez zmian.`,
      isError: true,
    };
  }
  render();
}

function confirmImport() {
  importData(state.importOffer);
}

function cancelImport() {
  state.importOffer = null;
  render();
}

// Zastępuje wszystkie dane danymi z pliku. Stan zmieniamy dopiero po udanym zapisie.
async function importData(offer) {
  try {
    await storage.replaceAll(offer.data);
  } catch (error) {
    showError(`Nie udało się zaimportować danych. ${error.message}`, () => importData(offer));
    return;
  }
  // Czekające „Spróbuj ponownie” dotyczą starych danych: blok wskazywałby zadanie,
  // którego po imporcie już nie ma. Dlatego je kasujemy.
  hideError();
  state.data = offer.data;
  state.loadError = null;
  state.tab = "tasks";
  state.importOffer = null;
  state.backupNotice = {
    text: `Zaimportowano ${offer.fileName}: ${dataSummaryText(offer.data)}.`,
    isError: false,
  };
  render();
}

// ---------------------------------------------------------------------------
// Start

// Napis „Wczytywanie…” z index.html. Chowamy go dopiero na samym końcu startu:
// jeśli start przerwie nieprzewidziany błąd, napis zostaje i mówi, co zrobić.
const loadingNotice = document.getElementById("loading");

async function start() {
  try {
    state.lastExportDate = await storage.loadLastExportDate();
    state.data = await storage.load();
  } catch (error) {
    if (error.rawText !== undefined) {
      // Dane są, ale uszkodzone: panel z pobraniem ich i importem kopii zamiast zakładek.
      state.loadError = { message: error.message, rawText: error.rawText };
      render();
    } else {
      showError(`Nie udało się wczytać danych. ${error.message}`, start);
    }
    loadingNotice.hidden = true;
    return;
  }
  state.loadError = null;
  render();
  loadingNotice.hidden = true;
}

start();

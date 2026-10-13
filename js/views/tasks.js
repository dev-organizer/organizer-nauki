// Zakładka „Zadania”: kopia zapasowa, czyli eksport i import (F7).
// Lista i edycja zadań (F4) oraz wylogowanie (F8) dochodzą później.
//
// Ten plik rysuje też panel, który zastępuje zakładki, gdy zapisanych danych nie da się
// odczytać: wtedy kopia jest najbardziej potrzebna.
//
// Nazwy plików i komunikaty mogą zawierać tekst z pliku użytkownika, więc wstawiamy je
// przez textContent, a nie przez innerHTML.

import { dataSummaryText, fewerBlocksWarning, lastExportText } from "../model.js";

export function render(container, state, actions) {
  const placeholder = document.createElement("p");
  placeholder.textContent = "Lista zadań pojawi się w kroku 7.";
  container.replaceChildren(placeholder, renderBackup(state, actions));
}

// Sekcja „Kopia zapasowa”: data ostatniej kopii, eksport, import i potwierdzenie importu.
function renderBackup(state, actions) {
  const section = document.createElement("section");
  section.className = "backup";

  const heading = document.createElement("h2");
  heading.textContent = "Kopia zapasowa";

  const lastExport = document.createElement("p");
  lastExport.textContent = lastExportText(state.lastExportDate);

  const buttons = document.createElement("div");
  buttons.className = "backup-buttons";
  buttons.append(
    createButton("Eksportuj dane", () => actions.exportData()),
    createButton("Importuj dane", () => actions.chooseImportFile()),
  );

  section.append(heading, lastExport, buttons);

  if (state.backupNotice !== null) {
    section.append(renderNotice(state.backupNotice));
  }
  if (state.importOffer !== null) {
    const currentText = dataSummaryText(state.data);
    const warning = fewerBlocksWarning(state.importOffer.data, state.data);
    section.append(renderImportOffer(state.importOffer, currentText, warning, actions));
  }
  return section;
}

// Panel zamiast zakładek, gdy zapisanych danych nie da się odczytać (F7):
// najpierw pobranie uszkodzonych danych, potem import kopii.
export function renderDamaged(container, state, actions) {
  const heading = document.createElement("h2");
  heading.textContent = "Nie udało się wczytać danych";

  const reason = document.createElement("p");
  reason.textContent = state.loadError.message;

  const safe = document.createElement("p");
  safe.textContent = "Nic nie zostało nadpisane: zapisane dane wciąż są w przeglądarce.";

  const steps = document.createElement("ol");
  steps.className = "damaged-steps";
  steps.append(
    renderStep(
      "Pobierz je do pliku, żeby dało się je później odratować.",
      createButton("Pobierz uszkodzone dane", () => actions.downloadDamagedData()),
    ),
    renderStep(
      `Zaimportuj ostatnią kopię (plik organizer-nauki-RRRR-MM-DD.json). Zastąpi uszkodzone dane. ${lastExportText(state.lastExportDate)}.`,
      createButton("Importuj kopię", () => actions.chooseImportFile()),
    ),
  );

  container.replaceChildren(heading, reason, safe, steps);

  if (state.backupNotice !== null) {
    container.append(renderNotice(state.backupNotice));
  }
  if (state.importOffer !== null) {
    // Obecnych danych nie da się policzyć, więc bez ostrzeżenia o mniejszej liczbie bloków.
    container.append(renderImportOffer(state.importOffer, "uszkodzone, nie da się ich odczytać", "", actions));
  }

  const retry = document.createElement("p");
  retry.className = "damaged-retry";
  retry.append(
    "Dane poprawione w inny sposób (np. w F12)? ",
    createButton("Spróbuj ponownie", () => actions.retryLoad()),
  );
  container.append(retry);
}

// Jeden krok na liście w panelu uszkodzonych danych: opis i przycisk pod nim.
function renderStep(text, button) {
  const item = document.createElement("li");
  const description = document.createElement("p");
  description.textContent = text;
  item.append(description, button);
  return item;
}

// Potwierdzenie importu na stronie (nie przez confirm()): co jest w pliku, co jest teraz
// i ostrzeżenie, gdy plik wygląda na starą kopię.
function renderImportOffer(offer, currentText, warning, actions) {
  const box = document.createElement("div");
  box.className = "import-offer";

  const question = document.createElement("p");
  question.className = "import-question";
  question.textContent = "Zastąpić obecne dane danymi z pliku?";

  const fileLine = document.createElement("p");
  fileLine.textContent = `Plik ${offer.fileName}: ${dataSummaryText(offer.data)}.`;

  const currentLine = document.createElement("p");
  currentLine.textContent = `Obecne dane: ${currentText}.`;

  box.append(question, fileLine, currentLine);

  if (warning !== "") {
    const warningLine = document.createElement("p");
    warningLine.className = "import-warning";
    warningLine.textContent = `⚠ ${warning}`;
    box.append(warningLine);
  }

  const buttons = document.createElement("div");
  buttons.className = "backup-buttons";
  buttons.append(
    createButton("Tak, zastąp", () => actions.confirmImport()),
    createButton("Nie", () => actions.cancelImport()),
  );
  box.append(buttons);
  return box;
}

// Komunikat po eksporcie albo imporcie. Błąd (np. zły plik) na ciemnym tle, nigdy na czerwono.
function renderNotice(notice) {
  const text = document.createElement("p");
  text.className = notice.isError ? "backup-notice backup-error" : "backup-notice";
  text.setAttribute("role", "status");
  text.textContent = notice.text;
  return text;
}

function createButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

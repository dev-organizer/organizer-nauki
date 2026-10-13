// Uruchamia wszystkie testy i pokazuje wynik na stronie tests.html.
// Nowy plik z testami dopisz do importów poniżej.

import { runTests } from "./check.js";
import "./dates.test.js";
import "./model.test.js";

const summary = document.getElementById("summary");
const timeZoneInfo = document.getElementById("time-zone");
const resultsBox = document.getElementById("results");

// Testy zmiany czasu coś sprawdzają tylko w strefie ze zmianą czasu (np. Europe/Warsaw).
function showTimeZone() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Strefa ma zmianę czasu, gdy różnica do UTC jest inna w styczniu i w lipcu.
  const hasTimeChange = new Date(2026, 0, 1).getTimezoneOffset() !== new Date(2026, 6, 1).getTimezoneOffset();
  if (hasTimeChange) {
    timeZoneInfo.textContent = `Strefa czasowa przeglądarki: ${timeZone}.`;
  } else {
    timeZoneInfo.textContent = `Strefa czasowa przeglądarki: ${timeZone}. Tu nie ma zmiany czasu, więc testy zmiany czasu niczego nie sprawdzają.`;
  }
}

function showSummary(results) {
  const passed = results.filter((result) => result.passed).length;
  if (passed === results.length) {
    summary.textContent = `Wszystkie testy przechodzą: ${passed} z ${results.length} ✓`;
  } else {
    summary.textContent = `Nie przechodzi: ${results.length - passed} z ${results.length} testów. Szczegóły niżej, przy ✗.`;
    summary.classList.add("failed");
  }
}

// Wyniki pogrupowane tak jak w plikach testów (describe).
function showResults(results) {
  let groupName = null;
  let groupList = null;
  for (const result of results) {
    if (result.group !== groupName) {
      groupName = result.group;
      const heading = document.createElement("h2");
      heading.textContent = groupName;
      groupList = document.createElement("ul");
      resultsBox.append(heading, groupList);
    }
    groupList.append(renderResult(result));
  }
}

// „✓ nazwa testu” albo „✗ nazwa testu: oczekiwano …, otrzymano …”.
function renderResult(result) {
  const item = document.createElement("li");
  if (result.passed) {
    item.textContent = `✓ ${result.name}`;
  } else {
    item.className = "failed";
    item.textContent = `✗ ${result.name}: ${result.message}`;
  }
  return item;
}

const results = runTests();
showTimeZone();
showSummary(results);
showResults(results);

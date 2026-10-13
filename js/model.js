// Dziedziny, format danych, tworzenie zadań i bloków oraz zliczenia.
// Ten plik nie zapisuje niczego sam: zapisem zajmuje się moduł storage.

import {
  todayString,
  currentTime,
  formatDuration,
  formatDate,
  daysBetween,
  isValidDate,
  isValidTime,
} from "./dates.js";

// Dziedziny są stałe i zapisane w kodzie, a nie w danych.
export const DOMAINS = [
  { id: "prog", name: "Programowanie" },
  { id: "eng",  name: "Angielski" },
  { id: "art",  name: "ART" },
];

// Wersja formatu danych. Przy zmianie formatu podnieś ją
// i dopisz migrację w upgradeData().
export const DATA_VERSION = 1;

// Długość jednego bloku w minutach.
export const BLOCK_MINUTES = 25;

// Najwyższy cel dzienny i najdłuższy blok, jakie przyjmuje import kopii i baza
// (SPEC.md, sekcja 6.3). 100 bloków to więcej, niż mieści się w dobie.
export const MAX_DAILY_GOAL = 100;
export const MAX_BLOCK_MINUTES = 24 * 60;

// Zadania, z którymi aplikacja startuje przy pierwszym uruchomieniu.
const START_TASKS = [
  { domainId: "prog", name: "Python",      color: "#1e88e5", dailyGoal: 2 },
  { domainId: "prog", name: "Frontend",    color: "#e53935", dailyGoal: 2 },
  { domainId: "prog", name: "Claude Code", color: "#fb8c00", dailyGoal: 1 },
  { domainId: "eng",  name: "Angielski",   color: "#8e24aa", dailyGoal: 4 },
  { domainId: "art",  name: "Rysunek",     color: "#43a047", dailyGoal: 1 },
];

// Nowy identyfikator, np. "3f1c…".
// crypto.randomUUID() działa tylko na https:// albo na localhost.
function newId() {
  return crypto.randomUUID();
}

// Nowe zadanie. dailyGoal = 0 oznacza zadanie bez celu.
export function createTask({ domainId, name, color, dailyGoal = 0 }) {
  return { id: newId(), domainId, name, color, dailyGoal, archived: false };
}

// Nowy blok. Bez daty i godziny dostaje bieżące, bez opisu pusty tekst.
export function createBlock({ taskId, date = todayString(), time = currentTime(), note = "" }) {
  return { id: newId(), taskId, date, time, minutes: BLOCK_MINUTES, note };
}

// Dane na pierwsze uruchomienie: 5 zadań startowych i zero bloków.
export function createStartData() {
  return {
    version: DATA_VERSION,
    tasks: START_TASKS.map((task) => createTask(task)),
    blocks: [],
  };
}

// Sprawdza wczytane dane i przenosi je do bieżącej wersji formatu.
// Używane przy wczytaniu z pamięci i przy imporcie pliku.
export function upgradeData(data) {
  if (!data || typeof data.version !== "number" || !Array.isArray(data.tasks) || !Array.isArray(data.blocks)) {
    throw new Error("To nie są dane organizera nauki.");
  }
  if (data.version > DATA_VERSION) {
    throw new Error("Dane pochodzą z nowszej wersji aplikacji. Odśwież stronę.");
  }

  // Tu dopisujemy migracje, po jednej na każdą zmianę formatu, np.:
  // if (data.version === 1) {
  //   data = { ...data, version: 2, ... };
  // }

  return data;
}

// Zadania widoczne na ekranie „Dziś” (bez zarchiwizowanych).
export function activeTasks(tasks) {
  return tasks.filter((task) => !task.archived);
}

// Zadania z jednej dziedziny, np. tasksInDomain(tasks, "prog").
export function tasksInDomain(tasks, domainId) {
  return tasks.filter((task) => task.domainId === domainId);
}

// Bloki z jednego dnia, np. blocksOnDate(blocks, "2026-10-12").
export function blocksOnDate(blocks, date) {
  return blocks.filter((block) => block.date === date);
}

// Liczba bloków jednego zadania w podanej liście bloków.
export function countBlocks(blocks, taskId) {
  return blocks.filter((block) => block.taskId === taskId).length;
}

// Cel dnia: suma celów aktywnych zadań (na start 2 + 2 + 1 + 4 + 1 = 10).
export function dailyGoalTotal(tasks) {
  return activeTasks(tasks).reduce((sum, task) => sum + task.dailyGoal, 0);
}

// Bloki, które liczą się do celu dnia: każde aktywne zadanie najwyżej do swojego celu.
// Python 4 / 2 daje 2, zadanie bez celu daje 0, więc nadmiar w jednym zadaniu
// nie zasłania braków w innym.
export function blocksTowardGoals(tasks, blocks) {
  return activeTasks(tasks).reduce(
    (sum, task) => sum + Math.min(countBlocks(blocks, task.id), task.dailyGoal),
    0,
  );
}

// Łączny czas bloków w minutach.
export function totalMinutes(blocks) {
  return blocks.reduce((sum, block) => sum + block.minutes, 0);
}

// Czy zadanie osiągnęło dzienny cel. Zadanie bez celu (0) nie ma czego osiągać.
export function isGoalReached(done, dailyGoal) {
  return dailyGoal > 0 && done >= dailyGoal;
}

// Liczba z polską odmianą słowa: 1 blok, 3 bloki, 5 bloków, 12 bloków, 22 bloki.
// Słowo podajemy w trzech formach: dla 1, dla 2–4 i dla pozostałych liczb.
function formatCount(count, one, twoToFour, many) {
  if (count === 1) {
    return `1 ${one}`;
  }
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const endsWith2to4 = lastDigit >= 2 && lastDigit <= 4;
  const endsWith12to14 = lastTwoDigits >= 12 && lastTwoDigits <= 14;
  if (endsWith2to4 && !endsWith12to14) {
    return `${count} ${twoToFour}`;
  }
  return `${count} ${many}`;
}

// Liczba bloków: 1 blok, 3 bloki, 5 bloków.
export function formatBlocks(count) {
  return formatCount(count, "blok", "bloki", "bloków");
}

// Liczba zadań: 1 zadanie, 3 zadania, 5 zadań.
export function formatTasks(count) {
  return formatCount(count, "zadanie", "zadania", "zadań");
}

// Tekst na kafelku: „1 / 2”, także ponad cel: „4 / 2”. Zadanie bez celu pokazuje
// samą liczbę bloków. Procent celu i ✓ są na kafelku osobno, po prawej.
export function tileCountText(done, dailyGoal) {
  if (dailyGoal === 0) {
    return String(done);
  }
  return `${done} / ${dailyGoal}`;
}

// Procent celu zadania: 1 / 4 → „25%”, 2 / 2 → „100%”, 3 / 2 → „150%”.
// Zaokrąglamy do całości: 1 / 3 → „33%”. Zadanie bez celu nie ma procentu: "".
export function goalPercentText(done, dailyGoal) {
  if (dailyGoal === 0) {
    return "";
  }
  return `${Math.round((done / dailyGoal) * 100)}%`;
}

// Suma dnia: najpierw wszystkie bloki z tego dnia, potem postęp względem celu dnia,
// np. „Dziś: 9 bloków · 3 h 45 min · cele: 7 z 10”. Po osiągnięciu wszystkich celów
// „cele: 10 z 10 ✓”. Gdy żadne aktywne zadanie nie ma celu, części „cele” nie ma.
export function daySummaryText(tasks, dayBlocks) {
  const summary = `Dziś: ${formatBlocks(dayBlocks.length)} · ${formatDuration(totalMinutes(dayBlocks))}`;
  const goal = dailyGoalTotal(tasks);
  if (goal === 0) {
    return summary;
  }
  const done = blocksTowardGoals(tasks, dayBlocks);
  const mark = isGoalReached(done, goal) ? " ✓" : "";
  return `${summary} · cele: ${done} z ${goal}${mark}`;
}

// Licznik łączny: „Łącznie: 312 bloków · 130 h”. Przy 0 blokach bez czasu: „Łącznie: 0 bloków”.
export function totalText(blocks) {
  if (blocks.length === 0) {
    return "Łącznie: 0 bloków";
  }
  return `Łącznie: ${formatBlocks(blocks.length)} · ${formatDuration(totalMinutes(blocks))}`;
}

// ---------------------------------------------------------------------------
// Kopia zapasowa (F7): sprawdzanie pliku, podsumowanie do potwierdzenia, nazwy plików.
//
// Sprawdzanie jest tak samo surowe jak baza (SPEC.md, sekcja 6.3): plik, który
// przejdzie import tutaj, przejdzie też import do bazy. Zmieniając jedno, zmień drugie.

// UUID z małymi literami, taki jak z crypto.randomUUID().
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
// Kolor jak z <input type="color">: "#1e88e5". Baza przyjmuje też wielkie litery.
const COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function isUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function isDomainId(value) {
  return DOMAINS.some((domain) => domain.id === value);
}

function isNonEmptyText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isText(value) {
  return typeof value === "string";
}

function isColor(value) {
  return typeof value === "string" && COLOR_PATTERN.test(value);
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isDailyGoal(value) {
  return Number.isInteger(value) && value >= 0 && value <= MAX_DAILY_GOAL;
}

function isBlockMinutes(value) {
  return Number.isInteger(value) && value >= 1 && value <= MAX_BLOCK_MINUTES;
}

const DOMAIN_IDS_TEXT = DOMAINS.map((domain) => domain.id).join(", ");

// Pola zadania: nazwa pola, funkcja sprawdzająca i opis do komunikatu („powinno być …”).
const TASK_RULES = [
  { field: "id", isValid: isUuid, expected: "identyfikatorem UUID" },
  { field: "domainId", isValid: isDomainId, expected: `jedną z dziedzin: ${DOMAIN_IDS_TEXT}` },
  { field: "name", isValid: isNonEmptyText, expected: "niepustym tekstem" },
  { field: "color", isValid: isColor, expected: "kolorem w formacie #rrggbb" },
  { field: "dailyGoal", isValid: isDailyGoal, expected: `liczbą całkowitą od 0 do ${MAX_DAILY_GOAL}` },
  { field: "archived", isValid: isBoolean, expected: "wartością true albo false" },
];

// Pola bloku, w tym samym układzie.
const BLOCK_RULES = [
  { field: "id", isValid: isUuid, expected: "identyfikatorem UUID" },
  { field: "taskId", isValid: isUuid, expected: "identyfikatorem UUID" },
  { field: "date", isValid: isValidDate, expected: "istniejącą datą w formacie RRRR-MM-DD" },
  { field: "time", isValid: isValidTime, expected: "godziną w formacie GG:MM, od 00:00 do 23:59" },
  { field: "minutes", isValid: isBlockMinutes, expected: `liczbą całkowitą od 1 do ${MAX_BLOCK_MINUTES}` },
  { field: "note", isValid: isText, expected: "tekstem (może być pusty)" },
];

// Wartość z pliku do komunikatu: tekst w cudzysłowie ("24:00"), liczba bez (2).
// Długie wartości skracamy, żeby komunikat zmieścił się na ekranie.
function describeValue(value) {
  const text = JSON.stringify(value);
  if (text.length > 40) {
    return `${text.slice(0, 40)}…`;
  }
  return text;
}

// Opis pierwszego złego pola według listy reguł albo "" (pusty tekst), gdy wszystko jest dobre.
function findFieldError(item, rules) {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return "to nie jest obiekt z polami";
  }
  for (const rule of rules) {
    const value = item[rule.field];
    // W pliku JSON nie ma wartości undefined, więc undefined to brak pola.
    if (value === undefined) {
      return `brak pola „${rule.field}”`;
    }
    if (!rule.isValid(value)) {
      return `pole „${rule.field}” ma wartość ${describeValue(value)}, a powinno być ${rule.expected}`;
    }
  }
  return "";
}

// „Zadanie nr 2 („Frontend”)”: numer od 1, w kolejności z pliku, i nazwa, jeśli jest.
function taskLabel(task, index) {
  const label = `Zadanie nr ${index + 1}`;
  if (isNonEmptyText(task?.name)) {
    return `${label} („${task.name}”)`;
  }
  return label;
}

// „Blok nr 12 (2026-10-12 07:40)”: numer od 1, w kolejności z pliku, i data z godziną, jeśli są.
function blockLabel(block, index) {
  const label = `Blok nr ${index + 1}`;
  if (isText(block?.date) && isText(block?.time)) {
    return `${label} (${block.date} ${block.time})`;
  }
  return label;
}

// Sprawdza dane z pliku kopii (już po upgradeData). Przy pierwszym złym miejscu zgłasza błąd,
// który mówi, które pole i dlaczego, np. „Blok nr 12 (2026-10-12 24:00): pole „time” ma wartość
// "24:00", a powinno być godziną w formacie GG:MM, od 00:00 do 23:59.”
export function validateData(data) {
  if (data.version !== DATA_VERSION) {
    throw new Error(`Nieznana wersja danych: ${describeValue(data.version)}.`);
  }

  // Każde id występuje w pliku najwyżej raz, a bloki wskazują tylko zadania z pliku.
  const usedIds = new Set();
  const taskIds = new Set();

  for (let index = 0; index < data.tasks.length; index++) {
    const task = data.tasks[index];
    const fieldError = findFieldError(task, TASK_RULES);
    if (fieldError !== "") {
      throw new Error(`${taskLabel(task, index)}: ${fieldError}.`);
    }
    if (usedIds.has(task.id)) {
      throw new Error(`${taskLabel(task, index)}: identyfikator ${task.id} powtarza się w pliku.`);
    }
    usedIds.add(task.id);
    taskIds.add(task.id);
  }

  for (let index = 0; index < data.blocks.length; index++) {
    const block = data.blocks[index];
    const fieldError = findFieldError(block, BLOCK_RULES);
    if (fieldError !== "") {
      throw new Error(`${blockLabel(block, index)}: ${fieldError}.`);
    }
    if (usedIds.has(block.id)) {
      throw new Error(`${blockLabel(block, index)}: identyfikator ${block.id} powtarza się w pliku.`);
    }
    if (!taskIds.has(block.taskId)) {
      throw new Error(`${blockLabel(block, index)}: wskazuje zadanie ${block.taskId}, którego nie ma w pliku.`);
    }
    usedIds.add(block.id);
  }
}

// Tekst pliku kopii → dane gotowe do importu. Zgłasza błąd z opisem, gdy plik
// nie jest kopią organizera albo ma błędne pola.
export function parseBackup(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error("To nie jest plik JSON.");
  }
  const data = upgradeData(parsed);
  validateData(data);
  return data;
}

// Ostatni blok (najpóźniejsza data i godzina) albo null, gdy bloków nie ma.
// Daty "RRRR-MM-DD" i godziny "GG:MM" porównane jako tekst układają się w kolejności czasu.
export function lastBlock(blocks) {
  let latest = null;
  for (const block of blocks) {
    if (latest === null || `${block.date} ${block.time}` > `${latest.date} ${latest.time}`) {
      latest = block;
    }
  }
  return latest;
}

// Podsumowanie danych do potwierdzenia importu: „5 zadań, 143 bloki, ostatni blok 13.10.2026 14:05”.
export function dataSummaryText(data) {
  const counts = `${formatTasks(data.tasks.length)}, ${formatBlocks(data.blocks.length)}`;
  const latest = lastBlock(data.blocks);
  if (latest === null) {
    return counts;
  }
  return `${counts}, ostatni blok ${formatDate(latest.date)} ${latest.time}`;
}

// Ostrzeżenie, gdy w pliku jest mniej bloków niż w obecnych danych: najczęstsza pomyłka
// to stara kopia. Pusty tekst, gdy ostrzegać nie trzeba.
export function fewerBlocksWarning(fileData, currentData) {
  const missing = currentData.blocks.length - fileData.blocks.length;
  if (missing <= 0) {
    return "";
  }
  return `W pliku jest o ${formatBlocks(missing)} mniej niż teraz. Najczęściej to znaczy, że to starsza kopia: import usunie bloki, których w niej nie ma.`;
}

// „Ostatnia kopia: dziś”, „wczoraj”, „9 dni temu”, a przed pierwszym eksportem „jeszcze żadnej”.
export function lastExportText(lastExportDate, today = todayString()) {
  if (lastExportDate === null) {
    return "Ostatnia kopia: jeszcze żadnej";
  }
  const days = daysBetween(lastExportDate, today);
  if (days <= 0) {
    return "Ostatnia kopia: dziś";
  }
  if (days === 1) {
    return "Ostatnia kopia: wczoraj";
  }
  return `Ostatnia kopia: ${days} dni temu`;
}

// Nazwy pobieranych plików zaczynają się od „organizer-nauki-”. Ten wzór jest w .gitignore,
// więc kopia z prywatnymi opisami bloków nie trafi do publicznego repozytorium.
export function exportFileName(date) {
  return `organizer-nauki-${date}.json`;
}

export function damagedFileName(date) {
  return `organizer-nauki-uszkodzone-${date}.txt`;
}

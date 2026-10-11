// Dziedziny, format danych, tworzenie zadań i bloków oraz zliczenia.
// Ten plik nie zapisuje niczego sam: zapisem zajmuje się moduł storage.

import { todayString, currentTime } from "./dates.js";

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

// Zadania, z którymi aplikacja startuje przy pierwszym uruchomieniu.
const START_TASKS = [
  { domainId: "prog", name: "Python",      color: "#1e88e5", dailyGoal: 2 },
  { domainId: "prog", name: "Frontend",    color: "#e53935", dailyGoal: 2 },
  { domainId: "prog", name: "Claude Code", color: "#fb8c00", dailyGoal: 0 },
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

// Cel dnia: suma celów aktywnych zadań (na start 2 + 2 + 0 + 4 + 1 = 9).
export function dailyGoalTotal(tasks) {
  return activeTasks(tasks).reduce((sum, task) => sum + task.dailyGoal, 0);
}

// Łączny czas bloków w minutach.
export function totalMinutes(blocks) {
  return blocks.reduce((sum, block) => sum + block.minutes, 0);
}

// Czy zadanie osiągnęło dzienny cel. Zadanie bez celu (0) nie ma czego osiągać.
export function isGoalReached(done, dailyGoal) {
  return dailyGoal > 0 && done >= dailyGoal;
}

// Liczba bloków z polską odmianą: 1 blok, 3 bloki, 5 bloków, 12 bloków, 22 bloki.
export function formatBlocks(count) {
  if (count === 1) {
    return "1 blok";
  }
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const endsWith2to4 = lastDigit >= 2 && lastDigit <= 4;
  const endsWith12to14 = lastTwoDigits >= 12 && lastTwoDigits <= 14;
  if (endsWith2to4 && !endsWith12to14) {
    return `${count} bloki`;
  }
  return `${count} bloków`;
}

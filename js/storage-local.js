// Zapis danych w localStorage przeglądarki (wersja lokalna).
//
// Wszystkie funkcje są asynchroniczne (zwracają Promise), tak samo jak
// przyszły storage-supabase.js. Dzięki temu przejście na bazę to
// zmiana jednego importu w app.js, bez zmian w widokach.
//
// Każdy błąd (np. przeglądarka blokuje zapis albo brakuje miejsca)
// kończy funkcję odrzuconym Promise, żeby widok mógł pokazać komunikat.

import { createStartData, upgradeData } from "./model.js";
import { isValidDate } from "./dates.js";

// Pod tym kluczem leży cały obiekt danych.
const KEY = "organizerNauki";

// Data ostatniego eksportu („Ostatnia kopia: …”). Osobno od danych, bo to informacja
// o tej przeglądarce, a nie część kopii.
const LAST_EXPORT_KEY = "organizerNaukiLastExport";

// Błąd odczytu z surowym tekstem zapisanych danych w polu rawText. Dzięki niemu
// aplikacja może zaproponować „Pobierz uszkodzone dane”, nie sięgając do localStorage.
function damagedDataError(message, rawText) {
  const error = new Error(message);
  error.rawText = rawText;
  return error;
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Dane w bieżącej wersji formatu. Przy pierwszym uruchomieniu zapisuje dane startowe.
// Uszkodzonych danych nie nadpisujemy danymi startowymi: zostają do odratowania.
function readData() {
  const text = localStorage.getItem(KEY);
  if (text === null) {
    const startData = createStartData();
    write(startData);
    return startData;
  }

  let saved;
  try {
    saved = JSON.parse(text);
  } catch (error) {
    throw damagedDataError("Zapisane dane są uszkodzone i nie da się ich odczytać.", text);
  }

  const savedVersion = saved?.version;
  let data;
  try {
    data = upgradeData(saved);
  } catch (error) {
    throw damagedDataError(error.message, text);
  }
  if (data.version !== savedVersion) {
    write(data);
  }
  return data;
}

// Wczytuje wszystkie dane: { version, tasks, blocks }.
export async function load() {
  return readData();
}

// Dopisuje nowy blok.
export async function addBlock(block) {
  const data = readData();
  data.blocks.push(block);
  write(data);
  return block;
}

// Usuwa blok o podanym id.
export async function deleteBlock(id) {
  const data = readData();
  data.blocks = data.blocks.filter((block) => block.id !== id);
  write(data);
}

// Dodaje nowe zadanie albo aktualizuje istniejące (o tym samym id).
export async function saveTask(task) {
  const data = readData();
  const index = data.tasks.findIndex((saved) => saved.id === task.id);
  if (index === -1) {
    data.tasks.push(task);
  } else {
    data.tasks[index] = task;
  }
  write(data);
  return task;
}

// Zastępuje wszystkie dane, np. danymi z pliku eksportu.
export async function replaceAll(data) {
  write(upgradeData(data));
}

// Zwraca wszystkie dane do zapisania w pliku eksportu.
export async function exportAll() {
  return readData();
}

// Data ostatniego eksportu "RRRR-MM-DD" albo null, gdy eksportu jeszcze nie było.
export async function loadLastExportDate() {
  const date = localStorage.getItem(LAST_EXPORT_KEY);
  if (isValidDate(date)) {
    return date;
  }
  return null;
}

// Zapamiętuje datę eksportu, np. "2026-10-13".
export async function saveLastExportDate(date) {
  localStorage.setItem(LAST_EXPORT_KEY, date);
}

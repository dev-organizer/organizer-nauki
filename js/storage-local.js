// Zapis danych w localStorage przeglądarki (kroki 1–7).
//
// Wszystkie funkcje są asynchroniczne (zwracają Promise), tak samo jak
// przyszły storage-supabase.js. Dzięki temu przejście na bazę to
// zmiana jednego importu w app.js, bez zmian w widokach.
//
// Każdy błąd (np. przeglądarka blokuje zapis albo brakuje miejsca)
// kończy funkcję odrzuconym Promise, żeby widok mógł pokazać komunikat.

import { createStartData, upgradeData } from "./model.js";

// Pod tym kluczem leży cały obiekt danych.
const KEY = "organizerNauki";

// Czyta dane z localStorage. Zwraca null, gdy jeszcze nic nie zapisano.
function readSaved() {
  const text = localStorage.getItem(KEY);
  if (text === null) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    // Nie nadpisujemy uszkodzonych danych danymi startowymi: zostają do odratowania.
    throw new Error("Zapisane dane są uszkodzone i nie da się ich odczytać.");
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Dane w bieżącej wersji formatu. Przy pierwszym uruchomieniu zapisuje dane startowe.
function readData() {
  const saved = readSaved();
  if (saved === null) {
    const startData = createStartData();
    write(startData);
    return startData;
  }

  const savedVersion = saved.version;
  const data = upgradeData(saved);
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

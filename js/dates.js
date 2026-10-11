// Daty w czasie lokalnym, zakresy dni i polskie skróty dni.
//
// Daty trzymamy jako tekst "RRRR-MM-DD", a godziny jako "GG:MM".
// Nie używamy toISOString(): zwraca czas UTC, więc blok zapisany
// tuż po północy trafiłby na poprzedni dzień.

const DAY_SHORT = ["nd", "pn", "wt", "śr", "cz", "pt", "sb"];

// Dopisuje zero z przodu: 7 → "07".
function twoDigits(number) {
  return String(number).padStart(2, "0");
}

// Obiekt Date → "2026-10-12" (czas lokalny).
export function toDateString(date) {
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
}

// "2026-10-12" → obiekt Date o północy czasu lokalnego.
// new Date("2026-10-12") odczytałby tekst jako UTC, dlatego składamy datę ręcznie.
export function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Dzisiejsza data, np. "2026-10-12".
export function todayString() {
  return toDateString(new Date());
}

// Bieżąca godzina, np. "07:40".
export function currentTime() {
  const now = new Date();
  return `${twoDigits(now.getHours())}:${twoDigits(now.getMinutes())}`;
}

// Przesuwa datę o podaną liczbę dni: addDays("2026-10-12", -1) → "2026-10-11".
export function addDays(dateString, days) {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

// Ostatnie dni do podanej daty włącznie, od najstarszego:
// lastDays(3, "2026-10-12") → ["2026-10-10", "2026-10-11", "2026-10-12"].
export function lastDays(count, endDate = todayString()) {
  const days = [];
  for (let i = count - 1; i >= 0; i--) {
    days.push(addDays(endDate, -i));
  }
  return days;
}

// Polski skrót dnia tygodnia: "2026-10-12" → "pn".
export function dayShort(dateString) {
  return DAY_SHORT[parseDate(dateString).getDay()];
}

// Krótki opis dnia do wykresu i raportu: "2026-10-12" → "pn 12.10".
export function dayLabel(dateString) {
  const [, month, day] = dateString.split("-");
  return `${dayShort(dateString)} ${day}.${month}`;
}

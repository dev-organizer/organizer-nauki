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

// Bieżąca godzina, np. "07:40". Testy podają godzinę wprost:
// currentTime(new Date(2026, 9, 13, 0, 5)) → "00:05".
export function currentTime(now = new Date()) {
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

// Liczba dni od jednej daty do drugiej: daysBetween("2026-10-04", "2026-10-13") → 9.
// Zaokrąglamy, bo doba ze zmianą czasu ma 23 albo 25 godzin.
export function daysBetween(fromDate, toDate) {
  const milliseconds = parseDate(toDate) - parseDate(fromDate);
  return Math.round(milliseconds / (24 * 60 * 60 * 1000));
}

// Czy tekst to istniejąca data "RRRR-MM-DD": "2026-02-28" tak, "2026-02-30" nie.
// Sprawdzamy w obie strony: Date zamienia 30 lutego na 2 marca, więc po zamianie
// z powrotem na tekst wychodzi inna data niż na wejściu.
export function isValidDate(text) {
  if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return false;
  }
  return toDateString(parseDate(text)) === text;
}

// Czy tekst to godzina "GG:MM" od 00:00 do 23:59: "07:40" tak, "24:00" i "7:40" nie.
export function isValidTime(text) {
  return typeof text === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(text);
}

// Data do pokazania na ekranie: "2026-10-13" → "13.10.2026".
export function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
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

// Czas w minutach jako tekst: 125 → "2 h 5 min", 7800 → "130 h", 25 → "25 min".
export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  if (hours === 0) {
    return `${restMinutes} min`;
  }
  if (restMinutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${restMinutes} min`;
}

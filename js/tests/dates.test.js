// Testy dat lokalnych, zakresów dni i czasu (js/dates.js).
// Datę i godzinę zawsze podajemy wprost, żeby wynik nie zależał od dnia uruchomienia.
// Testy zmiany czasu (25.10.2026 i 29.03.2026) coś sprawdzają tylko w strefie
// ze zmianą czasu, np. Europe/Warsaw; strefę pokazuje tests.html.

import { describe, test, equal } from "./check.js";
import {
  toDateString,
  parseDate,
  currentTime,
  addDays,
  lastDays,
  dayShort,
  dayLabel,
  formatDuration,
  daysBetween,
  isValidDate,
  isValidTime,
  formatDate,
} from "../dates.js";

describe("toDateString", () => {
  test("zwykły dzień", () => {
    equal(toDateString(new Date(2026, 9, 12, 7, 40)), "2026-10-12");
  });
  test("zero z przodu w miesiącu i dniu", () => {
    equal(toDateString(new Date(2026, 0, 5)), "2026-01-05");
  });
  // toISOString() dałby tu w Polsce "2026-10-12": o 00:05 w UTC jest jeszcze wczoraj.
  test("tuż po północy to już nowy dzień", () => {
    equal(toDateString(new Date(2026, 9, 13, 0, 5)), "2026-10-13");
  });
  test("tuż przed północą to jeszcze ten dzień", () => {
    equal(toDateString(new Date(2026, 9, 12, 23, 59)), "2026-10-12");
  });
});

describe("currentTime", () => {
  test("rano", () => {
    equal(currentTime(new Date(2026, 9, 12, 7, 40)), "07:40");
  });
  test("tuż po północy", () => {
    equal(currentTime(new Date(2026, 9, 13, 0, 5)), "00:05");
  });
  test("tuż przed północą", () => {
    equal(currentTime(new Date(2026, 9, 12, 23, 59)), "23:59");
  });
});

describe("parseDate", () => {
  test("północ czasu lokalnego, nie UTC", () => {
    const date = parseDate("2026-10-12");
    equal([date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours()], [2026, 10, 12, 0]);
  });
});

describe("addDays", () => {
  test("koniec miesiąca", () => {
    equal(addDays("2026-10-31", 1), "2026-11-01");
  });
  test("koniec roku", () => {
    equal(addDays("2026-12-31", 1), "2027-01-01");
  });
  test("wstecz przez początek roku", () => {
    equal(addDays("2027-01-01", -1), "2026-12-31");
  });
  test("luty w zwykłym roku", () => {
    equal(addDays("2026-02-28", 1), "2026-03-01");
  });
  test("luty w roku przestępnym", () => {
    equal(addDays("2028-02-28", 1), "2028-02-29");
  });
  test("zmiana czasu 25.10.2026 (dzień ma 25 godzin)", () => {
    equal([addDays("2026-10-25", 1), addDays("2026-10-26", -1)], ["2026-10-26", "2026-10-25"]);
  });
  test("zmiana czasu 29.03.2026 (dzień ma 23 godziny)", () => {
    equal([addDays("2026-03-29", 1), addDays("2026-03-30", -1)], ["2026-03-30", "2026-03-29"]);
  });
});

describe("lastDays", () => {
  test("3 dni, od najstarszego", () => {
    equal(lastDays(3, "2026-10-12"), ["2026-10-10", "2026-10-11", "2026-10-12"]);
  });
  test("przez koniec roku", () => {
    equal(lastDays(3, "2027-01-01"), ["2026-12-30", "2026-12-31", "2027-01-01"]);
  });
  test("przez zmianę czasu 25.10.2026: bez powtórzonych i zgubionych dni", () => {
    equal(lastDays(4, "2026-10-26"), ["2026-10-23", "2026-10-24", "2026-10-25", "2026-10-26"]);
  });
  test("przez zmianę czasu 29.03.2026: bez powtórzonych i zgubionych dni", () => {
    equal(lastDays(4, "2026-03-30"), ["2026-03-27", "2026-03-28", "2026-03-29", "2026-03-30"]);
  });
  test("30 dni przez zmianę czasu: 30 różnych dni, od 12.10 do 10.11", () => {
    const days = lastDays(30, "2026-11-10");
    equal([days.length, new Set(days).size, days[0], days[29]], [30, 30, "2026-10-12", "2026-11-10"]);
  });
});

describe("dayShort i dayLabel", () => {
  test("poniedziałek", () => {
    equal(dayShort("2026-10-12"), "pn");
  });
  test("niedziela", () => {
    equal(dayShort("2026-10-18"), "nd");
  });
  test("etykieta dnia do wykresu i raportu", () => {
    equal(dayLabel("2026-10-12"), "pn 12.10");
  });
});

describe("formatDuration", () => {
  test("0 min", () => {
    equal(formatDuration(0), "0 min");
  });
  test("25 min", () => {
    equal(formatDuration(25), "25 min");
  });
  test("pełna godzina", () => {
    equal(formatDuration(60), "1 h");
  });
  test("2 h 5 min", () => {
    equal(formatDuration(125), "2 h 5 min");
  });
  test("130 h", () => {
    equal(formatDuration(7800), "130 h");
  });
});

describe("daysBetween", () => {
  test("ten sam dzień", () => {
    equal(daysBetween("2026-10-13", "2026-10-13"), 0);
  });
  test("9 dni", () => {
    equal(daysBetween("2026-10-04", "2026-10-13"), 9);
  });
  test("przez koniec roku", () => {
    equal(daysBetween("2026-12-31", "2027-01-01"), 1);
  });
  test("wstecz daje liczbę ujemną", () => {
    equal(daysBetween("2026-10-13", "2026-10-12"), -1);
  });
  test("przez zmianę czasu 25.10.2026 (dzień ma 25 godzin)", () => {
    equal(daysBetween("2026-10-24", "2026-10-26"), 2);
  });
  test("przez zmianę czasu 29.03.2026 (dzień ma 23 godziny)", () => {
    equal(daysBetween("2026-03-28", "2026-03-30"), 2);
  });
});

describe("isValidDate", () => {
  test("zwykła data", () => {
    equal(isValidDate("2026-10-13"), true);
  });
  test("30 lutego nie istnieje", () => {
    equal(isValidDate("2026-02-30"), false);
  });
  test("29 lutego tylko w roku przestępnym", () => {
    equal([isValidDate("2028-02-29"), isValidDate("2026-02-29")], [true, false]);
  });
  test("miesiąc 13 nie istnieje", () => {
    equal(isValidDate("2026-13-01"), false);
  });
  test("bez zer z przodu to zły format", () => {
    equal(isValidDate("2026-1-5"), false);
  });
  test("rok 0000 nie istnieje", () => {
    equal(isValidDate("0000-01-01"), false);
  });
  test("liczba i brak wartości to nie data", () => {
    equal([isValidDate(20261013), isValidDate(null)], [false, false]);
  });
});

describe("isValidTime", () => {
  test("od 00:00 do 23:59", () => {
    equal([isValidTime("00:00"), isValidTime("07:40"), isValidTime("23:59")], [true, true, true]);
  });
  test("24:00 to już następny dzień", () => {
    equal(isValidTime("24:00"), false);
  });
  test("60 minut nie ma", () => {
    equal(isValidTime("12:60"), false);
  });
  test("bez zera z przodu i z sekundami to zły format", () => {
    equal([isValidTime("7:40"), isValidTime("07:40:00")], [false, false]);
  });
});

describe("formatDate", () => {
  test("data do pokazania na ekranie", () => {
    equal(formatDate("2026-10-13"), "13.10.2026");
  });
});

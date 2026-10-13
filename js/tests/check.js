// Krótka funkcja sprawdzająca dla testów, bez bibliotek.
//
// Test to nazwa i funkcja, która wywołuje equal() albo throwsError():
//
//   describe("formatDuration", () => {
//     test("2 h 5 min", () => {
//       equal(formatDuration(125), "2 h 5 min");
//     });
//   });
//
// Pierwszy niezgodny wynik kończy test jako nieudany. Nazwy są takie jak
// w popularnych bibliotekach do testów (np. Jest), więc łatwo się potem przesiąść.

const tests = [];

// Nazwa bieżącej grupy testów, np. "formatDuration".
let currentGroup = "";

// Niezgodny wynik. Odróżnia go od nieoczekiwanego błędu w samym teście.
class CheckFailed extends Error {}

// Grupa testów jednej funkcji.
export function describe(groupName, defineTests) {
  currentGroup = groupName;
  defineTests();
  currentGroup = "";
}

// Zapamiętuje test. Uruchamia go dopiero runTests().
export function test(name, testFunction) {
  tests.push({ group: currentGroup, name, testFunction });
}

// Sprawdza, czy wynik jest równy oczekiwanemu. Porównujemy tekst JSON,
// więc działa to też dla list i obiektów: ["a", "b"] jest równe ["a", "b"].
export function equal(actual, expected) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new CheckFailed(`oczekiwano ${expectedText}, otrzymano ${actualText}`);
  }
}

// Sprawdza, czy funkcja zgłasza błąd z dokładnie takim komunikatem.
export function throwsError(testedFunction, expectedMessage) {
  let error = null;
  try {
    testedFunction();
  } catch (caught) {
    error = caught;
  }
  if (error === null) {
    throw new CheckFailed(`oczekiwano błędu „${expectedMessage}”, a funkcja go nie zgłosiła`);
  }
  if (error.message !== expectedMessage) {
    throw new CheckFailed(`oczekiwano błędu „${expectedMessage}”, otrzymano „${error.message}”`);
  }
}

// Uruchamia wszystkie testy i zwraca listę wyników:
// { group, name, passed, message }, gdzie message mówi, co poszło nie tak.
export function runTests() {
  return tests.map(({ group, name, testFunction }) => {
    try {
      testFunction();
      return { group, name, passed: true, message: "" };
    } catch (error) {
      const message = error instanceof CheckFailed ? error.message : `nieoczekiwany błąd: ${error.message}`;
      return { group, name, passed: false, message };
    }
  });
}

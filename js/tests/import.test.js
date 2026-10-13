// Testy kopii zapasowej (js/model.js, F7): sprawdzanie pliku, podsumowanie do potwierdzenia
// importu, „Ostatnia kopia” i nazwy plików. Testy nie dotykają localStorage.

import { describe, test, equal, throwsError } from "./check.js";
import {
  DATA_VERSION,
  createBlock,
  createStartData,
  formatTasks,
  validateData,
  parseBackup,
  lastBlock,
  dataSummaryText,
  fewerBlocksWarning,
  lastExportText,
  exportFileName,
  damagedFileName,
} from "../model.js";

// Stałe id, żeby komunikaty w testach były przewidywalne.
const PYTHON_ID = "11111111-1111-4111-8111-111111111111";
const RYSUNEK_ID = "22222222-2222-4222-8222-222222222222";
const BLOCK_1_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const BLOCK_2_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const MISSING_TASK_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

// Dobry plik kopii: 2 zadania i 2 bloki. Każde wywołanie daje świeżą kopię,
// więc test może zepsuć jedno pole, nie psując danych innym testom.
function goodData() {
  return {
    version: DATA_VERSION,
    tasks: [
      { id: PYTHON_ID, domainId: "prog", name: "Python", color: "#1e88e5", dailyGoal: 2, archived: false },
      { id: RYSUNEK_ID, domainId: "art", name: "Rysunek", color: "#43a047", dailyGoal: 1, archived: false },
    ],
    blocks: [
      { id: BLOCK_1_ID, taskId: PYTHON_ID, date: "2026-10-12", time: "07:40", minutes: 25, note: "Day 25" },
      { id: BLOCK_2_ID, taskId: RYSUNEK_ID, date: "2026-10-13", time: "20:00", minutes: 25, note: "" },
    ],
  };
}

// Dobry plik ze zmienionymi polami pierwszego zadania, np. withTask({ color: "red" }).
function withTask(changes) {
  const data = goodData();
  data.tasks[0] = { ...data.tasks[0], ...changes };
  return data;
}

// Dobry plik ze zmienionymi polami pierwszego bloku, np. withBlock({ time: "24:00" }).
function withBlock(changes) {
  const data = goodData();
  data.blocks[0] = { ...data.blocks[0], ...changes };
  return data;
}

// Bloki do podsumowań: tylko data i godzina mają tu znaczenie.
function blockAt(date, time) {
  return createBlock({ taskId: PYTHON_ID, date, time });
}

const PYTHON = "Zadanie nr 1 („Python”)";
const FIRST_BLOCK = "Blok nr 1 (2026-10-12 07:40)";

describe("parseBackup: dobre pliki", () => {
  test("dobry plik wraca jako te same dane", () => {
    equal(parseBackup(JSON.stringify(goodData())), goodData());
  });
  test("dane startowe z blokami z aplikacji przechodzą import", () => {
    const data = createStartData();
    data.blocks.push(createBlock({ taskId: data.tasks[0].id, date: "2026-10-13", time: "00:05" }));
    equal(parseBackup(JSON.stringify(data)), data);
  });
  test("plik bez bloków przechodzi", () => {
    const data = { version: DATA_VERSION, tasks: goodData().tasks, blocks: [] };
    equal(parseBackup(JSON.stringify(data)), data);
  });
  test("kolor z wielkimi literami przechodzi (baza też go przyjmie)", () => {
    equal(parseBackup(JSON.stringify(withTask({ color: "#1E88E5" }))).tasks[0].color, "#1E88E5");
  });
  test("cel 0 i opis z cudzysłowem przechodzą", () => {
    const data = withTask({ dailyGoal: 0 });
    data.blocks[0].note = "Rozdział „Funkcje”, <b>bez</b> HTML";
    equal(parseBackup(JSON.stringify(data)), data);
  });
});

describe("parseBackup: pliki, które nie są kopią", () => {
  test("tekst, który nie jest JSON", () => {
    throwsError(() => parseBackup("zepsute"), "To nie jest plik JSON.");
  });
  test("inny plik JSON", () => {
    throwsError(() => parseBackup('{"name":"lista zakupów"}'), "To nie są dane organizera nauki.");
  });
  test("kopia z nowszej wersji aplikacji", () => {
    const data = { ...goodData(), version: DATA_VERSION + 1 };
    throwsError(() => parseBackup(JSON.stringify(data)), "Dane pochodzą z nowszej wersji aplikacji. Odśwież stronę.");
  });
  test("nieznana starsza wersja", () => {
    throwsError(() => validateData({ ...goodData(), version: 0 }), "Nieznana wersja danych: 0.");
  });
});

describe("validateData: zadania", () => {
  test("brak pola", () => {
    const data = goodData();
    delete data.tasks[0].archived;
    throwsError(() => validateData(data), `${PYTHON}: brak pola „archived”.`);
  });
  test("zadanie, które nie jest obiektem", () => {
    const data = goodData();
    data.tasks[0] = "Python";
    throwsError(() => validateData(data), "Zadanie nr 1: to nie jest obiekt z polami.");
  });
  test("id, które nie jest UUID", () => {
    throwsError(
      () => validateData(withTask({ id: "python" })),
      `${PYTHON}: pole „id” ma wartość "python", a powinno być identyfikatorem UUID.`,
    );
  });
  test("UUID z wielkimi literami (crypto.randomUUID() daje małe)", () => {
    throwsError(
      () => validateData(withTask({ id: "AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA" })),
      `${PYTHON}: pole „id” ma wartość "AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA", a powinno być identyfikatorem UUID.`,
    );
  });
  test("nieznana dziedzina", () => {
    throwsError(
      () => validateData(withTask({ domainId: "health" })),
      `${PYTHON}: pole „domainId” ma wartość "health", a powinno być jedną z dziedzin: prog, eng, art.`,
    );
  });
  test("pusta nazwa (same spacje)", () => {
    throwsError(
      () => validateData(withTask({ name: "   " })),
      "Zadanie nr 1: pole „name” ma wartość \"   \", a powinno być niepustym tekstem.",
    );
  });
  test("kolor spoza formatu #rrggbb", () => {
    throwsError(
      () => validateData(withTask({ color: "red" })),
      `${PYTHON}: pole „color” ma wartość "red", a powinno być kolorem w formacie #rrggbb.`,
    );
  });
  test("kolor z 5 cyframi", () => {
    throwsError(
      () => validateData(withTask({ color: "#1e88e" })),
      `${PYTHON}: pole „color” ma wartość "#1e88e", a powinno być kolorem w formacie #rrggbb.`,
    );
  });
  test("cel zapisany jako tekst (zły typ pola)", () => {
    throwsError(
      () => validateData(withTask({ dailyGoal: "2" })),
      `${PYTHON}: pole „dailyGoal” ma wartość "2", a powinno być liczbą całkowitą od 0 do 100.`,
    );
  });
  test("cel ułamkowy, ujemny i ponad 100", () => {
    const expected = (value) => `${PYTHON}: pole „dailyGoal” ma wartość ${value}, a powinno być liczbą całkowitą od 0 do 100.`;
    throwsError(() => validateData(withTask({ dailyGoal: 1.5 })), expected("1.5"));
    throwsError(() => validateData(withTask({ dailyGoal: -1 })), expected("-1"));
    throwsError(() => validateData(withTask({ dailyGoal: 101 })), expected("101"));
  });
  test("archived zapisane jako tekst (zły typ pola)", () => {
    throwsError(
      () => validateData(withTask({ archived: "false" })),
      `${PYTHON}: pole „archived” ma wartość "false", a powinno być wartością true albo false.`,
    );
  });
  test("powtórzone id zadania", () => {
    const data = goodData();
    data.tasks[1].id = PYTHON_ID;
    throwsError(() => validateData(data), `Zadanie nr 2 („Rysunek”): identyfikator ${PYTHON_ID} powtarza się w pliku.`);
  });
});

describe("validateData: bloki", () => {
  test("brak pola", () => {
    const data = goodData();
    delete data.blocks[0].note;
    throwsError(() => validateData(data), `${FIRST_BLOCK}: brak pola „note”.`);
  });
  test("data 2026-02-30 nie istnieje", () => {
    throwsError(
      () => validateData(withBlock({ date: "2026-02-30" })),
      "Blok nr 1 (2026-02-30 07:40): pole „date” ma wartość \"2026-02-30\", a powinno być istniejącą datą w formacie RRRR-MM-DD.",
    );
  });
  test("godzina 24:00", () => {
    throwsError(
      () => validateData(withBlock({ time: "24:00" })),
      "Blok nr 1 (2026-10-12 24:00): pole „time” ma wartość \"24:00\", a powinno być godziną w formacie GG:MM, od 00:00 do 23:59.",
    );
  });
  test("minuty 0", () => {
    throwsError(
      () => validateData(withBlock({ minutes: 0 })),
      `${FIRST_BLOCK}: pole „minutes” ma wartość 0, a powinno być liczbą całkowitą od 1 do 1440.`,
    );
  });
  test("opis null zamiast pustego tekstu", () => {
    throwsError(
      () => validateData(withBlock({ note: null })),
      `${FIRST_BLOCK}: pole „note” ma wartość null, a powinno być tekstem (może być pusty).`,
    );
  });
  test("id bloku, które nie jest UUID", () => {
    throwsError(
      () => validateData(withBlock({ id: "1" })),
      `${FIRST_BLOCK}: pole „id” ma wartość "1", a powinno być identyfikatorem UUID.`,
    );
  });
  test("powtórzone id bloku", () => {
    const data = goodData();
    data.blocks[1].id = BLOCK_1_ID;
    throwsError(() => validateData(data), `Blok nr 2 (2026-10-13 20:00): identyfikator ${BLOCK_1_ID} powtarza się w pliku.`);
  });
  test("blok z tym samym id co zadanie", () => {
    throwsError(
      () => validateData(withBlock({ id: RYSUNEK_ID })),
      `${FIRST_BLOCK}: identyfikator ${RYSUNEK_ID} powtarza się w pliku.`,
    );
  });
  test("blok wskazuje zadanie, którego nie ma w pliku", () => {
    throwsError(
      () => validateData(withBlock({ taskId: MISSING_TASK_ID })),
      `${FIRST_BLOCK}: wskazuje zadanie ${MISSING_TASK_ID}, którego nie ma w pliku.`,
    );
  });
  test("długa wartość jest w komunikacie skrócona do 40 znaków", () => {
    throwsError(
      () => validateData(withBlock({ note: ["Rozdział 1", "Rozdział 2", "Rozdział 3", "Rozdział 4"] })),
      `${FIRST_BLOCK}: pole „note” ma wartość ["Rozdział 1","Rozdział 2","Rozdział 3",…, a powinno być tekstem (może być pusty).`,
    );
  });
});

describe("formatTasks", () => {
  test("0, 1, 3, 5, 12, 22", () => {
    equal(
      [formatTasks(0), formatTasks(1), formatTasks(3), formatTasks(5), formatTasks(12), formatTasks(22)],
      ["0 zadań", "1 zadanie", "3 zadania", "5 zadań", "12 zadań", "22 zadania"],
    );
  });
});

describe("lastBlock", () => {
  test("brak bloków", () => {
    equal(lastBlock([]), null);
  });
  test("najpóźniejsza data, niezależnie od kolejności w liście", () => {
    const blocks = [blockAt("2026-10-13", "08:00"), blockAt("2026-10-14", "07:00"), blockAt("2026-10-12", "23:00")];
    equal(lastBlock(blocks), blocks[1]);
  });
  test("ten sam dzień: najpóźniejsza godzina", () => {
    const blocks = [blockAt("2026-10-13", "20:00"), blockAt("2026-10-13", "09:30")];
    equal(lastBlock(blocks), blocks[0]);
  });
});

describe("dataSummaryText", () => {
  test("zadania, bloki i ostatni blok", () => {
    equal(dataSummaryText(goodData()), "2 zadania, 2 bloki, ostatni blok 13.10.2026 20:00");
  });
  test("bez bloków: bez ostatniego bloku", () => {
    equal(dataSummaryText(createStartData()), "5 zadań, 0 bloków");
  });
});

describe("fewerBlocksWarning", () => {
  // Dane z podaną liczbą bloków; do ostrzeżenia liczy się tylko liczba.
  function dataWithBlocks(count) {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      blocks.push(blockAt("2026-10-13", "08:00"));
    }
    return { version: DATA_VERSION, tasks: [], blocks };
  }

  test("w pliku o 7 bloków mniej: ostrzeżenie", () => {
    equal(
      fewerBlocksWarning(dataWithBlocks(143), dataWithBlocks(150)),
      "W pliku jest o 7 bloków mniej niż teraz. Najczęściej to znaczy, że to starsza kopia: import usunie bloki, których w niej nie ma.",
    );
  });
  test("o 1 blok mniej", () => {
    equal(fewerBlocksWarning(dataWithBlocks(2), dataWithBlocks(3)).startsWith("W pliku jest o 1 blok mniej"), true);
  });
  test("tyle samo bloków: bez ostrzeżenia", () => {
    equal(fewerBlocksWarning(dataWithBlocks(3), dataWithBlocks(3)), "");
  });
  test("więcej bloków w pliku: bez ostrzeżenia", () => {
    equal(fewerBlocksWarning(dataWithBlocks(5), dataWithBlocks(0)), "");
  });
});

describe("lastExportText", () => {
  test("przed pierwszym eksportem", () => {
    equal(lastExportText(null, "2026-10-13"), "Ostatnia kopia: jeszcze żadnej");
  });
  test("dziś", () => {
    equal(lastExportText("2026-10-13", "2026-10-13"), "Ostatnia kopia: dziś");
  });
  test("wczoraj", () => {
    equal(lastExportText("2026-10-12", "2026-10-13"), "Ostatnia kopia: wczoraj");
  });
  test("9 dni temu", () => {
    equal(lastExportText("2026-10-04", "2026-10-13"), "Ostatnia kopia: 9 dni temu");
  });
  test("przez zmianę czasu 25.10.2026", () => {
    equal(lastExportText("2026-10-24", "2026-10-26"), "Ostatnia kopia: 2 dni temu");
  });
  test("data z przyszłości (np. przestawiony zegar) to dziś", () => {
    equal(lastExportText("2026-10-14", "2026-10-13"), "Ostatnia kopia: dziś");
  });
});

describe("nazwy plików", () => {
  // Oba wzory są w .gitignore („organizer-nauki-*”).
  test("kopia", () => {
    equal(exportFileName("2026-10-13"), "organizer-nauki-2026-10-13.json");
  });
  test("uszkodzone dane", () => {
    equal(damagedFileName("2026-10-13"), "organizer-nauki-uszkodzone-2026-10-13.txt");
  });
});

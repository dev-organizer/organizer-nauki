// Testy modelu danych, zliczeń i tekstów ekranu „Dziś” (js/model.js).
// Testy nie dotykają localStorage: tests.html jest też na GitHub Pages, obok prawdziwych danych.

import { describe, test, equal, throwsError } from "./check.js";
import {
  DATA_VERSION,
  createBlock,
  createStartData,
  upgradeData,
  activeTasks,
  blocksOnDate,
  countBlocks,
  dailyGoalTotal,
  blocksTowardGoals,
  isGoalReached,
  formatBlocks,
  tileCountText,
  goalPercentText,
  daySummaryText,
  totalText,
} from "../model.js";

// Zadanie testowe z czytelnym id, np. task("python", 2).
function task(id, dailyGoal, archived = false) {
  return { id, domainId: "prog", name: id, color: "#1e88e5", dailyGoal, archived };
}

// Bloki jednego zadania z jednego dnia, np. blocksOf("python", 2).
function blocksOf(taskId, count, date = "2026-10-13") {
  const blocks = [];
  for (let i = 0; i < count; i++) {
    blocks.push(createBlock({ taskId, date, time: "08:00" }));
  }
  return blocks;
}

// Przykład z SPEC.md (F1): Python 2 / 2, Frontend 2 / 2, Claude Code 3 / 1,
// Angielski 1 / 4, Rysunek 1 / 1. Razem 9 bloków, do celów liczy się 7 z 10.
const EXAMPLE_TASKS = [
  task("python", 2),
  task("frontend", 2),
  task("claude", 1),
  task("angielski", 4),
  task("rysunek", 1),
];
const EXAMPLE_BLOCKS = [
  ...blocksOf("python", 2),
  ...blocksOf("frontend", 2),
  ...blocksOf("rysunek", 1),
  ...blocksOf("angielski", 1),
  ...blocksOf("claude", 3),
];

const UUID_FORMAT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const NOT_ORGANIZER_DATA = "To nie są dane organizera nauki.";

describe("formatBlocks", () => {
  test("0 bloków", () => {
    equal(formatBlocks(0), "0 bloków");
  });
  test("1 blok", () => {
    equal(formatBlocks(1), "1 blok");
  });
  test("2 bloki i 4 bloki", () => {
    equal([formatBlocks(2), formatBlocks(4)], ["2 bloki", "4 bloki"]);
  });
  test("5 bloków", () => {
    equal(formatBlocks(5), "5 bloków");
  });
  test("12 i 14 bloków (nie „bloki”)", () => {
    equal([formatBlocks(12), formatBlocks(14)], ["12 bloków", "14 bloków"]);
  });
  test("22 bloki", () => {
    equal(formatBlocks(22), "22 bloki");
  });
  test("112 bloków i 122 bloki", () => {
    equal([formatBlocks(112), formatBlocks(122)], ["112 bloków", "122 bloki"]);
  });
});

describe("createBlock", () => {
  test("blok z podaną datą i godziną tuż po północy", () => {
    const block = createBlock({ taskId: "python", date: "2026-10-13", time: "00:05" });
    equal(
      [block.taskId, block.date, block.time, block.minutes, block.note],
      ["python", "2026-10-13", "00:05", 25, ""],
    );
  });
  test("id w formacie UUID, inne dla każdego bloku", () => {
    const first = createBlock({ taskId: "python" });
    const second = createBlock({ taskId: "python" });
    equal([UUID_FORMAT.test(first.id), first.id === second.id], [true, false]);
  });
});

describe("createStartData", () => {
  test("5 zadań, 0 bloków, cel dnia 10, bieżąca wersja", () => {
    const data = createStartData();
    equal(
      [data.version, data.tasks.length, data.blocks.length, dailyGoalTotal(data.tasks)],
      [DATA_VERSION, 5, 0, 10],
    );
  });
  test("każde zadanie ma inne id w formacie UUID", () => {
    const ids = createStartData().tasks.map((startTask) => startTask.id);
    equal([new Set(ids).size, ids.every((id) => UUID_FORMAT.test(id))], [5, true]);
  });
});

describe("upgradeData", () => {
  test("dobre dane z bieżącej wersji wracają bez zmian", () => {
    const data = createStartData();
    equal(upgradeData(data), data);
  });
  test("odrzuca brak danych", () => {
    throwsError(() => upgradeData(null), NOT_ORGANIZER_DATA);
  });
  test("odrzuca inny plik JSON", () => {
    throwsError(() => upgradeData({ name: "lista zakupów" }), NOT_ORGANIZER_DATA);
  });
  test("odrzuca zadania, które nie są listą", () => {
    throwsError(() => upgradeData({ version: 1, tasks: "Python", blocks: [] }), NOT_ORGANIZER_DATA);
  });
  test("odrzuca wersję zapisaną jako tekst", () => {
    throwsError(() => upgradeData({ version: "1", tasks: [], blocks: [] }), NOT_ORGANIZER_DATA);
  });
  test("odrzuca dane z nowszej wersji aplikacji", () => {
    throwsError(
      () => upgradeData({ version: DATA_VERSION + 1, tasks: [], blocks: [] }),
      "Dane pochodzą z nowszej wersji aplikacji. Odśwież stronę.",
    );
  });
});

describe("activeTasks i dailyGoalTotal", () => {
  test("cel dnia zadań z przykładu: 2 + 2 + 1 + 4 + 1 = 10", () => {
    equal(dailyGoalTotal(EXAMPLE_TASKS), 10);
  });
  test("zarchiwizowane zadanie nie jest aktywne i nie liczy się do celu dnia", () => {
    const tasks = [task("python", 2), task("stare", 3, true)];
    equal([activeTasks(tasks).map((active) => active.id), dailyGoalTotal(tasks)], [["python"], 2]);
  });
});

describe("blocksOnDate i countBlocks", () => {
  test("bloki z jednego dnia i jednego zadania", () => {
    const blocks = [
      ...blocksOf("python", 2, "2026-10-12"),
      ...blocksOf("python", 1, "2026-10-13"),
      ...blocksOf("rysunek", 1, "2026-10-13"),
    ];
    const dayBlocks = blocksOnDate(blocks, "2026-10-13");
    equal([dayBlocks.length, countBlocks(dayBlocks, "python")], [2, 1]);
  });
});

describe("isGoalReached", () => {
  test("przed celem, cel osiągnięty, ponad cel, bez celu", () => {
    equal(
      [isGoalReached(1, 2), isGoalReached(2, 2), isGoalReached(4, 2), isGoalReached(3, 0)],
      [false, true, true, false],
    );
  });
});

describe("tileCountText", () => {
  test("bez celu: sama liczba bloków", () => {
    equal([tileCountText(0, 0), tileCountText(3, 0)], ["0", "3"]);
  });
  test("przed celem", () => {
    equal([tileCountText(0, 2), tileCountText(1, 2)], ["0 / 2", "1 / 2"]);
  });
  test("cel osiągnięty: bez ✓, bo ✓ jest na kafelku osobno", () => {
    equal(tileCountText(2, 2), "2 / 2");
  });
  test("ponad cel to informacja, nie błąd", () => {
    equal(tileCountText(4, 2), "4 / 2");
  });
});

describe("goalPercentText", () => {
  test("0%", () => {
    equal(goalPercentText(0, 2), "0%");
  });
  test("25%", () => {
    equal(goalPercentText(1, 4), "25%");
  });
  test("cel osiągnięty: 100%", () => {
    equal(goalPercentText(2, 2), "100%");
  });
  test("ponad cel: 125% i 150%", () => {
    equal([goalPercentText(5, 4), goalPercentText(3, 2)], ["125%", "150%"]);
  });
  test("zaokrąglenie do całości: 33% i 67%", () => {
    equal([goalPercentText(1, 3), goalPercentText(2, 3)], ["33%", "67%"]);
  });
  test("zadanie bez celu nie ma procentu", () => {
    equal(goalPercentText(3, 0), "");
  });
});

describe("blocksTowardGoals", () => {
  test("przykład z SPEC.md: 7", () => {
    equal(blocksTowardGoals(EXAMPLE_TASKS, EXAMPLE_BLOCKS), 7);
  });
  test("Python 4 / 2 liczy się jako 2", () => {
    equal(blocksTowardGoals([task("python", 2)], blocksOf("python", 4)), 2);
  });
  test("zadanie bez celu się nie liczy", () => {
    equal(blocksTowardGoals([task("claude", 0)], blocksOf("claude", 3)), 0);
  });
  test("bloki zarchiwizowanego zadania się nie liczą", () => {
    const tasks = [task("python", 2), task("stare", 3, true)];
    const blocks = [...blocksOf("python", 1), ...blocksOf("stare", 2)];
    equal(blocksTowardGoals(tasks, blocks), 1);
  });
});

describe("daySummaryText", () => {
  test("cel 0: bez części „cele”", () => {
    equal(daySummaryText([task("claude", 0)], blocksOf("claude", 5)), "Dziś: 5 bloków · 2 h 5 min");
  });
  test("cel 1, osiągnięty", () => {
    equal(daySummaryText([task("rysunek", 1)], blocksOf("rysunek", 1)), "Dziś: 1 blok · 25 min · cele: 1 z 1 ✓");
  });
  test("cel 10, początek dnia", () => {
    equal(daySummaryText(EXAMPLE_TASKS, []), "Dziś: 0 bloków · 0 min · cele: 0 z 10");
  });
  test("cel 10, przykład z SPEC.md: Angielski 1 / 4 nie ginie w sumie", () => {
    equal(daySummaryText(EXAMPLE_TASKS, EXAMPLE_BLOCKS), "Dziś: 9 bloków · 3 h 45 min · cele: 7 z 10");
  });
  test("cel 10, wszystkie cele osiągnięte", () => {
    const blocks = [...EXAMPLE_BLOCKS, ...blocksOf("angielski", 3)];
    equal(daySummaryText(EXAMPLE_TASKS, blocks), "Dziś: 12 bloków · 5 h · cele: 10 z 10 ✓");
  });
  test("zarchiwizowane zadanie: bloki w sumie dnia, ale nie w celach", () => {
    const tasks = [task("python", 2), task("stare", 3, true)];
    const blocks = [...blocksOf("python", 1), ...blocksOf("stare", 2)];
    equal(daySummaryText(tasks, blocks), "Dziś: 3 bloki · 1 h 15 min · cele: 1 z 2");
  });
});

describe("totalText", () => {
  test("0 bloków: bez czasu", () => {
    equal(totalText([]), "Łącznie: 0 bloków");
  });
  test("1 blok", () => {
    equal(totalText(blocksOf("python", 1)), "Łącznie: 1 blok · 25 min");
  });
  test("312 bloków to 130 h", () => {
    equal(totalText(blocksOf("python", 312)), "Łącznie: 312 bloków · 130 h");
  });
});

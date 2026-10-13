// Ekran „Dziś”: suma dnia, licznik łączny i kafelki zadań.
// Opis bloku (F2) oraz lista dnia, usuwanie i dopisywanie po fakcie (F3) dochodzą później.
//
// Elementy tworzymy przez createElement i textContent, a nie przez innerHTML:
// nazwa zadania wpisana przez użytkownika nigdy nie zostanie potraktowana jak kod HTML.

import {
  DOMAINS,
  activeTasks,
  tasksInDomain,
  blocksOnDate,
  countBlocks,
  isGoalReached,
  tileCountText,
  goalPercentText,
  daySummaryText,
  totalText,
} from "../model.js";
import { todayString } from "../dates.js";

export function render(container, state, actions) {
  const todayBlocks = blocksOnDate(state.data.blocks, todayString());

  const header = document.createElement("div");
  header.className = "today-header";
  header.append(renderDaySummary(state.data.tasks, todayBlocks), renderTotal(state.data.blocks));

  container.replaceChildren(header);

  const tasks = activeTasks(state.data.tasks);
  for (const domain of DOMAINS) {
    const domainTasks = tasksInDomain(tasks, domain.id);
    if (domainTasks.length > 0) {
      container.append(renderDomain(domain, domainTasks, todayBlocks, actions));
    }
  }
}

// „Dziś: 9 bloków · 3 h 45 min · cele: 7 z 10”. Tekst składa model.js.
function renderDaySummary(tasks, todayBlocks) {
  const summary = document.createElement("p");
  summary.className = "day-summary";
  summary.textContent = daySummaryText(tasks, todayBlocks);
  return summary;
}

// „Łącznie: 312 bloków · 130 h”: wszystkie bloki od początku, widoczne od razu
// po otwarciu strony. Przy 0 blokach z podpowiedzią pod spodem.
function renderTotal(blocks) {
  const box = document.createElement("div");
  box.className = "total";

  const total = document.createElement("p");
  total.textContent = totalText(blocks);
  box.append(total);

  if (blocks.length === 0) {
    const hint = document.createElement("p");
    hint.className = "total-hint";
    hint.textContent = "Tu będzie widać Twój postęp";
    box.append(hint);
  }
  return box;
}

// Jedna dziedzina: nagłówek i kafelki jej zadań.
function renderDomain(domain, tasks, todayBlocks, actions) {
  const section = document.createElement("section");
  section.className = "domain";

  const heading = document.createElement("h2");
  heading.textContent = domain.name;

  const tiles = document.createElement("div");
  tiles.className = "tiles";
  for (const task of tasks) {
    tiles.append(renderTile(task, todayBlocks, actions));
  }

  section.append(heading, tiles);
  return section;
}

// Kafelek zadania. Jedno kliknięcie zapisuje blok 25 minut.
// Po lewej nazwa i „zrobione / cel”, po prawej procent celu i zielony ✓ po osiągnięciu celu.
function renderTile(task, todayBlocks, actions) {
  const done = countBlocks(todayBlocks, task.id);
  const goalReached = isGoalReached(done, task.dailyGoal);

  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "tile";
  // Kolor zadania trafia do zmiennej CSS, a style.css robi z niego tło i pasek.
  tile.style.setProperty("--task-color", task.color);
  if (goalReached) {
    tile.classList.add("tile-goal-reached");
  }

  const name = document.createElement("span");
  name.className = "tile-name";
  name.textContent = task.name;

  const percent = document.createElement("span");
  percent.className = "tile-percent";
  percent.textContent = goalPercentText(done, task.dailyGoal);

  const count = document.createElement("span");
  count.className = "tile-count";
  count.textContent = tileCountText(done, task.dailyGoal);

  // Pusty, dopóki cel nie jest osiągnięty, żeby układ kafelka się nie zmieniał.
  const check = document.createElement("span");
  check.className = "tile-check";
  check.textContent = goalReached ? "✓" : "";

  // Kolejność ma znaczenie: style.css układa je w dwa wiersze po dwie kolumny.
  tile.append(name, percent, count, check);
  tile.addEventListener("click", () => actions.addBlock(task.id));
  return tile;
}

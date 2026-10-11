// Ekran „Dziś”: suma dnia, licznik łączny i kafelki zadań.
// Opis bloku i lista dnia dochodzą w kroku 3.
//
// Elementy tworzymy przez createElement i textContent, a nie przez innerHTML:
// nazwa zadania wpisana przez użytkownika nigdy nie zostanie potraktowana jak kod HTML.

import {
  DOMAINS,
  activeTasks,
  tasksInDomain,
  blocksOnDate,
  countBlocks,
  dailyGoalTotal,
  totalMinutes,
  isGoalReached,
  formatBlocks,
} from "../model.js";
import { todayString, formatDuration } from "../dates.js";

export function render(container, state, actions) {
  const todayBlocks = blocksOnDate(state.data.blocks, todayString());

  const header = document.createElement("div");
  header.className = "today-header";
  header.append(renderDaySummary(state.data.tasks, todayBlocks), renderTotal(state));

  container.replaceChildren(header);

  const tasks = activeTasks(state.data.tasks);
  for (const domain of DOMAINS) {
    const domainTasks = tasksInDomain(tasks, domain.id);
    if (domainTasks.length > 0) {
      container.append(renderDomain(domain, domainTasks, todayBlocks, actions));
    }
  }
}

// „Dziś: 5 z 9 bloków · 2 h 5 min”. Bez żadnego celu: „Dziś: 5 bloków · 2 h 5 min”.
function renderDaySummary(tasks, todayBlocks) {
  const done = todayBlocks.length;
  const goal = dailyGoalTotal(tasks);
  const time = formatDuration(totalMinutes(todayBlocks));

  const summary = document.createElement("p");
  summary.className = "day-summary";
  if (goal === 0) {
    summary.textContent = `Dziś: ${formatBlocks(done)} · ${time}`;
  } else {
    // Po „z” odmiana jest inna niż zwykle: „z 1 bloku”, „z 9 bloków”.
    const unit = goal === 1 ? "bloku" : "bloków";
    summary.textContent = `Dziś: ${done} z ${goal} ${unit} · ${time}`;
  }
  return summary;
}

// „Łącznie: 312 bloków · 130 h”: wszystkie bloki od początku.
// Pojawia się po zapisaniu bloku. Do tego czasu jego miejsce jest puste,
// ale zarezerwowane, żeby kafelki nie przeskoczyły w dół pod kursorem.
function renderTotal(state) {
  const blocks = state.data.blocks;

  const total = document.createElement("p");
  total.className = "total";
  total.textContent = `Łącznie: ${formatBlocks(blocks.length)} · ${formatDuration(totalMinutes(blocks))}`;
  if (state.lastBlock === null) {
    total.classList.add("total-waiting");
  }
  return total;
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
function renderTile(task, todayBlocks, actions) {
  const done = countBlocks(todayBlocks, task.id);

  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "tile";
  // Kolor zadania trafia do zmiennej CSS, a style.css robi z niego tło i pasek.
  tile.style.setProperty("--task-color", task.color);
  if (isGoalReached(done, task.dailyGoal)) {
    tile.classList.add("tile-goal-reached");
  }

  const name = document.createElement("span");
  name.className = "tile-name";
  name.textContent = task.name;

  const count = document.createElement("span");
  count.className = "tile-count";
  count.textContent = countText(done, task.dailyGoal);

  tile.append(name, count);
  tile.addEventListener("click", () => actions.addBlock(task.id));
  return tile;
}

// „1 / 2”, po osiągnięciu celu „2 / 2 ✓” (także „4 / 2 ✓”).
// Zadanie bez celu pokazuje samą liczbę bloków.
function countText(done, dailyGoal) {
  if (dailyGoal === 0) {
    return String(done);
  }
  if (isGoalReached(done, dailyGoal)) {
    return `${done} / ${dailyGoal} ✓`;
  }
  return `${done} / ${dailyGoal}`;
}

// Ekran „Dziś”: kafelki zadań, opis bloku i lista dnia.
// Kafelki dochodzą w kroku 2, opis bloku i lista dnia w kroku 3.

import { activeTasks, dailyGoalTotal } from "../model.js";

export function render(container, state) {
  const tasks = activeTasks(state.data.tasks);
  const goal = dailyGoalTotal(state.data.tasks);
  container.textContent = `Wczytane zadania: ${tasks.length}, cel dnia: ${goal}. Kafelki pojawią się w kroku 2.`;
}

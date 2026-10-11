# Organizer nauki: specyfikacja MVP

Wersja 1 · 11 października 2026

Prosty dziennik 25-minutowych bloków nauki. Jedno kliknięcie zapisuje blok, kafelki pokazują postęp dnia względem celu, a wykres pokazuje postęp z dnia na dzień.

## 1. Problem

Aplikacja rozwiązuje trzy problemy, w kolejności ważności:

1. **Brak widocznego postępu.** Bez zapisu każdy gorszy dzień wygląda na stracony. Rozwiązanie: wykres i liczniki pokazujące to, co zrobione.
2. **Jedna rzecz zjada dzień.** Rozwiązanie: licznik „zrobione / cel” na każdym zadaniu pokazuje to w trakcie dnia, a nie dopiero wieczorem.
3. **Start bez konkretu.** W MVP tylko częściowo, przez podpowiedź ostatniego opisu bloku. Pełne rozwiązanie po MVP (sekcja 11).

## 2. Użytkownik i główny scenariusz

Jeden użytkownik. Przeglądarka na komputerze w pracy (własne konto Windows), aplikacja otwarta w przypiętej karcie.

1. Kostka-minutnik odlicza 25 minut. Minutnik jest poza aplikacją.
2. Kliknięcie kafelka zadania, np. „Python”, zapisuje blok 25 minut z bieżącą godziną.
3. Opcjonalnie: wpisanie, co konkretnie było robione (Enter), albo pominięcie (Esc).
4. Kafelek pokazuje np. „2 / 2 ✓”. Od razu widać, które zadania są jeszcze przed celem.
5. Na koniec dnia lub tygodnia: zakładka „Postęp” z wykresem i przycisk „Kopiuj raport” do wklejenia w projekt w Claude.

## 3. Zasady projektowe

- **Zapis bloku to jedno kliknięcie.** Wszystko inne jest opcjonalne.
- **Pokazujemy to, co zrobione.** Żadnych komunikatów o porażce, serii do zerwania ani „nieudanych dni”.
- **Dzień bez bloków nie jest spadkiem do zera.** Wolna niedziela nie robi dołka na wykresie.
- **Przekroczenie celu to informacja, nie błąd**, np. „4 / 2”.
- **Czerwony to wyłącznie kolor zadania Frontend**, nigdy sygnał błędu.
- Interfejs po polsku.

## 4. Funkcje MVP

### F1. Ekran „Dziś”

- Kafelki zadań pogrupowane w dziedziny: Programowanie, Angielski, ART. Każdy kafelek ma kolor swojego zadania.
- Na kafelku: nazwa i „zrobione / cel”, np. „1 / 2”. Po osiągnięciu celu pojawia się ✓. Zadanie z celem 0 pokazuje samą liczbę bloków.
- Kliknięcie kafelka zapisuje blok 25 minut z bieżącą datą i godziną.
- Nad kafelkami suma dnia, np. „Dziś: 5 z 9 bloków · 2 h 5 min”.

**Gotowe, gdy:** dwa kliknięcia w „Python” dają „2 / 2 ✓”, a po odświeżeniu strony stan zostaje.

### F2. Opis bloku (opcjonalny)

- Po kliknięciu kafelka pojawia się pole „Co konkretnie?”. Podpowiedzią w polu jest ostatni opis z tego zadania.
- Enter zapisuje opis. Esc albo kliknięcie obok zamyka pole bez opisu.
- Blok jest zapisany już w chwili kliknięcia kafelka. Opis go tylko uzupełnia.

**Gotowe, gdy:** blok z opisem i blok bez opisu oba trafiają na listę dnia.

### F3. Lista bloków dnia

- Pod kafelkami lista dzisiejszych bloków: godzina, zadanie, opis.
- Usuwanie bloku (pomyłka) po potwierdzeniu.
- „Dopisz blok”: formularz z zadaniem, datą, godziną i opisem, do uzupełniania zapomnianych bloków po fakcie.

**Gotowe, gdy:** blok dopisany na wczoraj pojawia się na wykresie we wczorajszym dniu.

### F4. Zadania (zakładka „Zadania”)

- Lista zadań pogrupowana w dziedziny.
- Dodawanie i edycja zadania: nazwa, dziedzina, kolor, cel dzienny (liczba bloków, 0 = bez celu).
- Archiwizacja zamiast usuwania: zadanie znika z ekranu „Dziś”, ale jego bloki zostają w historii i na wykresie. Zarchiwizowane zadanie można przywrócić.
- Dziedziny są w MVP stałe: Programowanie, Angielski, ART.

**Gotowe, gdy:** nowe zadanie „Kolaże GIMP” w dziedzinie ART pojawia się na ekranie „Dziś” w wybranym kolorze.

### F5. Postęp (wykres)

- Wykres liniowy: oś X to dni, oś Y to liczba bloków. Jedna linia na zadanie, w kolorze zadania.
- Przełącznik zakresu: 7 dni albo 30 dni.
- Kliknięcie w legendę ukrywa lub pokazuje linię. Przy kilku liniach o wartościach 0–4 linie będą się nakładać, więc to ważne.
- Dzień bez żadnego bloku nie ma punktów (wartość `null`, linia go przeskakuje dzięki `spanGaps`), więc nie robi dołka.
- Pod wykresem: suma w zakresie (np. „7 dni: 41 bloków · 17 h 5 min”), suma dla każdego zadania i licznik „Bloki w tym miesiącu”, który tylko rośnie.

**Gotowe, gdy:** dane z kilku dni dają osobne kolorowe linie, a niedziela bez bloków nie robi dołka.

### F6. Raport

- Przycisk „Kopiuj raport” z wyborem: dziś albo ostatnie 7 dni. Raport trafia do schowka jako Markdown.
- Zawartość: zakres dat, suma bloków i godzin, tabela dzień × zadanie, lista opisów bloków. Wzór w sekcji 9.

**Gotowe, gdy:** raport wklejony do Claude wyświetla się jako czytelna tabela.

### F7. Kopia zapasowa

- „Eksportuj dane” pobiera plik `organizer-nauki-RRRR-MM-DD.json`.
- „Importuj dane” wczytuje taki plik i po potwierdzeniu zastępuje obecne dane.

**Gotowe, gdy:** eksport, wyczyszczenie danych i import przywracają wszystko.

## 5. Poza zakresem MVP

- minutnik (jest kostka),
- planowanie tygodnia i przeciąganie zadań,
- listy lekcji z kursów, ściana chwały, plany przedsięwzięć,
- dane o zdrowiu: leki, sen, dieta, Oura,
- połączenie z AI przez API (raport wklejany ręcznie),
- synchronizacja między urządzeniami, logowanie, serwer z bazą danych,
- edycja istniejącego bloku (wystarczy usunąć i dopisać),
- sterowanie głosem.

## 6. Model danych

Wszystkie dane to jeden obiekt JSON zapisany w `localStorage` pod kluczem `organizerNauki`. Dane startowe:

```json
{
  "version": 1,
  "domains": [
    { "id": "prog", "name": "Programowanie" },
    { "id": "eng",  "name": "Angielski" },
    { "id": "art",  "name": "ART" }
  ],
  "tasks": [
    { "id": "t-python",   "domainId": "prog", "name": "Python",      "color": "#1e88e5", "dailyGoal": 2, "archived": false },
    { "id": "t-frontend", "domainId": "prog", "name": "Frontend",    "color": "#e53935", "dailyGoal": 2, "archived": false },
    { "id": "t-cc",       "domainId": "prog", "name": "Claude Code", "color": "#fb8c00", "dailyGoal": 0, "archived": false },
    { "id": "t-english",  "domainId": "eng",  "name": "Angielski",   "color": "#8e24aa", "dailyGoal": 4, "archived": false },
    { "id": "t-drawing",  "domainId": "art",  "name": "Rysunek",     "color": "#43a047", "dailyGoal": 1, "archived": false }
  ],
  "blocks": []
}
```

Przykładowy blok:

```json
{ "id": "2f1c…", "taskId": "t-python", "date": "2026-10-12", "time": "07:40", "minutes": 25, "note": "Day 25, ćwiczenie 2" }
```

| Pole | Znaczenie |
|---|---|
| `version` | wersja formatu danych; przy zmianie formatu aplikacja migruje stare dane podczas wczytania |
| `domains` | dziedziny; w MVP stałe |
| `tasks[].dailyGoal` | cel dzienny w blokach; 0 = bez celu |
| `tasks[].archived` | zarchiwizowane zadanie nie pokazuje się na ekranie „Dziś”, ale zostaje w historii |
| `blocks[].date` | dzień bloku `RRRR-MM-DD` w czasie lokalnym |
| `blocks[].time` | godzina `GG:MM` |
| `blocks[].minutes` | w MVP zawsze 25; pole na przyszłe bloki innej długości |
| `blocks[].note` | opcjonalny opis; pusty tekst, gdy brak |

Uwagi techniczne:

- Datę liczyć lokalnie. `toISOString()` zwraca czas UTC, więc blok zapisany tuż po północy trafiłby na poprzedni dzień.
- Nowe identyfikatory z `crypto.randomUUID()`.
- Cel dnia to suma celów aktywnych zadań: na start 2 + 2 + 0 + 4 + 1 = 9.
- Rozmiar: ok. 9 bloków dziennie po ~150 bajtów to ok. 0,5 MB rocznie. Limit `localStorage` to ok. 5 MB.

## 7. Architektura

Statyczna strona: HTML, CSS i JavaScript. Bez serwera aplikacji i bez bazy danych.

```
kliknięcie ──► model.js ──► storage.js ──► localStorage
                  │
                  └──────► bieżący widok rysuje się od nowa
```

Cały stan to jeden obiekt w pamięci. Każda zmiana to trzy kroki: aktualizacja obiektu, zapis do `localStorage`, ponowne narysowanie bieżącego widoku. Trzy zakładki w jednym pliku HTML: Dziś, Postęp, Zadania.

```
index.html             szkielet i trzy zakładki
css/style.css
js/app.js              start, przełączanie zakładek, odświeżanie widoku
js/storage.js          wczytanie, zapis, dane startowe, migracje, eksport, import
js/model.js            operacje: dodaj/usuń blok, zadania, zliczenia
js/dates.js            daty lokalne, zakresy dni, polskie skróty dni
js/report.js           tekst raportu w Markdown
js/views/today.js      ekran Dziś, opis bloku, lista dnia
js/views/progress.js   wykres i sumy
js/views/tasks.js      zadania, eksport, import
```

**Hosting to nie to samo co przechowywanie danych.** GitHub Pages tylko wysyła pliki aplikacji. Dane zostają w przeglądarce, w której klikasz, osobno dla każdego komputera i każdego adresu. Dane z testów na `localhost` nie pojawią się same na `github.io`; przenosi się je eksportem i importem.

## 8. Stos technologiczny

| Element | Wybór | Dlaczego |
|---|---|---|
| Kod | HTML, CSS, JavaScript (moduły ES), bez frameworka | zero konfiguracji, działa przez vscode.dev i tunel, każdą linię da się przeczytać i zrozumieć |
| Wykres | Chart.js 4.4.1 z CDN jsDelivr | wykres liniowy i klikalna legenda bez dodatkowej pracy |
| Dane | `localStorage` | bez serwera i bez kluczy API |
| Hosting | GitHub Pages | darmowy, bez kluczy, wdrożenie przez `git push`; publiczne repozytorium to też portfolio (kod jest publiczny, dane nie) |
| Uruchomienie lokalne | `python -m http.server 8000` i przekierowanie portu w VS Code (zakładka Ports) | moduły ES nie działają z pliku otwartego przez `file://` |

Wczytanie Chart.js w `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
```

React z Vite to rozsądna alternatywa dopiero wtedy, gdy kurs frontendu dojdzie do Reacta. W MVP to niepotrzebna warstwa.

## 9. Raport, Claude i Arkusz Google

Wzór raportu:

```markdown
# Raport nauki: 12.10–13.10.2026
Bloki: 17 · 7 h 5 min · dni z nauką: 2

| Dzień    | Python | Frontend | Claude Code | Angielski | Rysunek | Suma |
|----------|--------|----------|-------------|-----------|---------|------|
| pn 12.10 | 2      | 1        | 1           | 4         | 0       | 8    |
| wt 13.10 | 3      | 2        | 0           | 3         | 1       | 9    |

## Opisy bloków
- pn 12.10 07:40 · Python · Day 25, ćwiczenie 2
- pn 12.10 08:30 · Angielski · przepisywanie, rozdz. 3
```

Jak to połączyć z Arkuszem Google:

- Aplikacja tylko generuje tekst. Nie łączy się ani z Google, ani z Claude.
- Claude może dopisać dane do Arkusza tylko wtedy, gdy na Twoim koncie Claude jest konektor Google z prawem zapisu. Sprawdź to jednym testem w projekcie, zanim oprzesz na tym proces.
- Model przepisujący liczby może się czasem pomylić. Arkusz traktuj jako archiwum; źródłem prawdy są dane w aplikacji.
- Jeśli konektor nie zapisuje do Arkusza, pierwszym punktem backlogu jest przycisk „Kopiuj do arkusza” (format TSV, wklejany Ctrl+V prosto w komórki).

Propozycja instrukcji dla projektu w Claude:

> Dostajesz raporty z mojego organizera nauki. Jeden blok to 25 minut. Do każdego raportu napisz: (1) co poszło dobrze, (2) czy któraś dziedzina wyparła inne, (3) jedną konkretną sugestię na kolejne dni. Opisuj to, co zrobione, i wzorce. Nie oceniaj surowo i nie pisz o porażkach.

## 10. Plan implementacji

Każdy krok to 1–2 bloki Claude Code i kończy się czymś, co działa i co da się sprawdzić. Razem ok. 14 bloków, czyli ok. 6 godzin. Przy 2–3 blokach Claude Code dziennie to mniej więcej tydzień.

Zasady pracy:

- Jeden krok na sesję Claude Code. Prompt w stylu: „Zaimplementuj F1 ze SPEC.md. Trzymaj się zasad z sekcji 3.”
- Po każdym działającym kroku: commit i push. GitHub Pages aktualizuje stronę po ok. minucie.
- Nowy pomysł w trakcie pracy trafia do sekcji 11, a nie do kodu.
- Przed zmianą formatu danych: eksport kopii.

### Krok 0. Przygotowanie i test ryzyka (1–2 bloki)

- Publiczne repozytorium `organizer-nauki` na GitHubie, sklonowane na laptopa, z tym plikiem jako `SPEC.md`.
- Prompt: „Przeczytaj SPEC.md i utwórz CLAUDE.md z zasadami projektu, stosem i strukturą plików.”
- Prompt: „Zrób testowy index.html z licznikiem odświeżeń zapisywanym w localStorage.” Potem push i w repozytorium: Settings → Pages → gałąź `main`.

**Gotowe, gdy:** strona otwiera się na komputerze w pracy pod adresem `https://<login>.github.io/organizer-nauki/`, a licznik następnego dnia ma tę samą wartość. To sprawdza dwa największe ryzyka: czy adres nie jest blokowany i czy przeglądarka zachowuje dane.

### Krok 1. Szkielet i dane (1–2 bloki)

- Prompt: „Według sekcji 6–8 SPEC.md utwórz strukturę plików, storage.js z danymi startowymi i obsługą wersji danych oraz model.js. Bez wyglądu.”

**Gotowe, gdy:** w narzędziach deweloperskich (F12 → Application → Local Storage) widać klucz `organizerNauki` z 3 dziedzinami i 5 zadaniami.

### Krok 2. Ekran „Dziś” (2 bloki)

Funkcja F1. **Gotowe, gdy:** spełniony warunek z F1.

### Krok 3. Opis bloku i lista dnia (2 bloki)

Funkcje F2 i F3. **Gotowe, gdy:** spełnione warunki z F2 i F3.

### Krok 4. Zadania (2 bloki)

Funkcja F4. **Gotowe, gdy:** spełniony warunek z F4.

### Krok 5. Wykres (2 bloki)

Funkcja F5. **Gotowe, gdy:** spełniony warunek z F5.

### Krok 6. Raport i kopia zapasowa (2 bloki)

Funkcje F6 i F7. **Gotowe, gdy:** spełnione warunki z F6 i F7.

### Krok 7. Szlif i start (1–2 bloki)

Wygląd i czytelność, przypięta karta w przeglądarce w pracy, pierwszy eksport danych.

**Gotowe, gdy:** pierwszy prawdziwy dzień nauki jest zapisany w aplikacji.

## 11. Po MVP (backlog)

W kolejności priorytetów:

1. „Kopiuj do arkusza” (TSV), jeśli Claude nie zapisuje do Arkusza Google.
2. Listy lekcji z kursów do odhaczania, z procentem ukończenia, zamiast wydrukowanych kartek.
3. Ściana chwały.
4. Plan każdego przedsięwzięcia.
5. Podpowiedź „następne zadanie” (najbardziej w tyle względem celu) i karta „Po co to robię”.
6. Zakładka zdrowia: sen, jedzenie, leki. Na prywatnym urządzeniu, nie na komputerze firmowym. Samo przypomnienie o lekach zostaje w telefonie, bo strona w przeglądarce nie przypomni, gdy jest zamknięta.
7. Własny minutnik z automatyczną pauzą przy zmianie karty.
8. Widok na czytnik Boox: wysoki kontrast, bez animacji.
9. Sterowanie głosem.

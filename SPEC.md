# Organizer nauki: specyfikacja MVP

Wersja 2 · 11 października 2026

Prosty dziennik 25-minutowych bloków nauki. Jedno kliknięcie zapisuje blok, kafelki pokazują postęp dnia względem celu, a wykres pokazuje postęp z dnia na dzień.

## 1. Problem

Aplikacja rozwiązuje trzy problemy, w kolejności ważności:

1. **Brak widocznego postępu.** Bez zapisu każdy gorszy dzień wygląda na stracony. Rozwiązanie: wykres i liczniki pokazujące to, co zrobione.
2. **Jedna rzecz zjada dzień.** Rozwiązanie: licznik „zrobione / cel” na każdym zadaniu pokazuje to w trakcie dnia, a nie dopiero wieczorem.
3. **Start bez konkretu.** W MVP tylko częściowo, przez podpowiedź ostatniego opisu bloku. Pełne rozwiązanie po MVP (sekcja 11).

## 2. Użytkownik i główny scenariusz

Jeden użytkownik. Głównie przeglądarka na komputerze w pracy (własne konto Windows), aplikacja otwarta w przypiętej karcie. Od wersji z bazą danych (kroki 8–11) te same dane są dostępne także na innych urządzeniach, np. na czytniku Boox albo telefonie.

1. Kostka-minutnik odlicza 25 minut. Minutnik jest poza aplikacją.
2. Kliknięcie kafelka zadania, np. „Python”, zapisuje blok 25 minut z bieżącą godziną.
3. Opcjonalnie: wpisanie, co konkretnie było robione (Enter), albo pominięcie (Esc).
4. Kafelek pokazuje np. „2 / 2 ✓”, a licznik łączny rośnie o 1. Od razu widać, które zadania są jeszcze przed celem.
5. Na koniec dnia lub tygodnia: zakładka „Postęp” z wykresem i przycisk „Kopiuj raport” do wklejenia w projekt w Claude.

**Zmiana założeń (11.10.2026).** Pierwotnie aplikacja miała działać bez logowania i bez usług wymagających kluczy. Świadomie to zmieniamy: dochodzi logowanie dla jednej osoby i baza Supabase z kluczem publicznym (sekcja 8). Reszta założeń zostaje: jeden użytkownik, jeden główny scenariusz, brak płatności.

## 3. Zasady projektowe

- **Zapis bloku to jedno kliknięcie.** Wszystko inne jest opcjonalne.
- **Pokazujemy to, co zrobione.** Żadnych komunikatów o porażce, serii do zerwania ani „nieudanych dni”.
- **Wykres jest uczciwy, licznik daje poczucie postępu.** Dzień bez bloków to na wykresie 0. Licznik wszystkich bloków od początku nigdy nie maleje (poza usunięciem pomyłkowego bloku).
- **Przekroczenie celu to informacja, nie błąd**, np. „4 / 2”.
- **Czerwony to wyłącznie kolor zadania Frontend**, nigdy sygnał błędu.
- **Kliknięcie nie może zginąć po cichu.** Jeśli zapis się nie uda, aplikacja to mówi i pozwala spróbować ponownie.
- Interfejs po polsku.

## 4. Funkcje MVP

### F1. Ekran „Dziś”

- Kafelki zadań pogrupowane w dziedziny: Programowanie, Angielski, ART. Każdy kafelek ma kolor swojego zadania.
- Na kafelku: nazwa i „zrobione / cel”, np. „1 / 2”. Po osiągnięciu celu pojawia się ✓. Zadanie z celem 0 pokazuje samą liczbę bloków.
- Kliknięcie kafelka zapisuje blok 25 minut z bieżącą datą i godziną.
- Nad kafelkami suma dnia, np. „Dziś: 5 z 9 bloków · 2 h 5 min”.
- Po zapisaniu bloku pojawia się licznik wszystkich bloków od początku, np. „Łącznie: 312 bloków · 130 h”.

**Gotowe, gdy:** dwa kliknięcia w „Python” dają „2 / 2 ✓”, po każdym kliknięciu licznik łączny rośnie o 1, a po odświeżeniu strony stan zostaje.

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
- Dzień bez bloków ma wartość 0.
- Pod wykresem: suma w zakresie (np. „7 dni: 41 bloków · 17 h 5 min”), suma dla każdego zadania i licznik „Łącznie od początku”.

**Gotowe, gdy:** dane z kilku dni dają osobne kolorowe linie, a dzień bez bloków pokazuje 0.

### F6. Raport

- Przycisk „Kopiuj raport” z wyborem: dziś albo ostatnie 7 dni. Raport trafia do schowka jako Markdown.
- Zawartość: zakres dat, suma bloków i godzin, tabela dzień × zadanie, lista opisów bloków. Wzór w sekcji 9.

**Gotowe, gdy:** raport wklejony do Claude wyświetla się jako czytelna tabela.

### F7. Kopia zapasowa

- „Eksportuj dane” pobiera plik `organizer-nauki-RRRR-MM-DD.json`.
- „Importuj dane” wczytuje taki plik i po potwierdzeniu zastępuje obecne dane.

**Gotowe, gdy:** eksport, wyczyszczenie danych i import przywracają wszystko.

### F8. Logowanie i dane w bazie (kroki 8–11)

- Ekran logowania: e-mail i hasło. Jedno konto, Twoje; rejestracja nowych kont jest wyłączona w Supabase.
- Sesja zostaje zapamiętana, więc na każdym urządzeniu logujesz się raz.
- Przycisk „Wyloguj” w zakładce „Zadania”.
- Zadania i bloki zapisują się w bazie Supabase, więc na każdym urządzeniu są te same.
- Gdy zapis się nie uda (np. brak internetu), aplikacja pokazuje komunikat z przyciskiem „Spróbuj ponownie”.
- Jednorazowe przeniesienie danych z wersji lokalnej: import pliku eksportu (F7) do bazy.

**Gotowe, gdy:** blok zapisany na komputerze w pracy widać po odświeżeniu na drugim urządzeniu, a bez zalogowania nie da się odczytać żadnych danych.

## 5. Poza zakresem MVP

- minutnik (jest kostka),
- planowanie tygodnia i przeciąganie zadań,
- listy lekcji z kursów, ściana chwały, plany przedsięwzięć,
- dane o zdrowiu: leki, sen, dieta, Oura,
- połączenie z AI przez API (raport wklejany ręcznie),
- konta dla innych osób (aplikacja ma jednego użytkownika),
- praca bez internetu w wersji z bazą (komunikat o błędzie zamiast kolejki zapisów),
- edycja istniejącego bloku (wystarczy usunąć i dopisać),
- sterowanie głosem.

## 6. Model danych

### 6.1. Dziedziny

Dziedziny są stałe i zapisane w kodzie (`js/model.js`), a nie w danych:

```js
export const DOMAINS = [
  { id: "prog", name: "Programowanie" },
  { id: "eng",  name: "Angielski" },
  { id: "art",  name: "ART" },
];
```

### 6.2. Dane w aplikacji (kroki 1–7: `localStorage`)

Wszystkie dane to jeden obiekt JSON zapisany w `localStorage` pod kluczem `organizerNauki`. Ten sam format ma plik eksportu (F7). Dane startowe:

```json
{
  "version": 1,
  "tasks": [
    { "id": "…", "domainId": "prog", "name": "Python",      "color": "#1e88e5", "dailyGoal": 2, "archived": false },
    { "id": "…", "domainId": "prog", "name": "Frontend",    "color": "#e53935", "dailyGoal": 2, "archived": false },
    { "id": "…", "domainId": "prog", "name": "Claude Code", "color": "#fb8c00", "dailyGoal": 0, "archived": false },
    { "id": "…", "domainId": "eng",  "name": "Angielski",   "color": "#8e24aa", "dailyGoal": 4, "archived": false },
    { "id": "…", "domainId": "art",  "name": "Rysunek",     "color": "#43a047", "dailyGoal": 1, "archived": false }
  ],
  "blocks": []
}
```

Przykładowy blok:

```json
{ "id": "…", "taskId": "…", "date": "2026-10-12", "time": "07:40", "minutes": 25, "note": "Day 25, ćwiczenie 2" }
```

| Pole | Znaczenie |
|---|---|
| `version` | wersja formatu danych; przy zmianie formatu aplikacja migruje stare dane podczas wczytania |
| `id` | UUID z `crypto.randomUUID()`, także dla zadań startowych, żeby dane dało się bez zmian przenieść do bazy |
| `tasks[].domainId` | `prog`, `eng` albo `art` |
| `tasks[].dailyGoal` | cel dzienny w blokach; 0 = bez celu |
| `tasks[].archived` | zarchiwizowane zadanie nie pokazuje się na ekranie „Dziś”, ale zostaje w historii |
| `blocks[].date` | dzień bloku `RRRR-MM-DD` w czasie lokalnym |
| `blocks[].time` | godzina `GG:MM` |
| `blocks[].minutes` | w MVP zawsze 25; pole na przyszłe bloki innej długości |
| `blocks[].note` | opcjonalny opis; pusty tekst, gdy brak |

### 6.3. Dane w bazie (kroki 8–11: Supabase)

Te same pola w dwóch tabelach. W bazie nazwy są w stylu `snake_case` (`daily_goal`, `task_id`); `storage-supabase.js` tłumaczy je na `camelCase` używane w aplikacji. SQL do wklejenia w Supabase (SQL Editor):

```sql
create table tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  domain_id   text not null check (domain_id in ('prog', 'eng', 'art')),
  name        text not null,
  color       text not null,
  daily_goal  int  not null default 0,
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table blocks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  task_id     uuid not null references tasks on delete restrict,
  date        date not null,
  time        time not null,
  minutes     int  not null default 25,
  note        text not null default '',
  created_at  timestamptz not null default now()
);

create index blocks_user_date on blocks (user_id, date);

-- Bez tych reguł każdy znający adres projektu mógłby czytać dane.
alter table tasks  enable row level security;
alter table blocks enable row level security;

create policy "tylko własne zadania" on tasks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tylko własne bloki" on blocks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Uwagi techniczne:

- Datę liczyć lokalnie. `toISOString()` zwraca czas UTC, więc blok zapisany tuż po północy trafiłby na poprzedni dzień.
- Cel dnia to suma celów aktywnych zadań: na start 2 + 2 + 0 + 4 + 1 = 9.
- Rozmiar: ok. 9 bloków dziennie to ok. 3300 bloków rocznie. Dla `localStorage` to ok. 0,5 MB przy limicie ok. 5 MB; dla bazy to drobiazg.
- Supabase zwraca domyślnie najwyżej 1000 wierszy na zapytanie. Bloki trzeba pobierać stronami (`range`) albo tylko z potrzebnego zakresu dat, a licznik łączny liczyć zapytaniem z `count`.

## 7. Architektura

Statyczna strona (HTML, CSS, JavaScript) na GitHub Pages. W krokach 1–7 dane są w przeglądarce, od kroku 8 w bazie Supabase.

```
kliknięcie ──► model.js ──► storage ──► localStorage (kroki 1–7)
                  │                └──► Supabase     (od kroku 8)
                  │
                  └──────► bieżący widok rysuje się od nowa
```

Cały stan to jeden obiekt w pamięci. Każda zmiana to trzy kroki: aktualizacja obiektu, zapis przez moduł `storage`, ponowne narysowanie bieżącego widoku. Trzy zakładki w jednym pliku HTML: Dziś, Postęp, Zadania. Od kroku 9 przed nimi ekran logowania.

**Wspólny interfejs zapisu.** Oba moduły zapisu mają te same funkcje i od pierwszego dnia są asynchroniczne (zwracają `Promise`), także wersja na `localStorage`. Dzięki temu przejście na bazę to wymiana jednego pliku, bez zmian w widokach.

```
load()             → Promise<{ tasks, blocks }>
addBlock(block)    → Promise<block>
deleteBlock(id)    → Promise<void>
saveTask(task)     → Promise<task>      dodaje albo aktualizuje
replaceAll(data)   → Promise<void>      import pliku
exportAll()        → Promise<data>
```

Pliki:

```
index.html                szkielet i trzy zakładki
css/style.css
js/app.js                 start, wybór modułu zapisu, zakładki, odświeżanie widoku
js/storage-local.js       zapis w localStorage (kroki 1–7)
js/storage-supabase.js    zapis w Supabase (od kroku 8)
js/model.js               dziedziny, operacje na danych, zliczenia
js/dates.js               daty lokalne, zakresy dni, polskie skróty dni
js/report.js              tekst raportu w Markdown
js/views/today.js         ekran Dziś, opis bloku, lista dnia
js/views/progress.js      wykres i sumy
js/views/tasks.js         zadania, eksport, import, wylogowanie
js/views/login.js         ekran logowania (od kroku 9)
```

**Hosting to nie to samo co przechowywanie danych.** GitHub Pages tylko wysyła pliki aplikacji. W krokach 1–7 dane zostają w przeglądarce, osobno dla każdego komputera i adresu. Od kroku 8 dane są w bazie i każde urządzenie po zalogowaniu widzi to samo.

## 8. Stos technologiczny

| Element | Wybór | Dlaczego |
|---|---|---|
| Kod | HTML, CSS, JavaScript (moduły ES), bez frameworka | zero konfiguracji, działa przez vscode.dev i tunel, każdą linię da się przeczytać i zrozumieć |
| Wykres | Chart.js 4.4.1 z CDN jsDelivr | wykres liniowy i klikalna legenda bez dodatkowej pracy |
| Dane, kroki 1–7 | `localStorage` | działa od razu, bez kont i konfiguracji |
| Baza i logowanie, od kroku 8 | Supabase, plan darmowy, region UE (Frankfurt) | baza Postgres, gotowe logowanie i API bez pisania własnego serwera |
| Klient bazy | supabase-js 2.45.4 z CDN jsDelivr | oficjalna biblioteka, bez instalowania |
| Hosting | GitHub Pages | darmowy, wdrożenie przez `git push`; publiczne repozytorium to też portfolio |
| Uruchomienie lokalne | `python -m http.server 8000` i przekierowanie portu w VS Code (zakładka Ports) | moduły ES nie działają z pliku otwartego przez `file://` |

Wczytanie bibliotek:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
```

```js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";
```

Supabase, rzeczy do zapamiętania:

- **Klucz publiczny w kodzie jest w porządku.** Adres projektu i klucz publiczny (`anon` / `publishable`) z założenia trafiają do kodu strony. Dane chronią reguły RLS z sekcji 6.3.
- **Klucz `service_role` (secret) nigdy nie trafia do kodu ani do repozytorium.** Daje pełny dostęp z pominięciem reguł.
- **Darmowy projekt zasypia po tygodniu bez używania.** Przy codziennym używaniu to nie grozi. Po dłuższym urlopie wznawia się go jednym kliknięciem w panelu Supabase; dane zostają.

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

Każdy krok to 1–2 bloki Claude Code i kończy się czymś, co działa i co da się sprawdzić. Kroki 0–7 (ok. 14 bloków) dają działającą aplikację na jednym komputerze. Kroki 8–11 (ok. 6 bloków) przenoszą dane do bazy. Razem ok. 20 bloków, czyli ok. 8,5 godziny; przy 2–3 blokach Claude Code dziennie to ok. półtora tygodnia.

Baza wchodzi po wersji lokalnej, a nie od pierwszego dnia, bo:

- działająca aplikacja jest gotowa po tygodniu i od razu zbiera prawdziwe dane;
- błędy wyglądu i błędy bazy nie mieszają się ze sobą;
- dane z pierwszych dni przechodzą do bazy przez eksport i import.

Zasady pracy:

- Jeden krok na sesję Claude Code. Prompt w stylu: „Zaimplementuj F1 ze SPEC.md. Trzymaj się zasad z sekcji 3.”
- Po każdym działającym kroku: commit i push. GitHub Pages aktualizuje stronę po ok. minucie.
- Nowy pomysł w trakcie pracy trafia do sekcji 11, a nie do kodu.
- Przed zmianą formatu danych: eksport kopii.

### Krok 0. Przygotowanie i test ryzyka (1–2 bloki)

Stan na 11.10.2026: repozytorium i GitHub Pages działają, test pamięci przeglądarki przeszedł zamknięcie przeglądarki i restart komputera. Zostało: sprawdzenie następnego dnia i CLAUDE.md.

- Prompt: „Przeczytaj SPEC.md i utwórz CLAUDE.md z zasadami projektu, stosem i strukturą plików.”

**Gotowe, gdy:** strona testowa następnego dnia pokazuje, że dane przetrwały, a w repozytorium jest CLAUDE.md.

### Krok 1. Szkielet i dane (1–2 bloki)

- Prompt: „Według sekcji 6–8 SPEC.md utwórz strukturę plików, storage-local.js z asynchronicznym interfejsem z sekcji 7, danymi startowymi i obsługą wersji danych oraz model.js. Bez wyglądu.”

**Gotowe, gdy:** w narzędziach deweloperskich (F12 → Application → Local Storage) widać klucz `organizerNauki` z 5 zadaniami.

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

### Krok 8. Projekt w Supabase (1–2 bloki)

Ten krok to klikanie w panelu Supabase, nie kod. Konto zakładasz sam.

- Załóż konto na supabase.com i projekt `organizer-nauki` w regionie Frankfurt.
- W SQL Editor wklej i uruchom SQL z sekcji 6.3.
- W ustawieniach logowania dodaj swojego użytkownika (e-mail i hasło), a potem wyłącz rejestrację nowych użytkowników.
- W ustawieniach adresów jako Site URL wpisz `https://kubiakraf.github.io/organizer-nauki/`.

**Gotowe, gdy:** w Table Editor są tabele `tasks` i `blocks`, obie z włączonym RLS, a na liście użytkowników jest jedno konto.

### Krok 9. Logowanie (1–2 bloki)

Część F8: ekran logowania i wylogowanie.

**Gotowe, gdy:** po zalogowaniu widać aplikację, po wylogowaniu ekran logowania, a po odświeżeniu strony sesja zostaje.

### Krok 10. Zapis w bazie i przeniesienie danych (2 bloki)

- Prompt: „Napisz storage-supabase.js z tym samym interfejsem co storage-local.js (sekcja 7) i przełącz na niego aplikację. Uwzględnij limit 1000 wierszy z sekcji 6.3.”
- Eksport z wersji lokalnej, import do bazy.

**Gotowe, gdy:** spełniony warunek z F8, a historia z wersji lokalnej jest w bazie.

### Krok 11. Test bezpieczeństwa (1 blok)

- Prompt: „Sprawdź, czy bez logowania da się odczytać tabele tasks i blocks samym kluczem publicznym. Sprawdź też, czy w repozytorium nie ma klucza service_role.”

**Gotowe, gdy:** zapytanie bez logowania zwraca pustą listę, a w repozytorium nie ma żadnego sekretnego klucza.

## 11. Po MVP (backlog)

W kolejności priorytetów:

1. „Kopiuj do arkusza” (TSV), jeśli Claude nie zapisuje do Arkusza Google.
2. Listy lekcji z kursów do odhaczania, z procentem ukończenia, zamiast wydrukowanych kartek.
3. Ściana chwały.
4. Plan każdego przedsięwzięcia.
5. Podpowiedź „następne zadanie” (najbardziej w tyle względem celu) i karta „Po co to robię”.
6. Zakładka zdrowia: sen, jedzenie, leki, wpisywane z telefonu na tym samym koncie. Dane zdrowotne wymagają sprawdzenia reguł dostępu tak jak w kroku 11. Samo przypomnienie o lekach zostaje w telefonie, bo strona w przeglądarce nie przypomni, gdy jest zamknięta.
7. Podsumowania AI przez API. Klucz do AI musi siedzieć w funkcji po stronie Supabase (Edge Function), nigdy w kodzie strony.
8. Własny minutnik z automatyczną pauzą przy zmianie karty.
9. Widok na czytnik Boox: wysoki kontrast, bez animacji.
10. Praca bez internetu: kolejka zapisów wysyłana po odzyskaniu połączenia.
11. Sterowanie głosem.

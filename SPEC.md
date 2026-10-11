# Organizer nauki: specyfikacja MVP

Wersja 5 · 11 października 2026

Prosty dziennik 25-minutowych bloków nauki. Jedno kliknięcie zapisuje blok, kafelki pokazują postęp dnia względem celu, a wykres pokazuje postęp z dnia na dzień.

Ten plik opisuje, czym jest aplikacja. Plan budowy krok po kroku, stan prac i backlog są w [PLAN.md](PLAN.md).

## 1. Problem

Aplikacja rozwiązuje trzy problemy, w kolejności ważności:

1. **Brak widocznego postępu.** Bez zapisu każdy gorszy dzień wygląda na stracony. Rozwiązanie: wykres i liczniki pokazujące to, co zrobione.
2. **Jedna rzecz zjada dzień.** Rozwiązanie: licznik „zrobione / cel” na każdym zadaniu pokazuje to w trakcie dnia, a nie dopiero wieczorem.
3. **Start bez konkretu.** W MVP tylko częściowo, przez podpowiedź ostatniego opisu bloku. Pełne rozwiązanie po MVP (backlog w PLAN.md).

## 2. Użytkownik i główny scenariusz

Jeden użytkownik. Głównie przeglądarka na komputerze w pracy (własne konto Windows), aplikacja otwarta w przypiętej karcie. Od wersji z bazą danych (kroki 9–12) te same dane są dostępne także na innych urządzeniach, np. na czytniku Boox albo telefonie.

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
- Licznik wszystkich bloków od początku, np. „Łącznie: 312 bloków · 130 h”, widoczny zawsze. Przy 0 blokach pokazuje „Łącznie: 0 bloków” i podpowiedź „Tu będzie widać Twój postęp”.

**Gotowe, gdy:** dwa kliknięcia w „Python” dają „2 / 2 ✓”, po każdym kliknięciu licznik łączny rośnie o 1, a po odświeżeniu strony stan zostaje. Przy danych bez bloków licznik pokazuje 0 z podpowiedzią.

### F2. Opis bloku (opcjonalny)

- Po kliknięciu kafelka pojawia się pole „Co konkretnie?”. Podpowiedzią w polu jest ostatni opis z tego zadania.
- Enter zapisuje opis. Esc albo kliknięcie obok zamyka pole bez opisu.
- Blok jest zapisany już w chwili kliknięcia kafelka. Opis go tylko uzupełnia (operacja `updateBlock`, sekcja 7).
- Gdy zapis opisu się nie uda, aplikacja pokazuje komunikat z „Spróbuj ponownie”, a blok zostaje bez opisu.

**Gotowe, gdy:** po kliknięciu kafelka pole podpowiada ostatni opis tego zadania; Enter zapisuje opis przy bloku, a Esc zostawia blok bez opisu; oba bloki są na liście dnia i zostają po odświeżeniu strony.

### F3. Lista bloków dnia

- Pod kafelkami lista dzisiejszych bloków: godzina, zadanie, opis.
- Usuwanie bloku (pomyłka) po potwierdzeniu.
- „Dopisz blok”: formularz z zadaniem, datą, godziną i opisem, do uzupełniania zapomnianych bloków po fakcie.

**Gotowe, gdy:**

- usunięcie bloku pyta o potwierdzenie, a po nim kafelek i licznik łączny pokazują o 1 mniej (krok 3a);
- blok dopisany na wczoraj ma w danych wczorajszą datę i nie pojawia się na dzisiejszej liście ani na kafelkach (krok 3b). Na wykresie sprawdza go krok 5.

### F4. Zadania (zakładka „Zadania”)

- Lista zadań pogrupowana w dziedziny.
- Dodawanie i edycja zadania: nazwa, dziedzina, kolor, cel dzienny (liczba bloków, 0 = bez celu).
- Archiwizacja zamiast usuwania: zadanie znika z ekranu „Dziś”, ale jego bloki zostają w historii i na wykresie. Zarchiwizowane zadanie można przywrócić.
- Dziedziny są w MVP stałe: Programowanie, Angielski, ART.

**Gotowe, gdy:**

- nowe zadanie „Kolaże GIMP” w dziedzinie ART pojawia się na ekranie „Dziś” w wybranym kolorze;
- zmiana celu zmienia sumę dnia, np. z „z 9” na „z 10”;
- zarchiwizowane zadanie znika z ekranu „Dziś”, a jego bloki zostają w liczniku łącznym, na wykresie i w raporcie; przywrócone wraca na ekran „Dziś”.

### F5. Postęp (wykres)

- Wykres liniowy: oś X to dni, oś Y to liczba bloków. Jedna linia na zadanie, w kolorze zadania.
- Przełącznik zakresu: 7 dni albo 30 dni.
- Kliknięcie w legendę ukrywa lub pokazuje linię. Przy kilku liniach o wartościach 0–4 linie będą się nakładać, więc to ważne.
- Dzień bez bloków ma wartość 0.
- Pod wykresem: suma w zakresie (np. „7 dni: 41 bloków · 17 h 5 min”), suma dla każdego zadania i licznik „Łącznie od początku”.

**Gotowe, gdy:** dane z kilku dni dają osobne kolorowe linie, dzień bez bloków pokazuje 0, przełącznik zmienia zakres między 7 a 30 dniami, kliknięcie w legendę chowa i pokazuje linię, a sumy pod wykresem zgadzają się z danymi. Blok dopisany na wczoraj (F3) jest we wczorajszym dniu.

### F6. Raport

- Przycisk „Kopiuj raport” z wyborem: dziś albo ostatnie 7 dni. Raport trafia do schowka jako Markdown.
- Zawartość: zakres dat, suma bloków i godzin, tabela dzień × zadanie, lista opisów bloków. Wzór w sekcji 9.
- Gdy przeglądarka nie pozwoli zapisać do schowka, aplikacja pokazuje tekst raportu do skopiowania ręcznie.

**Gotowe, gdy:** testy dla stałych danych dają dokładnie tekst według wzoru z sekcji 9, raport wklejony do Claude wyświetla się jako czytelna tabela, a przy błędzie schowka tekst raportu jest widoczny do ręcznego skopiowania.

### F7. Kopia zapasowa

- „Eksportuj dane” pobiera plik `organizer-nauki-RRRR-MM-DD.json`.
- „Importuj dane” wczytuje taki plik i po potwierdzeniu zastępuje obecne dane.
- Plik, który nie jest kopią organizera albo ma błędne pola, daje komunikat, a dane zostają bez zmian.
- Import działa także wtedy, gdy zapisanych danych nie da się wczytać (np. są uszkodzone). Właśnie wtedy kopia jest najbardziej potrzebna.

**Gotowe, gdy:** eksport, wyczyszczenie danych i import przywracają wszystko; zły plik daje komunikat i niczego nie zmienia; przy celowo uszkodzonych danych da się zaimportować kopię.

### F8. Logowanie i dane w bazie (kroki 9–12)

- Ekran logowania: e-mail i hasło. Dwa konta: Twoje i testowe, do sprawdzania zmian na serwerze lokalnym bez dotykania prawdziwych danych. Rejestracja nowych kont jest wyłączona w Supabase.
- Sesja zostaje zapamiętana, więc na każdym urządzeniu logujesz się raz.
- Przycisk „Wyloguj” w zakładce „Zadania”.
- Zadania i bloki zapisują się w bazie Supabase, więc na każdym urządzeniu są te same.
- Podczas zapisu kliknięty kafelek pokazuje, że zapis trwa. Baza odpowiada wolniej niż `localStorage`, a bez tej informacji łatwo kliknąć drugi raz.
- Gdy zapis się nie uda (np. brak internetu), aplikacja pokazuje komunikat z przyciskiem „Spróbuj ponownie”.
- Jednorazowe przeniesienie danych z wersji lokalnej: eksport (F7) jeszcze w starej wersji, przed wdrożeniem zapisu w bazie, potem import do bazy (krok 11).

**Gotowe, gdy:** blok zapisany na komputerze w pracy widać po odświeżeniu na drugim urządzeniu, bez zalogowania nie da się odczytać żadnych danych, a konto testowe nie widzi Twoich danych.

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

### 6.2. Dane w aplikacji (do kroku 10: `localStorage`)

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

### 6.3. Dane w bazie (kroki 9–12: Supabase)

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
- Supabase zwraca domyślnie najwyżej 1000 wierszy na zapytanie. `load()` pobiera wszystkie bloki stronami (`range`), bo widoki liczą wszystko z pełnej listy; przy ok. 3300 blokach rocznie to kilka zapytań. Pobieranie tylko zakresu dat i licznik łączny przez `count` to optymalizacja na później (backlog w PLAN.md).
- Postgres zwraca godzinę jako `07:40:00`. `storage-supabase.js` skraca ją do `07:40`.
- Import do bazy (`replaceAll`): najpierw usunięcie bloków, potem zadań konta (bloki wskazują na zadania), następnie zapis zadań i bloków przez `upsert` po `id`. Gdy import przerwie się w połowie, „Spróbuj ponownie” wgrywa ten sam plik jeszcze raz, bez duplikatów. Dane są w pliku, więc nic nie ginie.

## 7. Architektura

Statyczna strona (HTML, CSS, JavaScript) na GitHub Pages. Do kroku 10 dane są w przeglądarce, od kroku 11 w bazie Supabase.

```
kliknięcie ──► app.js ──► storage ──► localStorage (do kroku 10) albo Supabase (od kroku 11)
                            │
                            ├── zapis udany ──► zmiana stanu ──► widok rysuje się od nowa
                            └── błąd zapisu ──► komunikat z „Spróbuj ponownie”, stan bez zmian
```

Cały stan to jeden obiekt w pamięci. Każda zmiana to trzy kroki: zapis przez moduł `storage`, a dopiero po udanym zapisie aktualizacja obiektu i ponowne narysowanie bieżącego widoku. Dzięki tej kolejności ekran nigdy nie pokazuje czegoś, czego nie udało się zapisać. Trzy zakładki w jednym pliku HTML: Dziś, Postęp, Zadania. Od kroku 10 przed nimi ekran logowania.

**Wspólny interfejs zapisu.** Oba moduły zapisu mają te same funkcje i od pierwszego dnia są asynchroniczne (zwracają `Promise`), także wersja na `localStorage`. Dzięki temu przejście na bazę to wymiana jednego pliku, bez zmian w widokach.

```
load()             → Promise<{ tasks, blocks }>
addBlock(block)    → Promise<block>
updateBlock(block) → Promise<block>     zmienia zapisany blok, np. dopisany opis (F2)
deleteBlock(id)    → Promise<void>
saveTask(task)     → Promise<task>      dodaje albo aktualizuje
replaceAll(data)   → Promise<void>      import pliku
exportAll()        → Promise<data>
```

Pliki:

```
index.html                szkielet i trzy zakładki: Dziś, Postęp, Zadania
tests.html                strona testów (od kroku 2b)
css/style.css
js/app.js                 start, wybór modułu zapisu, akcje, zakładki, odświeżanie widoku
js/storage-local.js       zapis w localStorage (do kroku 10)
js/storage-supabase.js    zapis w Supabase (od kroku 11)
js/model.js               dziedziny, operacje na danych, zliczenia
js/dates.js               daty lokalne, zakresy dni, polskie skróty dni
js/report.js              tekst raportu w Markdown (od kroku 6)
js/views/today.js         ekran Dziś, opis bloku, lista dnia
js/views/progress.js      wykres i sumy
js/views/tasks.js         zadania, eksport, import, wylogowanie
js/views/login.js         ekran logowania (od kroku 10)
js/tests/                 testy logiki (od kroku 2b)
```

**Testy.** `tests.html` uruchamia testy funkcji z `model.js`, `dates.js` i `report.js` i pokazuje wynik na ekranie: które przeszły, a które nie i dlaczego. Testy nie dotykają `localStorage`, bo strona testów trafia też na GitHub Pages, obok prawdziwych danych. Dzięki testom od razu widać, że nowa funkcja zepsuła starą.

**Hosting to nie to samo co przechowywanie danych.** GitHub Pages tylko wysyła pliki aplikacji. Do kroku 10 dane zostają w przeglądarce, osobno dla każdego komputera i adresu. Od kroku 11 dane są w bazie i każde urządzenie po zalogowaniu widzi to samo. Uwaga: wszystkie strony pod `kubiakraf.github.io`, także inne projekty na GitHub Pages, mają jeden wspólny `localStorage`.

## 8. Stos technologiczny

| Element | Wybór | Dlaczego |
|---|---|---|
| Kod | HTML, CSS, JavaScript (moduły ES), bez frameworka | zero konfiguracji, działa przez vscode.dev i tunel, każdą linię da się przeczytać i zrozumieć |
| Wykres | Chart.js 4.4.1 z CDN jsDelivr | wykres liniowy i klikalna legenda bez dodatkowej pracy |
| Dane, do kroku 10 | `localStorage` | działa od razu, bez kont i konfiguracji |
| Baza i logowanie, od kroku 9 | Supabase, plan darmowy, region UE (Frankfurt) | baza Postgres, gotowe logowanie i API bez pisania własnego serwera |
| Klient bazy | supabase-js 2.45.4 z CDN jsDelivr | oficjalna biblioteka, bez instalowania |
| Hosting | GitHub Pages | darmowy, wdrożenie przez `git push`; publiczne repozytorium to też portfolio |
| Uruchomienie lokalne | `python -m http.server 8000` i przekierowanie portu w VS Code (zakładka Ports) | moduły ES nie działają z pliku otwartego przez `file://` |
| Testy | strona `tests.html` z własną, krótką funkcją sprawdzającą | bez npm i bez bibliotek; testy działają w tej samej przeglądarce co aplikacja |

Wczytanie bibliotek:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
```

```js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";
```

Jeśli sieć w pracy blokuje jsDelivr (sprawdzenie w kroku 0), pliki bibliotek trafiają do repozytorium (`js/vendor/`) i aplikacja wczytuje je stamtąd.

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
- Jeśli konektor nie zapisuje do Arkusza, pierwszym punktem backlogu (PLAN.md) jest przycisk „Kopiuj do arkusza” (format TSV, wklejany Ctrl+V prosto w komórki).

Propozycja instrukcji dla projektu w Claude:

> Dostajesz raporty z mojego organizera nauki. Jeden blok to 25 minut. Do każdego raportu napisz: (1) co poszło dobrze, (2) czy któraś dziedzina wyparła inne, (3) jedną konkretną sugestię na kolejne dni. Opisuj to, co zrobione, i wzorce. Nie oceniaj surowo i nie pisz o porażkach.

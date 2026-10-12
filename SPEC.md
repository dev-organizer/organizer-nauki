# Organizer nauki: specyfikacja MVP

Wersja 6 · 12 października 2026

Prosty dziennik 25-minutowych bloków nauki. Jedno kliknięcie zapisuje blok, kafelki pokazują postęp dnia względem celu, a wykres pokazuje postęp z dnia na dzień.

Ten plik opisuje, czym jest aplikacja. Plan budowy krok po kroku, stan prac i lista kontrolna są w [PLAN.md](PLAN.md), a pomysły na czas po MVP w [ROADMAP.md](ROADMAP.md).

Aplikacja powstaje w dwóch wersjach: **wersja lokalna** (1.0: dane w przeglądarce, na jednym komputerze) i **wersja z bazą** (1.1: logowanie i dane w Supabase, na każdym urządzeniu). Numery kroków budowy są tylko w PLAN.md.

## 1. Problem

Aplikacja rozwiązuje trzy problemy, w kolejności ważności:

1. **Brak widocznego postępu.** Bez zapisu każdy gorszy dzień wygląda na stracony. Rozwiązanie: wykres i liczniki pokazujące to, co zrobione.
2. **Jedna rzecz zjada dzień.** Rozwiązanie: licznik „zrobione / cel” na każdym zadaniu pokazuje to w trakcie dnia, a nie dopiero wieczorem.
3. **Start bez konkretu.** W MVP tylko częściowo, przez podpowiedź ostatniego opisu bloku. Pełne rozwiązanie po MVP (ROADMAP.md).

## 2. Użytkownik i główny scenariusz

Jeden użytkownik. Głównie przeglądarka na komputerze w pracy (własne konto Windows), aplikacja otwarta w przypiętej karcie. W wersji z bazą te same dane są dostępne także na innych urządzeniach, np. na czytniku Boox albo telefonie.

1. Kostka-minutnik odlicza 25 minut. Minutnik jest poza aplikacją.
2. Kliknięcie kafelka zadania, np. „Python”, zapisuje blok 25 minut z bieżącą godziną.
3. Opcjonalnie: wpisanie, co konkretnie było robione (Enter), albo pominięcie (Esc).
4. Kafelek pokazuje np. „2 / 2 ✓”, a licznik łączny rośnie o 1. Od razu widać, które zadania są jeszcze przed celem.
5. Na koniec dnia lub tygodnia: zakładka „Postęp” z wykresem i przycisk „Kopiuj raport” do wklejenia w projekt w Claude.

**Wersja lokalna to jedna przeglądarka.** Dane są tylko w przeglądarce, w której klikasz (w pracy). Bloki zrobione gdzie indziej dopisujesz tam przez „Dopisz blok” (F3). Do bazy przenosi się jeden plik kopii, bez łączenia kilku.

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
- Licznik wszystkich bloków od początku, np. „Łącznie: 312 bloków · 130 h”, widoczny zawsze, od razu po otwarciu strony. Przy 0 blokach pokazuje „Łącznie: 0 bloków” i podpowiedź „Tu będzie widać Twój postęp”.

**Gotowe, gdy:** dwa kliknięcia w „Python” dają „2 / 2 ✓”, po każdym kliknięciu licznik łączny rośnie o 1, a po odświeżeniu strony stan zostaje. Przy danych bez bloków licznik pokazuje 0 z podpowiedzią.

### F2. Opis bloku (opcjonalny)

- Po kliknięciu kafelka pojawia się pole „Co konkretnie?”. Podpowiedzią w polu jest ostatni opis z tego zadania.
- Enter zapisuje opis. Esc albo kliknięcie obok zamyka pole bez opisu.
- Blok jest zapisany już w chwili kliknięcia kafelka. Opis go tylko uzupełnia (operacja `updateBlock`, sekcja 7).
- Gdy zapis opisu się nie uda, aplikacja pokazuje komunikat z „Spróbuj ponownie”, a blok zostaje bez opisu.

**Gotowe, gdy:** po kliknięciu kafelka pole podpowiada ostatni opis tego zadania; Enter zapisuje opis przy bloku, a Esc zostawia blok bez opisu; oba bloki są na liście dnia i zostają po odświeżeniu strony.

### F3. Lista bloków dnia

- Pod kafelkami lista bloków dnia: godzina, zadanie, opis. Domyślnie dziś; przyciski ◀ ▶ pokazują inne dni. Kafelki i suma dnia zawsze dotyczą dzisiaj.
- Usuwanie bloku (pomyłka) po potwierdzeniu na stronie („Usunąć? Tak / Nie”), także z innego dnia.
- „Dopisz blok”: formularz z zadaniem, datą, godziną i opisem, do uzupełniania zapomnianych bloków po fakcie.

**Gotowe, gdy:**

- usunięcie bloku pyta o potwierdzenie, a po nim kafelek i licznik łączny pokazują o 1 mniej;
- blok dopisany na wczoraj ma w danych wczorajszą datę i nie pojawia się na dzisiejszej liście ani na kafelkach; po ◀ jest na liście z wczoraj i da się go stamtąd usunąć. Na wykresie sprawdza go F5.

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

- Wykres liniowy: oś X to dni (zwykłe etykiety, np. „pn 12.10”), oś Y to liczba bloków. Jedna linia na zadanie, w kolorze zadania.
- Przełącznik zakresu: 7 dni albo 30 dni.
- Kliknięcie w legendę ukrywa lub pokazuje linię. Przy kilku liniach o wartościach 0–4 linie będą się nakładać, więc to ważne. Ukryte zadania zostają ukryte po zmianie zakresu.
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
- „Importuj dane” wczytuje taki plik i po potwierdzeniu na stronie zastępuje obecne dane. Potwierdzenie pokazuje liczbę zadań i bloków oraz datę ostatniego bloku w pliku i w obecnych danych. Gdy w pliku jest mniej bloków, wyraźnie ostrzega, bo najczęstsza pomyłka to stara kopia.
- Import sprawdza plik tak samo surowo jak baza (sekcja 6.3), więc plik, który przejdzie import lokalnie, przejdzie też import do bazy:
  - każde `id` w formacie UUID i bez powtórzeń;
  - `domainId` z listy dziedzin, `color` w formacie `#rrggbb`, `dailyGoal` liczba całkowita ≥ 0, `archived` prawda albo fałsz;
  - `date` jako `RRRR-MM-DD` z istniejącą datą, `time` jako `GG:MM`, `minutes` liczba całkowita > 0, `note` tekst;
  - każdy blok wskazuje zadanie z tego samego pliku.
- Plik, który nie jest kopią organizera albo ma błędne pola, daje komunikat (które pole i dlaczego), a dane zostają bez zmian.
- Gdy zapisanych danych nie da się wczytać (np. są uszkodzone), komunikat o błędzie ma „Pobierz uszkodzone dane” (surowy tekst do pliku, żeby dało się je odratować) i import kopii. Właśnie wtedy kopia jest najbardziej potrzebna.
- Przy 0 blokach na ekranie „Dziś”, obok podpowiedzi, jest link „Masz kopię? Importuj”. Po wyczyszczeniu przeglądarki aplikacja zaczyna od nowa i bez tego linku łatwo to przeoczyć.

**Gotowe, gdy:** eksport, wyczyszczenie danych i import przywracają wszystko; zły plik daje komunikat i niczego nie zmienia; plik z mniejszą liczbą bloków daje ostrzeżenie; przy celowo uszkodzonych danych da się pobrać ich surowy tekst i zaimportować kopię.

### F8. Logowanie i dane w bazie (wersja z bazą)

- Ekran logowania: e-mail i hasło. Dwa konta: Twoje i testowe (adres w domenie `@example.com`), do sprawdzania zmian na serwerze lokalnym bez dotykania prawdziwych danych. Rejestracja nowych kont jest wyłączona w Supabase.
- Poza adresem produkcyjnym (serwer lokalny, tunel) formularz przyjmuje tylko adres `@example.com`. Zasady „lokalnie tylko konto testowe” pilnuje kod, a nie pamięć.
- Sesja zostaje zapamiętana, więc na każdym urządzeniu logujesz się raz.
- Przycisk „Wyloguj” w zakładce „Zadania”, obok adresu zalogowanego konta.
- Zadania i bloki zapisują się w bazie Supabase, więc na każdym urządzeniu są te same.
- Podczas zapisu kliknięty kafelek pokazuje, że zapis trwa. Baza odpowiada wolniej niż `localStorage`, a bez tej informacji łatwo kliknąć drugi raz.
- Gdy zapis się nie uda (np. brak internetu), aplikacja pokazuje komunikat z przyciskiem „Spróbuj ponownie”. Ponowienie nigdy nie tworzy drugiego bloku, także wtedy, gdy pierwszy zapis doszedł do bazy, a zginęła tylko odpowiedź.
- Po powrocie do karty aplikacja wczytuje dane od nowa, żeby przypięta karta pokazywała też bloki zapisane na innych urządzeniach.
- Jednorazowe przeniesienie danych z wersji lokalnej: eksport (F7) jeszcze w starej wersji, przed wdrożeniem zapisu w bazie, potem import do bazy. Przedtem próba generalna na koncie testowym.

**Gotowe, gdy:** blok zapisany na komputerze w pracy widać na drugim urządzeniu, bez zalogowania nie da się odczytać żadnych danych, konto testowe nie widzi Twoich danych, a ponowiony zapis daje jeden blok.

## 5. Poza zakresem MVP

MVP to funkcje z sekcji 4 i nic więcej. Pomysły na później, ich kolejność i warunki, których MVP nie może zablokować, są w [ROADMAP.md](ROADMAP.md).

Świadome uproszczenia MVP (tak ma być, to nie braki do poprawienia w trakcie):

- minutnik jest poza aplikacją (kostka);
- jeden użytkownik, bez kont dla innych osób;
- dziedziny są stałe;
- bez edycji bloku: pomyłkę usuwasz z listy dnia i dopisujesz od nowa;
- w wersji z bazą bez pracy offline: komunikat z „Spróbuj ponownie” zamiast kolejki zapisów;
- raport wklejany ręcznie do Claude, bez połączenia z AI.

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

### 6.2. Dane w aplikacji (wersja lokalna: `localStorage`)

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
| `tasks[].color` | kolor `#rrggbb` (taki format daje `<input type="color">`) |
| `tasks[].dailyGoal` | cel dzienny w blokach; 0 = bez celu |
| `tasks[].archived` | zarchiwizowane zadanie nie pokazuje się na ekranie „Dziś”, ale zostaje w historii |
| `blocks[].date` | dzień bloku `RRRR-MM-DD` w czasie lokalnym |
| `blocks[].time` | godzina `GG:MM` |
| `blocks[].minutes` | w MVP zawsze 25; pole na przyszłe bloki innej długości |
| `blocks[].note` | opcjonalny opis; pusty tekst, gdy brak |

Zmiana formatu (`version`) to też zmiana sposobu wycofania błędu: przeglądarka, która raz otworzyła nową wersję, ma już dane w nowym formacie, a stary kod je odrzuci. Samo cofnięcie kodu nie wystarczy; potrzebny jest też import kopii sprzed zmiany.

### 6.3. Dane w bazie (wersja z bazą: Supabase)

Te same pola w dwóch tabelach. W bazie nazwy są w stylu `snake_case` (`daily_goal`, `task_id`); `storage-supabase.js` tłumaczy je na `camelCase` używane w aplikacji. SQL do wklejenia w Supabase (SQL Editor):

```sql
-- Klucz główny to para (user_id, id): ten sam plik kopii da się wgrać na dwa konta,
-- a blok nie wskaże zadania z innego konta.
-- "on delete restrict": konta z danymi nie da się usunąć (usunięcie skasowałoby historię).
create table tasks (
  user_id     uuid not null default auth.uid() references auth.users on delete restrict,
  id          uuid not null default gen_random_uuid(),
  domain_id   text not null check (domain_id in ('prog', 'eng', 'art')),
  name        text not null,
  color       text not null check (color ~* '^#[0-9a-f]{6}$'),
  daily_goal  int  not null default 0 check (daily_goal >= 0),
  archived    boolean not null default false,
  created_at  timestamptz not null default now(),
  primary key (user_id, id)
);

create table blocks (
  user_id     uuid not null default auth.uid() references auth.users on delete restrict,
  id          uuid not null default gen_random_uuid(),
  task_id     uuid not null,
  date        date not null,
  time        time not null,
  minutes     int  not null default 25 check (minutes > 0),
  note        text not null default '',
  created_at  timestamptz not null default now(),
  primary key (user_id, id),
  foreign key (user_id, task_id) references tasks (user_id, id) on delete restrict
);

create index blocks_user_date on blocks (user_id, date);

-- Dostęp przez API tylko dla zalogowanych. Bez logowania: błąd 42501 (permission denied).
revoke all on tasks, blocks from anon;
grant select, insert, update, delete on tasks, blocks to authenticated;

-- Bez tych reguł każdy zalogowany widziałby wszystkie wiersze, także cudze.
alter table tasks  enable row level security;
alter table blocks enable row level security;

create policy "tylko własne zadania" on tasks for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "tylko własne bloki" on blocks for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
```

Uwagi techniczne:

- Datę liczyć lokalnie. `toISOString()` zwraca czas UTC, więc blok zapisany tuż po północy trafiłby na poprzedni dzień.
- Cel dnia to suma celów aktywnych zadań: na start 2 + 2 + 0 + 4 + 1 = 9.
- Rozmiar: ok. 9 bloków dziennie to ok. 3300 bloków rocznie. Dla `localStorage` to ok. 0,5 MB przy limicie ok. 5 MB; dla bazy to drobiazg.
- **Klucz `(user_id, id)`.** Gdyby `id` było unikalne w całej tabeli, kopii wgranej na konto testowe (próba przed przeniesieniem prawdziwych danych) nie dałoby się potem wgrać na Twoje konto: import skończyłby się błędem `duplicate key` albo RLS.
- **Usuwanie konta.** `on delete restrict` nie pozwala usunąć w panelu konta, które ma dane. Zapomniane hasło odzyskuje się linkiem z panelu, nigdy przez usunięcie konta. Konto testowe da się usunąć dopiero po usunięciu jego bloków i zadań.
- **Uprawnienia (`grant`).** Od 30.05.2026 nowe projekty Supabase (od 30.10.2026 wszystkie) nie udostępniają tabel z `public` przez API bez `grant`; bez niego supabase-js dostaje `42501 permission denied for table tasks`. Uprawnienia mają tylko zalogowani (`authenticated`), bo aplikacja i tak wymaga logowania. Zapytanie bez logowania kończy się tym samym błędem i to jest poprawny wynik, a nie usterka.
- **RLS.** `to authenticated` i `(select auth.uid())` zamiast samego `auth.uid()`, jak zaleca Supabase: baza liczy wtedy `auth.uid()` raz na zapytanie, a nie dla każdego wiersza, i Performance Advisor nie zgłasza ostrzeżeń.
- **Pobieranie stronami.** Supabase zwraca domyślnie najwyżej 1000 wierszy na zapytanie. `load()` pobiera wszystkie bloki stronami (`range`), zawsze posortowane (`order` po dacie, godzinie i `id`): bez sortowania kolejne strony mogą się nakładać albo gubić wiersze. Widoki liczą wszystko z pełnej listy; przy ok. 3300 blokach rocznie to kilka zapytań. Pobieranie tylko zakresu dat i licznik łączny przez `count` to optymalizacja na później (ROADMAP.md).
- Postgres zwraca godzinę jako `07:40:00`. `storage-supabase.js` skraca ją do `07:40`.
- **`addBlock` wytrzymuje ponowienie.** Zapis przez `upsert` z `ignoreDuplicates` (albo błąd `23505` uznany za sukces). Gdy żądanie doszło, a zginęła odpowiedź, „Spróbuj ponownie” wysyła blok o tym samym `id` i nie powstaje ani drugi blok, ani fałszywy komunikat o błędzie.
- **Import do bazy (`replaceAll`).** Najpierw usunięcie bloków, potem zadań konta (bloki wskazują na zadania), następnie zapis zadań i bloków przez `upsert` po `(user_id, id)`. Gdy import przerwie się w połowie, „Spróbuj ponownie” wgrywa ten sam plik jeszcze raz, bez duplikatów. Dane są w pliku, więc nic nie ginie.

## 7. Architektura

Statyczna strona (HTML, CSS, JavaScript) na GitHub Pages. W wersji lokalnej dane są w przeglądarce, w wersji z bazą w Supabase.

```
kliknięcie ──► app.js ──► storage ──► localStorage (wersja lokalna) albo Supabase (wersja z bazą)
                            │
                            ├── zapis udany ──► zmiana stanu ──► widok rysuje się od nowa
                            └── błąd zapisu ──► komunikat z „Spróbuj ponownie”, stan bez zmian
```

Cały stan to jeden obiekt w pamięci. Każda zmiana to trzy kroki: zapis przez moduł `storage`, a dopiero po udanym zapisie aktualizacja obiektu i ponowne narysowanie bieżącego widoku. Dzięki tej kolejności ekran nigdy nie pokazuje czegoś, czego nie udało się zapisać. Trzy zakładki w jednym pliku HTML: Dziś, Postęp, Zadania. W wersji z bazą przed nimi ekran logowania.

Potwierdzenia („Usunąć? Tak / Nie”) i komunikaty są na stronie, a nie w oknach `alert()`, `confirm()` czy `prompt()`. Takie okno blokuje całą stronę, a narzędzia, którymi Claude Code sprawdza podgląd, często nie umieją go kliknąć.

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
tests.html                strona testów
css/style.css
js/app.js                 start, wybór modułu zapisu, akcje, zakładki, odświeżanie widoku
js/storage-local.js       zapis w localStorage (wersja lokalna)
js/storage-supabase.js    zapis w Supabase (wersja z bazą)
js/model.js               dziedziny, operacje na danych, zliczenia, sprawdzanie importu
js/dates.js               daty lokalne, zakresy dni, polskie skróty dni
js/report.js              tekst raportu w Markdown (F6)
js/vendor/                Chart.js i supabase-js z licencjami (sekcja 8)
js/views/today.js         ekran Dziś, opis bloku, lista dnia
js/views/progress.js      wykres i sumy
js/views/tasks.js         zadania, eksport, import, wylogowanie
js/views/login.js         ekran logowania (wersja z bazą)
js/tests/                 testy logiki
```

**Testy.** `tests.html` uruchamia testy funkcji z `model.js`, `dates.js` i `report.js` i pokazuje wynik na ekranie: które przeszły, a które nie i dlaczego. Testy nie dotykają `localStorage`, bo strona testów trafia też na GitHub Pages, obok prawdziwych danych. Dzięki testom od razu widać, że nowa funkcja zepsuła starą.

**Hosting to nie to samo co przechowywanie danych.** GitHub Pages tylko wysyła pliki aplikacji. W wersji lokalnej dane zostają w przeglądarce, osobno dla każdego komputera i adresu. W wersji z bazą dane są w bazie i każde urządzenie po zalogowaniu widzi to samo.

**Wspólny adres to wspólny `localStorage`.** Wszystkie strony pod `kubiakraf.github.io`, także inne projekty na GitHub Pages (np. z kursu), mają jeden `localStorage`. Mogą odczytać albo skasować dane organizera (poradniki często używają `localStorage.clear()`), a w wersji z bazą odczytać token sesji. Dopóki organizer jest pod tym adresem, inne projekty lepiej publikować gdzie indziej. Decyzja o osobnym adresie jest w PLAN.md.

## 8. Stos technologiczny

| Element | Wybór | Dlaczego |
|---|---|---|
| Kod | HTML, CSS, JavaScript (moduły ES), bez frameworka | zero konfiguracji, działa przez vscode.dev i tunel, każdą linię da się przeczytać i zrozumieć |
| Wykres | Chart.js 4.4.1, plik w repozytorium | wykres i klikalna legenda bez dodatkowej pracy |
| Dane, wersja lokalna | `localStorage` | działa od razu, bez kont i konfiguracji |
| Baza i logowanie, wersja z bazą | Supabase, plan darmowy, region UE (Frankfurt) | baza Postgres, gotowe logowanie i API bez pisania własnego serwera |
| Klient bazy | supabase-js 2.x w wersji aktualnej w dniu dodania, plik w repozytorium | oficjalna biblioteka, bez instalowania |
| Hosting | GitHub Pages | darmowy, wdrożenie przez `git push`; publiczne repozytorium to też portfolio |
| Uruchomienie lokalne | `python -m http.server 8000` i przekierowanie portu w VS Code (zakładka Ports) | moduły ES nie działają z pliku otwartego przez `file://` |
| Testy | strona `tests.html` z własną, krótką funkcją sprawdzającą | bez npm i bez bibliotek; testy działają w tej samej przeglądarce co aplikacja |

**Biblioteki leżą w repozytorium (`js/vendor/`), a nie na CDN.**

- Sieć w pracy nie może ich zablokować, a aplikacja nie zależy od cudzego serwera.
- Skrypt z obcego serwera miałby dostęp do danych i, w wersji z bazą, do tokenu sesji.
- CDN nie przyspiesza strony: przeglądarki od kilku lat nie dzielą pamięci podręcznej między stronami.
- Plik `+esm` z jsDelivr się nie nadaje: importuje kolejne pliki z jsDelivr. Potrzebna jest wersja jednoplikowa (UMD).

| Plik | Skąd (paczka npm) | Jak wczytany |
|---|---|---|
| `js/vendor/chart.umd.js` | Chart.js 4.4.1, `dist/chart.umd.js` (ok. 200 KB) | przez `views/progress.js` przy pierwszym otwarciu „Postępu”: dodany `<script>`, czekanie na `load`, potem globalne `Chart`. Ekran „Dziś” na niego nie czeka. Gdy plik się nie wczyta, zakładka pokazuje komunikat, a reszta aplikacji działa. |
| `js/vendor/supabase.js` | supabase-js, `dist/umd/supabase.js` (ok. 220 KB); wersja aktualna w dniu dodania, wpisana tutaj (7.10.2026: 2.117.3) | zwykły `<script>` przed `app.js`; w kodzie globalne `supabase` (`supabase.createClient`) |

Obok każdego pliku leży jego licencja (obie biblioteki mają licencję MIT).

Supabase, rzeczy do zapamiętania:

- **Klucz publiczny w kodzie jest w porządku.** Adres projektu i klucz `sb_publishable_…` z założenia trafiają do kodu strony. Dane chronią uprawnienia i reguły RLS z sekcji 6.3. Starych kluczy `anon` i `service_role` (długie tokeny `eyJ…`) nie używamy: Supabase wycofuje je do końca 2026.
- **Klucz sekretny (`sb_secret_…`, dawniej `service_role`) nigdy nie trafia do kodu ani do repozytorium.** Daje pełny dostęp z pominięciem reguł.
- **Nowa tabela potrzebuje `grant`.** Bez nadania uprawnień API jej nie widzi (sekcja 6.3).
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
- Jeśli konektor nie zapisuje do Arkusza, pierwszym pomysłem po MVP (ROADMAP.md) jest przycisk „Kopiuj do arkusza” (format TSV, wklejany Ctrl+V prosto w komórki).

Propozycja instrukcji dla projektu w Claude:

> Dostajesz raporty z mojego organizera nauki. Jeden blok to 25 minut. Do każdego raportu napisz: (1) co poszło dobrze, (2) czy któraś dziedzina wyparła inne, (3) jedną konkretną sugestię na kolejne dni. Opisuj to, co zrobione, i wzorce. Nie oceniaj surowo i nie pisz o porażkach.

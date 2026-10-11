# Organizer nauki: specyfikacja MVP

Wersja 4 · 11 października 2026

Prosty dziennik 25-minutowych bloków nauki. Jedno kliknięcie zapisuje blok, kafelki pokazują postęp dnia względem celu, a wykres pokazuje postęp z dnia na dzień.

## 1. Problem

Aplikacja rozwiązuje trzy problemy, w kolejności ważności:

1. **Brak widocznego postępu.** Bez zapisu każdy gorszy dzień wygląda na stracony. Rozwiązanie: wykres i liczniki pokazujące to, co zrobione.
2. **Jedna rzecz zjada dzień.** Rozwiązanie: licznik „zrobione / cel” na każdym zadaniu pokazuje to w trakcie dnia, a nie dopiero wieczorem.
3. **Start bez konkretu.** W MVP tylko częściowo, przez podpowiedź ostatniego opisu bloku. Pełne rozwiązanie po MVP (sekcja 11).

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
- Supabase zwraca domyślnie najwyżej 1000 wierszy na zapytanie. `load()` pobiera wszystkie bloki stronami (`range`), bo widoki liczą wszystko z pełnej listy; przy ok. 3300 blokach rocznie to kilka zapytań. Pobieranie tylko zakresu dat i licznik łączny przez `count` to optymalizacja na później (sekcja 11).
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
- Jeśli konektor nie zapisuje do Arkusza, pierwszym punktem backlogu jest przycisk „Kopiuj do arkusza” (format TSV, wklejany Ctrl+V prosto w komórki).

Propozycja instrukcji dla projektu w Claude:

> Dostajesz raporty z mojego organizera nauki. Jeden blok to 25 minut. Do każdego raportu napisz: (1) co poszło dobrze, (2) czy któraś dziedzina wyparła inne, (3) jedną konkretną sugestię na kolejne dni. Opisuj to, co zrobione, i wzorce. Nie oceniaj surowo i nie pisz o porażkach.

## 10. Plan implementacji

Plan prowadzi do wersji 1.0 (kroki 0–8: aplikacja w przeglądarce na jednym komputerze), a potem do wersji 1.1 (kroki 9–12: dane w bazie i logowanie). Każdy krok to 1–3 bloki Claude Code i kończy się czymś, co działa i co da się sprawdzić.

Szacunek: razem ok. 25–30 bloków. Po kroku 2 zostało ok. 19–24 bloków, czyli 8–10 godzin; przy 2–3 blokach Claude Code dziennie to ok. 1–2 tygodnie. To szacunek, nie termin: dłuższy krok to informacja, nie porażka. Bloki Claude Code zapisuj w aplikacji, a wykres pokaże, ile plan trwał naprawdę.

Kolejność: najpierw to, co potrzebne co dzień (zapis, poprawianie pomyłek, kopia), potem to, co rozwiązuje problem nr 1 (wykres, raport), a na końcu dopasowanie zadań, gdy pierwszy tydzień danych pokaże, co zmienić.

Baza wchodzi po wersji lokalnej, a nie od pierwszego dnia, bo:

- działająca aplikacja jest gotowa po tygodniu i od razu zbiera prawdziwe dane;
- błędy wyglądu i błędy bazy nie mieszają się ze sobą;
- dane z pierwszych dni przechodzą do bazy przez eksport i import.

### Zasady pracy

- Jeden krok na sesję Claude Code. Początek sesji: „Przeczytaj krok N ze SPEC.md. Wypisz plan i pytania z punktu »Do rozstrzygnięcia«; kodu jeszcze nie pisz.” Kod powstaje dopiero po decyzjach, a decyzje trafiają do SPEC.md.
- Krok jest skończony, gdy:
  1. spełnione jest jego „Gotowe, gdy”, a scenariusz ze „Sprawdzenia” przeszedł na serwerze lokalnym;
  2. przechodzą wszystkie testy w `tests.html`, nie tylko nowe;
  3. konsola przeglądarki (F12) jest bez błędów;
  4. warunki wcześniejszych kroków, których dotyczyła zmiana, nadal są spełnione;
  5. przy kroku jest „**Zrobione:**” z datą, a decyzje z kroku są w SPEC.md.
- Po każdym skończonym kroku: commit i push, po Twojej zgodzie. GitHub Pages aktualizuje stronę po ok. minucie.
- Po wdrożeniu odczekaj ok. 2 minuty i odśwież stronę na GitHub Pages przez Ctrl+Shift+R. Przeglądarka trzyma pliki strony do 10 minut, a mieszanka starych i nowych plików daje błędy. Produkcję sprawdzamy bez klikania kafelków: strona się otwiera, `tests.html` przechodzi, konsola jest bez błędów.
- Gdy wdrożenie coś zepsuje: `git revert` ostatniego commita i push. Naprawa na spokojnie, w kolejnej sesji.
- Przed zmianą formatu danych: eksport kopii (od kroku 4).
- Nowy pomysł w trakcie pracy trafia do sekcji 11, a nie do kodu.
- Następny krok to pierwszy bez dopisku „**Zrobione:**”.

Każdy krok ma te same punkty: **Opis** (co powstaje), **Rezultat** (co możesz potem zrobić), **Gotowe, gdy** (warunek ukończenia), **Sprawdzenie** (co kliknąć i co zobaczyć, które testy), **Zależności**, **Ryzyka** (i co z nimi robimy) oraz **Do rozstrzygnięcia** (pytania do decyzji na początku sesji). Zrobione kroki zostają w krótszej formie.

### Etap 1. Fundament (kroki 0–2b)

#### Krok 0. Przygotowanie i test ryzyka (1–2 bloki)

Stan na 11.10.2026: repozytorium i GitHub Pages działają, CLAUDE.md jest w repozytorium, test pamięci przeglądarki przeszedł zamknięcie przeglądarki i restart komputera. Zostało, na komputerze w pracy we wtorek 13.10.2026: sprawdzenie następnego dnia, sieci i przeglądarki.

- **Opis.** CLAUDE.md (prompt: „Przeczytaj SPEC.md i utwórz CLAUDE.md z zasadami projektu, stosem i strukturą plików.”) i sprawdzenie, czy komputer w pracy nie przekreśli planu:
  - `test-pamieci.html` następnego dnia;
  - adres `https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js` pokazuje kod biblioteki, a nie stronę blokady;
  - nazwa i wersja przeglądarki (Edge: `edge://settings/help`, Chrome: `chrome://settings/help`).
- **Rezultat.** Wiadomo, że dane w przeglądarce przetrwają i że wykres będzie miał skąd wczytać bibliotekę.
- **Gotowe, gdy:** strona testowa następnego dnia pokazuje, że dane przetrwały, w repozytorium jest CLAUDE.md, a wynik sprawdzenia sieci i wersja przeglądarki są zapisane przy tym kroku.
- **Zależności:** brak.
- **Ryzyka i plan B:**
  - dane nie przetrwały nocy → kroki 9–12 (baza) idą zaraz po kroku 4, a do ich końca eksport na koniec każdego dnia;
  - jsDelivr zablokowany → w kroku 5 plik Chart.js trafia do repozytorium (`js/vendor/`); to samo trzeba będzie rozwiązać dla supabase-js w kroku 10.

#### Krok 1. Szkielet i dane (1–2 bloki)

- Prompt: „Według sekcji 6–8 SPEC.md utwórz strukturę plików, storage-local.js z asynchronicznym interfejsem z sekcji 7, danymi startowymi i obsługą wersji danych oraz model.js. Bez wyglądu.”

**Gotowe, gdy:** w narzędziach deweloperskich (F12 → Application → Local Storage) widać klucz `organizerNauki` z 5 zadaniami.

**Zrobione:** 11.10.2026.

#### Krok 2. Ekran „Dziś” (2 bloki)

Funkcja F1. **Gotowe, gdy:** spełniony warunek z F1.

**Zrobione:** 11.10.2026. Licznik łączny był wtedy ukryty do pierwszego zapisu; widoczny zawsze i z podpowiedzią przy 0 jest od kroku 2b.

#### Krok 2b. Testy i licznik łączny (1–2 bloki)

Dopisany 11.10.2026, po kroku 2. Testy pozwalają od razu zauważyć, że nowa funkcja zepsuła starą.

- **Opis.**
  - Strona `tests.html` z krótką funkcją sprawdzającą (bez bibliotek) i testy funkcji z `model.js` i `dates.js`.
  - Teksty kafelka i sumy dnia („2 / 2 ✓”, „Dziś: 5 z 9 bloków”) przechodzą z `views/today.js` do `model.js`, żeby testy je obejmowały.
  - Licznik łączny według F1: widoczny zawsze, przy 0 blokach z podpowiedzią.
- **Rezultat.** Każda kolejna zmiana od razu pokazuje, czy nie zepsuła czegoś, co już działało.
- **Gotowe, gdy:** `tests.html` pokazuje, że wszystkie testy przechodzą; celowo zepsuty test pokazuje, który i dlaczego (potem cofamy zmianę); spełniony jest warunek z F1.
- **Sprawdzenie:**
  1. `tests.html` na serwerze lokalnym: wszystkie testy przechodzą, widać ich liczbę.
  2. Zmiana oczekiwanego wyniku w jednym teście: test nie przechodzi, a komunikat mówi, czego oczekiwał i co dostał. Potem cofnięcie zmiany.
  3. Testy obejmują co najmniej: odmianę (1 blok, 2 bloki, 5 bloków, 12 bloków, 22 bloki), czas (0 min, 25 min, 2 h 5 min, 130 h), przejście przez koniec miesiąca i roku, zmianę czasu 25.10.2026 i 29.03.2026 (`lastDays` bez powtórzonych i zgubionych dni), godzinę tuż po północy, odrzucenie złych danych i danych z nowszej wersji (`upgradeData`), pominięcie zarchiwizowanych zadań w celu dnia, teksty kafelka (bez celu, przed celem, cel osiągnięty, ponad cel).
  4. Na serwerze lokalnym usunięcie klucza `organizerNauki` (F12 → Application → Local Storage) i odświeżenie: „Łącznie: 0 bloków” z podpowiedzią; po kliknięciu kafelka licznik rośnie o 1.
- **Zależności:** brak.
- **Ryzyka:**
  - testy zależne od bieżącej daty dają różne wyniki w różne dni → w testach datę i godzinę zawsze podajemy wprost;
  - `tests.html` jest też na GitHub Pages, obok prawdziwych danych → testy nie dotykają `localStorage`.

### Etap 2. Codzienne używanie (kroki 3a–4)

#### Krok 3a. Opis bloku, lista dnia, usuwanie (2 bloki)

- **Opis.** F2 i część F3: pole „Co konkretnie?” po kliknięciu kafelka, lista dzisiejszych bloków, usuwanie po potwierdzeniu. Nowa operacja zapisu `updateBlock(block)` w `storage-local.js` (sekcja 7), bo opis dochodzi do bloku, który jest już zapisany.
- **Rezultat.** Zapisujesz, co konkretnie robiłeś, i cofasz pomyłkowe kliknięcie.
- **Gotowe, gdy:** spełnione są warunki z F2 i warunek z F3 o usuwaniu.
- **Sprawdzenie:**
  1. Kliknięcie „Python” → pole z podpowiedzią ostatniego opisu → wpisanie opisu i Enter → blok na liście z godziną, zadaniem i opisem.
  2. Kliknięcie „Python” → Esc → blok na liście bez opisu, kafelek „2 / 2 ✓”.
  3. Usuń blok → Anuluj: nic się nie zmienia. Usuń → OK: kafelek „1 / 2”, licznik łączny o 1 mniejszy.
  4. Odświeżenie strony: opisy i usunięcia zostają.
  5. Testy nowych funkcji z `model.js` (np. podpowiedź ostatniego opisu, kolejność listy).
- **Zależności:** krok 2b.
- **Ryzyka:**
  - widok rysuje się od nowa po każdym zapisie, więc pole opisu może zniknąć albo stracić kursor → to, dla którego bloku pole jest otwarte, trzymamy w stanie aplikacji (`state`), a nie tylko na stronie;
  - zapis opisu się nie uda → komunikat z „Spróbuj ponownie”, blok zostaje bez opisu;
  - pole opisu nie może blokować następnego kliknięcia kafelka (zasada „jedno kliknięcie”).
- **Do rozstrzygnięcia:** kolejność listy (od najstarszego czy od najnowszego); czy podpowiedzią jest ostatni niepusty opis; co z otwartym polem, gdy klikniesz inny kafelek.

#### Krok 3b. Dopisywanie bloku po fakcie (1 blok)

- **Opis.** Reszta F3: formularz „Dopisz blok” z zadaniem, datą, godziną i opisem.
- **Rezultat.** Zapomniany blok nie przepada.
- **Gotowe, gdy:** spełniony jest warunek z F3 o dopisywaniu.
- **Sprawdzenie:**
  1. Dopisanie „Rysunek” na wczoraj, 20:00 → nie ma go na dzisiejszej liście ani na kafelku, a licznik łączny jest o 1 większy.
  2. F12 → Application → Local Storage: blok ma wczorajszą datę i godzinę 20:00.
  3. Dopisanie bloku na dziś, na wcześniejszą godzinę → jest na kafelku i na liście, w miejscu wynikającym z godziny.
  4. Odświeżenie strony: oba bloki zostają.
  5. Testy: blok z podaną datą i godziną, wartości domyślne formularza.
- **Zależności:** krok 3a (lista dnia).
- **Ryzyka:** pole daty w formularzu daje tekst `RRRR-MM-DD` → zapisujemy go wprost, bez `new Date()` i `toISOString()`, które mogą przesunąć dzień.
- **Do rozstrzygnięcia:** domyślna data i godzina w formularzu; czy można dopisać blok z przyszłą datą.

#### Krok 4. Kopia zapasowa (2 bloki)

- **Opis.** F7: „Eksportuj dane” i „Importuj dane” w zakładce „Zadania” (lista zadań dojdzie w kroku 7). Import sprawdza plik: czy to kopia organizera i czy zadania i bloki mają poprawne pola. Import jest dostępny także wtedy, gdy zapisanych danych nie da się wczytać.
- **Rezultat.** Prawdziwe dane mają kopię poza przeglądarką, a na serwerze lokalnym możesz wczytać dane testowe (potrzebne w krokach 5–6).
- **Gotowe, gdy:** spełniony jest warunek z F7.
- **Sprawdzenie (na serwerze lokalnym):**
  1. Eksport → pobiera się `organizer-nauki-RRRR-MM-DD.json` z dzisiejszą datą.
  2. Usunięcie klucza `organizerNauki` i odświeżenie → import pliku → potwierdzenie → wracają wszystkie zadania i bloki, licznik łączny jak przed eksportem.
  3. Anulowanie potwierdzenia → dane bez zmian.
  4. Import innego pliku JSON → komunikat, dane bez zmian.
  5. Wpisanie w `organizerNauki` tekstu `zepsute` i odświeżenie → komunikat o uszkodzonych danych z możliwością importu → import przywraca dane.
  6. Testy sprawdzania pliku: dobry plik, brak pól, zły typ pola, nowsza wersja.
  7. Na komputerze w pracy: eksport działa i wiadomo, w którym folderze ląduje plik.
- **Zależności:** krok 2b.
- **Ryzyka:**
  - pomyłkowy import nadpisze prawdziwe dane → potwierdzenie przed importem;
  - przy uszkodzonych danych zakładki się nie rysują (`render()` czeka na dane) → import musi być dostępny poza zakładką, np. w komunikacie o błędzie;
  - przeglądarka w pracy może blokować pobieranie plików → sprawdzenie 7;
  - kopia w folderze Pobrane chroni przed wyczyszczeniem przeglądarki, ale nie przed awarią komputera → pełne rozwiązanie to baza (kroki 9–12).
- **Do rozstrzygnięcia:** treść potwierdzenia importu (np. ile zadań i bloków jest w pliku); gdzie dokładnie jest import przy uszkodzonych danych.

**Kamień milowy: używam na co dzień.** Aplikacja na GitHub Pages w przypiętej karcie w pracy, eksport raz w tygodniu. Klikać można już wcześniej, ale pomyłki da się usuwać dopiero od kroku 3a, a kopię robić od kroku 4.

### Etap 3. Widoczny postęp (kroki 5–6)

#### Krok 5. Wykres (2–3 bloki)

- **Opis.** F5. W `model.js` funkcja licząca bloki w układzie dzień × zadanie dla zakresu dni; tej samej funkcji użyje raport w kroku 6. Chart.js 4.4.1 z CDN albo z `js/vendor/`, zależnie od wyniku kroku 0. Dane testowe z datami do dziś, do wczytania przez import na serwerze lokalnym.
- **Rezultat.** Widzisz postęp z dnia na dzień: odpowiedź na problem nr 1.
- **Gotowe, gdy:** spełniony jest warunek z F5.
- **Sprawdzenie (na serwerze lokalnym, po imporcie danych testowych):**
  1. 7 dni: osobna linia w kolorze każdego zadania, dzień bez bloków ma wartość 0.
  2. 30 dni: na osi 30 kolejnych dni, bez powtórzonych i zgubionych dni.
  3. Kliknięcie w legendę chowa i pokazuje linię.
  4. Sumy pod wykresem zgadzają się z danymi.
  5. Blok dopisany na wczoraj (krok 3b) jest we wczorajszym dniu.
  6. Kilkanaście przełączeń zakładek i zakresów: konsola bez błędów.
  7. Testy: zliczenie dzień × zadanie, dni bez bloków jako 0, suma w zakresie, zadanie zarchiwizowane.
- **Zależności:** krok 4 (import danych testowych), krok 0 (skąd Chart.js).
- **Ryzyka:**
  - każde przerysowanie tworzy nowy wykres → poprzedni niszczymy (`chart.destroy()`), inaczej zostaje w pamięci i daje błędy;
  - plik z danymi o stałych datach szybko się zestarzeje, bo wykres pokazuje dni do dziś → dane testowe powstają z datami kończącymi się dziś;
  - Chart.js się nie wczyta (sieć, awaria CDN) → zakładka pokazuje komunikat zamiast wykresu, reszta aplikacji działa;
  - linie o wartościach 0–4 nakładają się → legenda do chowania linii (F5).
- **Do rozstrzygnięcia:** czy rysować linie zadań bez bloków w zakresie; czy zadanie zarchiwizowane ma linię tylko wtedy, gdy ma bloki w zakresie; skąd brać dane testowe (propozycja: przycisk w `tests.html`, który pobiera plik do importu).

#### Krok 6. Raport (2 bloki)

- **Opis.** F6. `report.js` buduje tekst raportu z tej samej funkcji zliczającej co wykres. „Kopiuj raport” z wyborem: dziś albo 7 dni.
- **Rezultat.** Jednym kliknięciem przenosisz dzień albo tydzień nauki do projektu w Claude.
- **Gotowe, gdy:** spełniony jest warunek z F6.
- **Sprawdzenie:**
  1. Testy `report.js` dla stałych danych: tekst dokładnie według wzoru z sekcji 9; dzień bez bloków ma w tabeli zera; nazwa zadania ze znakiem `|` nie psuje tabeli.
  2. „Kopiuj raport” (7 dni) na danych testowych → raport wklejony do Claude wyświetla się jako czytelna tabela.
  3. Symulowany błąd schowka (tymczasowa zmiana w kodzie, potem cofnięta) → tekst raportu jest widoczny do ręcznego skopiowania.
- **Zależności:** krok 5 (funkcja zliczająca), krok 4 (dane testowe).
- **Ryzyka:**
  - schowek działa tylko na `https://` albo `localhost` i może odmówić → zawsze jest plan B z tekstem do ręcznego skopiowania;
  - znak `|` w nazwie zadania rozbiłby tabelę Markdown → w tabeli zamieniamy go na `\|`.
- **Do rozstrzygnięcia:** czy „7 dni” obejmuje dziś; które zadania są kolumnami tabeli (np. zarchiwizowane tylko z blokami w zakresie); kolejność opisów bloków.

### Etap 4. Wersja 1.0 (kroki 7–8)

#### Krok 7. Zadania (2 bloki)

- **Opis.** F4: lista zadań pogrupowana w dziedziny, dodawanie, edycja, archiwizacja i przywracanie.
- **Rezultat.** Dopasowujesz zadania i cele do tego, co pokazał pierwszy tydzień danych.
- **Gotowe, gdy:** spełniony jest warunek z F4.
- **Sprawdzenie:**
  1. Nowe zadanie „Kolaże GIMP” w ART → na ekranie „Dziś” w dziedzinie ART, w wybranym kolorze.
  2. Cel „Rysunku” z 1 na 2 → suma dnia „z 10”.
  3. Archiwizacja zadania z blokami → znika z ekranu „Dziś”; licznik łączny bez zmian; jego bloki nadal są na wykresie i w raporcie.
  4. Przywrócenie → zadanie wraca na ekran „Dziś”.
  5. Nazwa `<b>test</b>` wyświetla się dosłownie, bez pogrubienia (tekst nie jest traktowany jak HTML).
  6. Odświeżenie strony: zmiany zostają.
  7. Testy: dodanie i zmiana zadania, cel dnia po archiwizacji, sprawdzanie formularza.
- **Zależności:** kroki 5 i 6 (archiwum widać na wykresie i w raporcie).
- **Ryzyka:**
  - usunięcie zadania osierociłoby jego bloki → tylko archiwizacja, bez przycisku „Usuń” (F4);
  - zmiana dziedziny przenosi kafelek do innej grupy, a bloki zostają przy zadaniu, bo `id` się nie zmienia.
- **Do rozstrzygnięcia:** zasady formularza (pusta nazwa, cel ujemny albo ułamkowy, powtórzona nazwa); kolor dowolny czy z palety i czy czerwony zostaje tylko dla Frontendu (sekcja 3).

#### Krok 8. Szlif i wersja 1.0 (najwyżej 2 bloki)

- **Opis.** Konkretna lista zamiast ogólnego „wyglądu”:
  - czytelność i kontrast tekstu na kafelkach każdego koloru;
  - obsługa klawiaturą: Tab po kafelkach, widoczny fokus, fokus nie ginie po zapisie bloku;
  - wąskie okno (ok. 360 px) bez przewijania w bok;
  - przeglądarka w pracy (wersja z kroku 0): wszystko działa, konsola bez błędów;
  - README.md: co to jest, link do aplikacji, zrzut ekranu, stos, uruchomienie lokalne i testy;
  - tag `v1.0` w git.
- **Rezultat.** Wersja 1.0 do codziennego używania i do pokazania w portfolio.
- **Gotowe, gdy:** punkty z listy są zrobione, README widać na GitHubie, tag `v1.0` jest wypchnięty (`git push origin v1.0`), a na GitHub Pages strona i `tests.html` działają bez błędów w konsoli.
- **Sprawdzenie:** przejście listy na serwerze lokalnym i na komputerze w pracy; po wdrożeniu sprawdzenie produkcji według zasad pracy.
- **Zależności:** kroki 2–7.
- **Ryzyka:**
  - szlif nie ma naturalnego końca → limit 2 bloków, reszta do sekcji 11;
  - zrzut ekranu w publicznym README mógłby pokazać prywatne opisy bloków → zrzut na danych testowych.
- **Do rozstrzygnięcia:** README po polsku czy po angielsku.

### Etap 5. Wersja 1.1: baza i logowanie (kroki 9–12)

#### Krok 9. Projekt w Supabase (1–2 bloki)

Ten krok to klikanie w panelu Supabase, nie kod. Konto zakładasz sam.

- **Opis.**
  - Na komputerze w pracy: czy otwiera się `https://supabase.com`.
  - Projekt `organizer-nauki` w regionie Frankfurt. Z komputera w pracy adres `https://<adres-projektu>.supabase.co/rest/v1/` daje odpowiedź JSON (np. o braku klucza), a nie stronę blokady.
  - W SQL Editor SQL z sekcji 6.3.
  - Dwa konta (Authentication → Users → Add user, z automatycznym potwierdzeniem): Twoje i testowe, np. `test@example.com`. Potem wyłączona rejestracja nowych kont.
  - Site URL: `https://kubiakraf.github.io/organizer-nauki/`.
  - Advisors → Security Advisor bez ostrzeżeń o tabelach bez RLS.
- **Rezultat.** Baza i konta są gotowe i zabezpieczone, zanim powstanie kod.
- **Gotowe, gdy:** w Table Editor są tabele `tasks` i `blocks`, obie z włączonym RLS; Security Advisor nie zgłasza tabel bez RLS; są dwa konta, a rejestracja jest wyłączona; adres projektu odpowiada z komputera w pracy.
- **Sprawdzenie:** Table Editor (oznaczenie RLS przy tabelach), Security Advisor, lista użytkowników, ustawienie rejestracji, adres `/rest/v1/` otwarty w pracy.
- **Zależności:** wersja 1.0 (krok 8).
- **Ryzyka:**
  - sieć w pracy blokuje `*.supabase.co` → stop przed pisaniem kodu i decyzja, co dalej;
  - klucz `service_role` (secret) daje pełny dostęp z pominięciem RLS → nigdy do plików, repozytorium ani czatu; do kodu trafia tylko klucz publiczny;
  - hasła obu kont tylko w menedżerze haseł, nigdy w plikach ani w czacie;
  - pusta tabela przechodzi każdy test RLS → prawdziwy test w kroku 12, na danych.

#### Krok 10. Logowanie (1–2 bloki)

- **Opis.** Część F8: ekran logowania (`views/login.js`), zapamiętana sesja, „Wyloguj” w zakładce „Zadania”. Dane nadal w `localStorage`.
- **Rezultat.** Aplikacja jest zamknięta dla obcych, zanim trafią do niej dane z bazy.
- **Gotowe, gdy:** po zalogowaniu widać aplikację, po wylogowaniu ekran logowania, a po odświeżeniu strony sesja zostaje.
- **Sprawdzenie** (logujesz się sam, hasła nie podajesz w czacie):
  1. Złe hasło → komunikat po polsku.
  2. Dobre hasło → aplikacja; odświeżenie → nadal zalogowany.
  3. Wyloguj → ekran logowania; odświeżenie → nadal ekran logowania.
  4. Konto testowe też się loguje.
  5. W kodzie są tylko adres projektu i klucz publiczny.
- **Zależności:** krok 9.
- **Ryzyka:**
  - wszystkie strony pod `kubiakraf.github.io` mają wspólny `localStorage`, a w nim token sesji → nie publikuj tam stron z cudzymi skryptami; przed danymi o zdrowiu osobny adres (sekcja 11, punkt 6);
  - supabase-js z CDN zablokowany w pracy → jak Chart.js w kroku 5 (`js/vendor/`);
  - menedżer haseł nie podpowiada danych → pola formularza z `autocomplete="email"` i `autocomplete="current-password"`.
- **Do rozstrzygnięcia:** co widać przy starcie, zanim aplikacja sprawdzi sesję (żeby nie mignął ekran logowania).

#### Krok 11. Zapis w bazie i przeniesienie danych (2–3 bloki)

- **Opis.**
  - `storage-supabase.js` z tym samym interfejsem co `storage-local.js` (sekcja 7) i przełączenie na niego aplikacji.
  - Tłumaczenie `snake_case` ↔ `camelCase` i godziny `07:40:00` → `07:40`; bloki pobierane stronami; `replaceAll` według sekcji 6.3.
  - Kafelek pokazuje, że zapis trwa (np. „Zapisuję…”).
  - Przeniesienie danych z wersji lokalnej.
- **Rezultat.** Te same dane na każdym urządzeniu.
- **Gotowe, gdy:** spełniony jest warunek z F8, a cała historia z wersji lokalnej jest w bazie (licznik łączny taki sam jak przed przeniesieniem).
- **Sprawdzenie:**
  1. Na serwerze lokalnym, na koncie testowym: scenariusze z kroków 2–7 (kafelki, opis, lista, usuwanie, dopisywanie, kopia, wykres, raport, zadania).
  2. F12 → Network → Offline → kliknięcie kafelka → komunikat z „Spróbuj ponownie” → Online → ponowienie → jeden blok, nie dwa.
  3. F12 → Network → Slow 3G: kafelek pokazuje, że zapis trwa.
  4. Testy tłumaczenia wierszy, bez łączenia z bazą.
  5. Przeniesienie, w jednej sesji i bez klikania bloków pomiędzy: eksport na GitHub Pages (jeszcze stara wersja) → commit i push → Ctrl+Shift+R → logowanie na Twoje konto → import pliku → licznik łączny i wykres jak przed przeniesieniem.
  6. Drugie urządzenie: po zalogowaniu i odświeżeniu widać blok zapisany na komputerze w pracy.
- **Zależności:** kroki 9 i 10; kopia zapasowa (krok 4).
- **Ryzyka:**
  - od tego kroku serwer lokalny i GitHub Pages używają tej samej bazy → lokalnie logujesz się wyłącznie na konto testowe;
  - po wdrożeniu eksport czyta już z bazy → eksport ze starej wersji przed pushem (sprawdzenie 5); stare dane i tak zostają w `localStorage`, więc w razie kłopotu da się je odzyskać przez F12;
  - import przerwany w połowie → „Spróbuj ponownie” wgrywa ten sam plik jeszcze raz (sekcja 6.3);
  - baza odpowiada wolniej niż `localStorage` → widoczny stan zapisu, żeby nie kliknąć drugi raz;
  - sesja wygasła → ekran logowania zamiast „Spróbuj ponownie” bez końca;
  - baza to nie kopia zapasowa (na darmowym planie nie licz na kopie z panelu Supabase) → eksport raz w tygodniu zostaje.
- **Do rozstrzygnięcia:** gdzie trzymać tłumaczenie wierszy, żeby testy działały bez łączenia z bazą; czy kafelek przyjmuje drugie kliknięcie, zanim skończy się zapis.

#### Krok 12. Test bezpieczeństwa i wersja 1.1 (1 blok)

- **Opis.** Sprawdzenie RLS na prawdziwych danych, z kontrolą pozytywną; szukanie sekretów w plikach i w historii gita; tag `v1.1`.
- **Rezultat.** Pewność, że Twoje dane widzisz tylko Ty.
- **Gotowe, gdy:**
  1. to samo zapytanie o `tasks` i `blocks` z kluczem publicznym: po zalogowaniu na Twoje konto zwraca Twoje dane, bez logowania pustą listę, a na koncie testowym tylko dane testowe;
  2. próba założenia nowego konta kończy się błędem;
  3. w plikach i w historii gita nie ma sekretnego klucza: każdy klucz to klucz publiczny (`sb_publishable_…` albo token, który po rozkodowaniu ma `"role": "anon"`), nigdzie nie ma `sb_secret_…`;
  4. tag `v1.1` jest wypchnięty.
- **Sprawdzenie:** prompt: „Przygotuj zapytania do sprawdzenia RLS według kroku 12 i wykonaj wersję bez logowania. Znajdź w plikach i w historii gita wszystkie klucze (`eyJ…`, `sb_…`) i sprawdź, że to klucze publiczne.” Zapytania po zalogowaniu i próbę rejestracji wykonujesz sam, bo wymagają hasła albo zakładają konto.
- **Zależności:** krok 11 (pusta tabela niczego nie dowodzi).
- **Ryzyka:**
  - pusta odpowiedź może znaczyć błąd w zapytaniu, a nie działające RLS → dlatego najpierw zapytanie po zalogowaniu musi zwrócić dane;
  - stary klucz `service_role` to zakodowany token, więc samo szukanie słowa `service_role` go nie znajdzie → rozkodowujemy każdy token;
  - sekret raz wypchnięty i potem usunięty zostaje w historii gita → gdyby się znalazł: nowy klucz w panelu Supabase, a stary przestaje działać.

## 11. Po MVP (backlog)

W kolejności priorytetów:

1. „Kopiuj do arkusza” (TSV), jeśli Claude nie zapisuje do Arkusza Google.
2. Listy lekcji z kursów do odhaczania, z procentem ukończenia, zamiast wydrukowanych kartek.
3. Ściana chwały.
4. Plan każdego przedsięwzięcia.
5. Podpowiedź „następne zadanie” (najbardziej w tyle względem celu) i karta „Po co to robię”.
6. Zakładka zdrowia: sen, jedzenie, leki, wpisywane z telefonu na tym samym koncie. Dane zdrowotne wymagają sprawdzenia reguł dostępu tak jak w kroku 12. Wcześniej aplikacja dostaje własny adres (np. własną domenę), bo wszystkie strony pod `kubiakraf.github.io` mają wspólny `localStorage`, a w nim token sesji. Samo przypomnienie o lekach zostaje w telefonie, bo strona w przeglądarce nie przypomni, gdy jest zamknięta.
7. Podsumowania AI przez API. Klucz do AI musi siedzieć w funkcji po stronie Supabase (Edge Function), nigdy w kodzie strony.
8. Własny minutnik z automatyczną pauzą przy zmianie karty.
9. Widok na czytnik Boox: wysoki kontrast, bez animacji.
10. Praca bez internetu: kolejka zapisów wysyłana po odzyskaniu połączenia.
11. Pobieranie bloków tylko z potrzebnego zakresu dat i licznik łączny zapytaniem z `count`, gdy pełne wczytanie zacznie być wolne.
12. Sterowanie głosem.

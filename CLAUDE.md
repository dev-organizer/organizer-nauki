# Organizer nauki

Dziennik 25-minutowych bloków nauki dla jednej osoby: jedno kliknięcie w kafelek zapisuje blok, kafelki pokazują „zrobione / cel”, wykres pokazuje postęp z dnia na dzień.

**Źródłem prawdy są [SPEC.md](SPEC.md) (czym jest aplikacja: funkcje, dane, architektura) i [PLAN.md](PLAN.md) (kroki budowy, stan prac, lista kontrolna). [ROADMAP.md](ROADMAP.md) zbiera pomysły po MVP i warunki, których MVP nie może zablokować.** Przed każdym krokiem przeczytaj krok w PLAN.md i funkcje (F1–F8) ze SPEC.md, do których się odwołuje. Jeśli kod, CLAUDE.md, SPEC.md, PLAN.md i ROADMAP.md się różnią, zapytaj, zamiast zgadywać. Gdy zmieniasz zasadę zapisaną w kilku plikach, popraw ją we wszystkich.

Numery kroków są tylko w PLAN.md. Tu i w SPEC.md piszemy **wersja lokalna** (1.0: dane w `localStorage`, jedna przeglądarka) i **wersja z bazą** (1.1: logowanie i dane w Supabase).

## Komunikacja

- Rozmawiaj po polsku. Użytkownik uczy się programowania: po zmianie krótko i prostym językiem wyjaśnij, co zostało zrobione i dlaczego.
- Gdy SPEC.md czegoś nie rozstrzyga i wybierasz jedną z interpretacji, powiedz to wprost i zapytaj, zanim utrwalisz ją w kodzie.
- Gdy użytkownik pyta „dlaczego”, wyjaśnij bez żargonu, najlepiej na przykładzie z tego projektu.

## Stos

- HTML, CSS i JavaScript z modułami ES. Bez frameworka, bez npm, bez kroku budowania. Nie dodawaj zależności ani narzędzi bez pytania (React z Vite dopiero po kursie Reacta, nie w MVP).
- Biblioteki leżą w repozytorium (`js/vendor/`), nie na CDN (powody: SPEC.md, sekcja 8). Każdą pobierasz raz z paczki npm, a obok kładziesz jej licencję:
  - Chart.js 4.4.1: `js/vendor/chart.umd.js` (z `dist/chart.umd.js`). Wczytuje go `views/progress.js` przy pierwszym otwarciu „Postępu” (dodany `<script>`, czekanie na `load`); potem w kodzie globalne `Chart`. Ekran „Dziś” nie czeka na wykres.
  - supabase-js 2.x, tylko w wersji z bazą: `js/vendor/supabase.js` (z `dist/umd/supabase.js`), w wersji aktualnej w dniu dodania, wpisanej tutaj i w SPEC.md. Zwykły `<script>` przed `app.js`; tworzy globalną zmienną `supabase`, więc klienta nazywaj inaczej: `const client = window.supabase.createClient(…)` (zapis `const supabase = supabase.createClient(…)` w module daje błąd „Cannot access 'supabase' before initialization”). Plik `+esm` z jsDelivr się nie nadaje: importuje kolejne pliki z jsDelivr.
- Przeglądarka docelowa to Chrome 155 na komputerze w pracy (sprawdzone 13.10.2026). Nie używaj funkcji JavaScript ani CSS, których Chrome 155 nie zna (MDN, sekcja „Browser compatibility”). Telefon i czytnik Boox mogą mieć starsze przeglądarki: zanim aplikacja ma na nich działać, sprawdzamy, czego nie znają.
- Dane: `localStorage` pod kluczem `organizerNauki`; w wersji z bazą przechodzą do Supabase.
- Hosting: GitHub Pages pod adresem `https://kubiakraf.github.io/organizer-nauki/`. Plik `.nojekyll` musi zostać w repozytorium.

## Uruchomienie i testy

- Moduły ES nie działają z `file://`, więc stronę otwieraj przez serwer:
  - przez tunel VS Code: `python -m http.server 8000`, port w zakładce Ports;
  - na tym komputerze: `py -m http.server 8123` (konfiguracja `organizer` w `.claude/launch.json`); `python` jest tu tylko skrótem do Microsoft Store.
- Każdy port (8123, 8124, 8125) to osobny adres, więc osobny `localStorage`: dane zaimportowane na jednym porcie nie są widoczne na pozostałych.
- Testy: `tests.html` na tym samym serwerze pokazuje, które testy przeszły, a które nie i dlaczego. Sprawdzają logikę z `model.js`, `dates.js` i `report.js`, bez bibliotek.
- Testy nie dotykają `localStorage`: `tests.html` jest też na GitHub Pages, obok prawdziwych danych.
- Testy piszemy w `js/tests/*.test.js` funkcjami `describe`, `test`, `equal` i `throwsError` z `js/tests/check.js`, z datą i godziną podanymi wprost. Nowy plik testów dopisz do importów w `js/tests/run.js`.
- Krok jest skończony, gdy:
  1. przechodzą wszystkie testy, nie tylko nowe;
  2. warunek „Gotowe, gdy” i scenariusz „Sprawdzenie” z kroku w PLAN.md są wykonane w przeglądarce, a konsola (F12) jest bez błędów;
  3. przechodzi lista kontrolna z PLAN.md, razem z punktami, które ten krok do niej dopisał.
- Sprawdzaj na serwerze lokalnym. Ma osobny `localStorage`, więc klikanie nie zmienia prawdziwych danych z GitHub Pages. W wersji z bazą baza jest wspólna: na serwerze lokalnym tylko konto testowe (pilnuje tego też kod logowania).
- GitHub Pages po pushu sprawdzaj tylko do odczytu (strona, `tests.html`, konsola), bez klikania kafelków. Przeglądarka trzyma pliki do 10 minut, więc najpierw Ctrl+Shift+R.

## Struktura plików

Docelowa struktura (SPEC.md, sekcja 7). Pliki z dopiskiem „jeszcze nie ma” powstają dopiero w kroku z PLAN.md, który ich potrzebuje; nie twórz ich wcześniej, a tworząc plik, usuń dopisek.

```
index.html                szkielet i trzy zakładki: Dziś, Postęp, Zadania
tests.html                strona testów
css/style.css
js/app.js                 start, wybór modułu zapisu, akcje, zakładki, odświeżanie widoku
js/storage-local.js       zapis w localStorage (wersja lokalna)
js/storage-supabase.js    zapis w Supabase (wersja z bazą; jeszcze nie ma)
js/model.js               dziedziny, operacje na danych, zliczenia, sprawdzanie importu
js/dates.js               daty lokalne, zakresy dni, polskie skróty dni
js/report.js              tekst raportu w Markdown (jeszcze nie ma)
js/vendor/                Chart.js i supabase-js z licencjami (jeszcze nie ma)
js/views/today.js         ekran Dziś, opis bloku, lista dnia
js/views/progress.js      wykres i sumy
js/views/tasks.js         zadania, eksport, import, panel uszkodzonych danych, wylogowanie
js/views/login.js         ekran logowania (wersja z bazą; jeszcze nie ma)
js/tests/                 testy logiki
```

## Architektura

- Cały stan to jeden obiekt w pamięci. Każda zmiana: zapis przez moduł `storage` → po udanym zapisie aktualizacja obiektu → ponowne narysowanie bieżącego widoku. Gdy zapis się nie uda, stan zostaje bez zmian, a aplikacja pokazuje komunikat z „Spróbuj ponownie”.
- Widoki nigdy nie używają `localStorage` ani Supabase bezpośrednio, tylko modułu `storage`. Moduł wybiera `app.js`, więc przejście na bazę to zmiana jednego importu.
- Widoki zmieniają dane przez obiekt `actions` z `app.js` (np. `actions.addBlock(taskId)`), przekazywany jako trzeci argument `render(container, state, actions)`.
- Oba moduły zapisu mają ten sam, asynchroniczny interfejs (zwracają `Promise`, także wersja lokalna):
  `load()`, `addBlock(block)`, `updateBlock(block)` (np. dopisany opis), `deleteBlock(id)`, `saveTask(task)` (dodaje albo aktualizuje), `replaceAll(data)`, `exportAll()`, `loadLastExportDate()`, `saveLastExportDate(date)`.
- Datę ostatniego eksportu obie wersje trzymają w `localStorage` (klucz `organizerNaukiLastExport`): to informacja o tej przeglądarce, nie część kopii.
- Gdy zapisanych danych nie da się odczytać, błąd z `load()` w wersji lokalnej ma pole `rawText` (surowy tekst do „Pobierz uszkodzone dane”). Uszkodzonych danych nigdy nie nadpisujemy danymi startowymi.
- Logika liczenia (sumy, cele, zakresy dni) i sprawdzanie importu w `model.js` i `dates.js`, nie w widokach. Funkcje liczące dostają listę bloków jako argument, a nie czytają globalnego stanu.
- Przerysowanie widoku (po zapisie, o północy, po odświeżeniu danych) nie może skasować wpisywanego tekstu: otwarte pole i wpisany tekst trzymaj w `state`, a nie tylko na stronie.
- Bez `alert()`, `confirm()` i `prompt()`: potwierdzenia („Usunąć? Tak / Nie”) i komunikaty pokazuj na stronie. Okno przeglądarki blokuje stronę, a narzędzia podglądu Claude Code często nie umieją go kliknąć.
- Wszystkie ścieżki względne (`./js/app.js`, nie `/js/app.js`), bo strona działa pod podkatalogiem `/organizer-nauki/`.

## Dane

Pełny model w SPEC.md, sekcja 6.

- Dziedziny są stałe, w kodzie (`DOMAINS` w `model.js`): `prog`, `eng`, `art`. Nie trzymaj ich w danych.
- Każde `id` z `crypto.randomUUID()`, także dla zadań startowych.
- Pole `version` w danych: przy zmianie formatu podnieś wersję i dopisz migrację starych danych podczas `load()`. Przed zmianą formatu przypomnij użytkownikowi o eksporcie kopii. Sam `git revert` nie cofa zmiany formatu (przeglądarka ma już dane w nowym formacie): wycofanie to revert i import kopii sprzed zmiany.
- **Daty liczone lokalnie.** Nigdy `toISOString()` do daty bloku: zwraca czas UTC i blok zapisany tuż po północy trafiłby na poprzedni dzień. Format `RRRR-MM-DD` i `GG:MM`.
- `minutes` w MVP zawsze 25. `note` to pusty tekst, gdy brak opisu (nie `null`).
- Zadań się nie usuwa, tylko archiwizuje (`archived: true`). Ich bloki zostają w historii i na wykresie.
- Sprawdzanie importu (F7) jest tak samo surowe jak baza (SPEC.md, sekcja 6.3): plik, który przejdzie import lokalnie, przejdzie też do bazy. Zmieniając jedno, zmień drugie.
- Supabase:
  - w bazie `snake_case`, w aplikacji `camelCase`; tłumaczy to wyłącznie `storage-supabase.js`. Godzinę z bazy (`07:40:00`) skracaj do `GG:MM`;
  - klucz główny to `(user_id, id)`, a blok wskazuje zadanie przez `(user_id, task_id)`; `upsert` po tych kolumnach;
  - zapytanie zwraca najwyżej 1000 wierszy, więc `load()` pobiera wszystkie bloki stronami (`range`), zawsze z `order` (data, godzina, `id`), a widoki liczą z pełnej listy;
  - `addBlock` musi wytrzymać ponowienie tego samego bloku (`upsert` z `ignoreDuplicates` albo błąd `23505` jako sukces);
  - `delete()` zawsze z jawnym warunkiem (np. `.eq("user_id", userId)`): Supabase odrzuca `DELETE` bez warunku, a RLS go nie zastępuje.

## Zasady projektowe

Z sekcji 3 SPEC.md; obowiązują w każdym widoku:

- Zapis bloku to jedno kliknięcie. Wszystko inne (opis, formularze) jest opcjonalne i nie może go blokować.
- Pokazujemy to, co zrobione. Żadnych komunikatów o porażce, serii do zerwania ani „nieudanych dni”.
- Wykres jest uczciwy: dzień bez bloków to 0. Licznik łączny nigdy nie maleje (poza usunięciem pomyłkowego bloku).
- Przekroczenie celu to informacja, nie błąd: „4 / 2”.
- Czerwony to wyłącznie kolor zadania Frontend, nigdy sygnał błędu. Błędy pokazuj innym kolorem.
- Kliknięcie nie może zginąć po cichu: gdy zapis się nie uda, pokaż komunikat z przyciskiem „Spróbuj ponownie”.
- Cały interfejs po polsku.

## Bezpieczeństwo

- Tekst wpisany przez użytkownika (nazwy zadań, opisy bloków, dane z importu) wstawiaj przez `textContent`, nigdy przez `innerHTML`.
- Repozytorium jest publiczne: nie wpisuj do plików prywatnego e-maila ani innych danych osobowych. Kopie danych i pliki z danymi (`organizer-nauki-*`, `dane-testowe-*`) są w `.gitignore`; nie commituj ich. Pliki pobierane przez aplikację nazywaj tak, żeby pasowały do tych wzorców.
- Wszystkie strony pod `kubiakraf.github.io` mają wspólny `localStorage`: inny projekt pod tym adresem może odczytać albo skasować dane organizera, a w wersji z bazą odczytać token sesji (SPEC.md, sekcja 7).
- Żadnych kluczy do usług AI w kodzie strony (tylko w Edge Function, i to po MVP).
- W wersji z bazą (Supabase):
  - adres projektu i klucz publiczny `sb_publishable_…` mogą być w kodzie strony. Dane chronią uprawnienia (`grant` tylko dla `authenticated`) i RLS z SPEC.md, sekcja 6.3; obie tabele muszą mieć RLS włączony. Starych kluczy `anon` i `service_role` (`eyJ…`) nie używamy;
  - klucz sekretny (`sb_secret_…`, dawniej `service_role`) nigdy nie trafia do kodu, plików ani repozytorium;
  - poza adresem produkcyjnym logowanie tylko na konto testowe (`@example.com`); pilnuje tego kod logowania;
  - hasła (także konta testowego) nie trafiają do plików ani do czatu. Logowanie przy sprawdzaniu wykonuje użytkownik.

## Styl kodu

- Kod ma być czytelny dla osoby, która się uczy: proste konstrukcje, krótkie funkcje, opisowe nazwy, bez sprytnych skrótów.
- Nazwy w kodzie po angielsku (jak w SPEC.md: `addBlock`, `dailyGoal`), teksty interfejsu po polsku. Krótkie komentarze po polsku tam, gdzie powód nie jest oczywisty z kodu.
- Wcięcie 2 spacje, cudzysłowy podwójne, średniki.

## Zakres i sposób pracy

- Jeden krok z PLAN.md na sesję. Nie wykonuj kroków naprzód.
- Sesję kroku zaczynaj od planu i pytań z punktu „Do rozstrzygnięcia” przy kroku w PLAN.md. Kod dopiero po decyzjach użytkownika.
- W kroku zmieniaj tylko to, czego krok wymaga. Poprawki „przy okazji” (porządki w kodzie, zmiany nazw, wygląd) najpierw zaproponuj.
- Nie dodawaj rzeczy spoza MVP (SPEC.md, sekcja 5). Nowy pomysł w trakcie pracy dopisz do ROADMAP.md, nie do kodu.
- Przy decyzji o formacie danych, interfejsie zapisu, bazie, adresie strony albo układzie widoków sprawdź sekcję „Czego nie zablokować” w ROADMAP.md. Jeśli decyzja utrudnia któryś pomysł z ROADMAP.md, powiedz to użytkownikowi przed zmianą.
- Nowa logika w `model.js`, `dates.js` albo `report.js` dostaje testy w tym samym kroku.
- Plan prowadzimy w PLAN.md. Po skończonym kroku dopisz przy nim „**Zrobione:** DD.MM.RRRR”, a do listy kontrolnej punkty z „Do listy kontrolnej”. Gdy decyzja zmienia to, co opisuje SPEC.md (funkcje, dane, architekturę), popraw SPEC.md w tym samym commicie.
- Po działającym kroku zaproponuj commit; commit i push rób po zgodzie użytkownika. GitHub Pages aktualizuje stronę po ok. minucie.
- Opisy commitów po polsku, w trybie rozkazującym, jak w historii („Dodaj …”, „Popraw …”).
- Nie zmieniaj lokalnej konfiguracji gita (e-mail w repozytorium to adres GitHub noreply). Folder `.claude/` jest w `.gitignore`; nie commituj go.

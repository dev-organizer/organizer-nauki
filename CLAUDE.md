# Organizer nauki

Dziennik 25-minutowych bloków nauki dla jednej osoby: jedno kliknięcie w kafelek zapisuje blok, kafelki pokazują „zrobione / cel”, wykres pokazuje postęp z dnia na dzień.

**Źródłem prawdy jest [SPEC.md](SPEC.md).** Przed każdym krokiem przeczytaj odpowiednią funkcję (F1–F8) i krok z sekcji 10. Jeśli kod, CLAUDE.md i SPEC.md się różnią, zapytaj, zamiast zgadywać. Gdy zmieniasz zasadę zapisaną w obu plikach, popraw ją w obu.

## Komunikacja

- Rozmawiaj po polsku. Użytkownik uczy się programowania: po zmianie krótko i prostym językiem wyjaśnij, co zostało zrobione i dlaczego.
- Gdy SPEC.md czegoś nie rozstrzyga i wybierasz jedną z interpretacji, powiedz to wprost i zapytaj, zanim utrwalisz ją w kodzie.
- Gdy użytkownik pyta „dlaczego”, wyjaśnij bez żargonu, najlepiej na przykładzie z tego projektu.

## Stos

- HTML, CSS i JavaScript z modułami ES. Bez frameworka, bez npm, bez kroku budowania. Nie dodawaj zależności ani narzędzi bez pytania (React z Vite dopiero po kursie Reacta, nie w MVP).
- Chart.js 4.4.1 z jsDelivr jako zwykły `<script>` (UMD) przed skryptami modułów; w kodzie dostępny jako globalne `Chart`.
- supabase-js 2.45.4 z jsDelivr (`+esm`) przez `import`, dopiero od kroku 10.
- Dane: `localStorage` pod kluczem `organizerNauki`; w kroku 11 przechodzą do Supabase.
- Hosting: GitHub Pages pod adresem `https://kubiakraf.github.io/organizer-nauki/`. Plik `.nojekyll` musi zostać w repozytorium.

## Uruchomienie i testy

- Moduły ES nie działają z `file://`, więc stronę otwieraj przez serwer:
  - przez tunel VS Code: `python -m http.server 8000`, port w zakładce Ports;
  - na tym komputerze: `py -m http.server 8123` (konfiguracja `organizer` w `.claude/launch.json`); `python` jest tu tylko skrótem do Microsoft Store.
- Testy (od kroku 2b): `tests.html` na tym samym serwerze pokazuje, które testy przeszły, a które nie i dlaczego. Sprawdzają logikę z `model.js`, `dates.js` i `report.js`, bez bibliotek.
- Testy nie dotykają `localStorage`: `tests.html` jest też na GitHub Pages, obok prawdziwych danych.
- Krok jest skończony, gdy:
  1. przechodzą wszystkie testy, nie tylko nowe;
  2. warunek „Gotowe, gdy” i scenariusz „Sprawdzenie” z kroku w SPEC.md są wykonane w przeglądarce, a konsola (F12) jest bez błędów;
  3. warunki wcześniejszych kroków, których dotyczyła zmiana, nadal są spełnione.
- Sprawdzaj na serwerze lokalnym. Ma osobny `localStorage`, więc klikanie nie zmienia prawdziwych danych z GitHub Pages. Od kroku 11 baza jest wspólna: na serwerze lokalnym tylko konto testowe.
- GitHub Pages po pushu sprawdzaj tylko do odczytu (strona, `tests.html`, konsola), bez klikania kafelków. Przeglądarka trzyma pliki do 10 minut, więc najpierw Ctrl+Shift+R.

## Struktura plików

Docelowa struktura (SPEC.md, sekcja 7). Plik z dopiskiem „od kroku N” powstaje dopiero w tym kroku; nie twórz go wcześniej.

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

**Test pamięci przeglądarki (tymczasowy).** `test-pamieci.html` sprawdza, czy `localStorage` przetrwa do następnego dnia (klucz `organizerNauki-test`, końcowe sprawdzenie we wtorek 13.10.2026). Do kroku 1 była w `index.html`; `localStorage` jest wspólny dla całej domeny `kubiakraf.github.io`, więc dane testu są widoczne pod nowym adresem. Usuń ją dopiero, gdy użytkownik potwierdzi wynik testu. To co innego niż `tests.html` (testy logiki).

## Architektura

- Cały stan to jeden obiekt w pamięci. Każda zmiana: zapis przez moduł `storage` → po udanym zapisie aktualizacja obiektu → ponowne narysowanie bieżącego widoku. Gdy zapis się nie uda, stan zostaje bez zmian, a aplikacja pokazuje komunikat z „Spróbuj ponownie”.
- Widoki nigdy nie używają `localStorage` ani Supabase bezpośrednio, tylko modułu `storage`. Moduł wybiera `app.js`, więc przejście na bazę to zmiana jednego importu.
- Widoki zmieniają dane przez obiekt `actions` z `app.js` (np. `actions.addBlock(taskId)`), przekazywany jako trzeci argument `render(container, state, actions)`.
- Oba moduły zapisu mają ten sam, asynchroniczny interfejs (zwracają `Promise`, także wersja lokalna):
  `load()`, `addBlock(block)`, `updateBlock(block)` (np. dopisany opis), `deleteBlock(id)`, `saveTask(task)` (dodaje albo aktualizuje), `replaceAll(data)`, `exportAll()`.
- Logika liczenia (sumy, cele, zakresy dni) w `model.js` i `dates.js`, nie w widokach.
- Wszystkie ścieżki względne (`./js/app.js`, nie `/js/app.js`), bo strona działa pod podkatalogiem `/organizer-nauki/`.

## Dane

Pełny model w SPEC.md, sekcja 6.

- Dziedziny są stałe, w kodzie (`DOMAINS` w `model.js`): `prog`, `eng`, `art`. Nie trzymaj ich w danych.
- Każde `id` z `crypto.randomUUID()`, także dla zadań startowych.
- Pole `version` w danych: przy zmianie formatu podnieś wersję i dopisz migrację starych danych podczas `load()`. Przed zmianą formatu przypomnij użytkownikowi o eksporcie kopii.
- **Daty liczone lokalnie.** Nigdy `toISOString()` do daty bloku: zwraca czas UTC i blok zapisany tuż po północy trafiłby na poprzedni dzień. Format `RRRR-MM-DD` i `GG:MM`.
- `minutes` w MVP zawsze 25. `note` to pusty tekst, gdy brak opisu (nie `null`).
- Zadań się nie usuwa, tylko archiwizuje (`archived: true`). Ich bloki zostają w historii i na wykresie.
- Supabase: w bazie `snake_case`, w aplikacji `camelCase`; tłumaczy to wyłącznie `storage-supabase.js`. Zapytanie zwraca najwyżej 1000 wierszy, więc `load()` pobiera wszystkie bloki stronami (`range`), a widoki liczą z pełnej listy. Godzinę z bazy (`07:40:00`) skracaj do `GG:MM`.

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
- Repozytorium jest publiczne: nie wpisuj do plików prywatnego e-maila ani innych danych osobowych.
- Żadnych kluczy do usług AI w kodzie strony (tylko w Edge Function, i to po MVP).
- Od kroku 9 (Supabase):
  - adres projektu i klucz publiczny (`anon` / `publishable`) mogą być w kodzie strony. Dane chroni RLS z SPEC.md, sekcja 6.3; obie tabele muszą mieć RLS włączony;
  - klucz `service_role` (secret) nigdy nie trafia do kodu, plików ani repozytorium;
  - hasła (także konta testowego) nie trafiają do plików ani do czatu. Logowanie przy sprawdzaniu wykonuje użytkownik.

## Styl kodu

- Kod ma być czytelny dla osoby, która się uczy: proste konstrukcje, krótkie funkcje, opisowe nazwy, bez sprytnych skrótów.
- Nazwy w kodzie po angielsku (jak w SPEC.md: `addBlock`, `dailyGoal`), teksty interfejsu po polsku. Krótkie komentarze po polsku tam, gdzie powód nie jest oczywisty z kodu.
- Wcięcie 2 spacje, cudzysłowy podwójne, średniki.

## Zakres i sposób pracy

- Jeden krok z sekcji 10 na sesję. Nie wykonuj kroków naprzód.
- Sesję kroku zaczynaj od planu i pytań z punktu „Do rozstrzygnięcia” przy kroku w SPEC.md. Kod dopiero po decyzjach użytkownika.
- W kroku zmieniaj tylko to, czego krok wymaga. Poprawki „przy okazji” (porządki w kodzie, zmiany nazw, wygląd) najpierw zaproponuj.
- Nie dodawaj rzeczy z sekcji 5 („Poza zakresem MVP”). Nowy pomysł w trakcie pracy dopisz do sekcji 11 SPEC.md (backlog), nie do kodu.
- Nowa logika w `model.js`, `dates.js` albo `report.js` dostaje testy w tym samym kroku.
- Plan prowadzimy w SPEC.md, sekcja 10. Po skończonym kroku dopisz przy nim „**Zrobione:** DD.MM.RRRR”. Gdy decyzja zmienia to, co opisuje SPEC.md, popraw SPEC.md w tym samym commicie.
- Po działającym kroku zaproponuj commit; commit i push rób po zgodzie użytkownika. GitHub Pages aktualizuje stronę po ok. minucie.
- Opisy commitów po polsku, w trybie rozkazującym, jak w historii („Dodaj …”, „Popraw …”).
- Nie zmieniaj lokalnej konfiguracji gita (e-mail w repozytorium to adres GitHub noreply). Folder `.claude/` jest w `.gitignore`; nie commituj go.

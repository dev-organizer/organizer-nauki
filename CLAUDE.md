# Organizer nauki

Dziennik 25-minutowych bloków nauki dla jednej osoby: jedno kliknięcie w kafelek zapisuje blok, kafelki pokazują „zrobione / cel”, wykres pokazuje postęp z dnia na dzień.

**Źródłem prawdy jest [SPEC.md](SPEC.md).** Przed każdym krokiem przeczytaj odpowiednią funkcję (F1–F8) i krok z sekcji 10. Jeśli kod i SPEC.md się różnią, zapytaj, zamiast zgadywać.

## Komunikacja

- Rozmawiaj po polsku. Użytkownik uczy się programowania: po zmianie krótko i prostym językiem wyjaśnij, co zostało zrobione i dlaczego.
- Każdy krok kończy się warunkiem „Gotowe, gdy” ze SPEC.md. Sprawdź go w przeglądarce, zanim napiszesz, że krok jest skończony.

## Stos

- HTML, CSS i JavaScript z modułami ES. Bez frameworka, bez npm, bez kroku budowania. Nie dodawaj zależności ani narzędzi bez pytania (React z Vite dopiero po kursie Reacta, nie w MVP).
- Chart.js 4.4.1 z jsDelivr jako zwykły `<script>` (UMD) przed skryptami modułów; w kodzie dostępny jako globalne `Chart`.
- supabase-js 2.45.4 z jsDelivr (`+esm`) przez `import`, dopiero od kroku 8.
- Dane: `localStorage` pod kluczem `organizerNauki` (kroki 1–7), potem Supabase (kroki 8–11).
- Hosting: GitHub Pages pod adresem `https://kubiakraf.github.io/organizer-nauki/`. Plik `.nojekyll` musi zostać w repozytorium.
- Uruchomienie lokalne (moduły ES nie działają z `file://`):
  - przez tunel VS Code: `python -m http.server 8000`, port w zakładce Ports;
  - na tym komputerze: `py -m http.server 8123` (konfiguracja `organizer` w `.claude/launch.json`); `python` jest tu tylko skrótem do Microsoft Store.

## Struktura plików

Docelowa struktura (SPEC.md, sekcja 7). Po kroku 1 brakuje jeszcze `report.js` (krok 6), `storage-supabase.js` (krok 10) i `views/login.js` (krok 9); widoki to na razie zaślepki z jednym zdaniem.

```
index.html                szkielet i trzy zakładki: Dziś, Postęp, Zadania
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

**Strona testowa.** `test-pamieci.html` sprawdza, czy `localStorage` przetrwa do następnego dnia (klucz `organizerNauki-test`, ostatnie sprawdzenie we wtorek 13.10.2026). Do kroku 1 była w `index.html`; `localStorage` jest wspólny dla całej domeny `kubiakraf.github.io`, więc dane testu są widoczne pod nowym adresem. Usuń ją dopiero, gdy użytkownik potwierdzi wynik testu.

## Architektura

- Cały stan to jeden obiekt w pamięci. Każda zmiana: aktualizacja obiektu → zapis przez moduł `storage` → ponowne narysowanie bieżącego widoku.
- Widoki nigdy nie używają `localStorage` ani Supabase bezpośrednio, tylko modułu `storage`. Moduł wybiera `app.js`, więc przejście na bazę to zmiana jednego importu.
- Oba moduły zapisu mają ten sam, asynchroniczny interfejs (zwracają `Promise`, także wersja lokalna):
  `load()`, `addBlock(block)`, `deleteBlock(id)`, `saveTask(task)` (dodaje albo aktualizuje), `replaceAll(data)`, `exportAll()`.
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
- Supabase: w bazie `snake_case`, w aplikacji `camelCase`; tłumaczy to wyłącznie `storage-supabase.js`. Zapytanie zwraca najwyżej 1000 wierszy, więc bloki pobieraj stronami (`range`) albo z potrzebnego zakresu dat, a licznik łączny licz zapytaniem z `count`.

## Zasady projektowe

Z sekcji 3 SPEC.md; obowiązują w każdym widoku:

- Zapis bloku to jedno kliknięcie. Wszystko inne (opis, formularze) jest opcjonalne i nie może go blokować.
- Pokazujemy to, co zrobione. Żadnych komunikatów o porażce, serii do zerwania ani „nieudanych dni”.
- Wykres jest uczciwy: dzień bez bloków to 0. Licznik łączny nigdy nie maleje (poza usunięciem pomyłkowego bloku).
- Przekroczenie celu to informacja, nie błąd: „4 / 2”.
- Czerwony to wyłącznie kolor zadania Frontend, nigdy sygnał błędu. Błędy pokazuj innym kolorem.
- Kliknięcie nie może zginąć po cichu: gdy zapis się nie uda, pokaż komunikat z przyciskiem „Spróbuj ponownie”.
- Cały interfejs po polsku.

## Bezpieczeństwo (od kroku 8)

- Adres projektu i klucz publiczny Supabase (`anon` / `publishable`) mogą być w kodzie strony. Dane chroni RLS z SPEC.md, sekcja 6.3; obie tabele muszą mieć RLS włączony.
- Klucz `service_role` (secret) nigdy nie trafia do kodu, plików ani repozytorium.
- Żadnych kluczy do usług AI w kodzie strony (tylko w Edge Function, i to po MVP).
- Repozytorium jest publiczne: nie wpisuj do plików prywatnego e-maila ani innych danych osobowych.

## Styl kodu

- Kod ma być czytelny dla osoby, która się uczy: proste konstrukcje, krótkie funkcje, opisowe nazwy, bez sprytnych skrótów.
- Nazwy w kodzie po angielsku (jak w SPEC.md: `addBlock`, `dailyGoal`), teksty interfejsu po polsku. Krótkie komentarze po polsku tam, gdzie powód nie jest oczywisty z kodu.
- Wcięcie 2 spacje, cudzysłowy podwójne, średniki.

## Zakres i sposób pracy

- Jeden krok z sekcji 10 na sesję. Nie wykonuj kroków naprzód.
- Nie dodawaj rzeczy z sekcji 5 („Poza zakresem MVP”). Nowy pomysł w trakcie pracy dopisz do sekcji 11 SPEC.md (backlog), nie do kodu.
- Po działającym kroku zaproponuj commit; commit i push rób po zgodzie użytkownika. GitHub Pages aktualizuje stronę po ok. minucie.
- Opisy commitów po polsku, w trybie rozkazującym, jak w historii („Dodaj …”, „Popraw …”).
- Nie zmieniaj lokalnej konfiguracji gita (e-mail w repozytorium to adres GitHub noreply). Nie commituj folderu `.claude/`.

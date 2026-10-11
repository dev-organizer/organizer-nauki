# Organizer nauki: plan

Wersja 1 · 11 października 2026

Jak i w jakiej kolejności budujemy aplikację opisaną w [SPEC.md](SPEC.md), co jest już zrobione i co czeka po MVP. SPEC.md mówi, czym jest aplikacja; ten plik mówi, jak do niej dochodzimy.

Plan prowadzi do wersji 1.0 (kroki 0–8: aplikacja w przeglądarce na jednym komputerze), a potem do wersji 1.1 (kroki 9–12: dane w bazie i logowanie). Każdy krok to 1–3 bloki Claude Code i kończy się czymś, co działa i co da się sprawdzić.

Szacunek: razem ok. 25–30 bloków. Po kroku 2 zostało ok. 19–24 bloków, czyli 8–10 godzin; przy 2–3 blokach Claude Code dziennie to ok. 1–2 tygodnie. To szacunek, nie termin: dłuższy krok to informacja, nie porażka. Bloki Claude Code zapisuj w aplikacji, a wykres pokaże, ile plan trwał naprawdę.

Kolejność: najpierw to, co potrzebne co dzień (zapis, poprawianie pomyłek, kopia), potem to, co rozwiązuje problem nr 1 (wykres, raport), a na końcu dopasowanie zadań, gdy pierwszy tydzień danych pokaże, co zmienić.

Baza wchodzi po wersji lokalnej, a nie od pierwszego dnia, bo:

- działająca aplikacja jest gotowa po tygodniu i od razu zbiera prawdziwe dane;
- błędy wyglądu i błędy bazy nie mieszają się ze sobą;
- dane z pierwszych dni przechodzą do bazy przez eksport i import.

## Zasady pracy

- Jeden krok na sesję Claude Code. Początek sesji: „Przeczytaj krok N z PLAN.md. Wypisz plan i pytania z punktu »Do rozstrzygnięcia«; kodu jeszcze nie pisz.” Kod powstaje dopiero po decyzjach, a decyzje o tym, jak działa aplikacja, trafiają do SPEC.md.
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
- Nowy pomysł w trakcie pracy trafia do backlogu na końcu tego pliku, a nie do kodu.
- Następny krok to pierwszy bez dopisku „**Zrobione:**”.

Każdy krok ma te same punkty: **Opis** (co powstaje), **Rezultat** (co możesz potem zrobić), **Gotowe, gdy** (warunek ukończenia), **Sprawdzenie** (co kliknąć i co zobaczyć, które testy), **Zależności**, **Ryzyka** (i co z nimi robimy) oraz **Do rozstrzygnięcia** (pytania do decyzji na początku sesji). Zrobione kroki zostają w krótszej formie. F1–F8 to funkcje opisane w SPEC.md, sekcja 4.

## Etap 1. Fundament (kroki 0–2b)

### Krok 0. Przygotowanie i test ryzyka (1–2 bloki)

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

### Krok 1. Szkielet i dane (1–2 bloki)

- Prompt: „Według sekcji 6–8 SPEC.md utwórz strukturę plików, storage-local.js z asynchronicznym interfejsem z sekcji 7, danymi startowymi i obsługą wersji danych oraz model.js. Bez wyglądu.”

**Gotowe, gdy:** w narzędziach deweloperskich (F12 → Application → Local Storage) widać klucz `organizerNauki` z 5 zadaniami.

**Zrobione:** 11.10.2026.

### Krok 2. Ekran „Dziś” (2 bloki)

Funkcja F1. **Gotowe, gdy:** spełniony warunek z F1.

**Zrobione:** 11.10.2026. Licznik łączny był wtedy ukryty do pierwszego zapisu; widoczny zawsze i z podpowiedzią przy 0 jest od kroku 2b.

### Krok 2b. Testy i licznik łączny (1–2 bloki)

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

## Etap 2. Codzienne używanie (kroki 3a–4)

### Krok 3a. Opis bloku, lista dnia, usuwanie (2 bloki)

- **Opis.** F2 i część F3: pole „Co konkretnie?” po kliknięciu kafelka, lista dzisiejszych bloków, usuwanie po potwierdzeniu. Nowa operacja zapisu `updateBlock(block)` w `storage-local.js` (SPEC.md, sekcja 7), bo opis dochodzi do bloku, który jest już zapisany.
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

### Krok 3b. Dopisywanie bloku po fakcie (1 blok)

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

### Krok 4. Kopia zapasowa (2 bloki)

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

## Etap 3. Widoczny postęp (kroki 5–6)

### Krok 5. Wykres (2–3 bloki)

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

### Krok 6. Raport (2 bloki)

- **Opis.** F6. `report.js` buduje tekst raportu z tej samej funkcji zliczającej co wykres. „Kopiuj raport” z wyborem: dziś albo 7 dni.
- **Rezultat.** Jednym kliknięciem przenosisz dzień albo tydzień nauki do projektu w Claude.
- **Gotowe, gdy:** spełniony jest warunek z F6.
- **Sprawdzenie:**
  1. Testy `report.js` dla stałych danych: tekst dokładnie według wzoru z sekcji 9 SPEC.md; dzień bez bloków ma w tabeli zera; nazwa zadania ze znakiem `|` nie psuje tabeli.
  2. „Kopiuj raport” (7 dni) na danych testowych → raport wklejony do Claude wyświetla się jako czytelna tabela.
  3. Symulowany błąd schowka (tymczasowa zmiana w kodzie, potem cofnięta) → tekst raportu jest widoczny do ręcznego skopiowania.
- **Zależności:** krok 5 (funkcja zliczająca), krok 4 (dane testowe).
- **Ryzyka:**
  - schowek działa tylko na `https://` albo `localhost` i może odmówić → zawsze jest plan B z tekstem do ręcznego skopiowania;
  - znak `|` w nazwie zadania rozbiłby tabelę Markdown → w tabeli zamieniamy go na `\|`.
- **Do rozstrzygnięcia:** czy „7 dni” obejmuje dziś; które zadania są kolumnami tabeli (np. zarchiwizowane tylko z blokami w zakresie); kolejność opisów bloków.

## Etap 4. Wersja 1.0 (kroki 7–8)

### Krok 7. Zadania (2 bloki)

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
- **Do rozstrzygnięcia:** zasady formularza (pusta nazwa, cel ujemny albo ułamkowy, powtórzona nazwa); kolor dowolny czy z palety i czy czerwony zostaje tylko dla Frontendu (SPEC.md, sekcja 3).

### Krok 8. Szlif i wersja 1.0 (najwyżej 2 bloki)

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
  - szlif nie ma naturalnego końca → limit 2 bloków, reszta do backlogu;
  - zrzut ekranu w publicznym README mógłby pokazać prywatne opisy bloków → zrzut na danych testowych.
- **Do rozstrzygnięcia:** README po polsku czy po angielsku.

## Etap 5. Wersja 1.1: baza i logowanie (kroki 9–12)

### Krok 9. Projekt w Supabase (1–2 bloki)

Ten krok to klikanie w panelu Supabase, nie kod. Konto zakładasz sam.

- **Opis.**
  - Na komputerze w pracy: czy otwiera się `https://supabase.com`.
  - Projekt `organizer-nauki` w regionie Frankfurt. Z komputera w pracy adres `https://<adres-projektu>.supabase.co/rest/v1/` daje odpowiedź JSON (np. o braku klucza), a nie stronę blokady.
  - W SQL Editor SQL z sekcji 6.3 SPEC.md.
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

### Krok 10. Logowanie (1–2 bloki)

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
  - wszystkie strony pod `kubiakraf.github.io` mają wspólny `localStorage`, a w nim token sesji → nie publikuj tam stron z cudzymi skryptami; przed danymi o zdrowiu osobny adres (backlog, punkt 6);
  - supabase-js z CDN zablokowany w pracy → jak Chart.js w kroku 5 (`js/vendor/`);
  - menedżer haseł nie podpowiada danych → pola formularza z `autocomplete="email"` i `autocomplete="current-password"`.
- **Do rozstrzygnięcia:** co widać przy starcie, zanim aplikacja sprawdzi sesję (żeby nie mignął ekran logowania).

### Krok 11. Zapis w bazie i przeniesienie danych (2–3 bloki)

- **Opis.**
  - `storage-supabase.js` z tym samym interfejsem co `storage-local.js` (SPEC.md, sekcja 7) i przełączenie na niego aplikacji.
  - Tłumaczenie `snake_case` ↔ `camelCase` i godziny `07:40:00` → `07:40`; bloki pobierane stronami; `replaceAll` według sekcji 6.3 SPEC.md.
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
  - import przerwany w połowie → „Spróbuj ponownie” wgrywa ten sam plik jeszcze raz (SPEC.md, sekcja 6.3);
  - baza odpowiada wolniej niż `localStorage` → widoczny stan zapisu, żeby nie kliknąć drugi raz;
  - sesja wygasła → ekran logowania zamiast „Spróbuj ponownie” bez końca;
  - baza to nie kopia zapasowa (na darmowym planie nie licz na kopie z panelu Supabase) → eksport raz w tygodniu zostaje.
- **Do rozstrzygnięcia:** gdzie trzymać tłumaczenie wierszy, żeby testy działały bez łączenia z bazą; czy kafelek przyjmuje drugie kliknięcie, zanim skończy się zapis.

### Krok 12. Test bezpieczeństwa i wersja 1.1 (1 blok)

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

## Po MVP (backlog)

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

# Organizer nauki: plan

Wersja 2 · 12 października 2026

Jak i w jakiej kolejności budujemy aplikację opisaną w [SPEC.md](SPEC.md), co jest już zrobione i jak sprawdzamy każdy krok. SPEC.md mówi, czym jest aplikacja; ten plik mówi, jak do niej dochodzimy; [ROADMAP.md](ROADMAP.md) zbiera pomysły na czas po MVP.

Plan prowadzi do wersji lokalnej 1.0 (kroki 0a–8: aplikacja w przeglądarce na jednym komputerze), a potem do wersji z bazą 1.1 (kroki 9–12: dane w bazie i logowanie). Numery kroków są tylko w tym pliku. SPEC.md i CLAUDE.md mówią „wersja lokalna” i „wersja z bazą”, więc zmiana kolejności kroków to poprawka w jednym miejscu. Każdy krok to 1–3 bloki Claude Code i kończy się czymś, co działa i co da się sprawdzić.

Szacunek: po kroku 2 zostało ok. 19–27 bloków, czyli 8–11 godzin; przy 2–3 blokach Claude Code dziennie to ok. 1–2 tygodnie. To szacunek, nie termin: dłuższy krok to informacja, nie porażka. Bloki Claude Code zapisuj w aplikacji, a wykres pokaże, ile plan trwał naprawdę.

Kolejność: najpierw kopia prawdziwych danych, potem to, co potrzebne co dzień (opis bloku, poprawianie pomyłek), potem to, co rozwiązuje problem nr 1 (wykres, raport), a na końcu dopasowanie zadań, gdy pierwszy tydzień danych pokaże, co zmienić.

Baza wchodzi po wersji lokalnej, a nie od pierwszego dnia, bo:

- działająca aplikacja jest gotowa po tygodniu i od razu zbiera prawdziwe dane;
- błędy wyglądu i błędy bazy nie mieszają się ze sobą;
- dane z pierwszych dni przechodzą do bazy przez eksport i import.

## Zasady pracy

- Jeden krok na sesję Claude Code. Początek sesji: „Przeczytaj krok N z PLAN.md. Wypisz plan i pytania z punktu »Do rozstrzygnięcia«; kodu jeszcze nie pisz.” Kod powstaje dopiero po decyzjach, a decyzje o tym, jak działa aplikacja, trafiają do SPEC.md. Decyzje o danych i architekturze sprawdzamy z sekcją „Czego nie zablokować” w ROADMAP.md.
- Krok jest skończony, gdy:
  1. spełnione jest jego „Gotowe, gdy”, a scenariusz ze „Sprawdzenia” przeszedł na serwerze lokalnym;
  2. przechodzą wszystkie testy w `tests.html`, nie tylko nowe;
  3. konsola przeglądarki (F12) jest bez błędów;
  4. przechodzi lista kontrolna (niżej), razem z punktami dopisanymi w tym kroku;
  5. przy kroku jest „**Zrobione:**” z datą, a decyzje z kroku są w SPEC.md.
- Po każdym skończonym kroku: commit i push, po Twojej zgodzie. Wyjątek: krok 11a powstaje na osobnej gałęzi (opis przy kroku). GitHub Pages aktualizuje stronę po ok. minucie.
- Po wdrożeniu odczekaj ok. 2 minuty i odśwież stronę na GitHub Pages przez Ctrl+Shift+R. Przeglądarka trzyma pliki strony do 10 minut, a mieszanka starych i nowych plików daje błędy. Produkcję sprawdzamy bez klikania kafelków: strona się otwiera, `tests.html` przechodzi, konsola jest bez błędów.
- Gdy wdrożenie coś zepsuje: `git revert` ostatniego commita i push. Naprawa na spokojnie, w kolejnej sesji. Jeśli zepsuty commit zmieniał format danych (`version`), sam revert nie wystarczy: przeglądarka, która raz otworzyła nową wersję, ma już dane w nowym formacie, a stary kod je odrzuci. Wtedy revert i import kopii sprzed zmiany.
- Przed zmianą formatu danych: eksport kopii (od kroku 3).
- Nowy pomysł w trakcie pracy trafia do ROADMAP.md, a nie do kodu.
- Następny krok to pierwszy bez dopisku „**Zrobione:**”, z pominięciem kroków oznaczonych „poza kolejnością”; te robi się w podanym dniu.

Każdy krok ma te same punkty: **Opis** (co powstaje), **Rezultat** (co możesz potem zrobić), **Gotowe, gdy** (warunek ukończenia), **Sprawdzenie** (co kliknąć i co zobaczyć, które testy), **Zależności**, **Ryzyka** (i co z nimi robimy), **Do rozstrzygnięcia** (pytania do decyzji na początku sesji) oraz **Do listy kontrolnej** (co krok dopisuje do listy). Zrobione kroki zostają w krótszej formie. F1–F8 to funkcje opisane w SPEC.md, sekcja 4.

## Lista kontrolna (2–5 minut)

Jedna lista zamiast warunków rozrzuconych po krokach. Przechodzisz ją na serwerze lokalnym na końcu każdego kroku; w wersji z bazą na koncie testowym. Krok, który dodaje funkcję, dopisuje tu jeden punkt; do wersji 1.1 lista urośnie do ok. 14 punktów i ok. 5 minut. Punkty oznaczone krokiem obowiązują od jego ukończenia.

1. `tests.html`: wszystkie testy przechodzą (od kroku 2b).
2. Strona się otwiera: kafelki w trzech dziedzinach, suma dnia i licznik łączny widoczne od razu (licznik od kroku 2b).
3. Kliknięcie kafelka: kafelek, suma dnia i licznik łączny rosną o 1.
4. Odświeżenie strony: stan zostaje.
5. Przejście przez wszystkie zakładki: konsola (F12) bez błędów.

## Etap 1. Fundament (kroki 0a–2b)

### Krok 0a. Przygotowanie

Repozytorium i GitHub Pages działają, CLAUDE.md jest w repozytorium, a test pamięci przeglądarki (`test-pamieci.html`) przeszedł na komputerze w pracy zamknięcie przeglądarki i restart komputera.

**Zrobione:** 11.10.2026.

### Krok 0b. Komputer w pracy (poza kolejnością: wtorek 13.10.2026)

Nie blokuje kroków 2b–4b. Sprawdzenie robisz we wtorek w pracy, niezależnie od tego, na którym kroku jest budowa; potem krótka sesja z Claude Code, która zapisuje wyniki.

- **Opis.**
  - `test-pamieci.html` następnego dnia: czy dane przetrwały.
  - Nazwa i wersja przeglądarki (Edge: `edge://settings/help`, Chrome: `chrome://settings/help`). Wersja trafia do CLAUDE.md jako zasada: kod nie używa funkcji JavaScript ani CSS, których ta przeglądarka nie zna (np. `Object.groupBy` w starszej wersji).
  - Czy otwiera się `https://supabase.com`. Wersja z bazą i plan B na tym stoją; pełne sprawdzenie adresu projektu jest w kroku 9.
  - Po potwierdzeniu wyniku: „Wyczyść test” na stronie testu w pracy, a w repozytorium usunięcie `test-pamieci.html` i akapitu o nim z CLAUDE.md.
  - Sprawdzenie jsDelivr odpada: biblioteki leżą w repozytorium (SPEC.md, sekcja 8).
- **Rezultat.** Wiadomo, że dane w przeglądarce przetrwają noc i pod jaką przeglądarkę piszemy kod.
- **Gotowe, gdy:** przy tym kroku zapisane są wynik testu pamięci, nazwa i wersja przeglądarki oraz to, czy otwiera się supabase.com; wersja przeglądarki jest w CLAUDE.md; `test-pamieci.html` jest usunięty.
- **Zależności:** brak.
- **Ryzyka i plan B:**
  - dane nie przetrwały nocy, a supabase.com się otwiera → po kroku 3 (kopia) idą kroki 9–12, a dopiero potem 4a i dalej. Do końca kroku 11b eksport na koniec każdego dnia i import, gdy dane znikną. Lista kontrolna sprawdza wtedy tylko to, co już zbudowane. Nie ma też jeszcze wykresu ani danych testowych z kroku 5: w krokach 11b i 12 porównujemy licznik łączny, a konto testowe dostaje kilka bloków klikniętych ręcznie;
  - dane nie przetrwały nocy i supabase.com jest zablokowany → stop i decyzja, co dalej, zanim powstanie kolejny kod;
  - przeglądarka jest stara → mniej nowych funkcji JavaScript w kodzie; pilnuje tego zasada w CLAUDE.md.

### Krok 1. Szkielet i dane (1–2 bloki)

- Prompt: „Według sekcji 6–8 SPEC.md utwórz strukturę plików, storage-local.js z asynchronicznym interfejsem z sekcji 7, danymi startowymi i obsługą wersji danych oraz model.js. Bez wyglądu.”

**Gotowe, gdy:** w narzędziach deweloperskich (F12 → Application → Local Storage) widać klucz `organizerNauki` z 5 zadaniami.

**Zrobione:** 11.10.2026.

### Krok 2. Ekran „Dziś” (2 bloki)

Funkcja F1. **Gotowe, gdy:** spełniony warunek z F1.

**Zrobione:** 11.10.2026. Licznik łączny był wtedy ukryty do pierwszego zapisu; widoczny zawsze i z podpowiedzią przy 0 jest od kroku 2b.

### Krok 2b. Testy, licznik łączny i napis startowy (1–2 bloki)

Dopisany 11.10.2026, po kroku 2. Testy pozwalają od razu zauważyć, że nowa funkcja zepsuła starą.

- **Opis.**
  - Strona `tests.html` z krótką funkcją sprawdzającą (bez bibliotek) i testy funkcji z `model.js` i `dates.js`. Strona pokazuje też strefę czasową przeglądarki, bo testy zmiany czasu coś sprawdzają tylko w strefie ze zmianą czasu (np. `Europe/Warsaw`).
  - Teksty kafelka i sumy dnia („2 / 2 ✓”, „Dziś: 5 z 9 bloków”) przechodzą z `views/today.js` do `model.js`, żeby testy je obejmowały.
  - Licznik łączny według F1: widoczny zawsze, od razu po otwarciu strony, a przy 0 blokach z podpowiedzią. Dziś jest ukryty po każdym otwarciu strony aż do pierwszego kliknięcia (`state.lastBlock` startuje jako `null`), a nie tylko przy pustej historii.
  - Napis startowy w `index.html`: „Wczytywanie… Jeśli ten napis nie znika, odśwież stronę przez Ctrl+Shift+R.” `app.js` chowa go dopiero na końcu startu (po narysowaniu widoku albo po pokazaniu komunikatu o błędzie wczytania), więc zostaje widoczny przy każdym nieprzewidzianym błędzie startu. Pojawia się z opóźnieniem ok. 2 s (CSS `animation-delay`), żeby nie migał przy każdym otwarciu. Dziś, gdy `app.js` się nie wczyta, np. gdy po wdrożeniu przeglądarka zmiesza stare i nowe pliki, widać tylko trzy przyciski zakładek, a w przypiętej karcie nikt nie zagląda do F12.
- **Rezultat.** Każda kolejna zmiana od razu pokazuje, czy nie zepsuła czegoś, co już działało, a nieudany start strony mówi, co zrobić.
- **Gotowe, gdy:** `tests.html` pokazuje, że wszystkie testy przechodzą; celowo zepsuty test pokazuje, który i dlaczego (potem cofamy zmianę); spełniony jest warunek z F1; napis startowy pojawia się tylko wtedy, gdy aplikacja nie wystartowała.
- **Sprawdzenie:**
  1. `tests.html` na serwerze lokalnym: wszystkie testy przechodzą, widać ich liczbę i strefę czasową.
  2. Zmiana oczekiwanego wyniku w jednym teście: test nie przechodzi, a komunikat mówi, czego oczekiwał i co dostał. Potem cofnięcie zmiany.
  3. Testy obejmują co najmniej: odmianę (1 blok, 2 bloki, 5 bloków, 12 bloków, 22 bloki), czas (0 min, 25 min, 2 h 5 min, 130 h), przejście przez koniec miesiąca i roku, zmianę czasu 25.10.2026 i 29.03.2026 (`lastDays` bez powtórzonych i zgubionych dni), godzinę tuż po północy, odrzucenie złych danych i danych z nowszej wersji (`upgradeData`), pominięcie zarchiwizowanych zadań w celu dnia, teksty kafelka (bez celu, przed celem, cel osiągnięty, ponad cel), tekst sumy dnia (cel 0, cel 1: „z 1 bloku”, cel 9).
  4. Na serwerze lokalnym usunięcie klucza `organizerNauki` (F12 → Application → Local Storage) i odświeżenie: „Łącznie: 0 bloków” z podpowiedzią; po kliknięciu kafelka licznik rośnie o 1.
  5. Odświeżenie strony, gdy bloki już są: licznik łączny widoczny od razu, bez klikania.
  6. Tymczasowa literówka w ścieżce do `app.js` w `index.html`: po ok. 2 s widać napis o odświeżeniu. Po cofnięciu literówki napis nie pojawia się wcale.
- **Zależności:** brak.
- **Ryzyka:**
  - testy zależne od bieżącej daty dają różne wyniki w różne dni → w testach datę i godzinę zawsze podajemy wprost;
  - `tests.html` jest też na GitHub Pages, obok prawdziwych danych → testy nie dotykają `localStorage`.
- **Do rozstrzygnięcia:** co liczy suma dnia. Dziś liczy wszystkie bloki, także zadań bez celu i ponad cel. Przykład: Python 2/2, Frontend 2/2, Rysunek 1/1, Angielski 1/4 i trzy bloki Claude Code dają „Dziś: 9 z 9”, choć Angielski jest daleko przed celem, czyli nagłówek ukrywa problem nr 2. Możliwości: zostawić; „Dziś: 9 bloków · cele: 6 z 9” (do celu liczy się najwyżej tyle bloków zadania, ile wynosi jego cel); albo inny pomysł.
- **Do listy kontrolnej:** punkty 1–5 już obejmują ten krok.

## Etap 2. Codzienne używanie (kroki 3–4b)

### Krok 3. Kopia zapasowa (2–3 bloki)

Przed opisem bloku i dopisywaniem, bo od nich nie zależy, a chroni prawdziwe dane od pierwszego dnia (także w planie B z kroku 0b).

- **Opis.** F7: „Eksportuj dane” i „Importuj dane” w zakładce „Zadania” (lista zadań dojdzie w kroku 7).
  - Sprawdzanie pliku w `model.js`, z testami. Jest tak samo surowe jak baza z sekcji 6.3 SPEC.md, więc plik, który przejdzie import lokalnie, przejdzie też import do bazy w kroku 11b. Pełna lista warunków jest w F7.
  - Potwierdzenie importu na stronie (nie przez `confirm()`), z liczbą zadań i bloków oraz datą ostatniego bloku w pliku i w obecnych danych. Gdy w pliku jest mniej bloków, wyraźne ostrzeżenie: najczęstsza pomyłka to stara kopia.
  - Przy uszkodzonych danych komunikat z „Pobierz uszkodzone dane” (surowy tekst do pliku, którego nazwa też zaczyna się od `organizer-nauki-`) i z importem kopii.
  - Przy 0 blokach na ekranie „Dziś”, obok podpowiedzi, link „Masz kopię? Importuj”. Po wyczyszczeniu przeglądarki aplikacja po cichu zaczyna od nowa, z nowymi `id` zadań.
- **Rezultat.** Prawdziwe dane mają kopię poza przeglądarką, a na serwerze lokalnym możesz wczytać dane testowe (potrzebne w krokach 5–6).
- **Gotowe, gdy:** spełniony jest warunek z F7.
- **Sprawdzenie (na serwerze lokalnym):**
  1. Eksport → pobiera się `organizer-nauki-RRRR-MM-DD.json` z dzisiejszą datą.
  2. Usunięcie klucza `organizerNauki` i odświeżenie → link „Masz kopię? Importuj” → import pliku → potwierdzenie z liczbą zadań i bloków → Tak → wracają wszystkie zadania i bloki, licznik łączny jak przed eksportem.
  3. Import → Nie: dane bez zmian.
  4. Import pliku z mniejszą liczbą bloków niż w obecnych danych → wyraźne ostrzeżenie w potwierdzeniu.
  5. Import innego pliku JSON → komunikat, dane bez zmian.
  6. Wpisanie w `organizerNauki` tekstu `zepsute` i odświeżenie → komunikat o uszkodzonych danych → „Pobierz uszkodzone dane” daje plik z tekstem `zepsute` → import przywraca dane.
  7. Testy sprawdzania pliku: dobry plik, brak pól, zły typ pola, nowsza wersja, `id`, które nie jest UUID, powtórzone `id`, nieznana dziedzina, kolor spoza formatu `#rrggbb`, data `2026-02-30`, godzina `24:00`, blok wskazujący nieistniejące zadanie.
  8. Na komputerze w pracy: eksport działa i wiadomo, w którym folderze ląduje plik.
- **Zależności:** krok 2b.
- **Ryzyka:**
  - pomyłkowy import nadpisze prawdziwe dane, najczęściej starszą kopią → potwierdzenie z liczbą bloków i datą ostatniego bloku, ostrzeżenie przy mniejszej liczbie bloków;
  - przy uszkodzonych danych zakładki się nie rysują (`render()` czeka na dane) → pobranie surowych danych i import w komunikacie o błędzie, poza zakładkami;
  - przeglądarka w pracy może blokować pobieranie plików → sprawdzenie 8;
  - kopia w folderze Pobrane chroni przed wyczyszczeniem przeglądarki, ale nie przed awarią komputera → pełne rozwiązanie to baza (kroki 9–12);
  - kopia trafi do publicznego repozytorium, a w niej prywatne opisy bloków → pliki `organizer-nauki-*` są w `.gitignore` (od 12.10.2026), z każdym rozszerzeniem;
  - inne strony pod `kubiakraf.github.io` (np. projekty z kursu) mają ten sam `localStorage`, więc mogą odczytać albo skasować dane organizera (w poradnikach często jest `localStorage.clear()`) → pytanie o osobny adres niżej.
- **Do rozstrzygnięcia:**
  - gdzie dokładnie są pobranie i import przy uszkodzonych danych;
  - czy w zakładce „Zadania” pokazywać „Ostatnia kopia: 9 dni temu” (bez przypomnienia eksport raz w tygodniu rzadko przetrwa miesiąc), a jeśli tak, gdzie zapisać datę ostatniego eksportu; jeśli nie, pomysł trafia do ROADMAP.md;
  - osobny adres strony już teraz czy dopiero przed logowaniem (krok 10)? Darmowa organizacja na GitHubie daje osobny adres `<nazwa>.github.io`. Przeprowadzka to eksport na starym adresie i import na nowym, więc najtaniej zrobić ją zaraz po tym kroku, zanim pod `kubiakraf.github.io` pojawią się inne projekty.
- **Do listy kontrolnej:** „Eksport pobiera plik. Import tego pliku → potwierdzenie z liczbą bloków → Nie: dane bez zmian.”

### Krok 4a. Opis bloku, lista dnia, usuwanie (2 bloki)

- **Opis.** F2 i część F3: pole „Co konkretnie?” po kliknięciu kafelka, lista dzisiejszych bloków, usuwanie po potwierdzeniu na stronie („Usunąć? Tak / Nie”). Nie przez `confirm()`: okno przeglądarki blokuje stronę, a narzędzia, którymi Claude Code sprawdza podgląd, często nie umieją go kliknąć. Nowa operacja zapisu `updateBlock(block)` w `storage-local.js` (SPEC.md, sekcja 7), bo opis dochodzi do bloku, który jest już zapisany.
- **Rezultat.** Zapisujesz, co konkretnie robiłeś, i cofasz pomyłkowe kliknięcie.
- **Gotowe, gdy:** spełnione są warunki z F2 i warunek z F3 o usuwaniu.
- **Sprawdzenie:**
  1. Kliknięcie „Python” → pole z podpowiedzią ostatniego opisu → wpisanie opisu i Enter → blok na liście z godziną, zadaniem i opisem.
  2. Kliknięcie „Python” → Esc → blok na liście bez opisu, kafelek „2 / 2 ✓”.
  3. Usuń blok → Nie: nic się nie zmienia. Usuń → Tak: kafelek „1 / 2”, licznik łączny o 1 mniejszy.
  4. Odświeżenie strony: opisy i usunięcia zostają.
  5. Testy nowych funkcji z `model.js` (np. podpowiedź ostatniego opisu, kolejność listy).
- **Zależności:** krok 2b.
- **Ryzyka:**
  - widok rysuje się od nowa po każdym zapisie i o północy (`setInterval` w `app.js`), więc pole opisu może zniknąć, stracić kursor albo wpisany tekst → to, dla którego bloku pole jest otwarte, i wpisywany tekst trzymamy w stanie aplikacji (`state`), a nie tylko na stronie;
  - zapis opisu się nie uda → komunikat z „Spróbuj ponownie”, blok zostaje bez opisu;
  - pole opisu nie może blokować następnego kliknięcia kafelka (zasada „jedno kliknięcie”).
- **Do rozstrzygnięcia:**
  - kolejność listy (od najstarszego czy od najnowszego);
  - czy podpowiedzią jest ostatni niepusty opis;
  - podpowiedź jako szary tekst w pustym polu czy jako wpisany i zaznaczony tekst (Enter go przyjmuje, pisanie zastępuje); druga wersja lepiej pomaga na problem nr 3;
  - co z wpisanym tekstem przy kliknięciu obok pola: zapisać czy wyrzucić? Wyrzucenie to tekst, który ginie po cichu, a F2 mówi dziś „zamyka pole bez opisu”;
  - co z otwartym polem, gdy klikniesz inny kafelek;
  - gdzie pojawia się pole, żeby nie przesuwało kafelków pod kursorem (dół okna zajmuje komunikat o błędzie);
  - podwójne kliknięcie kafelka: dziś daje dwa bloki. Czy kafelek ma przez chwilę (np. 1 s) ignorować drugie kliknięcie? Ta sama decyzja obowiązuje w wersji z bazą (krok 11a), gdzie zapis trwa dłużej.
- **Do listy kontrolnej:** „Kliknięcie kafelka → opis → Enter: blok z opisem na liście. Usuń → Tak: kafelek i licznik łączny o 1 mniej.”

### Krok 4b. Dopisywanie po fakcie i lista innych dni (1–2 bloki)

- **Opis.** Reszta F3: formularz „Dopisz blok” z zadaniem, datą, godziną i opisem oraz przełączanie dni na liście (◀ ▶), z tym samym usuwaniem. Bez przełączania blok dopisany z pomyłkową datą albo kliknięty przez pomyłkę o 23:55 zostałby na wykresie na zawsze, bo lista pokazuje tylko dziś, a edycji bloku w MVP nie ma.
- **Rezultat.** Zapomniany blok nie przepada, a pomyłkę z innego dnia da się usunąć.
- **Gotowe, gdy:** spełnione są warunki z F3 o dopisywaniu i o innych dniach.
- **Sprawdzenie:**
  1. Dopisanie „Rysunek” na wczoraj, 20:00 → nie ma go na dzisiejszej liście ani na kafelku, a licznik łączny jest o 1 większy.
  2. F12 → Application → Local Storage: blok ma wczorajszą datę i godzinę 20:00.
  3. ◀ → lista z wczoraj z tym blokiem; kafelki i suma dnia nadal pokazują dziś. Usunięcie bloku → licznik łączny o 1 mniejszy. ▶ → lista z dziś.
  4. Dopisanie bloku na dziś, na wcześniejszą godzinę → jest na kafelku i na liście, w miejscu wynikającym z godziny.
  5. Odświeżenie strony: bloki zostają.
  6. Testy: blok z podaną datą i godziną, wartości domyślne formularza, bloki wybranego dnia.
- **Zależności:** krok 4a (lista dnia).
- **Ryzyka:**
  - pole daty w formularzu daje tekst `RRRR-MM-DD` → zapisujemy go wprost, bez `new Date()` i `toISOString()`, które mogą przesunąć dzień;
  - przerysowanie po zapisie wróciłoby do dziś → wybrany dzień trzymamy w `state`; „dziś” zapisujemy jako brak wyboru, żeby o północy lista sama przeszła na nowy dzień.
- **Do rozstrzygnięcia:** domyślna data i godzina w formularzu; czy można dopisać blok z przyszłą datą (i czy ▶ wychodzi poza dziś); czy po dopisaniu bloku na inny dzień lista przełącza się na ten dzień, żeby było widać, że blok się zapisał.
- **Do listy kontrolnej:** „Dopisz blok na wczoraj → ◀: blok na wczorajszej liście → Usuń → Tak.”

**Kamień milowy: używam na co dzień.** Aplikacja na GitHub Pages w przypiętej karcie w pracy, eksport raz w tygodniu. Klikać można już wcześniej: kopię da się robić od kroku 3, a pomyłki usuwać od kroku 4a. W wersji lokalnej dane są tylko w tej jednej przeglądarce: bloki z domu dopisujesz w pracy przez „Dopisz blok”, bo do bazy przenosi się jeden plik, bez łączenia kilku.

## Etap 3. Widoczny postęp (kroki 5–6)

### Krok 5. Wykres (2–3 bloki)

- **Opis.** F5.
  - W `model.js` funkcja licząca bloki w układzie dzień × zadanie dla zakresu dni; tej samej funkcji użyje raport w kroku 6.
  - Oś X to zwykłe etykiety z `dayLabel()` („pn 12.10”), a nie oś czasu Chart.js: ta wymaga dodatkowej biblioteki do dat i znowu trzeba by pilnować stref czasowych.
  - Chart.js 4.4.1 trafia do `js/vendor/` i wczytuje się dopiero przy pierwszym otwarciu „Postępu” (SPEC.md, sekcja 8). Ekran „Dziś” na niego nie czeka.
  - Dane testowe z datami kończącymi się dziś, w pliku `dane-testowe-RRRR-MM-DD.json`, z zadaniami „TEST Python”, „TEST Frontend” itd. Pobierasz je w tej samej przeglądarce co kopię prawdziwych danych, więc nie może się dać ich pomylić.
- **Rezultat.** Widzisz postęp z dnia na dzień: odpowiedź na problem nr 1.
- **Gotowe, gdy:** spełniony jest warunek z F5.
- **Sprawdzenie (na serwerze lokalnym, po imporcie danych testowych).** Każdy port z `.claude/launch.json` (8123, 8124, 8125) ma osobny `localStorage`, więc dane testowe widać tylko na porcie, na którym je zaimportowano.
  1. 7 dni: każde zadanie w swoim kolorze, dzień bez bloków ma wartość 0.
  2. 30 dni: na osi 30 kolejnych dni, bez powtórzonych i zgubionych dni.
  3. Kliknięcie w legendę chowa i pokazuje zadanie; schowane zostaje schowane po zmianie zakresu.
  4. Sumy pod wykresem zgadzają się z danymi.
  5. Blok dopisany na wczoraj (krok 4b) jest we wczorajszym dniu.
  6. F12 → Network: otwarcie „Dziś” nie wczytuje Chart.js; wczytuje go dopiero „Postęp”.
  7. Kilkanaście przełączeń zakładek i zakresów: konsola bez błędów.
  8. Testy: zliczenie dzień × zadanie, dni bez bloków jako 0, suma w zakresie, zadanie zarchiwizowane.
- **Zależności:** krok 3 (import danych testowych).
- **Ryzyka:**
  - każde przerysowanie tworzy nowy wykres → poprzedni niszczymy (`chart.destroy()`), inaczej zostaje w pamięci i daje błędy;
  - wykres powstaje od nowa, więc zadania schowane w legendzie wracałyby po zmianie zakresu → schowane zadania pamiętamy w `state`;
  - plik z danymi o stałych datach szybko się zestarzeje, bo wykres pokazuje dni do dziś → dane testowe powstają z datami kończącymi się dziś;
  - Chart.js się nie wczyta → zakładka pokazuje komunikat zamiast wykresu, reszta aplikacji działa;
  - linie o wartościach 0–4 nakładają się → legenda do chowania (F5) i pytanie o słupki niżej.
- **Do rozstrzygnięcia:**
  - linie czy słupki ułożone jeden na drugim? Słupki pokazują naraz sumę dnia (problem nr 1) i to, czy jedno zadanie zjada dzień (problem nr 2), i się nie nakładają; legenda nadal pozwala chować zadania. Słupki zmieniają F5 („wykres liniowy”);
  - czy „7 dni” obejmuje dziś; ta sama definicja obowiązuje potem w raporcie (krok 6);
  - czy pokazywać zadania bez bloków w zakresie; czy zadanie zarchiwizowane pojawia się tylko wtedy, gdy ma bloki w zakresie;
  - skąd brać dane testowe (propozycja: przycisk w `tests.html`, który pobiera plik do importu).
- **Do listy kontrolnej:** „Postęp: wykres się rysuje, przełączenie 7 / 30 dni działa.”

### Krok 6. Raport (2 bloki)

- **Opis.** F6. `report.js` buduje tekst raportu z tej samej funkcji zliczającej co wykres. „Kopiuj raport” z wyborem: dziś albo 7 dni. „7 dni” znaczy to samo co na wykresie (decyzja z kroku 5).
- **Rezultat.** Jednym kliknięciem przenosisz dzień albo tydzień nauki do projektu w Claude.
- **Gotowe, gdy:** spełniony jest warunek z F6.
- **Sprawdzenie:**
  1. Testy `report.js` dla stałych danych: tekst dokładnie według wzoru z sekcji 9 SPEC.md; dzień bez bloków ma w tabeli zera; nazwa zadania ze znakiem `|` nie psuje tabeli; nagłówek dla jednego dnia i dla zakresu przechodzącego przez Nowy Rok.
  2. „Kopiuj raport” (7 dni) na danych testowych → raport wklejony do Claude wyświetla się jako czytelna tabela.
  3. Symulowany błąd schowka (tymczasowa zmiana w kodzie, potem cofnięta) → tekst raportu jest widoczny do ręcznego skopiowania.
- **Zależności:** krok 5 (funkcja zliczająca), krok 3 (dane testowe).
- **Ryzyka:**
  - schowek działa tylko na `https://` albo `localhost` i może odmówić → zawsze jest plan B z tekstem do ręcznego skopiowania;
  - znak `|` w nazwie zadania rozbiłby tabelę Markdown → w tabeli zamieniamy go na `\|`.
- **Do rozstrzygnięcia:** wygląd nagłówka dla jednego dnia i dla zakresu przez Nowy Rok (wzór w sekcji 9 SPEC.md pokazuje tylko zakres w jednym roku); które zadania są kolumnami tabeli (np. zarchiwizowane tylko z blokami w zakresie); kolejność opisów bloków.
- **Do listy kontrolnej:** „Kopiuj raport (dziś) → tekst w schowku albo widoczny do ręcznego skopiowania.”

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
  7. Testy: dodanie i zmiana zadania, cel dnia po archiwizacji, sprawdzanie formularza (w tym odrzucenie pustej nazwy).
- **Zależności:** kroki 5 i 6 (archiwum widać na wykresie i w raporcie).
- **Ryzyka:**
  - usunięcie zadania osierociłoby jego bloki → tylko archiwizacja, bez przycisku „Usuń” (F4);
  - zmiana dziedziny przenosi kafelek do innej grupy, a bloki zostają przy zadaniu, bo `id` się nie zmienia;
  - kolor spoza formatu `#rrggbb` nie przejdzie importu ani bazy → formularz używa `<input type="color">`, który daje dokładnie ten format.
- **Do rozstrzygnięcia:** reszta zasad formularza (cel ujemny albo ułamkowy, powtórzona nazwa; pusta nazwa jest odrzucana tak jak w imporcie i w bazie); kolor dowolny czy z palety i czy czerwony zostaje tylko dla Frontendu (SPEC.md, sekcja 3).
- **Do listy kontrolnej:** „Zadania: zmiana celu zmienia sumę dnia na »Dziś«; potem powrót do starego celu.”

### Krok 8. Szlif i wersja 1.0 (najwyżej 2 bloki)

- **Opis.** Konkretna lista zamiast ogólnego „wyglądu”:
  - czytelność i kontrast tekstu na kafelkach każdego koloru;
  - obsługa klawiaturą: Tab po kafelkach, widoczny fokus, fokus nie ginie po zapisie bloku;
  - wąskie okno (ok. 360 px) bez przewijania w bok;
  - ikona strony (favicon): przypięta karta pokazuje tylko ikonę, a bez niej organizer to szara kula wśród innych kart;
  - przeglądarka w pracy (wersja z kroku 0b): wszystko działa, konsola bez błędów;
  - README.md: co to jest, link do aplikacji, zrzut ekranu, stos, uruchomienie lokalne i testy;
  - tag `v1.0` w git.
- **Rezultat.** Wersja 1.0 do codziennego używania i do pokazania w portfolio.
- **Gotowe, gdy:** punkty z listy są zrobione, README widać na GitHubie, tag `v1.0` jest wypchnięty (`git push origin v1.0`), a na GitHub Pages strona i `tests.html` działają bez błędów w konsoli.
- **Sprawdzenie:** przejście listy na serwerze lokalnym i na komputerze w pracy; po wdrożeniu sprawdzenie produkcji według zasad pracy.
- **Zależności:** kroki 2–7.
- **Ryzyka:**
  - szlif nie ma naturalnego końca → limit 2 bloków, reszta do ROADMAP.md;
  - zrzut ekranu w publicznym README mógłby pokazać prywatne opisy bloków → zrzut na danych testowych.
- **Do rozstrzygnięcia:** README po polsku czy po angielsku.
- **Do listy kontrolnej:** „Tab przechodzi po kafelkach, a Enter na kafelku zapisuje blok.”

## Etap 5. Wersja z bazą 1.1 (kroki 9–12)

### Krok 9. Projekt w Supabase (1–2 bloki)

Ten krok to klikanie w panelu Supabase, nie kod. Konto zakładasz sam.

- **Opis.**
  - Projekt `organizer-nauki` w regionie Frankfurt. Od 30.05.2026 nowe projekty nie udostępniają tabel przez API bez nadania uprawnień (`grant`) i SQL z SPEC.md jest pod to napisany. Z komputera w pracy adres `https://<adres-projektu>.supabase.co/rest/v1/` daje odpowiedź JSON (np. o braku klucza), a nie stronę blokady.
  - W SQL Editor SQL z sekcji 6.3 SPEC.md (tabele, uprawnienia, RLS).
  - Settings → API Keys: klucz `sb_publishable_…` do kodu strony. Starych kluczy `anon` i `service_role` (długie tokeny `eyJ…`) nie używamy, bo Supabase wycofuje je do końca 2026.
  - Dwa konta (Authentication → Users → Add user, z automatycznym potwierdzeniem): Twoje i testowe z adresem w domenie `@example.com`, np. `test@example.com`. Potem wyłączona rejestracja nowych kont.
  - Site URL: `https://kubiakraf.github.io/organizer-nauki/` (albo nowy adres, jeśli zapadła taka decyzja w kroku 3).
  - Advisors → Security Advisor i Performance Advisor bez błędów i ostrzeżeń (poziomy ERROR i WARN). Informacje (INFO) typu „Unused Index” są w świeżym projekcie normalne, bo indeksy nie były jeszcze używane.
  - Zapisany sposób odzyskania hasła. Hasła są w menedżerze haseł, a gdy hasło do Twojego konta zginie, pomaga link „Send password recovery” z panelu (Authentication → Users). Wbudowana poczta Supabase wysyła tylko na adresy osób z zespołu organizacji (zakładka Team), najwyżej ok. 2 maile na godzinę. Link dojdzie więc tylko wtedy, gdy Twoje konto w aplikacji ma ten sam adres co konto w Supabase albo gdy ten adres dodasz do zespołu; sprawdzamy to w tym kroku. Konto testowe (`@example.com`) maila nie dostanie: gdy jego hasło zginie, usuwasz jego bloki i zadania i zakładasz je od nowa. Co aplikacja robi z linkiem, rozstrzyga krok 10. Usunięcie Twojego konta nigdy nie jest rozwiązaniem: skasowałoby całą historię, dlatego baza na nie nie pozwala, dopóki konto ma dane (`on delete restrict`).
- **Rezultat.** Baza i konta są gotowe i zabezpieczone, zanim powstanie kod.
- **Gotowe, gdy:** w Table Editor są tabele `tasks` i `blocks`, obie z włączonym RLS; Advisory nie zgłaszają błędów ani ostrzeżeń; są dwa konta, a rejestracja jest wyłączona; adres projektu odpowiada z komputera w pracy; jest klucz `sb_publishable_…`; sposób odzyskania hasła jest zapisany przy tym kroku, a adres Twojego konta w aplikacji może dostać mail z panelu.
- **Sprawdzenie:** Table Editor (oznaczenie RLS przy tabelach), oba Advisory, lista użytkowników, ustawienie rejestracji, strona kluczy, adres `/rest/v1/` otwarty w pracy.
- **Zależności:** krok 8 (wersja 1.0); w planie B z kroku 0b: krok 3.
- **Ryzyka:**
  - sieć w pracy blokuje `*.supabase.co` → stop przed pisaniem kodu i decyzja, co dalej;
  - klucz sekretny (`sb_secret_…`, dawniej `service_role`) daje pełny dostęp z pominięciem RLS → nigdy do plików, repozytorium ani czatu; do kodu trafia tylko `sb_publishable_…`;
  - hasła obu kont tylko w menedżerze haseł, nigdy w plikach ani w czacie;
  - SQL bez `grant` dałby w nowym projekcie błąd `42501 permission denied for table tasks` → SQL w sekcji 6.3 ma `grant` dla zalogowanych;
  - pusta tabela przechodzi każdy test RLS → prawdziwy test w kroku 12, na danych.

### Krok 10. Logowanie (1–2 bloki)

- **Opis.** Część F8: ekran logowania (`views/login.js`), zapamiętana sesja, „Wyloguj” w zakładce „Zadania” obok adresu zalogowanego konta. Dane nadal w `localStorage`.
  - supabase-js w aktualnej wersji (sprawdzonej na npm w dniu kroku; 7.10.2026 była to 2.117.3) jako plik `js/vendor/supabase.js`, z kluczem `sb_publishable_…`. Wersję wpisujemy do SPEC.md i CLAUDE.md.
  - Plik tworzy globalną zmienną `supabase`, więc klienta nazywamy inaczej: `const client = window.supabase.createClient(…)`. Zapis `const supabase = supabase.createClient(…)` w module kończy się błędem „Cannot access 'supabase' before initialization”.
  - Poza adresem produkcyjnym (serwer lokalny, tunel VS Code) formularz przyjmuje tylko adres `@example.com`. Zasady „lokalnie tylko konto testowe” pilnuje kod, a nie pamięć. Adres produkcyjny jest w kodzie w jednej stałej.
- **Rezultat.** Aplikacja jest zamknięta dla obcych, zanim trafią do niej dane z bazy.
- **Gotowe, gdy:** po zalogowaniu widać aplikację, po wylogowaniu ekran logowania, a po odświeżeniu strony sesja zostaje; poza adresem produkcyjnym nie da się zalogować na adres spoza `@example.com`.
- **Sprawdzenie** (logujesz się sam, hasła nie podajesz w czacie):
  1. Złe hasło → komunikat po polsku.
  2. Dobre hasło → aplikacja; odświeżenie → nadal zalogowany.
  3. Wyloguj → ekran logowania; odświeżenie → nadal ekran logowania.
  4. Konto testowe też się loguje.
  5. Na serwerze lokalnym adres spoza `@example.com` → komunikat, bez wysyłania hasła do Supabase.
  6. W kodzie są tylko adres projektu i klucz `sb_publishable_…`.
- **Zależności:** krok 9.
- **Ryzyka:**
  - wszystkie strony pod `kubiakraf.github.io` mają wspólny `localStorage`, a w nim token sesji → jeśli w kroku 3 nie zapadła decyzja o osobnym adresie, wracamy do niej teraz; najpóźniej przed danymi o zdrowiu (ROADMAP.md);
  - menedżer haseł nie podpowiada danych → pola formularza z `autocomplete="email"` i `autocomplete="current-password"`.
- **Do rozstrzygnięcia:** co widać przy starcie, zanim aplikacja sprawdzi sesję (żeby nie mignął ekran logowania); co aplikacja robi po wejściu z linku odzyskiwania hasła (formularz nowego hasła czy tylko instrukcja).
- **Do listy kontrolnej:** „Wyloguj → ekran logowania → logowanie na konto testowe → aplikacja.”

### Krok 11a. Zapis w bazie (2–3 bloki)

Pracujemy na gałęzi `baza`. GitHub Pages pokazuje gałąź `main`, więc prawdziwe dane zostają w starej wersji aż do przeniesienia w kroku 11b. Commit i push idą na gałąź `baza`.

- **Opis.**
  - `storage-supabase.js` z tym samym interfejsem co `storage-local.js` (SPEC.md, sekcja 7) i przełączenie na niego aplikacji.
  - Tłumaczenie `snake_case` ↔ `camelCase` i godziny `07:40:00` → `07:40`; bloki pobierane stronami, zawsze posortowane (data, godzina, `id`); `replaceAll` według sekcji 6.3 SPEC.md. Usuwanie w `replaceAll` ma jawny warunek, np. `.delete().eq("user_id", userId)`: Supabase odrzuca przez API `DELETE` bez warunku („DELETE requires a WHERE clause”), a reguły RLS tego warunku nie zastępują.
  - `addBlock` odporny na ponowienie: gdy żądanie doszło, a odpowiedź zginęła, „Spróbuj ponownie” wysyła blok o tym samym `id`. Upsert z `ignoreDuplicates` (albo błąd `23505` uznany za sukces) daje wtedy jeden blok i żadnego fałszywego błędu.
  - Kafelek pokazuje, że zapis trwa (np. „Zapisuję…”); podwójne kliknięcie według decyzji z kroku 4a.
  - Po powrocie do karty (zdarzenie `visibilitychange`) dane wczytują się od nowa, najwyżej raz na minutę. Przypięta karta jest otwarta całymi dniami, a bez tego nie pokaże bloków z innych urządzeń. Odświeżenie czeka, dopóki trwa zapis albo otwarte jest pole opisu lub formularz („Dopisz blok”, potwierdzenie importu), żeby przerysowanie nie skasowało tego, co wpisujesz.
- **Rezultat.** Aplikacja zapisuje w bazie; na razie sprawdzana tylko na koncie testowym.
- **Gotowe, gdy:** na serwerze lokalnym, na koncie testowym, przechodzi cała lista kontrolna, a ponowiony zapis bloku daje jeden blok.
- **Sprawdzenie:**
  1. Na serwerze lokalnym, na koncie testowym: lista kontrolna.
  2. F12 → Network → Offline → kliknięcie kafelka → komunikat z „Spróbuj ponownie” → Online → ponowienie → jeden blok, nie dwa.
  3. Ten sam blok zapisany dwa razy (tymczasowe podwójne wywołanie `storage.addBlock(block)`, potem cofnięte) → jeden wiersz w bazie, bez komunikatu o błędzie. Sprawdzenie 2 tego nie złapie, bo w trybie Offline żądanie w ogóle nie wychodzi.
  4. F12 → Network → Slow 3G: kafelek pokazuje, że zapis trwa.
  5. Dwie karty na koncie testowym: blok zapisany w jednej → powrót do drugiej → blok widoczny bez odświeżania. Gdy w drugiej karcie jest otwarte pole opisu z wpisanym tekstem, powrót do niej tekstu nie kasuje.
  6. Testy tłumaczenia wierszy, bez łączenia z bazą.
- **Zależności:** kroki 9 i 10.
- **Ryzyka:**
  - od tego kroku serwer lokalny i GitHub Pages używają tej samej bazy → lokalnie tylko konto testowe (pilnuje tego kod z kroku 10);
  - baza odpowiada wolniej niż `localStorage` → widoczny stan zapisu, żeby nie kliknąć drugi raz;
  - odświeżenie po powrocie do karty w trakcie zapisu albo pisania nadpisałoby stan lub wpisany tekst → wczytujemy dane od nowa dopiero wtedy, gdy nie trwa zapis i nie jest otwarte żadne pole;
  - sesja wygasła → ekran logowania zamiast „Spróbuj ponownie” bez końca.
- **Do rozstrzygnięcia:** gdzie trzymać tłumaczenie wierszy, żeby testy działały bez łączenia z bazą.
- **Do listy kontrolnej:** „F12 → Network → Offline → kliknięcie kafelka → komunikat → Online → Spróbuj ponownie → jeden blok.”

### Krok 11b. Przeniesienie prawdziwych danych (1 blok)

Osobna sesja, w jednym ciągu i bez klikania bloków w trakcie.

- **Opis.** Próba generalna na koncie testowym, potem przeniesienie prawdziwych danych na Twoje konto i wdrożenie wersji z bazą.
- **Rezultat.** Te same dane na każdym urządzeniu.
- **Gotowe, gdy:** spełniony jest warunek z F8, a cała historia z wersji lokalnej jest w bazie (licznik łączny taki sam jak przed przeniesieniem).
- **Sprawdzenie (w tej kolejności):**
  1. Na GitHub Pages (jeszcze stara wersja): eksport → plik do próby generalnej. Eksport to nie klikanie kafelków, więc na produkcji wolno.
  2. Próba generalna: na serwerze lokalnym, na koncie testowym, import tego pliku → licznik łączny i wykres jak na GitHub Pages. Klucz `(user_id, id)` w bazie pozwala potem wgrać te same dane na drugie konto.
  3. Tuż przed scaleniem, na GitHub Pages: eksport jeszcze raz → świeży plik do przeniesienia. Od tej chwili bez klikania bloków aż do punktu 5. Po scaleniu eksport czyta już z bazy, więc później świeżego pliku z wersji lokalnej nie da się zrobić.
  4. Scalenie gałęzi `baza` z `main` i push → ok. 2 minuty → Ctrl+Shift+R na GitHub Pages.
  5. Logowanie na Twoje konto → import świeżego pliku z punktu 3 → licznik łączny i wykres jak przed przeniesieniem.
  6. Na koncie testowym import danych testowych (krok 5) w miejsce kopii prawdziwych. Inaczej test w kroku 12 nie odróżni Twoich danych od testowych.
  7. Drugie urządzenie: po zalogowaniu widać blok zapisany na komputerze w pracy.
- **Zależności:** krok 11a; kopia zapasowa (krok 3).
- **Ryzyka:**
  - po wdrożeniu eksport czyta już z bazy → świeży eksport tuż przed scaleniem (punkt 3); stare dane i tak zostają w `localStorage`, więc w razie kłopotu da się je odzyskać przez F12;
  - import przerwany w połowie → „Spróbuj ponownie” wgrywa ten sam plik jeszcze raz (SPEC.md, sekcja 6.3);
  - bloki z innej przeglądarki (np. z domu) nie przejdą, bo przeniesienie bierze jeden plik → wcześniej dopisane w pracy przez „Dopisz blok”;
  - baza to nie kopia zapasowa (na darmowym planie nie licz na kopie z panelu Supabase) → eksport raz w tygodniu zostaje.

### Krok 12. Test bezpieczeństwa i wersja 1.1 (1 blok)

- **Opis.** Sprawdzenie uprawnień i RLS na prawdziwych danych, z kontrolą pozytywną; szukanie sekretów w plikach i w historii gita; tag `v1.1`.
- **Rezultat.** Pewność, że Twoje dane widzisz tylko Ty.
- **Gotowe, gdy:**
  1. to samo zapytanie o `tasks` i `blocks` z kluczem publicznym: po zalogowaniu na Twoje konto zwraca Twoje dane, na koncie testowym tylko dane testowe, a bez logowania kończy się błędem `42501 permission denied`. Ten błąd to dobry wynik: tabele są dostępne tylko dla zalogowanych (SPEC.md, sekcja 6.3);
  2. próba założenia nowego konta kończy się błędem;
  3. próba usunięcia konta testowego, które ma dane (panel → Authentication → Users), kończy się błędem;
  4. w plikach i w historii gita jedyny prawdziwy klucz to `sb_publishable_…`: nie ma klucza `sb_secret_…` ani tokenów `eyJ…`. Szukamy prawdziwych kluczy, czyli prefiksu z długim ciągiem znaków za nim (np. `sb_secret_[A-Za-z0-9_-]{20,}`, `eyJ[A-Za-z0-9_-]{20,}`). Same teksty `sb_secret_`, `sb_publishable_` i `sb_temp_` są w `js/vendor/supabase.js`, bo biblioteka rozpoznaje rodzaje kluczy; to nie są klucze;
  5. tag `v1.1` jest wypchnięty.
- **Sprawdzenie:** prompt: „Przygotuj zapytania do sprawdzenia RLS według kroku 12 i wykonaj wersję bez logowania. Znajdź w plikach i w historii gita wszystkie prawdziwe klucze (prefiks `sb_` albo `eyJ` z co najmniej 20 znakami za nim) i sprawdź, że to wyłącznie `sb_publishable_…`.” Zapytania po zalogowaniu, próbę rejestracji i próbę usunięcia konta wykonujesz sam, bo wymagają hasła albo panelu.
- **Zależności:** krok 11b (pusta tabela niczego nie dowodzi).
- **Ryzyka:**
  - błąd albo pusta odpowiedź mogą znaczyć pomyłkę w zapytaniu, a nie działające zabezpieczenie → dlatego najpierw zapytanie po zalogowaniu musi zwrócić dane;
  - token `eyJ…` znaleziony w historii może być starym kluczem `service_role`, a samo szukanie słowa `service_role` go nie znajdzie → rozkodowujemy każdy token;
  - sekret raz wypchnięty i potem usunięty zostaje w historii gita → gdyby się znalazł: nowy klucz w panelu Supabase, a stary wyłączony.

## Po MVP

Pomysły na później, ich kolejność i warunki, których MVP nie może zablokować, są w [ROADMAP.md](ROADMAP.md).

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
6. Eksport pobiera plik. Import tego pliku → potwierdzenie z liczbą bloków → Nie: dane bez zmian (od kroku 3).

## Etap 1. Fundament (kroki 0a–2b)

### Krok 0a. Przygotowanie

Repozytorium i GitHub Pages działają, CLAUDE.md jest w repozytorium, a test pamięci przeglądarki (`test-pamieci.html`) przeszedł na komputerze w pracy zamknięcie przeglądarki i restart komputera.

**Zrobione:** 11.10.2026.

### Krok 0b. Komputer w pracy

Sprawdzenie na komputerze w pracy 13.10.2026:

- test pamięci (`test-pamieci.html`): dane przetrwały zamknięcie przeglądarki, restart komputera i dwie noce (4. otwarcie, pierwsze 11.10.2026), więc kolejność kroków zostaje bez zmian;
- przeglądarka: Chrome 155. Zasada w CLAUDE.md: kod używa tylko tego, co zna Chrome 155. Telefon i czytnik Boox mogą mieć starsze przeglądarki, więc sprawdzamy je, zanim aplikacja ma na nich działać;
- `https://supabase.com` się otwiera. Pełne sprawdzenie adresu projektu (`/rest/v1/`) jest w kroku 9;
- test wyczyszczony w pracy („Wyczyść test”), a `test-pamieci.html` i akapit o nim usunięte z repozytorium.

**Zrobione:** 13.10.2026.

### Krok 1. Szkielet i dane (1–2 bloki)

- Prompt: „Według sekcji 6–8 SPEC.md utwórz strukturę plików, storage-local.js z asynchronicznym interfejsem z sekcji 7, danymi startowymi i obsługą wersji danych oraz model.js. Bez wyglądu.”

**Gotowe, gdy:** w narzędziach deweloperskich (F12 → Application → Local Storage) widać klucz `organizerNauki` z 5 zadaniami.

**Zrobione:** 11.10.2026.

### Krok 2. Ekran „Dziś” (2 bloki)

Funkcja F1. **Gotowe, gdy:** spełniony warunek z F1.

**Zrobione:** 11.10.2026. Licznik łączny był wtedy ukryty do pierwszego zapisu; widoczny zawsze i z podpowiedzią przy 0 jest od kroku 2b.

### Krok 2b. Testy, licznik łączny i napis startowy

Strona `tests.html` z testami funkcji z `model.js` i `dates.js`: własna funkcja sprawdzająca w `js/tests/check.js`, bez bibliotek, a na stronie strefa czasowa przeglądarki (testy zmiany czasu coś sprawdzają tylko w strefie ze zmianą czasu). Teksty kafelka, sumy dnia i licznika łącznego są w `model.js`, więc testy je obejmują. Licznik łączny jest widoczny zawsze, od razu po otwarciu strony, a przy 0 blokach z podpowiedzią. Napis „Wczytywanie… Jeśli ten napis nie znika, odśwież stronę przez Ctrl+Shift+R.” pojawia się po ok. 2 s tylko wtedy, gdy aplikacja nie wystartowała.

Decyzje (SPEC.md, F1):

- suma dnia pokazuje osobno wszystkie bloki i postęp względem celu dnia, np. „Dziś: 9 bloków · 3 h 45 min · cele: 7 z 10”. Do celu każde zadanie liczy się najwyżej do swojego celu, więc Angielski 1 / 4 nie ginie za nadmiarem w innych zadaniach;
- kafelek ma po prawej procent celu (0%, 25%, 100%, 150%…), a pod nim zielony ✓ po osiągnięciu celu. Kafelki mają co najmniej 11rem szerokości, żeby nazwa i procent mieściły się w jednej linijce;
- Claude Code ma w danych startowych cel 1, więc cel dnia na start to 10.

**Zrobione:** 13.10.2026.

## Etap 2. Codzienne używanie (kroki 3–4b)

### Krok 3. Kopia zapasowa

F7: sekcja „Kopia zapasowa” w zakładce „Zadania” (eksport, import, „Ostatnia kopia”), sprawdzanie pliku w `model.js` tak samo surowe jak baza, z testami w `js/tests/import.test.js`, oraz link „Masz kopię? Importuj” na ekranie „Dziś” przy 0 blokach.

Decyzje (SPEC.md, F7):

- przy uszkodzonych danych zamiast zakładek jest panel: co się stało, „nic nie zostało nadpisane”, potem 1. „Pobierz uszkodzone dane”, 2. „Importuj kopię” i na dole „Spróbuj ponownie”;
- „Ostatnia kopia: 9 dni temu” tylko w zakładce „Zadania”. Datę trzyma osobny klucz `organizerNaukiLastExport`, a moduł zapisu ma dwie nowe funkcje: `loadLastExportDate()` i `saveLastExportDate(date)`;
- link „Masz kopię? Importuj” przenosi do „Zadań” i otwiera wybór pliku; przejście do innej zakładki działa jak „Nie”;
- komunikat o złym pliku podaje pierwszy znaleziony błąd. Cel dzienny ma granice 0–100, a blok 1–1440 minut, w imporcie i w SQL (SPEC.md, sekcja 6.3);
- osobny adres strony: zaraz po tym kroku (krok 3b).

Sprawdzenie na komputerze w pracy (eksport działa i wiadomo, w którym folderze ląduje plik) robisz przy pierwszym eksporcie prawdziwych danych.

**Zrobione:** 13.10.2026.

### Krok 3b. Osobny adres strony (1 blok)

- **Opis.** Organizer przenosi się pod osobny adres w darmowej organizacji na GitHubie, zanim pod `kubiakraf.github.io` pojawią się inne projekty (np. z kursu frontendu). Wszystkie strony pod jednym adresem mają wspólny `localStorage`: mogą odczytać albo skasować dane organizera, a w wersji z bazą odczytać token sesji (SPEC.md, sekcja 7). Przeprowadzka danych to eksport na starym adresie i import na nowym (krok 3).
- **Rezultat.** Projekty z kursu możesz publikować pod `kubiakraf.github.io` bez ryzyka dla danych organizera, a przypięta karta i kopie od początku działają pod docelowym adresem.
- **Gotowe, gdy:** aplikacja działa pod nowym adresem z prawdziwymi danymi, a stary adres nie trzyma już danych organizera.
- **Sprawdzenie:**
  1. W pracy, jeszcze pod starym adresem: eksport prawdziwych danych.
  2. Nowy adres: strona, `tests.html`, konsola bez błędów (Ctrl+Shift+R).
  3. W pracy pod nowym adresem: import kopii → licznik łączny jak przed eksportem.
  4. Stary adres: klucze `organizerNauki` i `organizerNaukiLastExport` usunięte (F12 → Application → Local Storage; działa na każdej stronie pod `kubiakraf.github.io`, także na stronie błędu 404).
  5. Nowy adres w przypiętej karcie. CLAUDE.md, SPEC.md i PLAN.md mają nowy adres.
- **Zależności:** krok 3.
- **Ryzyka:**
  - GitHub przekierowuje stary adres przeniesionego repozytorium, ale nie stronę na GitHub Pages → najpierw eksport (sprawdzenie 1), dopiero potem przeniesienie;
  - stare dane zostają w `localStorage` pod `kubiakraf.github.io`, z prywatnymi opisami bloków → sprawdzenie 4;
  - inna strona dodana później pod nowy adres znów dzieliłaby `localStorage` → pod nowym adresem jest tylko organizer.
- **Do rozstrzygnięcia:** nazwa organizacji (będzie w adresie strony); przeniesienie repozytorium do organizacji (historia i link z portfolio zostają) czy nowe repozytorium; adres `<nazwa>.github.io` (repozytorium o tej nazwie) czy `<nazwa>.github.io/organizer-nauki/`.
- **Do listy kontrolnej:** nic.

### Krok 4a. Opis bloku, lista dnia, usuwanie (2 bloki)

- **Opis.** F2 i część F3: pole „Co konkretnie?” po kliknięciu kafelka, lista dzisiejszych bloków, usuwanie po potwierdzeniu na stronie („Usunąć? Tak / Nie”). Nie przez `confirm()`: okno przeglądarki blokuje stronę, a narzędzia, którymi Claude Code sprawdza podgląd, często nie umieją go kliknąć. Nowa operacja zapisu `updateBlock(block)` w `storage-local.js` (SPEC.md, sekcja 7), bo opis dochodzi do bloku, który jest już zapisany.
- **Rezultat.** Zapisujesz, co konkretnie robiłeś, i cofasz pomyłkowe kliknięcie.
- **Gotowe, gdy:** spełnione są warunki z F2 i warunek z F3 o usuwaniu.
- **Sprawdzenie:**
  1. Kliknięcie „Python” → pole z podpowiedzią ostatniego opisu → wpisanie opisu i Enter → blok na liście z godziną, zadaniem i opisem.
  2. Kliknięcie „Python” → Esc → blok na liście bez opisu, kafelek „2 / 2” z ✓.
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
  - podwójne kliknięcie kafelka: dziś daje dwa bloki. Czy kafelek ma przez chwilę (np. 1 s) ignorować drugie kliknięcie? Ta sama decyzja obowiązuje w wersji z bazą (krok 11a), gdzie zapis trwa dłużej;
  - czy pole „Co konkretnie?” ma przycisk „Cofnij”, który jednym kliknięciem usuwa właśnie zapisany blok (pomyłka zauważona od razu, np. zły kafelek)? Usuwanie z listy z potwierdzeniem zostaje na pomyłki zauważone później.
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
  2. Cel „Rysunku” z 1 na 2 → suma dnia „z 11”.
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
- **Zależności:** krok 8 (wersja 1.0).
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
  - wszystkie strony pod jednym adresem mają wspólny `localStorage`, a w nim token sesji → organizer ma od kroku 3b osobny adres; sprawdzamy, że pod nim nie ma innych projektów;
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

# Organizer nauki: kierunki rozwoju

Wersja 1 · 12 października 2026

Pomysły na czas po MVP i warunki, których dzisiejsze decyzje nie mogą zablokować. [SPEC.md](SPEC.md) mówi, czym jest MVP, [GitHub Issues](https://github.com/dev-organizer/organizer-nauki/issues) mówią, jak do niego dochodzimy, a ten plik mówi, dokąd aplikacja może pójść potem.

Jak z niego korzystać:

- Przed decyzją o formacie danych, interfejsie zapisu, bazie, adresie strony albo układzie widoków przejrzyj sekcję „Czego nie zablokować”. Jeśli decyzja utrudnia któryś pomysł, powiedz to przed zmianą.
- Nowy pomysł z pracy nad krokiem trafia tutaj, a nie do kodu.
- Gdy pomysł wchodzi do budowy, dostaje kroki (issues w kamieniu milowym) i opis w SPEC.md, a stąd znika.
- Kolejność to priorytet na dziś. Zmieniamy ją, gdy dane z aplikacji pokażą coś innego.

## Pomysły, w kolejności priorytetów

1. **„Kopiuj do arkusza” (TSV).** Tylko jeśli Claude nie zapisuje do Arkusza Google (test w SPEC.md, sekcja 9). Tabela wklejana Ctrl+V prosto w komórki. Korzysta z tej samej funkcji zliczającej co wykres i raport.
2. **Listy lekcji z kursów.** Lekcje do odhaczania, z procentem ukończenia, zamiast wydrukowanych kartek. Lekcja należy do zadania (np. „Python” → kurs → lekcje). Pomaga na problem nr 3 (start bez konkretu): następna nieodhaczona lekcja to gotowy pomysł na blok. Pomysł, na którym zależy Ci najbardziej z tej listy.
3. **Ściana chwały.** Ukończone kursy, projekty i kamienie milowe w jednym miejscu.
4. **Plan każdego przedsięwzięcia.** Kroki i stan dla większych celów (np. kurs, projekt do portfolio).
5. **Podpowiedź „następne zadanie” i karta „Po co to robię”.** Podpowiedź wskazuje zadanie najbardziej w tyle względem celu dnia. Karta przypomina, po co jest dana nauka.
6. **Zakładka zdrowia.** Sen, godzina pobudki, jedzenie, leki, później może dane z Oura. Wpisywane z telefonu, na tym samym koncie. Warunki:
   - osobny adres strony, bo strony pod jednym adresem mają wspólny `localStorage`, a w nim token sesji. Spełnione od kroku 3b (`dev-organizer.github.io`, gdzie tylko organizer ma GitHub Pages);
   - osobne tabele z RLS i taki sam test bezpieczeństwa jak przed wersją z bazą (krok 12, issue #18);
   - samo przypomnienie o lekach zostaje w telefonie, bo strona w przeglądarce nie przypomni, gdy jest zamknięta.
7. **Podsumowania AI przez API.** Zamiast ręcznego wklejania raportu do Claude. Klucz do AI tylko w funkcji po stronie Supabase (Edge Function), nigdy w kodzie strony.
8. **Własny minutnik.** Z automatyczną pauzą przy zmianie karty. Bloki mogłyby wtedy mieć inną długość niż 25 minut (pole `minutes`).
9. **Widok na czytnik Boox.** Wysoki kontrast, bez animacji.
10. **Praca bez internetu w wersji z bazą.** Kolejka zapisów wysyłana po odzyskaniu połączenia, zamiast komunikatu z „Spróbuj ponownie”.
11. **Szybsze wczytywanie przy dużej historii.** Pobieranie bloków tylko z potrzebnego zakresu dat i licznik łączny zapytaniem z `count`, gdy pełne wczytanie zacznie być wolne (przy ok. 3300 blokach rocznie nieprędko).
12. **Sterowanie głosem.**

Do rozważenia, bez miejsca w kolejce:

- **Edycja bloku** (zadanie, data, godzina, opis) zamiast „usuń i dopisz od nowa”. W MVP wystarcza usuwanie z listy dowolnego dnia i dopisywanie.
- **Aplikacja na telefonie jako PWA:** ikona na ekranie głównym i okno bez paska przeglądarki. Przyda się przy zakładce zdrowia.

## Czego nie zablokować

Decyzje z MVP, które trzymają te pomysły otwarte. Zmiana którejś z nich wymaga rozmowy.

| Decyzja w MVP | Po co | Pomysły |
|---|---|---|
| `id` z `crypto.randomUUID()` nadawane w przeglądarce, a zapis bloku odporny na ponowienie (ten sam `id` daje jeden blok) | kolejka zapisów może wysłać ten sam blok kilka razy | 10, PWA |
| Pole `minutes` zostaje, choć w MVP zawsze 25 | bloki innej długości | 8 |
| `version` w danych i migracje w `upgradeData()`; nowe rodzaje danych jako nowe listy w danych i nowe tabele w bazie, a nie dodatkowe pola w blokach | lekcje i dane zdrowotne bez przebudowy bloków | 2, 6 |
| Widoki znają tylko `actions`, a zapis tylko moduł `storage`; nowy rodzaj danych to nowe funkcje w obu modułach zapisu | kolejka offline i nowe dane bez zmian w widokach | 2, 6, 10 |
| Liczenie w `model.js` z listy bloków podanej jako argument, nie z globalnego stanu | pobieranie zakresu dat bez przepisywania widoków; TSV i raport z tej samej funkcji | 1, 11 |
| Ścieżki względne; adres produkcyjny w kodzie najwyżej w jednej stałej (zasada „poza produkcją tylko konto testowe”) | przeprowadzka na osobny adres to zmiana jednej stałej i ustawień Supabase | 6 |
| Każda tabela w bazie: `user_id`, klucz `(user_id, id)`, `grant` tylko dla `authenticated`, RLS „tylko własne” | nowe tabele (lekcje, zdrowie) według tego samego wzoru | 2, 6 |
| Żadnych sekretów w kodzie strony; wszystko, co wymaga klucza, przez Edge Function | AI bez wycieku klucza | 7 |
| Wąskie okno (ok. 360 px), obsługa klawiaturą, informacja nie tylko kolorem (✓ obok koloru), kolory w zmiennych CSS | telefon; tryb wysokiego kontrastu to podmiana zmiennych | 6, 9, PWA |
| Dziedziny w kodzie (`DOMAINS`) i w `check` w bazie | nowa dziedzina to zmiana w dwóch miejscach, nie przebudowa | 6 |
| Raport to czysty tekst z `report.js` | wysyłka do AI użyje tego samego tekstu | 7 |

## Świadomie odrzucone

Żeby nie wracały jako „nowe” pomysły:

- **Planowanie tygodnia i przeciąganie zadań między dniami.** Dni w pracy są nieprzewidywalne, a sztywne plany wcześniej się nie sprawdzały.
- **Serie dni do zerwania, „nieudane dni”, komunikaty o porażce.** Sprzeczne z zasadą „pokazujemy to, co zrobione” (SPEC.md, sekcja 3).
- **Przerwy na wykresie zamiast zera.** Wykres jest uczciwy: dzień bez bloków to 0. Poczucie postępu daje licznik łączny.
- **Konta dla innych osób.** Aplikacja ma jednego użytkownika.

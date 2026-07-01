# Handoff: Portfolio Miłosza Bembnowicza (developer portfolio)

## Overview
Portfolio/strona-wizytówka dla programisty (Miłosz Bembnowicz), kierowana do małych firm w Rzeszowie, Krakowie i okolicy. Cel: jedna strona typu one-pager z sekcjami informującymi o usługach, przykładowych projektach (demo), cenniku i formularzu kontaktowym. Strona ma wspierać dwa języki (PL/EN) przełączane jednym przyciskiem, oraz mieć subtelne animacje wjazdu treści przy scrollu.

## About the design file
Plik `portfolio-reference.html` w tym folderze jest **referencją projektową zrobioną w HTML** — pokazuje docelowy wygląd, treści i zachowanie (przełącznik języka, animacje, tweaki kolorów/fontu), ale **nie jest kodem produkcyjnym do skopiowania 1:1**. Zadaniem jest odtworzenie tego projektu w Astro, z użyciem właściwych dla Astro wzorców (komponenty `.astro`, ewentualnie wyspy React/Preact tylko tam gdzie potrzebna jest interaktywność — przełącznik języka i formularz).

## Fidelity
**High-fidelity** — kolory, typografia, odstępy i treść są finalne (do podmiany realnych zdjęć/projektów w przyszłości). Odtwórz pikselowo.

## Sections (w kolejności na stronie)

1. **Top bar** — sticky nav. Po lewej tekst "home" (link do góry strony — bez logo, celowo). Po prawej: linki kotwic (realizacje, usługi, cennik, o mnie, kontakt) + przycisk przełącznika języka (pill, border 1px, tekst "PL / EN" / "EN / PL"). Linki nav są też tłumaczone przy przełączeniu języka.
2. **Intro / Hero** — wyrównane do lewej (nie wycentrowane), max-width 880px. Zielony "dostępny" dot + status, małe imię/nazwisko (font display), duży H1 (54px) z wyróżnionym fragmentem "bez ograniczeń" w kolorze akcentu, CTA "Skontaktuj się" (pill, tło akcent, scrolluje do #kontakt) + link tekstowy "Zobacz realizacje ↓".
3. **Stats strip** — 4 statystyki w jednym wierszu na białym tle, oddzielone pionowymi liniami (1+ rok doświadczenia, 100% własny kod, ∞ brak ograniczeń, 1,5k+ strony od 1500 zł).
4. **Realizacje (demo, interaktywne)** — nagłówek + podtytuł info że to projekty demo + link "Zobacz wszystkie ↗". Grid 2×2 dużych kart: kolorowe tło + "okno przeglądarki" mockup z paskiem adresu (np. "kancelarialex.pl") wyłaniający się od dołu, plakietka "DEMO" w lewym górnym rogu. **Interakcja:** hover na całej karcie unosi ją (translateY -4px) + dodaje cień na obrazku; hover na samym obrazku pokazuje ciemną nakładkę z napisem "Zobacz podgląd ↗" (sterowane przez onMouseEnter/onMouseLeave, NIE czystym CSS :hover — patrz uwaga techniczna niżej). **Link "Zobacz podgląd" jest obecnie nieaktywny (href="#")** — docelowo powinien prowadzić do żywego adresu danej realizacji (np. otwierać stronę klienta w nowej karcie), gdy powstaną prawdziwe projekty. 4 demo: Kancelaria Lex (kancelaria prawna), Trattoria Bella (restauracja), Warsztat Mechanika (warsztat samochodowy), Studio Glow (salon urody).
5. **Usługi** — 4 karty 2×2: strona wizytówkowa (od 1500 zł), sklep internetowy (od 4000 zł), aplikacja webowa (wycena indywidualna), opieka techniczna (od 150 zł/mies). Górna ramka karty w kolorze akcentu lub tekstu (alternująco).
6. **O mnie / USP** — wycentrowany blok tekstowy (max 760px), 3 akapity: (1) WordPress + wtyczki jako typowe podejście, ten sufit go nie dotyczy bo pisze kod sam, (2) może przyjąć każde zlecenie + buduje w Astro, (3) jest programistą i jednocześnie studiuje zaocznie informatykę na uczelni w Krakowie. Pod spodem chipy technologii (Astro, TypeScript, Netlify, PostgreSQL, REST API).
7. **Żywy kod (code editor demo)** — osobna sekcja PO sekcji "o mnie", wycentrowana, max-width 700px. Okno edytora kodu (ciemny motyw "Night Owl"-podobny, NIEZALEŻNY od jasnego/ciemnego motywu strony — zawsze ciemny, jak zrzut ekranu IDE) z paskiem tytułowym (traffic lights + "Hero.astro"), treścią: animowane, zapętlone "pisanie" fragmentu kodu Astro (frontmatter + komponent), kolorowanie składni na sztywno zakodowane (nie zależy od motywu/akcentu strony), migający kursor, oraz stopką ze statusem "Kompilowanie..." → "Wdrożono" (zielona kropka) po zakończeniu pisania, po czym pętla się resetuje. **Uwaga techniczna:** animacja pisania działa przez bezpośrednią manipulację DOM (nie przez setState/re-render frameworka) — ważne, żeby uniknąć przypadkowego "zerowania" innych efekty wizualnych przy częstych re-renderach.
8. **WP vs Astro (diagram kontrastowy)** — sekcja "Dwa podejścia do tej samej strony." z dwiema kartami obok siebie + plakietka "VS" pośrodku: po lewej jasna karta "WordPress + wtyczki" z rozsypanymi, pochylonymi chipami nazw wtyczek (Elementor, WooCommerce, Yoast SEO, WPForms + 4 inne), po prawej ciemna karta "Astro + kod pisany od podstaw" z checklistą 4 przewag (czysty kod, pełna kontrola nad bezpieczeństwem, szybkie ładowanie, dowolna funkcja na życzenie).
9. **Cennik** — 3 karty: Wizytówka (1500 zł netto), Rozbudowana (3000 zł netto, oznaczona jako "Najpopularniejszy", obramowanie w kolorze akcentu), Custom (wycena indywidualna).
10. **Opinie (przykładowe)** — 2 karty cytatów — **oznaczone jako przykładowe**, bo nie ma jeszcze prawdziwych klientów. Podmienić na realne opinie, gdy będą dostępne.
11. **Kontakt** — duży nagłówek "Porozmawiajmy.", opis, email + telefon jako linki tekstowe z wyszarzonymi etykietami "Email:" / "Telefon:", 4 ikony social (X, LinkedIn, GitHub, mail — obecnie placeholder linki "#", celowo bez prawdziwych profili), oraz formularz (Imię, Email, Wiadomość, przycisk Wyślij) w ciemnej karcie zaokrąglonej.
12. **Footer** — nazwa, copyright ("Rzeszów · Kraków i okolice"), etykieta języka.

## Uwaga techniczna ważna dla implementacji w Astro

Ten projekt referencyjny napotkał i rozwiązał dwa subtelne bugi związane ze sposobem renderowania w narzędziu projektowym (NIE dotyczą Astro/produkcji, ale warto znać kontekst):
1. **Animacja "scroll reveal"** (elementy wjeżdżające przy scrollu) oraz **hover na kartach realizacji** wymagały jawnego wyłączenia/włączenia CSS transition (`transition:none` → wymuszenie reflow → przywrócenie transition) w momencie zmiany stylu z JS, inaczej tranzycja "zawieszała się" na wartości początkowej. W czystej implementacji Astro (bez frameworka narzędzia projektowego) to prawdopodobnie nie wystąpi — ale jeśli scroll-reveal lub hover-overlay nie animują się płynnie, to pierwsza rzecz do sprawdzenia.
2. Animacja pisania kodu w sekcji "Żywy kod" celowo NIE używa re-renderów komponentu (np. React state) w pętli — w Astro/React odpowiednikiem powinno być sterowanie przez `useRef` + bezpośrednią manipulację DOM/tekstu w pętli (np. `setInterval` + `textContent`), a NIE przez `useState` co 32ms, żeby uniknąć niepotrzebnych, częstych re-renderów całego komponentu.

## Design Tokens

**Kolory (motyw domyślny "Kremowy"):**
- bg: `#f4f1eb` | surface: `#ffffff` | text: `#0f1629`
- muted: `rgba(15,22,41,0.55)` | border: `rgba(15,22,41,0.08)`
- accent (domyślny, tweakowalny): `#214eb8`
- chip bg: `#eef2ff`

Dostępne też dwa dodatkowe motywy: "Papier" (neutralny, `#faf8f3`) i "Atrament" (ciemny, `#0e1422`/tekst `#e8ecf3`) — patrz JS referencji, obiekt `THEMES`.

Paleta akcentów do wyboru: `#2462e3` (niebieski), `#214eb8` (granat pośredni), `#1e3a8a` (navy), `#d97642` (pomarańcz), `#3f9b72` (zielony), `#b4452f` (czerwień), `#0f1629` (ink), `#7c3aed` (fiolet), `#b8862e` (musztarda), `#0e8a82` (morski), `#d6336c` (róż).

**Typografia:**
- Display/nagłówki (tweakowalny): domyślnie `Playfair Display`, dostępne też: Times New Roman, Georgia, EB Garamond, Fraunces, Newsreader, Bricolage Grotesque, Space Grotesk, Syne.
- Treść: `DM Sans` (wagi 300–600).
- H1: 54px/600, H2 sekcji: 40–46px/600, ceny: 36px/700.

**Odstępy:** sekcje mają padding 84–104px (góra/dół) × 56px (boki), max-width treści 1280px (sekcje pełne) lub 760px (o mnie).

**Border-radius:** pills 100px, karty 12px, duże karty realizacji 18px, formularz 22px.

## Interakcje
- **Przełącznik PL/EN**: klik przełącza cały tekst strony (słownik `COPY.pl` / `COPY.en` w referencji).
- **Animacje wjazdu**: elementy z `data-reveal` startują z opacity:0, translateY(28px), wjeżdżają (opacity:1, translateY:0) gdy wejdą w viewport przy scrollu — easing `cubic-bezier(.16,1,.3,1)`, czas 0.85s, z opcjonalnym `data-reveal-d="1|2|3"` dla stopniowanego delay (0.08s/0.16s/0.24s).
- **Formularz**: walidacja required na polach (imię, email, wiadomość), submit obecnie pokazuje alert demo — do podłączenia np. pod Netlify Forms lub własne API.
- Linki kotwic w nav płynnie scrollują do sekcji (id: `#realizacje`, `#uslugi`, `#cennik`, `#omnie`, `#kontakt`).

## State management
- `lang`: "pl" | "en" — przełącza cały tekst.
- (opcjonalnie w produkcji) stan formularza kontaktowego — pola + status wysyłki.

## Assets
- `logo.svg` — logo "M" w kolorze `#004aad`, tło przezroczyste, dostarczone przez użytkownika. **Obecnie NIEUŻYWANE na stronie** (użytkownik zdecydował się zostawić sam tekst "home" w navbarze zamiast logo) — zachowane w folderze na wypadek gdyby chciał je dodać w przyszłości.
- Mockupy "okien przeglądarki" w kartach realizacji są budowane czystym CSS (gradient + bloki), nie obrazkami — można zostawić jako placeholder do czasu realnych zrzutów ekranu.

## Dane kontaktowe (do wpisania w finalnej wersji)
- Email: `miloszbembnowicz@gmail.com`
- Telefon: `733 969 987` (link `tel:+48733969987`)
- Lokalizacja: Rzeszów, Kraków i okolice

## Do ustalenia przed wdrożeniem
- Social media (X/LinkedIn/GitHub) — obecnie linki "#", czekają na realne profile.
- Sekcja "Opinie" jest oznaczona jako przykładowa — zastąpić prawdziwymi opiniami klientów, gdy będą dostępne.
- Sekcja "Realizacje" zawiera 4 projekty demo (kancelaria, restauracja, warsztat, salon) — zastąpić rzeczywistymi zrzutami i case studies, gdy powstaną pierwsze wdrożenia.

## Files
- `portfolio-reference.html` — pełna referencja wizualna (otwiera się w przeglądarce).
- `logo.svg` — logo do navbaru.

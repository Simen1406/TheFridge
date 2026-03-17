# Prosjektstatus - TheFridge

## Hva som er gjort

1. Backend med FastAPI er satt opp med hovedapp, CORS og helse-endepunkter (`/` og `/ping`).
2. Databaseintegrasjon via SQLModel er pa plass, inkludert init ved startup og sesjonshandtering.
3. Datamodeller for `FridgeItem` og `GroceryItem` er i bruk i backend.
4. Grocery-endepunkter er koblet riktig til grocery-tabell/modell:
   - Hente varer: `GET /grocery-items_from_db` (fra `GroceryItem`)
   - Legge til vare: `POST /ManualAddGroceryItem` (bruker `AddGroceryItem`)
   - Slette vare: `POST /deleteGroceryItem` (tabellspesifikk sletting)
5. Slette-logikk i backend er gjort tabellspesifikk for bade fridge og grocery.
6. Frontend Fridge er koblet til API-klient med hente/legg-til/slett-flyt.
7. Frontend Groceries er koblet til ekte API (ikke mock-data) med hente/legg-til/slett-flyt.
8. Egen `AddGroceryForm` er lagt til i frontend.
9. API-typing i frontend er oppdatert med `NewGroceryItem` for korrekt grocery payload.
10. Trumf-kvitteringsskript er refaktorert til separerte funksjoner (login/nav, finn nedlastinger, last ned, orkestrering) og lagrer filer i lokal `downloads`-mappe.

## Hva som bor gjores videre (prioritert)

1. **Stabilisere Trumf-kvitteringsnedlasting**
   - Lase selektorer mot faktisk DOM for menyknapp og "Last ned" i popup per kvittering.
   - Legge til robust venting/retry og logging for elementer som ikke gir download-event.

2. **Legg til validering og feilhandtering**
   - Bedre feilmeldinger i frontend ved API-feil.
   - Tydelige HTTP-feil i backend ved ugyldig input og DB-feil.

3. **Lag Python-skript som vasker data inn mot grocery-modellen**
   - Normaliser felt/typer slik at data matcher `GroceryItem`-modellen.
   - Kjor vasken for mock-data og evt. data fra eksterne kilder for innsetting i DB.

4. **Legg til tester og enkel CI**
   - API-tester for fridge/grocery endepunkter.
   - Enkle frontend-tester for sentrale flows.

5. **Dokumentasjon og oppstartsguide**
   - Oppdater README med lokale steg for backend + frontend.
   - Dokumenter miljo-variabler (f.eks. `DATABASE_URL`) og vanlige feilscenarioer.

## Isolert frontend - neste sma steg

1. **Legg til loading-state i Fridge- og Groceries-skjermene**
   - Vis tydelig "laster..." mens API-kall pagaar.
   - Behold tabellvisning nar data er ferdig hentet.

2. **Legg til error/empty-state i inventory-sider**
   - Vis brukervennlig feilbanner ved hentefeil.
   - Vis tydelig tom-liste-melding nar ingen varer finnes.

3. **Legg til validering i begge skjema**
   - Required-felt: navn, pris, vekt, enhet.
   - Numerisk sjekk for pris/vekt og datoformat (`YYYY-MM-DD`) for fridge.

4. **Hindre dobbelt-submit i skjema**
   - Deaktiver lagre-knapp mens request er i gang.
   - Vis enkel pending-tekst pa knappen ved innsending.

5. **Gjor modal-skjema responsive**
   - Erstatt fast `width: "30%"` med mobilvennlig bredde (`width: "90%"` + `maxWidth`).
   - Verifiser layout pa bade mobil og web.

6. **Rydd toolbar placeholders i InventoryTable**
   - Bytt ut "V" og "S" med tydelig tekst/ikon.
   - Fjern ubrukt filter-knapp hvis filter ikke er implementert ennå.

7. **Standardiser valutaformat**
   - Bruk samme valutaenhet pa tvers av skjermer.
   - Flytt formattering til en liten delt util-funksjon.

8. **Legg til frontend kvalitetsskript**
   - Legg til `typecheck` og `lint` script i `frontend/package.json`.
   - Kjor dem lokalt som fast verifikasjonstrinn.

9. **Flytt hardkodet CommonFridgeItems-data til `src/data`**
   - Gjenbruk status/dato-hjelpere i stedet for duplisering.
   - Hold sidekomponenten fokusert pa presentasjon.

10. **Oppdater frontend dokumentasjon**
   - Oppdater relevante `read.md`-filer med dagens komponent/service-flyt.
   - Beskriv kort hvor nye komponenter skal legges.

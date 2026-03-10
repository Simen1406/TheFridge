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

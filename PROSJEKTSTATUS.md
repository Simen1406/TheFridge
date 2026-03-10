# Prosjektstatus - TheFridge

## Hva som er gjort

- Backend med FastAPI er satt opp med hovedapp, CORS og helse-endepunkter (`/` og `/ping`).
- Databaseintegrasjon via SQLModel er pa plass, inkludert init ved startup og sesjonshandtering.
- Datamodeller for fridge/grocery finnes i backend.
- Mock-data for fridge settes inn ved oppstart dersom tabellen er tom.
- API for fridge er koblet opp i frontend:
  - Hente varer: `GET /fridge-items_from_db`
  - Legge til vare: `POST /ManualAddFridgeItem`
  - Slette vare: `POST /deleteFridgeItem`
- Frontend med Expo/React Native er satt opp med faner for Home, Fridge og Groceries.
- Fridge-siden henter data fra API og viser varene i tabell.

## Hva som bor gjores videre

1. **Lag grocery-endepunkter for add/remove**
   - Opprett backend-endepunkter som handterer "adding" og sletting av varer i grocery-listen.
   - Speil flyten som allerede finnes for fridge der det passer.

2. **Lag Python-skript som vasker data inn mot grocery-modellen**
   - Normaliser felt/typer slik at data matcher `GroceryItem`-modellen.
   - Kjor vasken for mock-data og evt. data fra eksterne kilder for innsetting i DB.

3. **Koble grocery til frontend**
   - Erstatt mock-data i Groceries-skjermen med kall til backend.
   - Koble `Add`/`Remove` handling til de nye grocery-endepunktene.

4. **Legg til validering og feilhandtering**
   - Bedre feilmeldinger i frontend.
   - Tydelige HTTP-feil i backend ved ugyldig input og DB-feil.

5. **Legg til tester og enkel CI**
   - API-tester for fridge/grocery endepunkter.
   - Enkle frontend-tester for sentrale flows.

6. **Dokumentasjon og oppstartsguide**
   - Oppdater README med lokale steg for backend + frontend.
   - Dokumenter miljo-variabler (f.eks. `DATABASE_URL`) og vanlige feilscenarioer.

# Prosjektstatus – TheFridge

## Hva som er gjort

- **Backend med FastAPI er satt opp** med hovedapp, CORS-konfigurasjon og enkle helse-endepunkter (`/` og `/ping`).
- **Databaseintegrasjon via SQLModel er på plass**, inkludert oppretting av tabeller ved startup og sesjonshåndtering.
- **Datamodeller for kjøleskaps- og handlelistevarer finnes**, med felter for blant annet navn, kategori, mengde, enhet og utløpsdato.
- **Mock-data for kjøleskapet settes inn ved oppstart** dersom tabellen er tom.
- **API-endepunkter finnes for kjøleskapsdata** (hent fra DB og manuell innlegging) samt produkt-/bildesøk mot ekstern Kassalapp-tjeneste.
- **Frontend med Expo/React Native er satt opp** med faner for hjem, kjøleskap og handleliste.
- **Kjøleskapssiden henter data fra API** ved lasting og viser data i tabellkomponent.
- **Skjema for å legge til vare i kjøleskap er laget**, med modal, inputfelter og kall til API ved lagring.

## Hva som bør gjøres videre

1. **Rette opp API-ruter mellom frontend og backend**
   - Frontend kaller i dag `/fridge-items` og `/AddFridgeItem`, mens backend eksponerer `/fridge-items_from_db` og `/ManualAddFridgeItem`.
   - Enten backend-rutene eller frontend-kallene må standardiseres for at funksjonaliteten skal virke.

2. **Synkronisere datamodeller mellom frontend og backend**
   - Frontend forventer felter som `category`, `quantity` og `unit`.
   - Backend-modellen inkluderer også felter som `ean`, `brand`, `price`, `weight`, `weight_unit`, `image`, som gjør at innlegging fra frontend trolig feiler uten mapping eller modellendring.

3. **Legge til validering og feilhåndtering**
   - Både i frontend (brukervennlige feilmeldinger) og backend (tydelige HTTP-feil med forklarende meldinger).

4. **Implementere sletting/oppdatering av varer**
   - UI har en "Remove"-knapp, men den gjør foreløpig bare `console.log`.
   - Krever tilsvarende backend-endepunkt(er).

5. **Bygge ut handleliste-flyten**
   - Handlelistevisningen bruker nå mock-data.
   - Koble denne til backend og lagre/fetch data fra database.

6. **Legge til tester og enkel CI**
   - Mangler synlige automatiserte tester for API-ruter, datamodeller og sentrale frontend-flyter.

7. **Dokumentasjon og oppstartsguide**
   - Legge inn README med tydelige steg for lokal kjøring (backend + frontend), miljøvariabler (`DATABASE_URL`) og vanlige feilscenarioer.

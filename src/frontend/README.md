# NourishNet React (Vite + Tailwind + Router + json-server)

## Quick start
```bash
npm install
npm run dev:all   # starts mock API (port 3001) + Vite dev server
# or run separately:
# > npx json-server --watch mocks/db.json --port 3001
# > npm run dev
```

Open: http://localhost:5173

## Where things are
- `src/pages/*` – Home, How, About, Contact, Login
- `src/components/*` – Header, Footer, Modal
- `src/lib/api.js` – API helper calling the mock endpoints
- `mocks/db.json` – Fake database for json-server
- `.env` – API base URL (http://localhost:3001)

## Switching to real backend later
- Change `.env` => `VITE_API_URL=https://your-api.example.com`
- Update `src/lib/api.js` endpoints if your paths differ

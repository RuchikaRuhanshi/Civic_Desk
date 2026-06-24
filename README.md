# CivicDesk — Hyperlocal Community Issue Reporting (MERN)

A full MERN-stack prototype for reporting, verifying, tracking, and resolving
local civic issues (potholes, leaks, streetlights, waste) with AI-assisted
categorization, geo-mapping, community verification, dashboards, predictive
insight, and gamification.

## Stack
- **MongoDB** — Tickets & Users collections (Mongoose)
- **Express** — REST API (`/server`)
- **React + Vite + Tailwind** — modern dark glassmorphic UI (`/client`)
- **Node** — runtime

## Project structure
```
mern-civicdesk/
  server/        Express API, Mongoose models, image upload, AI heuristic
  client/        React app (Vite), Tailwind UI, Leaflet map, Recharts
```

## Setup

### 1. MongoDB
Run a local MongoDB instance (or use MongoDB Atlas) and copy the connection
string into `server/.env`.

```bash
cd server
cp .env.example .env
# edit .env if your Mongo URI differs from the local default
```

### 2. Backend
```bash
cd server
npm install
npm run seed   # optional: loads demo issues + leaderboard data
npm run dev    # starts API on http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install
npm run dev    # starts UI on http://localhost:5173 (proxies /api to :5000)
```

Open http://localhost:5173.

## API overview
| Method | Route                          | Description                          |
|--------|---------------------------------|---------------------------------------|
| GET    | `/api/tickets`                  | List issues (filter by category/status) |
| POST   | `/api/tickets`                  | Create issue (multipart photo + AI categorization) |
| POST   | `/api/tickets/:id/verify`       | Community confirmation, auto-promotes status at 5 votes |
| PATCH  | `/api/tickets/:id/advance`      | Move issue to next status stage |
| GET    | `/api/tickets/stats/summary`    | Aggregates for dashboard |
| GET    | `/api/users/leaderboard`        | Top citizens by points |
| POST   | `/api/assistant/chat`           | AI assistant chat (uses live ticket data as context) |

## AI features
CivicDesk has two AI layers, both built on the Anthropic API and both with
automatic fallbacks so the app works with or without a key:

1. **Photo + description categorization** (`server/utils/classify.js`) — when
   a citizen attaches a photo, Claude looks at the image and description and
   returns a category, confidence, and a short reason. Falls back to a
   keyword heuristic if `ANTHROPIC_API_KEY` isn't set or the call fails.
2. **CivicDesk Assistant** (`server/routes/assistant.js`, floating chat button
   in the UI) — answers citizen questions ("how do I report a pothole?",
   "what's still open near me?") using live ticket data as context. Falls
   back to canned answers without a key.

To enable real AI behavior:
```bash
cd server
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env
npm install   # pulls in @anthropic-ai/sdk
npm run dev
```

## Swapping in a different AI model
Both AI layers go through `server/utils/anthropicClient.js`. To use a
different model or provider, change `AI_MODEL` there or swap the client —
`classify.js` and `assistant.js` only depend on the `{category, confidence}`
and `{reply}` contracts respectively.

## Notes for production
- Add authentication (the demo uses a hardcoded `"You"` user).
- Move uploaded photos to object storage (S3/GCS) instead of local disk.
- Add rate limiting / spam detection on report submission.
- Real predictive insight would run a time-series model over historical
  ticket data rather than the current simple "top category" heuristic.

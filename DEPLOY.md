# FMDS production checklist

## 1. Environment
- Copy `backend/.env.example` -> `backend/.env` (local Node runs).
- Copy root `.env.example` -> `.env` (Docker Compose).
- Set real `MONGODB_URI` / `JWT_SECRET` / `CLIENT_ORIGIN`.
- Frontend same-host API base: `REACT_APP_API_BASE_URL=/api` (Docker build sets this).
- Never commit `.env` files.

## 2. Docker deploy (recommended)
```bash
# From repo root
cp .env.example .env
# Edit JWT_SECRET and CLIENT_ORIGIN

docker compose up -d --build
```

This starts:
- MongoDB on `27017`
- App on `PORT` (default `5000`) serving API + SPA

Verify: `curl http://localhost:5000/api/health`

Useful commands:
```bash
docker compose logs -f app
docker compose down
```

## 3. Local Node single-host deploy
```bash
npm run install:all
npm run build
# backend/.env: NODE_ENV=production, SERVE_CLIENT=true
npm start
```

Express serves:
- API under `/api/*`
- Uploads under `/uploads/*`
- Frontend SPA from `frontend/build`

## 4. Split hosting
```bash
cd frontend && npm ci && npm run build
# Deploy frontend/build to static host

cd backend && npm ci && npm start
# SERVE_CLIENT=false and CLIENT_ORIGIN=https://your-frontend
```

## 5. Verify
- Confirm nothing else is bound to your chosen `PORT` (Laragon often uses `5000`).
- `GET /api/health` returns `{ "status": "ok", "db": "connected" }`
- Login works; protected routes still load on refresh
- CORS only allows your frontend origin(s)

## 6. Ops notes
- Prefer managed MongoDB (Atlas) in cloud; point `MONGODB_URI` at it and drop the compose `mongo` service if needed.
- Rotate `JWT_SECRET` if it was ever shared or committed.
- Rate limits: `RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_MAX`
- Uploads persist via the `uploads_data` Docker volume.
- CRA frontend `npm audit` noise remains until a bundler migration.
- GitHub Actions CI builds the frontend and syntax-checks the backend on push/PR.

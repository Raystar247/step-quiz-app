# STEPQ Backend

Local backend for STEPQ (Express + TypeScript + Prisma)

## Requirements
- Node.js 18+ / npm
- PostgreSQL (as configured in `.env`)

## Setup

1. Copy `.env` from `.env.example` (if present) and set `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

```bash
cd backend
npm install --legacy-peer-deps
```

3. Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Run in development:

```bash
npm run dev
```

## Tests

Run unit and integration tests:

```bash
npm run test
```

## Swagger

Open `http://localhost:3000/docs` when the server is running to see Swagger UI (serves `docs/openapi.yaml`).

## API examples
See `docs/requests.md` for curl and Postman examples.

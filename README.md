Dockerized development and production for this monorepo

Prerequisites
- Docker and Docker Compose (v2) installed
- Node 20 LTS for local development (optional)

Environment
- Put runtime secrets and connection strings into a root `.env` file (do NOT commit it).
- Compose files use `env_file: .env` to inject variables.

Development
- Start development environment (hot-reload):

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Notes:
  - Backend runs `npm run dev` inside the container (nodemon/ts-node), with source mounted from `./backend`.
  - Frontend runs Vite dev server (`npm run dev`) with source mounted from `./client`.
  - Postgres data is persisted in a Docker volume `postgres_data`.

Production
- Build and run production images:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

- Notes:
  - Frontend is built in a multi-stage Dockerfile and served by Nginx.
  - Backend is built in a multi-stage Dockerfile and runs the compiled `dist` output.
  - On backend container startup an entrypoint runs `npx prisma migrate deploy` to apply migrations.

Prisma behavior
- During backend image build `npm run prisma:generate` is executed to generate the Prisma client.
- On container start the entrypoint runs `npx prisma migrate deploy` (if `DATABASE_URL` is set) before starting the app.

Environment variables
- Provide `.env` in the repository root with keys such as:

```
DATABASE_URL=postgresql://user:password@postgres:5432/dbname
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname
```

Security
- Do not commit `.env` to git. The root `.dockerignore` excludes `.env` by default.

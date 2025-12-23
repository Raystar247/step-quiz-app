#!/bin/sh
set -e

echo "Starting container entrypoint"

if [ -n "${DATABASE_URL:-}" ]; then
  echo "Running Prisma migrations (prisma migrate deploy)..."
  npx prisma migrate deploy
else
  echo "DATABASE_URL is not set; skipping migrations"
fi

echo "Starting application: $@"
exec "$@"

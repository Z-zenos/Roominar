#!/bin/bash
set -e

echo "🔧 Installing backend Python dependencies with Poetry..."
poetry install

echo "📦 Activating virtual environment..."
source .venv/bin/activate

echo "📁 Installing frontend dependencies..."
cd frontend
npm install

echo "🛠️ Running database migrations..."
cd ..
alembic upgrade heads

echo "🚀 Starting backend server on port 2001..."
poetry run uvicorn backend.main:app --reload --host 0.0.0.0 --port 2001 &

echo "📄 Generating OpenAPI schema and frontend API client..."
python -c "from backend.main import app; import json; print(json.dumps(app.openapi()))" > openapi.json

cd frontend
pnpm run generate-api-local -y -- ../openapi.json || echo "❗ generate-api-local failed (not fatal)"
npx eslint --no-ignore --fix src/lib/api/generated || echo "❗ ESLint fix failed (not fatal)"

echo "🏗️ Building frontend on port 2002..."
npx next build --no-lint

echo "🌐 Starting frontend server on port 2002..."
exec npx next start -p 2002

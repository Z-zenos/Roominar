#!/bin/sh

poetry install
source .venv/bin/activate


cd frontend
npm install

cd ..
alembic upgrade heads
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 &

(python -c "from backend.main import app; import json; print(json.dumps(app.openapi()))" > openapi.json && cd frontend && (pnpm run generate-api-local -y -- ../openapi.json && npx eslint --no-ignore --fix src/lib/api/generated || echo 0) && npx next build --no-lint)



tail -f /dev/null

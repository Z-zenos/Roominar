#!/bin/sh

poetry install
source .venv/bin/activate


cd frontend
npm install

cd ..
alembic upgrade heads
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 &

(python -c "from backend.main import app; import json; print(json.dumps(app.openapi()))" > openapi.json && cd frontend && (pnpm run generate-api-local -y -- ../openapi.json && npx eslint --no-ignore --fix src/lib/api/generated || echo 0) && npx next build --no-lint)

if [ $? -eq 0 ]; then
    curl -X POST -H 'Content-type: application/json' --data '{"text":"AK-AZM has been deployed the latest version cc <@U06E0EBB37Y>"}' https://hooks.slack.com/services/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
    cd frontend && npm start &
else
    curl -X POST -H 'Content-type: application/json' --data '{"text":"Build error :hetcuu: cc ~<@U048BF6KH62>~"}' https://hooks.slack.com/services/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
    echo "Build error" &
fi

tail -f /dev/null

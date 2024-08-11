#!/bin/sh
set -e

cd /workspace
alembic upgrade heads

cd /workspace/frontend
pnpm start > /proc/1/fd/1 2<&1 < /proc/1/fd/1 &

cd /workspace
python3 -m uvicorn backend.main:app --host=0.0.0.0

FROM python:3.11-slim AS python-base

LABEL version="1.0" maintainer="hoanganhtuanbk2001@gmail.com" description="Roominar"

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.4.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/workspace" \
    VENV_PATH="/workspace/.venv"

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

FROM python-base AS poetry-base
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    curl

RUN curl -sSL https://install.python-poetry.org | python

FROM poetry-base AS builder-base
RUN apt-get update && \
    apt-get install --no-install-recommends -y  \
    build-essential \
    libpq-dev

WORKDIR $PYSETUP_PATH
COPY poetry.lock pyproject.toml README.md ./

RUN poetry install --only main

FROM python-base AS development

COPY --from=poetry-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base /workspace/.venv /workspace/.venv

RUN apt-get update && apt-get install --no-install-recommends -y \
    procps libpq-dev build-essential git bash curl tar sudo default-jre nodejs npm && \
    curl -fsSL https://get.pnpm.io/v6.js | node - add --global pnpm && \
    useradd -m -d /home/app -s /bin/bash app && \
    echo '%app ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers && \
    curl -sS https://starship.rs/install.sh | sh -s -- --yes && \
    echo 'eval "$(starship init bash)"' >>/home/app/.bashrc && \
    rm -rf /var/lib/apt/lists/*

USER app

WORKDIR /workspace

COPY . .


EXPOSE 8000 3000

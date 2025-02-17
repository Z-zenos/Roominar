FROM python:3.11-slim as python-base

LABEL version="1.0" maintainer="hoanganhtuanbk2001@gmail.com" description="Roominar"

# Python environment setup
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

# Stage for installing Poetry
FROM python-base as poetry-base
RUN apt-get update && apt-get install --no-install-recommends -y curl
RUN curl -sSL https://install.python-poetry.org | python

# Stage for building Python dependencies
FROM poetry-base as builder-base
RUN apt-get update && apt-get install --no-install-recommends -y build-essential libpq-dev
WORKDIR $PYSETUP_PATH
COPY poetry.lock pyproject.toml README.md ./
RUN poetry install --only main

# Stage for installing Node.js and pnpm
FROM node:20.18.3-slim as node-base
RUN npm install -g pnpm@10

# Development stage
FROM python-base as development

# Copy Python environment
COPY --from=poetry-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $VENV_PATH $VENV_PATH

# Install additional dependencies
RUN apt-get update && apt-get install --no-install-recommends -y \
    procps libpq-dev build-essential git bash curl tar sudo default-jre && \
    useradd -m -d /home/app -s /bin/bash app && \
    echo '%app ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    curl -sS https://starship.rs/install.sh | sh -s -- --yes && \
    echo 'eval "$(starship init bash)"' >> /home/app/.bashrc && \
    rm -rf /var/lib/apt/lists/*

# Copy Node.js and pnpm from node-base
COPY --from=node-base /usr/local/bin/node /usr/local/bin/node
COPY --from=node-base /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node-base /usr/local/bin/pnpm /usr/local/bin/pnpm

# # nvm environment variables
# ENV NVM_DIR /usr/local/nvm
# ENV NODE_VERSION 4.4.7

# # install nvm
# # https://github.com/creationix/nvm#install-script
# RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

# # install node and npm
# RUN source $NVM_DIR/nvm.sh \
#     && nvm install $NODE_VERSION \
#     && nvm alias default $NODE_VERSION \
#     && nvm use default

USER app
WORKDIR /workspace

# Copy project files
COPY . .

EXPOSE 8000 3000

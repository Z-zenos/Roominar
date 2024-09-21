FROM python:3.11-slim as python-base

LABEL version="1.0" maintainer="hoanganhtuanbk2001@gmail.com" description="Roominar"

# python
ENV PYTHONUNBUFFERED=1 \
    # prevents python creating .pyc files
    PYTHONDONTWRITEBYTECODE=1 \
    # pip
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    # poetry
    # https://python-poetry.org/docs/configuration/#using-environment-variables
    POETRY_VERSION=1.4.1 \
    # make poetry install to this location
    POETRY_HOME="/opt/poetry" \
    # make poetry create the virtual environment in the project's root
    # it gets named `.venv`
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    # do not ask any interactive question
    POETRY_NO_INTERACTION=1 \
    # paths
    # this is where our requirements + virtual environment will live
    PYSETUP_PATH="/workspace" \
    VENV_PATH="/workspace/.venv"

# prepend poetry and venv to path
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

FROM python-base as poetry-base
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    # deps for installing poetry
    curl

# install poetry - respects $POETRY_VERSION & $POETRY_HOME
RUN curl -sSL https://install.python-poetry.org | python

# `builder-base` stage is used to build deps + create our virtual environment
FROM poetry-base as builder-base
RUN apt-get update && \
    apt-get install --no-install-recommends -y  \
    # deps for building python deps
    build-essential \
    libpq-dev

# copy project requirement files here to ensure they will be cached.
WORKDIR $PYSETUP_PATH
COPY poetry.lock pyproject.toml README.md ./

# install runtime deps - uses $POETRY_VIRTUALENVS_IN_PROJECT internally
RUN poetry install --only main

# `development` image is used during development / testing
FROM python-base as development

# copy in our built poetry + venv
COPY --from=poetry-base $POETRY_HOME $POETRY_HOME

RUN apt-get update && apt-get install --no-install-recommends -y \
    libpq-dev build-essential git bash curl tar sudo default-jre nodejs npm && \
    curl -fsSL https://get.pnpm.io/v6.js | node - add --global pnpm && \
    useradd -m -d /home/app -s /bin/bash app && \
    echo '%app ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers && \
    curl -sS https://starship.rs/install.sh | sh -s -- --yes && \
    echo 'eval "$(starship init bash)"' >>/home/app/.bashrc && \
    rm -rf /var/lib/apt/lists/*

USER app

# will become mountpoint of our code
WORKDIR /workspace

# Copy files from host into image
COPY . .


EXPOSE 8000 3000

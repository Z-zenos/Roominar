# Roominar template

### FastAPI - PostgreSQL - Next.js 14 (CSR)

## Setup environment

### 1. Create .env files

- After successfully cloning, open project in vscode. Create .env files and copy content from backend/.env.example
  file to file just created:

  - /backend/.env

  ```bash
   cat backend/.env.example | tee backend/.env
  ```

### 2. Run docker and install backend packages

- Use keyboard shortcut `Ctrl + Shift + P` -> type: `Dev Containers: Open Folder in Container` and enter. This command
  will reopen vscode, run project in Dev Container Environment and install all necessary packages for backend and frontend
  environment. Wait 4-5 minutes for completely installing.

### 3. Test run backend.

- In root folder, run backend:

  ```bash
    uvicorn backend.main:app --reload
  ```

- Open browser and type `http://127.0.0.1:8000/docs`. If the Swagger docs screen appears, it means it has been run
  successfully.

### 4. Migrate model to Postgresql.

- In root folder, run command:

  ```bash
    alembic upgrade heads
  ```

- To migrate new content in model to database

  - Check to see if the latest code has been pulled?

    ```bash
      git pull origin dev
    ```

  - Update to the newest version

    ```bash
      alembic upgrade heads
    ```

  - Migrating the newly changed content in the model into the database:

    ```bash
      alembic revision --autogenerate -m "Comment for change"
    ```

### 5. Check PostgreSQL connection

- Open DBeaver -> New Database Connection -> Choose PostgreSQL
- Fill Host, Database, Username, Password, Port input using info in .env file
- Test connection. If success then finish.

- **NOTE**: In case there is already a database running on port 5432, check the ports tab next to the terminal tab, find
  port 5432 and forwarded address, for example: localhost:33412. Get port 33412 and replace port 5432 in DBeaver.

### 6. Create .env for frontend

- In frontend folder -> copy .env.example to .env

### 7. Generate API for frontend

- In frontend folder -> Run:

  ```bash
    pnpm generate-api-deploy

    or

    pnpm generate-api-local
  ```

### 8. Test run frontend.

- In frontend folder
  ```bash
    pnpm dev
  ```
# Roominar

# Install Dependency

- pip install -r requirements.txt

### Update Requirement File

- pip freeze > requirements.txt

# Virtual Environment

### Create Environment

- python -m venv .venv

### Activate Environment

- source backend/.venv/bin/activate
- source .venv/bin/activate

### De-Activate Environment

- deactivate

# Start API Server

- uvicorn app.main:app --reload

# Alembic

## Initial DB + Create Admin

- alembic upgrade head
- python3 -m app.initial_data

### Create a new migration

- alembic revision --autogenerate -m "description of changes"

### Apply Pending Migrations

- alembic upgrade head

### Downgrade Migration

- alembic downgrade -1

### Show Current Database Version

- alembic current

### List All Revisions

alembic history

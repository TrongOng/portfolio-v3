# Project Backend Overview

## FastAPI + PostgreSQL

### Description

This section of the project comprises the backend for my portfolio website. It utilizes FastAPI as the web framework and PostgreSQL as the database. The backend enables authorized users to log into the Admin Portal and manage messages received via the Contact Me form.

### How to Start

#### 1. Navigate to Project Directory

```bash
cd portfolio-v3/backend
```

#### 2. Create and Activate Virtual Environment

```bash
# Create Virtual Environment
python3 -m venv .venv

# Activate Virtual Environment (Linux/Mac)
source .venv/bin/activate

# Activate Virtual Environment (Windows)
.venv\Scripts\activate

# To Deactive Virtual Environment
deactivate
```

#### 3. Install Dependencies

```bash
# Install the current requirements
pip3 install -r requirements.txt

# If you update dependencies
pip3 freeze > requirements.txt
```

#### 4. Environment Variable Configurations

```bash
# Review and configure variables
backend/core/config.py
# Create a `.env` file and set neccessary environment
```

#### 5. PostgreSQL Management

```bash
For ease of use and efficient database management, it is recommended to use pgAdmin4.

Using pgAdmin4 alongside your FatAPI and PostgreSQL setup provides a graphical interface that simiplifes database administration, making it easier to visualize and manage your data effectively.
```

### PostgreSQL Database + Alembic

#### Create migration

```bash
alembic revision --autogenerate -m "init db"
```

#### Initialize Database and Create Initial Superuser

```bash
python3 -m app.initial_data
alembic upgrade head
```

#### To Apply Pending Migrations

```bash
alembic upgrade head
```

#### Downgrade Migration

```bash
alembic downgrade -1
```

#### Show Current Database Version

```bash
alembic current
```

#### List All Revisions

```bash
alembic history
```

# Start API Server

- uvicorn app.main:app --reload

View the FastAPI Swagger UI via URL link with your browser

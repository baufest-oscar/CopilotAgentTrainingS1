# Backend JWT Authentication API

FastAPI application that implements JWT-based authentication with token generation and refresh.

## Features

- **Login endpoint**: Authenticate with username and password to receive JWT access and refresh tokens.
- **Refresh endpoint**: Exchange a valid refresh token for a new pair of tokens.
- Access tokens expire in **300 seconds** (5 minutes).
- Refresh tokens expire in **3600 seconds** (1 hour).
- Passwords are hashed using `passlib[bcrypt]`.

## Default Credentials

| Username | Password  |
|----------|-----------|
| `admin`  | `admin123`|

## API Endpoints

### `POST /token`

Authenticate and obtain tokens.

**Request body (JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "<jwt_access_token>",
  "refresh_token": "<jwt_refresh_token>",
  "token_type": "bearer",
  "expires_in": 300
}
```

### `POST /token/refresh`

Refresh the access token using a valid refresh token.

**Request body (JSON):**
```json
{
  "refresh_token": "<jwt_refresh_token>"
}
```

**Response:**
```json
{
  "access_token": "<new_jwt_access_token>",
  "refresh_token": "<new_jwt_refresh_token>",
  "token_type": "bearer",
  "expires_in": 300
}
```

## Interactive Documentation

Once the application is running, visit:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
- Alternatively, [Python 3.11+](https://www.python.org/) and [Poetry](https://python-poetry.org/) for local development.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | `supersecretkey_change_in_production` | Secret key used to sign JWT tokens. **Always override this in production.** |

## Running with Docker Compose

```bash
cd backend
SECRET_KEY=your_strong_secret_here docker compose up --build
```

The API will be available at `http://localhost:8000`.

To stop the service:

```bash
docker compose down
```

## Running Locally with Poetry

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

## Example Usage with curl

### Login

```bash
curl -X POST http://localhost:8000/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Refresh Token

```bash
curl -X POST http://localhost:8000/token/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<your_refresh_token>"}'
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `fastapi` | Web framework |
| `uvicorn` | ASGI server |
| `python-jose[cryptography]` | JWT encoding/decoding |
| `passlib[bcrypt]` | Password hashing |
| `bcrypt>=3.2,<4.0` | Bcrypt backend (compatible with passlib 1.7.x) |
| `python-multipart` | Form data parsing |

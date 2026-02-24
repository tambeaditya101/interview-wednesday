# MERN Weather Application

Production-ready weather application built with MERN architecture.

## Tech Stack

- **Frontend:** React (Vite), Axios
- **Backend:** Node.js, Express, Axios
- **Database:** MongoDB (Mongoose)
- **External Provider:** OpenWeatherMap API

## Architecture

### Backend

- MVC + service layer separation
- `controllers/` handle request/response only
- `services/` contain business and external API logic
- `models/` define Mongo schemas
- `routes/` define versioned API endpoints
- `config/` centralizes environment and DB bootstrapping

### Frontend

- UI components in `components/`
- API communication encapsulated in `services/`
- View logic in custom hook `hooks/useWeather.js`

## Environment Setup

### 1) Backend

Copy env template:

```bash
cp backend/.env.example backend/.env
```

Set the values in `backend/.env`:

- `MONGODB_URI`
- `OPENWEATHER_API_KEY`
- `CLIENT_URL` (for backward compatibility)
- `ALLOWED_ORIGINS` (comma-separated list of allowed frontend origins, e.g., `http://localhost:5173,https://your-app.vercel.app`)

### 2) Frontend

Copy env template:

```bash
cp frontend/.env.example frontend/.env
```

`frontend/.env` should include:

- `VITE_API_BASE_URL=http://localhost:5000/api/v1`

## Installation

```bash
npm run install:all
```

## Run Locally

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

## API Endpoints

- `GET /api/v1/health`
- `GET /api/v1/weather?city=London`
- `GET /api/v1/weather/recent?page=1&limit=10`
- `GET /api/v1/weather/suggestions?q=lon&limit=5`

## Notes

- OpenWeatherMap API key remains backend-only and is never exposed to client code.
- Recent searched cities are persisted in MongoDB.
- Recent searched cities are unique per city and reordered on repeated search.
- Recent searches support pagination (`page`, `limit`) with response pagination metadata.

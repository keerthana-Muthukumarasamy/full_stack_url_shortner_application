# Easy URL Shortener

A simple full-stack URL shortening application that converts long URLs into short, shareable URLs and provides click tracking and analytics.

## Features

- Create short URLs from valid URLs
- Validate URL input
- Redirect short URLs to their original URLs
- Increment click counts after redirects
- Record individual click events
- View recent shortened URLs
- Copy short URLs
- View analytics for individual URLs
- Statistics chart for URL clicks and URL creations over time
- Pagination for URL history

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Recharts

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

## Project Structure

```text
url_shortner/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── seed/
│   └── seed_data.py
├── screenshots/
├── test_results.md
└── README.md
```

## Prerequisites

- Python 3.x
- Node.js
- npm

## Running the Backend

```bash
cd backend
```

Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

## Running the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Loading Seed Data

The project includes 10 preloaded shortened URLs with different creation dates, varying click counts, click events for analytics, and enough activity to populate the statistics charts.

From the project root:

```bash
python seed/seed_data.py
```

The seed script uses the same SQLite database as the backend:

```text
backend/url_shortener.db
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/urls` | Create a short URL |
| GET | `/api/urls` | Return recent URLs |
| GET | `/api/analytics` | Return overall statistics |
| GET | `/api/urls/{id}/analytics` | Return analytics for a URL |
| GET | `/{shortCode}` | Redirect to the original URL and increment clicks |

## Testing

Manual functional testing was performed for the required application features.

### Backend
- URL creation
- URL validation
- Redirect behavior
- Click count increment

### Frontend
- Main page rendering
- URL validation
- Recent URLs table rendering

### Analytics and Statistics
- Individual URL analytics
- Statistics chart
- Pagination

Detailed test results are available in:

```text
test_results.md
```

Testing screenshots are available in:

```text
screenshots/
```

## Test Summary

| Category | Tests | Passed | Failed |
|---|---:|---:|---:|
| Backend | 4 | 4 | 0 |
| Frontend | 3 | 3 | 0 |
| Analytics & Statistics | 3 | 3 | 0 |
| **Total** | **10** | **10** | **0** |

## Development Time

Approximately **2 days** were spent on development:
- **Day 1:** Backend development and API implementation
- **Day 2:** Frontend development, UI integration, analytics, testing, and responsive improvements

## Assumptions and Tradeoffs

- SQLite is used for simplicity and local development.
- Short codes are randomly generated and limited to 6 characters.
- Click events are stored separately to support click-over-time analytics.
- Authentication and user-specific URL management are outside the scope of this project.
- The application is designed as a local/demo implementation.
- API URLs are configured for local development rather than production deployment.
- Seed data is provided to demonstrate URL history, click activity, and statistics.

## Screenshots

The `screenshots/` directory contains evidence of:

- URL creation
- URL validation
- Redirect behavior
- Click count increment
- Main frontend
- Recent URLs table
- Individual URL analytics
- Overall statistics
- Backend API

# Mutual Funds Performance Prediction

A full-stack web application for tracking **real** mutual fund NAV performance, calculating SIP
(Systematic Investment Plan) returns, forecasting future NAV using multiple machine learning
models, and asking an AI assistant to explain the results in plain language.

## Features

- **Live NAV Data** — historical NAV data is fetched in real time from AMFI's public data feed
  via [mfapi.in](https://www.mfapi.in), for real Indian mutual fund schemes across 5 major AMCs.
  No sample/static CSVs.
- **AI Fund Assistant** — a chat panel backed by a real LLM call (OpenAI or Anthropic). It's
  given the fund's actual fetched NAV stats, model accuracy, and forecast as context, and
  answers investor questions from that data — no hardcoded/templated responses.
- **SIP Calculator** — projects invested amount, future value, and annualized return for
  1/3/5-year horizons based on a fund's real historical CAGR.
- **NAV Trend Visualization** — actual vs predicted NAV charts using Recharts.
- **Multi-Model NAV Forecasting** — compares three forecasting approaches side by side:
  - Linear Regression (Weka)
  - Random Forest (Weka)
  - Drift-based forecasting (baseline)
- **Algorithm Comparison Table & Leaderboard** — evaluates model accuracy (MAPE-based) on a
  held-out test split of real historical NAV data, with a star rating per model, driven entirely
  by the live response (no static numbers).
- **Risk & Volatility Stats** — mean NAV, standard deviation, and volatility-based risk
  classification (Low/Medium/High/Very High).
- **PDF Report Export** — downloadable performance report via jsPDF + html2canvas.
- **Centralized error handling** — API failures surface as a clear in-app banner instead of
  silently failing or showing stale/zeroed data.

## Tech Stack

**Frontend:** React (Vite), Axios, Recharts, jsPDF, html2canvas
**Backend:** Java, Spring Boot, Weka (machine learning library)
**Data:** Live historical NAV data from AMFI via [mfapi.in](https://www.mfapi.in) (no CSVs)
**AI:** OpenAI or Anthropic Chat/Messages API (configurable), called server-side

## Project Structure

```
MutualFundsPerformance/
├── backend/     # Spring Boot REST API (live fund data, SIP calc, ML predictions, AI assistant)
└── frontend/    # React + Vite dashboard UI
```

## Getting Started

### Prerequisites
- Java 17+ and Maven
- Node.js 18+ and npm
- Internet access (the backend calls mfapi.in for NAV data, and optionally an LLM API)

### Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

To enable the AI assistant, set an API key before starting the backend:
```bash
# OpenAI (default provider)
export AI_API_KEY=sk-...
export AI_PROVIDER=openai
export AI_MODEL=gpt-4o-mini

# OR Anthropic
export AI_API_KEY=sk-ant-...
export AI_PROVIDER=anthropic
export AI_MODEL=claude-sonnet-4-5
```
Without a key, every other feature still works — the assistant just replies with a short
setup message explaining how to enable it, instead of failing silently or faking a response.

### Frontend
```bash
cd frontend
cp .env.example .env   # adjust VITE_API_BASE_URL if needed
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fund/amc-list` | List of available AMCs |
| GET | `/api/fund/fund-list?name={amc}` | Real fund schemes under a given AMC, live from AMFI |
| GET | `/api/fund/by-fund?fund={schemeCode}` | Real historical NAV data, stats, and algorithm accuracy comparison |
| GET | `/api/fund/predict?fund={schemeCode}` | 6-month forward NAV forecast across Drift/Linear/RF models |
| POST | `/api/fund/ai-assistant` | Real LLM call: `{ question, context }` → `{ answer }` |

## How the Live Data Works

- `GET /mf` on mfapi.in returns AMFI's full scheme master list, which the backend filters down
  to a short list of currently active, growth-plan equity schemes per AMC (cached in memory for
  a few hours to avoid re-fetching a ~30k-row list on every request).
- `GET /mf/{schemeCode}` returns full daily NAV history for a scheme; the backend resamples this
  to one NAV point per calendar month over the last 3 years, which is what feeds the charts,
  statistics, and ML models.
- If mfapi.in is briefly unreachable, the backend serves the last successfully cached response
  rather than failing outright; if there's no cache yet, it returns a clear error instead of
  quietly returning fake/zeroed data.

## Future Improvements

- Add authentication for personalized SIP tracking and saved watchlists
- Expand ML model comparison with more sophisticated time-series techniques (ARIMA, LSTM)
- Support benchmark/index comparison alongside individual fund forecasts

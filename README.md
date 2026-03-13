# TrapEye — AI-Powered Cybersecurity Platform

<div align="center">
  <h3>🛡️ Detect Phishing · Fake News · Deepfakes · Misinformation</h3>
  <p>Powered by Machine Learning + Gemini Multimodal AI</p>
</div>

---

## Overview

**TrapEye** is a full-stack AI cybersecurity platform that uses a hybrid of traditional machine learning and Google Gemini multimodal AI to detect digital threats across multiple vectors:

| Module | Purpose | Tech |
|--------|---------|------|
| URL Scanner | Phishing URL detection | Random Forest, 20+ feature heuristics |
| Fake News Detector | Article credibility analysis | TF-IDF, Gemini AI reasoning |
| Deepfake Detector | AI-generated media detection | Heuristic analysis + Gemini Vision |
| News Monitor | Real-time misinformation surveillance | NewsAPI + ML scoring |
| Dashboard | Threat intelligence & analytics | Recharts, PostgreSQL |

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TailwindCSS** (custom cybersecurity theme)
- **Framer Motion** (animations)
- **Recharts** (threat charts)
- **Axios** (API client)

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** + **PostgreSQL**
- **Scikit-learn** (ML models)
- **Google Gemini API** (multimodal AI)
- **NewsAPI** (real-time news)

---

## Quick Start

### Option 1: One-click (Windows)
```bash
start.bat
```

### Option 2: Manual Setup

#### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (optional — app works without DB using mock data)

#### Step 1: Train ML Models
```bash
cd ml_models
python generate_models.py
```

#### Step 2: Start Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

#### Step 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

#### URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs

---

## Environment Variables

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEWS_API_KEY=your_newsapi_key_here
DATABASE_URL=postgresql://user:pass@localhost:5432/trapeye_db
```

> **Note**: The platform works without a database using mock data. API keys enhance functionality but are not required for basic operation.

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## API Reference

### Phishing Detection
```http
POST /api/phishing/analyze
Content-Type: application/json

{"url": "https://suspicious-site.com"}
```

### Fake News Analysis
```http
POST /api/fakenews/analyze
Content-Type: application/json

{
  "headline": "SHOCKING: Miracle cure found!",
  "article_text": "...",
  "source_url": "..."
}
```

### Deepfake Detection
```http
POST /api/deepfake/analyze
Content-Type: multipart/form-data
file: <image or video file>
```

### News Feed
```http
GET /api/news/feed?category=general&limit=20
```

### Dashboard Stats
```http
GET /api/dashboard/stats
```

---

## Feature Details

### URL Phishing Detection
Extracts 20+ features including:
- URL length, dot count, subdomain depth
- IP address usage, HTTPS status
- Domain entropy (randomness)
- Suspicious TLD detection (.xyz, .tk, .ml)
- Brand impersonation check
- PhishTank dataset cross-reference
- Phishing keyword detection

### Fake News Detection
- **ML Layer**: TF-IDF vectorization + Logistic Regression
- **Language Analysis**: Sensationalism, clickbait, emotional language patterns
- **Source Credibility**: Pre-scored database of 30+ news sources
- **Gemini Layer**: Contextual reasoning and fact-check analysis

### Deepfake Detection
- **Heuristic Analysis**: JPEG quality, compression artifacts
- **Gemini Vision**: Facial feature analysis, lighting consistency
- Supports: JPEG, PNG, WebP, MP4, WebM (up to 50MB)

### News Monitor
- Fetches from NewsAPI across 6 categories
- Auto-scores every article for credibility
- Flags suspicious articles for alerts
- Auto-refresh every 10 minutes

---

## Project Structure

```
trapeyeX/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config/settings.py   # Environment configuration
│   ├── routes/              # API endpoints
│   │   ├── phishing.py
│   │   ├── fakenews.py
│   │   ├── deepfake.py
│   │   ├── news_monitor.py
│   │   └── dashboard.py
│   ├── services/            # Business logic
│   │   ├── phishing_service.py
│   │   ├── fakenews_service.py
│   │   ├── deepfake_service.py
│   │   ├── news_service.py
│   │   └── gemini_service.py
│   ├── models/              # DB models & schemas
│   │   ├── database.py
│   │   └── schemas.py
│   └── utils/               # Helpers
│       ├── feature_extractor.py
│       └── ml_utils.py
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── scanner/         # URL scanner
│   │   ├── fakenews/        # News analyzer
│   │   ├── deepfake/        # Deepfake detector
│   │   └── dashboard/       # Threat dashboard
│   ├── components/          # Shared components
│   │   ├── Navbar.tsx
│   │   ├── RiskMeter.tsx    # Circular risk gauge
│   │   └── ThreatBadge.tsx
│   └── lib/api.ts           # API client
├── ml_models/
│   └── generate_models.py   # Train & save ML models
├── start.bat                # One-click launcher
└── README.md
```

---

## Getting API Keys

### Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to `backend/.env`

### News API
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free key
3. Add to `backend/.env`

---

## Disclaimer

TrapEye is designed as an AI-assisted threat awareness tool. Results should be used as probabilistic indicators and not as definitive security verdicts. Always apply human judgment for critical security decisions.

---

*Built with Google Gemini AI, Scikit-learn, FastAPI, and Next.js*

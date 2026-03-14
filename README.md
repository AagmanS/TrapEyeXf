# TrapEye — AI-Powered Cybersecurity Ecosystem

<div align="center">
  <h3>🛡️ Detect Phishing · Fake News · Deepfakes · Scams · Misinformation</h3>
  <p>Powered by Machine Learning + Google Gemini Multimodal AI</p>

  ![TrapEye Banner](https://img.shields.io/badge/TrapEye-AI%20Cybersecurity-8bfb25?style=for-the-badge&logo=shield&logoColor=black)
  ![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)
  ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)
  ![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google)
</div>

---

## Overview

**TrapEye** is a full-stack AI cybersecurity ecosystem that uses a hybrid of traditional machine learning and Google Gemini multimodal AI to detect digital threats across multiple vectors — on the **web**, via **browser extensions**, **WhatsApp**, and a dedicated **mobile app**.

| Module | Purpose | Tech |
|--------|---------|------|
| **TrapEyeX Web Platform** | Full threat intelligence dashboard | Next.js 14, FastAPI, Gemini AI |
| **Chrome Extension (LinkLens)** | In-browser phishing link scanning | Manifest V3, TrapEye API |
| **WhatsApp Bot (LinkLens)** | Instant URL scanning via WhatsApp | Twilio / WA API, Python |
| **Sentinelix Mobile App** | Comprehensive mobile cybersecurity guardian | React Native / Flutter |

---

## Applications Built During This Project

### 1. TrapEyeX — Web Platform

The flagship web dashboard featuring URL Scanner, Fake News Detector, Deepfake Analyzer, Threat Sandbox, and Live Intelligence Dashboard.

> Full-stack Next.js + FastAPI application with Gemini AI integration.

---

### 2. Sentinelix — Mobile Cybersecurity App

An AI-powered mobile security guardian protecting users from phishing, scams, QR fraud, job scams, and credential breaches in real-time.

**Splash & Onboarding**

<img src="grme/WhatsApp Image 2026-03-14 at 06.24.51.jpeg" width="300" alt="Sentinelix Splash Screen"/>

**Main Dashboard — Device Protection Score**

<img src="grme/WhatsApp Image 2026-03-14 at 06.24.52.jpeg" width="300" alt="Sentinelix Dashboard"/>

**QR Shield — AI Threat Interception for QR Codes**

<img src="grme/WhatsApp Image 2026-03-14 at 06.24.52 (1).jpeg" width="300" alt="QR Shield"/>

**Credential Guard — Email Breach Checker**

<img src="grme/WhatsApp Image 2026-03-14 at 06.24.52 (2).jpeg" width="300" alt="Credential Guard - Email Breach"/>

**Credential Guard — Password Leak Checker**

<img src="grme/WhatsApp Image 2026-03-14 at 06.24.53.jpeg" width="300" alt="Credential Guard - Password Leak"/>

**Threat Radar — Real-Time India Feed**

<img src="grme/WhatsApp Image 2026-03-14 at 06.24.53 (1).jpeg" width="300" alt="Threat Radar"/>

**Job Shield — AI Recruitment Scam Analyzer**

<img src="grme/WhatsApp Image 2026-03-14 at 06.24.54.jpeg" width="300" alt="Job Shield"/>

**Guardian Setup — Family Emergency Alerts**

<img src="grme/WhatsApp Image 2026-03-14 at 07.20.18.jpeg" width="300" alt="Guardian Setup"/>

**QR Scam Scanner — Live Camera Mode**

<img src="grme/WhatsApp Image 2026-03-14 at 07.20.18 (1).jpeg" width="300" alt="QR Scanner"/>

**All Tools Overview**

<img src="grme/WhatsApp Image 2026-03-14 at 07.20.19.jpeg" width="300" alt="All Tools"/>

---

### 3. Chrome Extension (LinkLens)

A browser extension that scans any link in real-time as you hover or click, flagging phishing attempts directly in your browser.

<img src="chrome-extension/extUI.png" width="400" alt="LinkLens Chrome Extension UI"/>

**Key Features:**
- One-click URL scanning via TrapEye API
- Visual risk indicator (green/yellow/red)
- Works on all websites in real-time
- Manifest V3 compliant

---

### 4. LinkLens WhatsApp Bot

Send any suspicious URL to our WhatsApp bot and get an instant threat analysis report — no app download required.

**Key Features:**
- Powered by Twilio/WhatsApp Business API
- Returns risk level, phishing probability, and reasons
- Ideal for non-tech-savvy users and senior citizens

---

## TrapEyeX Web Platform — Module Details

### URL Phishing Scanner
Extracts **20+ features** including:
- URL length, dot count, subdomain depth
- IP address usage, HTTPS status
- Domain entropy (randomness)
- Suspicious TLD detection (`.xyz`, `.tk`, `.ml`)
- Brand impersonation check
- Phishing keyword detection

### Fake News Detector
- **ML Layer**: TF-IDF vectorization + Logistic Regression
- **Language Analysis**: Sensationalism, clickbait, emotional language patterns
- **Source Credibility**: Pre-scored database of 30+ news sources
- **Gemini Layer**: Contextual reasoning and fact-check analysis

### Deepfake Detector
- **Heuristic Analysis**: JPEG quality, compression artifacts
- **Gemini Vision**: Facial feature analysis, lighting consistency
- Supports: JPEG, PNG, WebP, MP4, WebM (up to 50MB)

### Threat Sandbox
- Isolated virtual environment for threat payload analysis
- Behavioral heuristics logging
- Simulated C2 connection interception
- Real-time containment status tracking

### News Monitor & Dashboard
- Fetches from NewsAPI across 6 categories
- Auto-scores every article for credibility
- Flags suspicious articles for alerts
- Auto-refresh every 5 minutes
- Live threat timeline and distribution charts

---

## Tech Stack

### Frontend (TrapEyeX Web)
- **Next.js 14** (App Router)
- **TailwindCSS** (custom cybersecurity theme)
- **Framer Motion** (page transitions + animations)
- **Recharts** (threat charts)
- **Axios** (API client)

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** + **PostgreSQL**
- **Scikit-learn** (ML models — Random Forest, Logistic Regression, TF-IDF)
- **Google Gemini API** (multimodal AI for reasoning + vision)
- **NewsAPI** (real-time news feed)

### Extensions & Bots
- **Chrome Extension**: Manifest V3, Vanilla JS
- **WhatsApp Bot**: Python, Twilio API / WhatsApp Business API

---

## Project Structure

```
trapeyeX/
├── backend/                  # FastAPI backend
│   ├── main.py               # App entry point
│   ├── config/               # Environment configuration
│   ├── routes/               # API endpoints
│   │   ├── phishing.py
│   │   ├── fakenews.py
│   │   ├── deepfake.py
│   │   ├── news_monitor.py
│   │   └── dashboard.py
│   ├── services/             # Business logic
│   │   ├── phishing_service.py
│   │   ├── fakenews_service.py
│   │   ├── deepfake_service.py
│   │   ├── news_service.py
│   │   └── gemini_service.py
│   ├── models/               # DB models & schemas
│   └── utils/                # Feature extractor, ML utils
├── frontend/                 # Next.js 14 web app
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── scanner/          # URL phishing scanner
│   │   ├── fakenews/         # News analyzer
│   │   ├── deepfake/         # Deepfake detector
│   │   ├── sandbox/          # Threat sandbox
│   │   └── dashboard/        # Threat intelligence dashboard
│   └── components/           # Shared UI components
├── chrome-extension/         # Browser extension (LinkLens)
├── linklens-whatsapp/        # WhatsApp scanning bot
├── ml_models/                # ML model training scripts
├── grme/                     # App screenshots & media
├── start.bat                 # One-click launcher (Windows)
└── README.md
```

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
- PostgreSQL *(optional — app works without DB using mock data)*

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

*Built with Google Gemini AI · Scikit-learn · FastAPI · Next.js · React Native*

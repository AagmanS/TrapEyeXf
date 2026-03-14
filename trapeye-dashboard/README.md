# TrapEye CyberShield Academy

**TrapEye** is a state-of-the-art, education-focused cyber defense dashboard designed to empower students with real-time threat awareness, interactive simulations, and comprehensive security knowledge. Built with a premium "Cyber Defense" aesthetic, it combines cinematic visuals with practical defense tools.

## ✨ Key Features

### 🎬 Cinematic Experience
- **Cinematic Start**: A high-impact, race-start inspired intro sequence with 3.5s fade-in animations.
- **Modern Dark UI**: A professional, premium interface utilizing glassmorphism, background glow effects, and a refined grid overlay.
- **Responsive Animations**: Smooth scroll-reveal animations and interactive hover states throughout the platform.

### 🛡️ Core Educational Modules
- **Interactive Simulator**: Practice defense strategies in real-world scenarios (Phishing, QR Fraud, Job Scams) with immediate feedback and "Threat-O-Meter" tracking.
- **Global Analytics**: Visualization of global scam trends, geographic distribution, and student-targeted fraud statistics using interactive globes and charts.
- **Live Threat Feed**: Real-time monitoring of simulated global cyber threats and security alerts.
- **Quiz Arena**: Test your cybersecurity IQ with randomized questions, immediate scoring, and detailed technical explanations.
- **Scam Watch**: A comprehensive library of current scam tactics, red flags, and avoidance strategies.
- **Safety Checklist**: Interactive, persistent security audit tool for personal accounts, devices, and financial behavior.
- **Glossary**: Searchable database of core cybersecurity terminology and concepts.

### 🇮🇳 Report Center
- Dedicated module for Indian cybercrime reporting authorities.
- Quick access to the National Cyber Crime Helpline (1930).
- Step-by-step incident response guides.

## 🚀 Tech Stack

- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with modern CSS Variables
- **State Management**: React Context API
- **Animations**: CSS Keyframes & Intersection Observer API
- **Icons**: Professional Geometric Symbols (Emoji-free environment)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Credentials
- **Student Login**: `student` / `cyber2024`

## 📂 Project Structure

```
trapeye-dashboard/
├── src/
│   ├── components/      # Reusable UI components (Sidebar, TopNavbar, Chart, Globe)
│   ├── context/         # Global state management
│   ├── data/            # Static content (Scams, Quiz, Glossary, Translations)
│   ├── pages/           # Main page components (Landing, Dashboard, Simulator, etc.)
│   ├── types/           # TypeScript interfaces and types
│   ├── App.tsx          # Main routing and layout
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── .gitignore           # Version control settings
```

## 🧠 Design Philosophy

TrapEye follows a **Professional Geometric Aesthetic**:
- **Typography**: Inter (Body), Outfit (Headings), JetBrains Mono (Technical Data).
- **Professionalism**: Zero user-facing emojis. All iconography is built using clean, geometric unicode symbols or SVG icons.
- **Visual Feedback**: Heavy use of subtle micro-interactions, glow effects, and scale transitions to provide a premium "Command Center" feel.

---
*Developed for educational purposes to bridge the gap between cybersecurity theory and digital defense practice.*

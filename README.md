# Wavefront-ai

> Onchain market intelligence for Solana — narrative clustering, risk scoring, and AI-powered token analysis in one terminal.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-wavefront--ai.vercel.app-black?style=flat-square)](https://wavefront-ai.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Powered by Birdeye](https://img.shields.io/badge/Powered%20by-Birdeye%20API-blue?style=flat-square)](https://birdeye.so)

---

## Overview

Wavefront transforms raw Solana market data into structured, actionable intelligence. Instead of displaying token lists, it clusters what is moving into human-readable narratives, filters out low-liquidity scams algorithmically, and routes deep token metadata directly into a Gemini-powered analyst — so traders get signal, not noise.

Built for the [Birdeye Data BIP Competition](https://birdeye.so).

---

## Features

- **Narrative Clustering** — Parses Birdeye data points to surface emerging themes (AI Infrastructure, DePIN, RWA) before they trend on social media
- **Risk Scorer** — Mathematically penalizes zero-liquidity tokens; scams and honeypots are automatically graded `F` and filtered out
- **AI Copilot** — A Gemini-backed analyst pre-loaded with live holder concentration, freeze-authority status, and liquidity metrics for any token you inspect

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, Framer Motion |
| AI | Google Gemini (`@google/genai`) |
| Data | Birdeye API |
| Charts | Recharts |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Birdeye API key](https://birdeye.so/developer)
- A [Google Gemini API key](https://aistudio.google.com)

### Installation

```bash
git clone https://github.com/Ghostiemoh/wavefront.git
cd wavefront
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

| Variable | Description |
|---|---|
| `BIRDEYE_API_KEY_CHARTS` | Birdeye API key for market data |
| `GEMINI_API_KEY` | Google Gemini API key for the AI Copilot |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## License

MIT

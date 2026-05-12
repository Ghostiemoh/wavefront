# Wavefront Intelligence Engine

Wavefront is an **AI-native onchain intelligence infrastructure** built for Solana, powered by the Birdeye API. 

## The Core Problem

Hackathons are flooded with generic "Solana Monitors" that simply list trending tokens or raw volume metrics. But showing a trader a list of 50 pumping tokens isn't intelligence—it's noise. **Crypto traders react too late because existing tools only show raw data, forcing them to manually parse the market.**

## How Wavefront is Different

Unlike standard dashboards, Wavefront *interprets* raw data into actionable intelligence:

1. **Algorithmic Narrative Clustering**: Wavefront doesn't just list trending tokens. It parses thousands of Birdeye data points to cluster "what is moving" into human-readable narratives (e.g., AI Infrastructure, DePIN, RWA) before they hit Twitter.
2. **Zero-Liquidity Risk Penalization**: The vast majority of newly listed tokens are honeypots or dead. Wavefront's custom Risk Scorer (`risk-scorer.ts`) mathematically eliminates $0-$100 liquidity scams, instantly grading them an "F" to protect the user.
3. **Machine-Readable Intelligence (Copilot)**: Wavefront feeds Birdeye's deep security and liquidity data *directly into an AI's brain*. The integrated Gemini Copilot acts as a Bloomberg-tier analyst. It doesn't guess; it is pre-loaded with the exact holder concentration, freeze-authority status, and liquidity metrics of the token you are viewing.

## Quick Start

```bash
# Install dependencies
npm install

# Add your Birdeye and Gemini keys to .env.local
# BIRDEYE_API_KEY_CHARTS=...
# GEMINI_API_KEY=...

# Start the terminal
npm run dev
```

Built for the Birdeye Data BIP Competition.

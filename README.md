# WealthSphere - IDBI Innovate 2026

**Problem Statement 1 Solution**
**Submitted by:** Kranti Dhanawade (GSMCOE Balewadi, Pune)

WealthSphere is a modern, responsive, and intelligent personal finance dashboard designed for IDBI Bank customers. It provides a 360-degree view of a user's net worth, savings, investments, and spending, augmented by an AI-driven Financial Advisor powered by the Anthropic Claude API.

## 🚀 Features

- **360-Degree Dashboard**: Instant overview of Net Worth, Savings, Investments, and monthly Spending changes.
- **Interactive Analytics**: Beautiful, animated Recharts (Trend lines, Spending Donuts, and Comparative Bars) that bring financial data to life.
- **AI Financial Advisor**: A built-in chat interface powered by Claude 3.5 Sonnet. It receives the user's live financial context to offer highly personalized, actionable wealth management advice.
- **Multi-Page Architecture**: Dedicated full-page views for tracking Goals, analyzing the Investment Portfolio, and deep-diving into Spending patterns.
- **Banking-Grade UI**: A strict, professional design token system using Tailwind CSS v4, featuring a refined "IDBI Indigo" color palette, smooth micro-animations, loading skeletons, and graceful error boundaries.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, React Router DOM, Recharts, Lucide-React (Icons).
- **Backend**: Node.js, Express.js.
- **AI Integration**: `@anthropic-ai/sdk` (Claude 3.5 Sonnet).

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- An Anthropic API Key for the AI Advisor feature.

### 1. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment:
   Open `server/.env` and replace `your_anthropic_api_key_here` with your actual Anthropic API Key.
4. Start the server:
   ```bash
   node index.js
   ```
   *The backend will run on http://localhost:5000*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

## 📱 Application Flow

1. **Dashboard**: The landing page displays your macro financial health. Note the simulated 1-second network fetch demonstrating production readiness.
2. **AI Chat**: Located at the bottom right of the Dashboard. Type a question like *"How can I reduce my spending to reach my Emergency Fund goal?"* to see the AI analyze your specific mock data.
3. **Top Navigation**: Use the header links to switch between the Dashboard, Goals, Investments, and Spending pages instantly.

## 🏆 Hackathon Context
This prototype was developed across a structured 7-Day sprint, focusing heavily on a clean, data-first UX, zero decorative clutter, and practical AI integration tailored to the banking sector.

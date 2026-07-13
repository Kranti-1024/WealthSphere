WealthSphere
Premium Implementation Plan v2.0
Digital Wealth Management App — IDBI Innovate 2026
Kranti Dhanawade  |  GSMCOE Balewadi, Pune  |  Problem Statement 1
1. Design Philosophy
WealthSphere follows a banking-grade design language inspired by Bloomberg Terminal and HDFC NetBanking. Every decision is made with one rule: if it looks like a vibe-coded app, remove it.
1.1 What We Avoid
Glassmorphism, neon colours, gradient backgrounds
Animated gradient text or glowing borders
Dark grey (#1a1a1a) generic dark mode
Playful fonts or rounded card shadows
Gamification elements that feel consumer-app, not banking
1.2 What We Use
Solid navy header (#0A2540) with a 1px bottom border — no blur
Bloomberg-style dark mode: #060F1E background, #0D1B2A cards
IBM Plex Mono exclusively for all rupee values and percentages
Inter for all UI text, labels, and descriptions
8px spacing grid throughout — consistent margins everywhere
Muted positive/negative colours: #2E7D32 green, #C62828 red
1.3 Color Palette
Role
Light Mode
Dark Mode
Usage
App Background
#F5F7FA
#060F1E
Page background
Card Surface
#FFFFFF
#0D1B2A
All cards and panels
Primary
#0A2540
#1A3A5C
Header, primary buttons
Accent / Teal
#00796B
#00BFA5
Highlights, active states
Positive
#2E7D32
#4CAF50
Gains, credit amounts
Negative
#C62828
#EF5350
Losses, debit amounts
Text Primary
#1A1A2E
#F1F5F9
Headings, key labels
Text Secondary
#6B7280
#94A3B8
Captions, descriptions
Border
#E5E7EB
#1E3A5F
Card borders, dividers
2. Project Structure
wealthsphere/
├── client/                          # React + Vite Frontend
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx           # Solid navy top bar
│   │   │   │   ├── Sidebar.jsx          # Left navigation
│   │   │   │   └── PageWrapper.jsx      # Layout shell
│   │   │   ├── dashboard/
│   │   │   │   ├── NetWorthCard.jsx     # Total net worth hero
│   │   │   │   ├── SummaryCards.jsx     # Savings/invest/spend
│   │   │   │   ├── InsightsFeed.jsx     # AI proactive alerts
│   │   │   │   └── QuickActions.jsx     # Common action buttons
│   │   │   ├── analytics/
│   │   │   │   ├── TrendChart.jsx       # 12mo + 5yr forecast
│   │   │   │   ├── SpendingDonut.jsx    # Category breakdown
│   │   │   │   ├── SpendingBar.jsx      # Month comparison
│   │   │   │   └── CustomTooltip.jsx    # Themed chart tooltip
│   │   │   ├── investments/
│   │   │   │   ├── PortfolioChart.jsx   # Asset allocation pie
│   │   │   │   ├── HoldingsTable.jsx    # Detailed holdings
│   │   │   │   └── ReturnsCard.jsx      # XIRR / returns
│   │   │   ├── advisor/
│   │   │   │   ├── AIAdvisor.jsx        # Claude chat interface
│   │   │   │   └── VoiceInput.jsx       # Mic button (fallback safe)
│   │   │   ├── goals/
│   │   │   │   ├── GoalCard.jsx         # Individual goal card
│   │   │   │   ├── GoalTracker.jsx      # Goals list page
│   │   │   │   └── SIPCalculator.jsx    # SIP / EMI planner
│   │   │   ├── profile/
│   │   │   │   ├── RiskAssessment.jsx   # 5-question risk quiz
│   │   │   │   └── ProfileCard.jsx      # User profile summary
│   │   │   └── shared/
│   │   │       ├── NotificationCenter.jsx
│   │   │       ├── PrivacyToggle.jsx    # Blur sensitive data
│   │   │       ├── ThemeToggle.jsx      # Light/dark switch
│   │   │       └── CurrencyBadge.jsx    # ₹ formatter component
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx         # Global theme state
│   │   │   └── PrivacyContext.jsx       # Global privacy state
│   │   ├── hooks/
│   │   │   ├── useFormatINR.js          # Currency formatter
│   │   │   └── useSpeechRecognition.js  # Voice input hook
│   │   ├── data/
│   │   │   └── mockData.js              # All dummy bank data
│   │   ├── utils/
│   │   │   ├── calculations.js          # SIP, XIRR, forecast
│   │   │   └── formatters.js            # Date, currency, %
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Mock login screen
│   │   │   ├── Dashboard.jsx            # Main 360 view
│   │   │   ├── Spending.jsx             # Spending analysis
│   │   │   ├── Investments.jsx          # Portfolio page
│   │   │   ├── Goals.jsx                # Goals tracker
│   │   │   ├── Advisor.jsx              # AI chat page
│   │   │   └── Profile.jsx              # Risk profile page
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                    # Theme variables + scrollbars
│   └── package.json
├── server/
│   ├── routes/
│   │   ├── advisor.js                   # Claude API integration
│   │   ├── analytics.js                 # Data processing
│   │   └── goals.js                     # Goals CRUD
│   ├── middleware/
│   │   └── rateLimiter.js               # Protect Claude API calls
│   ├── index.js
│   └── package.json
└── README.md
3. Feature Specifications
3.1 Mock Login Screen  [MUST HAVE]
First impressions matter. A login screen transforms the prototype into a product.
Email + password fields with IDBI-style branding
'Sign In' button loads the dashboard with a subtle fade transition
No real authentication — hardcoded credentials (demo@idbi.com / demo123)
Displays WealthSphere logo, tagline, and a banking-grade illustration panel on the left
Forgot password link (non-functional, but present for realism)
3.2 360° Financial Dashboard  [MUST HAVE]
Net worth hero card with month-on-month delta (e.g., +₹12,400 this month)
Three summary cards: Total Savings, Investment Value, Monthly Spend
Each card shows a sparkline mini-chart (7-day trend)
Proactive Insights Feed below cards (see 3.8)
Quick Actions row: Transfer, Pay Bill, View FD, Book SIP
Last updated timestamp in the corner
3.3 Privacy Mode — Blur Toggle  [MUST HAVE]
Eye icon in navbar toggles privacy globally via PrivacyContext
All rupee values replaced with *** when enabled
Charts blur using CSS filter: blur(6px)
State persists across page navigation within session
Smooth 200ms CSS transition on blur/unblur
Tooltip on icon: 'Hide sensitive data'
3.4 Dark Mode — Bloomberg Style  [MUST HAVE]
Theme toggle in navbar (sun/moon icon)
CSS variables switch via ThemeContext + data-theme attribute on <html>
Dark background: #060F1E — deep navy, not generic dark grey
Cards: #0D1B2A — slightly lighter navy for depth
Recharts colours update with theme — no hardcoded chart colours
Preference saved to localStorage so it persists on refresh
3.5 Predictive Analytics — 5-Year Forecast  [MUST HAVE]
TrendChart has a toggle: 'Historical' vs 'Forecast'
Forecast extends 5 years using compound interest formula on current savings + investment rate
Historical data shown as solid line, forecast as dashed line in accent teal
Shaded confidence band (light teal fill) around forecast line
Assumptions shown below chart: 'Based on 8% annual return, current SIP maintained'
3.6 AI Financial Advisor — Claude API  [MUST HAVE]
Full-page chat interface with message history
System prompt includes user's full mock financial profile for context-aware advice
Suggested prompt chips below input: 'How can I save more?', 'Review my portfolio', 'Plan my retirement'
Typing indicator (animated dots) while waiting for Claude response
Messages styled differently: user (navy bubble right), AI (white card left)
Copy button on each AI response
Rate limited on backend to prevent API abuse
Voice Input (Bonus — Fallback Safe)
Microphone icon in chat input
Uses browser Web Speech API — works in Chrome/Edge
If microphone permission denied or API unavailable, icon is hidden gracefully
On success: transcribes speech to text in input field, user still reviews before sending
Never auto-submits — user controls when to send
3.7 Risk Profile Assessment  [MUST HAVE]
5-question quiz that determines investor profile. Claude API then tailors all advice to this profile.
Q#
Question
Options
1
What is your primary financial goal?
Capital Safety / Steady Growth / High Returns
2
How long can you stay invested?
< 1 Year / 1–3 Years / 3–7 Years / 7+ Years
3
How do you react to a 20% portfolio drop?
Sell immediately / Hold / Buy more
4
What % of income can you invest monthly?
< 10% / 10–20% / 20–30% / 30%+
5
Do you have 6-month emergency fund?
Yes, fully funded / Partial / No
Result: Conservative, Moderate, or Aggressive investor badge on profile
Badge appears on Dashboard and influences AI advisor system prompt
Option to retake quiz anytime
3.8 Proactive Insights Feed  [MUST HAVE]
AI-style alert cards displayed on the dashboard. Pre-generated from mock data logic (no API call needed for these).
Type
Example Insight
Icon
Warning
Your dining spend is 42% above last month
⚠
Opportunity
FD maturing in 7 days — consider reinvesting at 7.2%
💡
Achievement
You saved 18% of income this month — above your 15% target
✓
Alert
SIP of ₹5,000 due in 3 days — ensure sufficient balance
🔔
Tip
Based on your profile, switching to Direct MF could save ₹1,200/yr in fees
📈
3.9 Notification Center  [SHOULD HAVE]
Bell icon in navbar with unread count badge
Dropdown panel showing last 5-6 mock notifications
Types: transaction alerts, FD maturity, SIP debit, goal milestones
'Mark all as read' clears the badge count
Clicking a notification navigates to the relevant page
3.10 SIP & EMI Planner  [SHOULD HAVE]
Replaces the gamified Round-Ups feature. More aligned with IDBI's banking products.
SIP Calculator: monthly amount + rate + duration = maturity value with chart
EMI Calculator: loan amount + rate + tenure = EMI + total interest breakdown
Amortisation schedule table for EMI (month-by-month principal vs interest)
'Simulate investing your EMI savings' toggle for SIP
All calculations client-side — no API needed
3.11 Investment Holdings Table  [SHOULD HAVE]
Detailed table: Asset Name, Type, Units, Buy Price, Current Price, P&L, P&L%
Sortable columns (click header to sort)
Color-coded P&L: green positive, red negative — using IBM Plex Mono
Search/filter by asset name or type
Total row at bottom with portfolio summary
3.12 Transaction History  [SHOULD HAVE]
Paginated table of mock transactions (50 rows of dummy data)
Columns: Date, Description, Category, Amount, Balance
Filter by: date range, category, transaction type (credit/debit)
Search by merchant or description
Download as CSV button (client-side, no backend)
Debit amounts in red, credit in green — IBM Plex Mono font
3.13 Custom Chart Tooltips  [NICE TO HAVE]
Single CustomTooltip.jsx component used across all Recharts
Matches app theme: white card with navy border in light, dark card in dark mode
Shows formatted ₹ value with IBM Plex Mono, date label, % change
Smooth fade-in animation on hover
3.14 Custom Scrollbars  [NICE TO HAVE]
Webkit CSS scrollbar: 4px wide, rounded, teal thumb on light grey track
Applied globally in index.css — especially visible in AI chat history
Dark mode variant: darker track, brighter teal thumb
3.15 Currency Formatting Utility  [MUST HAVE]
useFormatINR() hook and formatINR() utility used everywhere
Formats: ₹1,23,456.78 — Indian numbering system (lakhs, crores)
IBM Plex Mono applied at component level via className
Supports compact format: ₹12.4L, ₹1.2Cr for cards with limited space
Privacy mode integration: returns *** when privacy is enabled
4. Backend API Design
Endpoint
Method
Description
Auth
/api/advisor
POST
Send financial context + query to Claude API
None (demo)
/api/insights
GET
Return pre-computed insights from mock data
None
/api/analytics/spending
GET
Spending breakdown by category
None
/api/analytics/investments
GET
Portfolio performance data
None
/api/analytics/networth
GET
Total net worth + history
None
/api/goals
GET
Fetch all financial goals
None
/api/goals
POST
Create a new financial goal
None
/api/transactions
GET
Paginated transaction history
None
/api/profile/risk
POST
Submit risk quiz answers, get profile
None
4.1 Claude API Integration
The /api/advisor endpoint constructs a rich system prompt:
System: You are WealthSphere, an AI financial advisor for IDBI Bank.
The user's financial profile:
- Risk Profile: {riskProfile}
- Net Worth: {netWorth}
- Monthly Income: {income}
- Monthly Expenses: {expenses}
- Investment Portfolio: {portfolio}
- Active Goals: {goals}
Give concise, actionable advice in 2-3 sentences.
Always use Indian financial context (SIP, FD, PPF, ELSS, etc.)
5. Revised 7-Day Build Plan
Day
Focus
Tasks
End Goal
Day 1
Foundation
Vite + React setup, Tailwind config, CSS variables for themes, routing, mock data JSON, Login page
App skeleton running
Day 2
Dashboard
Navbar, Sidebar, NetWorthCard, SummaryCards with sparklines, QuickActions, ThemeContext, PrivacyContext
Full dashboard layout
Day 3
Charts
TrendChart + forecast toggle, SpendingDonut, SpendingBar, PortfolioChart, CustomTooltip, all with theme support
All charts working
Day 4
AI Advisor
Node.js backend, Claude API route, rate limiter, AIAdvisor chat UI, prompt chips, VoiceInput (bonus)
AI advisor live
Day 5
Features
GoalTracker, SIP/EMI Planner, RiskAssessment quiz, HoldingsTable, InsightsFeed, NotificationCenter
All pages complete
Day 6
Polish
TransactionHistory, custom scrollbars, formatINR everywhere, mobile responsiveness, dark mode fine-tuning, error states
Production quality
Day 7
Ship
Deploy Vercel + Render, env vars, GitHub cleanup, test live URL, prepare PPT slides
Live demo ready
6. Mock Data Structure
All data lives in client/src/data/mockData.js. Structure:
export const user = {
  name: 'Rajesh Kumar',
  customerId: 'IDBI-2024-8821',
  riskProfile: 'Moderate',
  monthlyIncome: 85000,
  netWorth: 1248500,
}
export const portfolio = [
  { name: 'HDFC Flexi Cap Fund', type: 'Mutual Fund', value: 245000, returns: 14.2 },
  { name: 'IDBI Fixed Deposit', type: 'FD', value: 300000, returns: 7.1 },
  { name: 'Reliance Industries', type: 'Equity', value: 89000, returns: 22.4 },
  { name: 'PPF Account', type: 'PPF', value: 180000, returns: 7.1 },
]
export const spendingCategories = [
  { category: 'Housing', amount: 18000, percentage: 32 },
  { category: 'Food & Dining', amount: 9500, percentage: 17 },
  { category: 'Transport', amount: 4200, percentage: 7 },
  { category: 'Healthcare', amount: 2800, percentage: 5 },
  { category: 'Entertainment', amount: 3100, percentage: 6 },
  { category: 'Others', amount: 18400, percentage: 33 },
]
7. Hackathon Submission Checklist
Item
Details
Deadline
GitHub Repo
Clean repo, good README, no API keys in code
July 9, 2026
Live Demo URL
Vercel frontend + Render backend both running
July 9, 2026
Prototype PPT
Official IDBI template, do not modify layout
July 9, 2026
Problem Statement
PS1 selected on Hack2Skill platform
July 9, 2026
AMA Session
Attend June 30 session, ask questions about PS1
June 30, 2026
7.1 PPT Slide Plan (Official Template)
Slide 1 — Cover: WealthSphere, PS1, team name, participant name
Slide 2 — Problem: Gap in personalised banking advisory at scale
Slide 3 — Solution: WealthSphere feature overview with key screens
Slide 4 — Tech Architecture: Frontend → Backend → Claude API flow diagram
Slide 5 — AI Advisory: How Claude is integrated with financial context
Slide 6 — Demo Screenshots: Dashboard, AI chat, Goals, Risk profile
Slide 7 — Scalability: How mock data maps to real IDBI API endpoints
Slide 8 — Impact: Advisory at bank scale, cost savings vs human advisors
8. Winning Edge Strategy
8.1 Technical Differentiators
Real AI — Claude API with rich financial context, not canned responses
Risk-aware advice — system prompt changes based on Conservative/Moderate/Aggressive profile
5-year forecast — demonstrates long-term value, not just current state
Transaction history with CSV export — shows production thinking
8.2 Presentation Differentiators
Professional UI — judges will immediately notice it doesn't look like a student project
Live deployed demo — accessible from any device during judging
IDBI-specific terminology — SIP, FD, PPF, ELSS, NACH — shows domain knowledge
Scalability narrative — explicitly mention how each mock data source maps to a real IDBI API
8.3 Judging Criteria Alignment
Judging Criterion
WealthSphere Response
Innovation
AI advisor with risk-profile-aware advice at banking scale
Technical Feasibility
React + Node.js + Claude API — all production-proven technologies
Scalability
Mock data architecture mirrors real API structure for easy swap-in
UI/UX
Banking-grade design, mobile responsive, dark mode, privacy mode
Business Impact
Reduces cost of human financial advisors, increases customer retention
Prototype Quality
Fully deployed, interactive, realistic data, no broken flows
WealthSphere  |  IDBI Innovate 2026  |  Kranti Dhanawade  |  GSMCOE Balewadi, Pune
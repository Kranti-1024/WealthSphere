require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const advisorRoutes = require('./routes/advisor');
const analyticsRoutes = require('./routes/analytics');
const goalsRoutes = require('./routes/goals');
const transactionsRoutes = require('./routes/transactions');
const insightsRoutes = require('./routes/insights');
const profileRoutes = require('./routes/profile');
const notificationsRoutes = require('./routes/notifications');
const portfolioRoutes = require('./routes/portfolio');
const documentsRoutes = require('./routes/documents');
const creditRoutes = require('./routes/credit');

const cron = require('node-cron');
const { updatePortfolioMarketData } = require('./services/marketData');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security & CORS Middleware (MUST BE FIRST)
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, // Disable CSP in dev (upgrade-insecure-requests breaks local proxy)
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : true,
  credentials: true // Required for sending cookies over CORS
}));

// 2. Core Middleware
app.use(express.json());
app.use(cookieParser());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Rate Limiting Middleware
const { globalRateLimiter } = require('./middleware/rateLimiter');
app.use(globalRateLimiter);

const authMiddleware = require('./middleware/authMiddleware');

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WealthSphere v2.0 API',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/advisor',
      '/api/analytics/spending',
      '/api/analytics/investments',
      '/api/analytics/networth',
      '/api/goals',
      '/api/transactions',
      '/api/insights',
      '/api/profile/risk',
      '/api/notifications',
      '/api/portfolio'
    ],
  });
});

// Auth Route
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/advisor', authMiddleware, advisorRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/goals', authMiddleware, goalsRoutes);
app.use('/api/transactions', authMiddleware, transactionsRoutes);
app.use('/api/insights', authMiddleware, insightsRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/notifications', authMiddleware, notificationsRoutes);
app.use('/api/portfolio', authMiddleware, portfolioRoutes);
app.use('/api/documents', authMiddleware, documentsRoutes);
app.use('/api/credit', authMiddleware, creditRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', message: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: 'Something went wrong.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WealthSphere v2.0 API running on http://localhost:${PORT}`);
  
  // Run market data update on startup
  setTimeout(() => {
    updatePortfolioMarketData();
  }, 2000);
  
  // Schedule market data update every 1 hour
  cron.schedule('0 * * * *', () => {
    updatePortfolioMarketData();
  });
});

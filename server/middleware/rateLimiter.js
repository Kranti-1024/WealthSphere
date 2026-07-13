const rateLimit = require('express-rate-limit');

// Global API Rate Limiter: 100 requests per 15 minutes
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests', message: 'Global rate limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter Rate Limiter for Login (Brute Force Protection)
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per 15 minutes
  message: { error: 'Account locked', message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Advisor Rate Limiter (AI is expensive)
const advisorRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many requests', message: 'Rate limit exceeded for AI Advisor.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  globalRateLimiter,
  loginRateLimiter,
  advisorRateLimiter
};

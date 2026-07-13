const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { body, validationResult } = require('express-validator');
const { loginRateLimiter } = require('../middleware/rateLimiter');

// Secret key for JWT signing. In production, this must be a strong random string in .env
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_idbi_wealthsphere_key_2026';

const authMiddleware = require('../middleware/authMiddleware');

// Register Route
router.post('/register', 
  [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').trim().escape(),
    body('name').notEmpty().withMessage('Name is required').trim().escape()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email, password, name } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          customerId: 'IDBI-' + Math.floor(1000 + Math.random() * 9000),
          riskProfile: 'Moderate',
          netWorth: 500000,
          monthlyIncome: 85000,
          branch: 'IDBI Digital Branch',
          accountType: 'Starter Savings',
          savingsAccounts: {
            create: [
              { name: 'Starter Savings', balance: 500000, rate: 4.5 }
            ]
          },
          portfolios: {
            create: [
              { assetName: 'IDBI Flexi Cap Fund', assetType: 'Mutual Fund', investedAmount: 100000, currentValue: 112000, returns: 12.0, units: 1000, buyPrice: 100, currentPrice: 112 },
              { assetName: 'Reliance Industries', assetType: 'Equity', investedAmount: 50000, currentValue: 54000, returns: 8.0, units: 20, buyPrice: 2500, currentPrice: 2700 }
            ]
          },
          goals: {
            create: [
              { name: 'Emergency Fund', targetAmount: 200000, currentAmount: 50000, icon: '🛡️' }
            ]
          },
          transactions: {
            create: [
              { title: 'Initial Deposit', amount: 500000, type: 'credit', category: 'Transfer', status: 'completed' },
              { title: 'Mutual Fund SIP', amount: 10000, type: 'debit', category: 'Investment', status: 'completed' }
            ]
          },
          spending: {
            create: [
              { category: 'Housing', amount: 20000, percentage: 40, color: '#0A2540', month: 'Current' },
              { category: 'Food', amount: 15000, percentage: 30, color: '#00796B', month: 'Current' },
              { category: 'Transport', amount: 15000, percentage: 30, color: '#2E7D32', month: 'Current' }
            ]
          }
        }
      });

      res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server Error' });
    }
});

// Login Route with strict validation and rate limiting
router.post('/login', 
  loginRateLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').trim().escape()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true, // Prevents XSS from reading the cookie
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 3600000 // 1 hour
    });

    res.json({ message: 'Login successful', user: payload.user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        customerId: true,
        riskProfile: true,
        monthlyIncome: true,
        netWorth: true,
        phone: true,
        branch: true,
        accountType: true,
        lastLogin: true
      }
    });
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
});

// Status Route
router.get('/status', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ isAuthenticated: true, user: decoded.user });
  } catch (err) {
    res.status(401).json({ isAuthenticated: false });
  }
});

module.exports = router;

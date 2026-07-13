const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/portfolio
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const portfolio = await prisma.portfolioItem.findMany({
      where: { userId }
    });
    res.json({ portfolio });
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/portfolio/savings
router.get('/savings', async (req, res) => {
  try {
    const userId = req.user.id;
    const savingsAccounts = await prisma.savingsAccount.findMany({
      where: { userId }
    });
    res.json({ savingsAccounts });
  } catch (error) {
    console.error('Savings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/portfolio/link-external
router.post('/link-external', async (req, res) => {
  try {
    const userId = req.user.id;
    const { bankName } = req.body;
    
    if (!bankName) return res.status(400).json({ error: 'Bank name is required' });

    // Generate a random balance between 100,000 and 1,500,000
    const randomBalance = Math.floor(Math.random() * 1400000) + 100000;

    // Create the new savings account
    const newAccount = await prisma.savingsAccount.create({
      data: {
        userId,
        name: `${bankName} Savings`,
        balance: randomBalance,
        rate: 3.5
      }
    });

    // Update user's net worth
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: { netWorth: (user.netWorth || 0) + randomBalance }
      });
    }

    // Add a transaction for the "discovery" of assets
    await prisma.transaction.create({
      data: {
        userId,
        title: `Linked ${bankName} Account`,
        amount: randomBalance,
        type: 'credit',
        category: 'External Link',
        status: 'completed'
      }
    });

    res.json({ message: 'External account linked successfully', account: newAccount });
  } catch (error) {
    console.error('Link external error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

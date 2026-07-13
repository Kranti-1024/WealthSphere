const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Get spending breakdown
router.get('/spending', async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await prisma.spendingCategory.findMany({
      where: { userId }
    });

    // Mock comparison for simplicity
    const comparison = categories.map(c => ({
      category: c.category,
      thisMonth: c.amount,
      lastMonth: c.amount * (Math.random() * 0.2 + 0.9)
    }));

    res.json({ categories, comparison });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get investments breakdown
router.get('/investments', async (req, res) => {
  try {
    const userId = req.user.id;
    const portfolio = await prisma.portfolioItem.findMany({
      where: { userId }
    });
    
    const total = portfolio.reduce((acc, curr) => acc + curr.currentValue, 0);

    res.json({ total, portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get networth
router.get('/networth', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // Fetch actual history from NetWorthSnapshots
    const snapshots = await prisma.netWorthSnapshot.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });
    
    const history = snapshots.map(s => ({
      month: s.date.toLocaleString('default', { month: 'short' }),
      value: s.value,
      income: s.income,
      expenses: s.expenses,
      savings: s.savings,
    }));

    // If no snapshots exist, fallback to empty array
    res.json({ current: user.netWorth, history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

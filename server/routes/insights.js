const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/insights
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch user data
    const portfolio = await prisma.portfolioItem.findMany({ where: { userId } });
    const spending = await prisma.spendingCategory.findMany({ where: { userId } });
    const goals = await prisma.goal.findMany({ where: { userId } });

    const generatedInsights = [];

    // 1. Spending Insight
    const foodSpending = spending.find(s => s.category === 'Food & Dining');
    if (foodSpending) {
      generatedInsights.push({
        id: '1',
        type: 'spending',
        icon: '🍽️',
        severity: 'warning',
        title: 'Dining Expenses',
        message: `You spent ₹${foodSpending.amount} on Food & Dining this month.`,
        action: 'Review your budget to stay on track.',
      });
    } else {
      generatedInsights.push({
        id: '1',
        type: 'saving',
        icon: '💰',
        severity: 'positive',
        title: 'Strong Savings Rate',
        message: 'Your spending is well within limits. Keep it up!',
        action: 'Consider increasing SIP contributions.',
      });
    }

    // 2. Portfolio Insight
    if (portfolio.length > 0) {
      const bestPerformer = portfolio.reduce((prev, current) => (prev.returns > current.returns) ? prev : current);
      generatedInsights.push({
        id: '2',
        type: 'investment',
        icon: '📈',
        severity: 'positive',
        title: 'Portfolio Highlight',
        message: `${bestPerformer.assetName} is your best performer at ${bestPerformer.returns}%.`,
        action: 'Consider rebalancing if it exceeds your target allocation.',
      });
    }

    // 3. Goal Insight
    if (goals.length > 0) {
      const closestGoal = goals.reduce((prev, current) => (prev.currentAmount / prev.targetAmount) > (current.currentAmount / current.targetAmount) ? prev : current);
      const percent = Math.round((closestGoal.currentAmount / closestGoal.targetAmount) * 100);
      generatedInsights.push({
        id: '3',
        type: 'goal',
        icon: '🎯',
        severity: 'info',
        title: `${closestGoal.name} Progress`,
        message: `Your ${closestGoal.name} is ${percent}% complete.`,
        action: 'Keep up the good work to reach your target!',
      });
    }

    res.json({ insights: generatedInsights });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

module.exports = router;

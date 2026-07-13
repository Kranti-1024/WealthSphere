const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Get goals
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await prisma.goal.findMany({
      where: { userId }
    });
    res.json({ goals });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new goal
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, targetAmount, currentAmount, deadline, icon, monthlyRequired } = req.body;
    
    if (!name || !targetAmount) {
      return res.status(400).json({ error: 'Name and Target Amount are required' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        deadline: deadline ? new Date(deadline) : null,
        icon: icon || '🎯',
        monthlyRequired: monthlyRequired ? Number(monthlyRequired) : 0
      }
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;

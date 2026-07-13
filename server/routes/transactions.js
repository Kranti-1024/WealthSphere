const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Get paginated transactions
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      prisma.transaction.count({
        where: { userId }
      })
    ]);

    res.json({
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

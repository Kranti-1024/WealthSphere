const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { time: 'desc' }
    });
    res.json({ notifications });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Ensure the notification belongs to the user
    const updated = await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true }
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Notifications read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

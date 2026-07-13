const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const Groq = require('groq-sdk');
const prisma = new PrismaClient();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Get profile
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        customerId: true,
        riskProfile: true,
        monthlyIncome: true,
        netWorth: true,
        phone: true,
        branch: true,
        accountType: true,
        lastLogin: true,
        twoFactorEnabled: true,
        alertsEnabled: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /analyze/:testId
// Unified AI endpoint for multiple tests (risk, resilience, retirement)
router.post('/analyze/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;

    let systemPrompt = '';
    
    if (testId === 'risk') {
      systemPrompt = `
      You are IDBI WealthSphere's AI Behavioral Profiler. 
      Analyze these questionnaire answers: ${JSON.stringify(answers)}
      
      Return EXACTLY this JSON structure:
      {
        "mainScore": "Moderate",
        "narrative": "A 3-paragraph deep psychological narrative of their risk tolerance.",
        "biases": [
          { "name": "Bias Name", "description": "Short explanation" }
        ],
        "chartData": [
          { "name": "Equities", "value": 60, "color": "#0A2540" },
          { "name": "Debt", "value": 30, "color": "#00796B" },
          { "name": "Gold", "value": 10, "color": "#F59E0B" }
        ],
        "chartType": "pie",
        "metrics": {
          "Sharpe Ratio": "1.2",
          "Max Drawdown": "-18.5%",
          "Beta": "0.85"
        },
        "insights": [
          { "title": "Liquidity", "status": "Healthy", "description": "Adequate cash buffers." }
        ]
      }`;
    } else if (testId === 'resilience') {
      systemPrompt = `
      You are a Quantitative Risk AI. 
      Analyze these market crash resilience answers: ${JSON.stringify(answers)}
      
      Return EXACTLY this JSON structure:
      {
        "mainScore": "High Resilience",
        "narrative": "A 3-paragraph analysis of how they behave during severe market drawdowns.",
        "biases": [
          { "name": "Panic Selling Risk", "description": "Short explanation" }
        ],
        "chartData": [
          { "name": "Tech Crash", "impactPercent": -12.5 },
          { "name": "Inflation", "impactPercent": -5.2 },
          { "name": "Rate Hikes", "impactPercent": -8.4 }
        ],
        "chartType": "bar",
        "metrics": {
          "Stress Tolerance": "High",
          "Recovery Time": "2.4 Yrs",
          "Volatility Drag": "Low"
        },
        "insights": [
          { "title": "Hedging Need", "status": "Warning", "description": "Consider gold or bonds." }
        ]
      }`;
    } else if (testId === 'retirement') {
      systemPrompt = `
      You are a Retirement Planning AI. 
      Analyze these retirement readiness answers: ${JSON.stringify(answers)}
      
      Return EXACTLY this JSON structure:
      {
        "mainScore": "On Track (75%)",
        "narrative": "A 3-paragraph analysis of their retirement trajectory and longevity risk.",
        "biases": [
          { "name": "Inflation Underestimation", "description": "Short explanation" }
        ],
        "chartData": [
          { "name": "Current Savings", "value": 45, "color": "#4CAF50" },
          { "name": "Shortfall", "value": 55, "color": "#EF5350" }
        ],
        "chartType": "pie",
        "metrics": {
          "Target Corpus": "₹4.5 Cr",
          "Projected Age": "62",
          "Monthly SIP Need": "₹24,000"
        },
        "insights": [
          { "title": "Longevity Risk", "status": "Healthy", "description": "Portfolio should last till 85." }
        ]
      }`;
    } else {
      return res.status(400).json({ error: 'Invalid test ID' });
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    res.json(aiResponse);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: 'Server error during AI analysis' });
  }
});

// ----------------SECURITY ENDPOINTS----------------

// Update Password
router.put('/security/password', async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle 2FA
router.put('/security/2fa', async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;
    
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: !!enabled }
    });
    
    res.json({ message: `2FA ${enabled ? 'enabled' : 'disabled'} successfully`, twoFactorEnabled: !!enabled });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle Alerts
router.put('/security/alerts', async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;
    
    await prisma.user.update({
      where: { id: userId },
      data: { alertsEnabled: !!enabled }
    });
    
    res.json({ message: `Alerts ${enabled ? 'enabled' : 'disabled'} successfully`, alertsEnabled: !!enabled });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update PIN
router.put('/security/pin', async (req, res) => {
  try {
    const userId = req.user.id;
    const { pin } = req.body;
    
    if (!pin || pin.length < 4) {
      return res.status(400).json({ error: 'A valid PIN (minimum 4 digits) is required' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pin, salt);
    
    await prisma.user.update({
      where: { id: userId },
      data: { pinHash }
    });
    
    res.json({ message: 'PIN updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

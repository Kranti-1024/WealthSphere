const express = require('express');
const Groq = require('groq-sdk');
const { advisorRateLimiter } = require('../middleware/rateLimiter');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.use(advisorRateLimiter);

function buildSystemPrompt(financialContext) {
  const {
    riskProfile = 'Not specified',
    netWorth = 0,
    income = 0,
    expenses = 0,
    portfolio = [],
    goals = [],
  } = financialContext || {};

  const portfolioSummary = typeof portfolio === 'string' 
    ? portfolio 
    : (portfolio.length > 0
      ? portfolio.map((p) => `${p.assetName || p.assetType}: ₹${(p.currentValue || p.investedAmount || 0).toLocaleString('en-IN')}`).join(', ')
      : 'No investments yet');

  const goalsSummary = typeof goals === 'string'
    ? goals
    : (goals.length > 0
      ? goals.map((g) => `${g.name}: ₹${(g.targetAmount || 0).toLocaleString('en-IN')} by ${g.deadline ? new Date(g.deadline).getFullYear() : 'N/A'}`).join(', ')
      : 'No active goals');

  return `You are WealthSphere, an advanced AI financial advisor integrated into the IDBI Bank platform.
Your primary role is to act as a helpful, conversational financial assistant. 

IMPORTANT RULES:
1. NEVER proactively offer a full financial plan or unsolicited advice if the user just says "hi", "hello", or asks a general question. 
2. ALWAYS respond naturally to greetings (e.g. "Hello! How can I assist you with your finances today?").
3. Think before you answer. Understand the intent of the user's input.
4. When the user explicitly asks for financial guidance, give concise, actionable advice in 2-3 sentences based directly on their financial data.
5. Use Indian financial context (SIP, FD, PPF, ELSS, etc.).
6. Do not use markdown excessively.

User's current financial profile (for context when needed):
- Risk Profile: ${riskProfile}
- Net Worth: ₹${Number(netWorth).toLocaleString('en-IN')}
- Monthly Income: ₹${Number(income).toLocaleString('en-IN')}
- Monthly Expenses: ₹${Number(expenses).toLocaleString('en-IN')}
- Investment Portfolio: ${portfolioSummary}
- Active Goals: ${goalsSummary}`;
}

router.post('/', 
  [
    body('message').isString().notEmpty().trim().escape().withMessage('Invalid message format'),
    body('financialContext').isObject().withMessage('Invalid context format')
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { message, financialContext } = req.body;
    const userId = req.user.id;

    // 1. Save user message to DB
    await prisma.chatHistory.create({
      data: {
        userId,
        role: 'user',
        message
      }
    });

    // 2. Fetch past conversation history (last 10 messages)
    const rawHistory = await prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    // Reverse to chronological order for the API
    const history = rawHistory.reverse().map(h => ({
      role: h.role === 'assistant' ? 'assistant' : 'user',
      content: h.message
    }));

    // 3. Prepare messages for Groq API
    const systemPrompt = buildSystemPrompt(financialContext);
    
    // Groq expects the system prompt as the first message
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history
    ];

    // 4. Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile", // Fast and capable model
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage = completion.choices[0]?.message?.content || "I'm having trouble processing that right now.";

    // 5. Save AI response to DB
    await prisma.chatHistory.create({
      data: {
        userId,
        role: 'assistant',
        message: aiMessage
      }
    });

    res.json({ response: aiMessage });
  } catch (error) {
    console.error('Advisor Error:', error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

module.exports = router;

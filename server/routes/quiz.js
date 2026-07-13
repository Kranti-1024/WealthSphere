const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key'
});

router.post('/generate', async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
      return res.status(503).json({ error: "Anthropic API key is not configured." });
    }

    const systemPrompt = `You are a financial risk assessment expert. Your task is to generate exactly 5 multiple-choice questions to determine a user's financial risk tolerance.
Output strictly a JSON array of objects. Do not include any markdown wrappers.
Each object MUST have the following structure exactly:
[
  {
    "id": 1,
    "text": "The question text here",
    "options": [
      { "text": "Option text", "score": 1 },
      { "text": "Option text", "score": 2 }
    ]
  }
]
Make the questions realistic, behavioural, and focused on Indian banking/investment scenarios. The score for options MUST range from 1 (very conservative) to 4 (very aggressive). Provide exactly 3 or 4 options per question. You MUST use the exact keys "id", "text", "options", "text", and "score".`;

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Generate a new 5-question risk assessment quiz.' }],
    });

    let rawJson = msg.content[0].text;
    
    // Extract JSON array using regex in case there's surrounding text
    const match = rawJson.match(/\[[\s\S]*\]/);
    if (match) {
      rawJson = match[0];
    }

    const quiz = JSON.parse(rawJson);
    res.json(quiz);

  } catch (error) {
    console.error('Claude API Quiz Gen Error:', error);
    res.status(500).json({ error: "Failed to generate dynamic quiz." });
  }
});

module.exports = router;

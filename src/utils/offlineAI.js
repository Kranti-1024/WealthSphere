import { formatINR } from './formatters';

const INTENTS = [
  {
    category: 'Savings',
    keywords: ['save', 'saving', 'cut expense', 'budget', 'reduce', 'trim'],
    handler: (ctx) => {
      const highestSpend = [...ctx.spendingCategories].sort((a, b) => b.amount - a.amount)[0];
      return `Based on your recent transactions, your highest spending category is ${highestSpend.category} (${formatINR(highestSpend.amount)}). If you can cut this by just 15%, you'd save ${formatINR(highestSpend.amount * 0.15)} monthly, which could be redirected to your ${ctx.goals[0]?.name || 'investments'}.`;
    }
  },
  {
    category: 'Portfolio Review',
    keywords: ['review', 'portfolio', 'holdings', 'performance', 'investments', 'doing'],
    handler: (ctx) => {
      const best = [...ctx.portfolio].sort((a, b) => b.returns - a.returns)[0];
      const worst = [...ctx.portfolio].sort((a, b) => a.returns - b.returns)[0];
      return `Your total net worth is ${formatINR(ctx.user.netWorth)}. Your best performer is ${best.name} at +${best.returns}%, while ${worst.name} is lagging at ${worst.returns}%. Given your ${ctx.user.riskProfile} risk profile, this mix looks balanced, but you might want to review the underperformer.`;
    }
  },
  {
    category: 'Retirement',
    keywords: ['retire', 'retirement', 'corpus', 'pension'],
    handler: (ctx) => {
      return `To build a comfortable retirement corpus, you should aim to invest at least 20-30% of your income. You are currently earning ${formatINR(ctx.user.monthlyIncome)}. A stepped-up SIP in diversified equity funds is highly recommended for long-term compounding.`;
    }
  },
  {
    category: 'SIP vs FD',
    keywords: ['sip', 'fd', 'fixed deposit', 'mutual fund', 'compare'],
    handler: (ctx) => {
      return `For a time horizon of 5+ years, Equity SIPs typically beat FDs and inflation. However, for short-term goals (1-3 years) or your emergency fund, FDs or Liquid Funds (like your current IDBI Fixed Deposit) are safer to preserve capital.`;
    }
  },
  {
    category: 'Goal Planning',
    keywords: ['goal', 'target', 'dream', 'achieve', 'plan'],
    handler: (ctx) => {
      if (!ctx.goals || ctx.goals.length === 0) return 'You haven\'t set any specific goals yet. I recommend starting with an Emergency Fund goal first.';
      const goal = ctx.goals[0];
      return `You're tracking towards your "${goal.name}" goal. You have ${formatINR(goal.current)} out of ${formatINR(goal.target)}. To reach this by the deadline, continue your monthly contribution of ${formatINR(goal.monthlyRequired)}.`;
    }
  },
  {
    category: 'Tax Planning',
    keywords: ['tax', '80c', 'elss', 'deduction', 'save tax'],
    handler: (ctx) => {
      return `To maximize your Section 80C limit (₹1.5L), consider ELSS Mutual Funds, PPF, or 5-year FDs. Since you are a ${ctx.user.riskProfile} investor, ELSS could offer the best post-tax returns due to its equity exposure and short 3-year lock-in.`;
    }
  },
  {
    category: 'Emergency Fund',
    keywords: ['emergency', 'backup', 'liquid', 'contingency'],
    handler: (ctx) => {
      const expenses = ctx.spendingCategories.reduce((acc, cat) => acc + cat.amount, 0);
      const target = expenses * 6;
      return `Your estimated monthly expenses are ${formatINR(expenses)}. An ideal emergency fund for you should be around ${formatINR(target)} (6 months of expenses). Keep this in a high-yield savings account or a liquid fund.`;
    }
  },
  {
    category: 'Market General',
    keywords: ['market', 'sensex', 'nifty', 'crash', 'correction'],
    handler: (ctx) => {
      return `Market volatility is normal. With your ${ctx.user.riskProfile} profile, the best strategy during market dips is to stick to your asset allocation and continue your SIPs. Dips often present a good buying opportunity for long-term investors.`;
    }
  },
  {
    category: 'Insurance',
    keywords: ['insurance', 'term plan', 'health cover', 'mediclaim'],
    handler: (ctx) => {
      return `Insurance is for protection, not investment. Ensure you have a pure Term Life Insurance cover of at least 10-15x your annual income, plus a comprehensive Family Floater Health Insurance independent of your employer's cover.`;
    }
  },
  {
    category: 'Loan / EMI',
    keywords: ['loan', 'emi', 'borrow', 'home loan', 'debt'],
    handler: (ctx) => {
      return `Before taking a new loan, ensure your total EMIs do not exceed 40% of your monthly income of ${formatINR(ctx.user.monthlyIncome)}. Always clear high-interest debt like credit cards first.`;
    }
  },
  {
    category: 'Risk Profile',
    keywords: ['risk', 'aggressive', 'conservative', 'moderate', 'profile'],
    handler: (ctx) => {
      return `Your current risk profile is assessed as ${ctx.user.riskProfile}. This means you seek a balance between capital growth and safety. If your life circumstances have changed recently, you can retake the Risk Assessment in the Tools menu.`;
    }
  },
  {
    category: 'Credit Score',
    keywords: ['credit score', 'cibil', 'score'],
    handler: (ctx) => {
      return `To maintain a good CIBIL score (750+), always pay your credit card bills in full before the due date, keep your credit utilization below 30%, and avoid applying for multiple new credit lines in a short period.`;
    }
  },
  {
    category: 'Gold / Commodities',
    keywords: ['gold', 'silver', 'commodity', 'sgb'],
    handler: (ctx) => {
      return `Gold is a good hedge against inflation and currency depreciation. It's generally recommended to keep 5-10% of your portfolio in Gold. Sovereign Gold Bonds (SGBs) are the most tax-efficient way to hold gold in India.`;
    }
  },
  {
    category: 'Real Estate',
    keywords: ['property', 'real estate', 'buy house', 'home'],
    handler: (ctx) => {
      return `Real estate requires a large capital outlay and is illiquid. If you're buying a house to live in, ensure your EMI is manageable. For investment purposes, consider REITs (Real Estate Investment Trusts) as a liquid alternative.`;
    }
  }
];

export const canHandle = (message) => {
  const msgLower = message.toLowerCase();
  return INTENTS.some(intent => 
    intent.keywords.some(kw => msgLower.includes(kw))
  );
};

export const generateResponse = (message, context) => {
  const msgLower = message.toLowerCase();
  const matchedIntent = INTENTS.find(intent => 
    intent.keywords.some(kw => msgLower.includes(kw))
  );

  if (matchedIntent) {
    return matchedIntent.handler(context);
  }

  return getFallback(message, context);
};

export const getFallback = (message, context) => {
  return `I'm currently operating in offline mode. I can help you with specific topics like: Portfolio Reviews, Savings Advice, Goal Planning, Tax Savings, SIP vs FD, Insurance, and Risk Assessment. How can I help you with these?`;
};

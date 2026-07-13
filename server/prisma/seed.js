const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding database...');

  // 1. Create or update Demo User
  const passwordHash = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@idbi.com' },
    update: {
      passwordHash,
      name: 'Kranti Dhanawade',
      customerId: 'IDBI-2024-8821',
      riskProfile: 'Moderate',
      monthlyIncome: 85000,
      netWorth: 1248500,
      phone: '+91 98765 43210',
      branch: 'IDBI Bank, Koregaon Park, Pune',
      accountType: 'Premium Savings',
      lastLogin: new Date('2026-07-03T10:30:00Z'),
    },
    create: {
      email: 'demo@idbi.com',
      passwordHash,
      name: 'Kranti Dhanawade',
      customerId: 'IDBI-2024-8821',
      riskProfile: 'Moderate',
      monthlyIncome: 85000,
      netWorth: 1248500,
      phone: '+91 98765 43210',
      branch: 'IDBI Bank, Koregaon Park, Pune',
      accountType: 'Premium Savings',
      lastLogin: new Date('2026-07-03T10:30:00Z'),
    },
  });

  console.log(`User created: ${user.email}`);

  // Clear existing related data for a fresh seed
  await prisma.portfolioItem.deleteMany({ where: { userId: user.id } });
  await prisma.goal.deleteMany({ where: { userId: user.id } });
  await prisma.spendingCategory.deleteMany({ where: { userId: user.id } });
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.netWorthSnapshot.deleteMany({ where: { userId: user.id } });
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.savingsAccount.deleteMany({ where: { userId: user.id } });

  // 1.5 Seed Savings Accounts
  const savings = [
    { name: 'Premium Savings', balance: 342000, rate: 4.0 },
    { name: 'Recurring Deposit', balance: 120000, rate: 6.5 },
  ];
  await prisma.savingsAccount.createMany({
    data: savings.map(s => ({ ...s, userId: user.id }))
  });
  console.log(`Seeded ${savings.length} savings accounts.`);

  // 1.6 Seed NetWorth Snapshots
  const trends = [
    { monthStr: 'Jan', value: 1102000, income: 82000, expenses: 51000, savings: 31000, date: new Date('2026-01-31') },
    { monthStr: 'Feb', value: 1115500, income: 83000, expenses: 49500, savings: 33500, date: new Date('2026-02-28') },
    { monthStr: 'Mar', value: 1130200, income: 83500, expenses: 52000, savings: 31500, date: new Date('2026-03-31') },
    { monthStr: 'Apr', value: 1148000, income: 84000, expenses: 48000, savings: 36000, date: new Date('2026-04-30') },
    { monthStr: 'May', value: 1158500, income: 84000, expenses: 53500, savings: 30500, date: new Date('2026-05-31') },
    { monthStr: 'Jun', value: 1172000, income: 84500, expenses: 50000, savings: 34500, date: new Date('2026-06-30') },
    { monthStr: 'Jul', value: 1189000, income: 85000, expenses: 51500, savings: 33500, date: new Date('2026-07-31') },
    { monthStr: 'Aug', value: 1198500, income: 85000, expenses: 54000, savings: 31000, date: new Date('2026-08-31') },
    { monthStr: 'Sep', value: 1212000, income: 85000, expenses: 49000, savings: 36000, date: new Date('2026-09-30') },
    { monthStr: 'Oct', value: 1224000, income: 85000, expenses: 52500, savings: 32500, date: new Date('2026-10-31') },
    { monthStr: 'Nov', value: 1236500, income: 85000, expenses: 50500, savings: 34500, date: new Date('2026-11-30') },
    { monthStr: 'Dec', value: 1248500, income: 85000, expenses: 56000, savings: 29000, date: new Date('2026-12-31') },
  ];
  await prisma.netWorthSnapshot.createMany({
    data: trends.map(({monthStr, ...t}) => ({ ...t, userId: user.id }))
  });
  console.log(`Seeded ${trends.length} net worth snapshots.`);

  // 1.7 Seed Notifications
  const notifications = [
    { type: 'alert', title: 'SIP Due Tomorrow', message: 'Your HDFC Flexi Cap Fund SIP of ₹10,000 is scheduled for tomorrow.', time: new Date('2026-07-03T08:00:00Z'), read: false, link: '/investments' },
    { type: 'success', title: 'FD Matured', message: 'Your IDBI Fixed Deposit of ₹3,00,000 has matured. Reinvest or withdraw.', time: new Date('2026-07-02T14:30:00Z'), read: false, link: '/investments' },
    { type: 'warning', title: 'Spending Alert', message: 'Food & Dining spending is 42% higher than last month. Review your budget.', time: new Date('2026-07-01T18:00:00Z'), read: true, link: '/spending' },
    { type: 'info', title: 'Market Update', message: 'Sensex crossed 82,000 today. Your equity holdings are up 2.3% this week.', time: new Date('2026-07-01T09:15:00Z'), read: true, link: '/dashboard' },
  ];
  await prisma.notification.createMany({
    data: notifications.map(n => ({ ...n, userId: user.id }))
  });
  console.log(`Seeded ${notifications.length} notifications.`);
  
  // 2. Portfolio Holdings
  const holdings = [
    { assetName: 'HDFC Flexi Cap Fund', assetType: 'Mutual Fund', investedAmount: 245000, currentValue: 245000, returns: 0, units: 1842.5, buyPrice: 133.0, currentPrice: 133.0, mfSchemeCode: '119062' },
    { assetName: 'IDBI Fixed Deposit', assetType: 'FD', investedAmount: 300000, currentValue: 321300, returns: 7.1, units: 1, buyPrice: 300000, currentPrice: 321300 },
    { assetName: 'Reliance Industries', assetType: 'Equity', investedAmount: 71890, currentValue: 89000, returns: 23.8, units: 35, buyPrice: 2054, currentPrice: 2543, symbol: 'RELIANCE.NS' },
    { assetName: 'PPF Account', assetType: 'PPF', investedAmount: 180000, currentValue: 192780, returns: 7.1, units: 1, buyPrice: 180000, currentPrice: 192780 },
    { assetName: 'SBI Blue Chip Fund', assetType: 'Mutual Fund', investedAmount: 139298, currentValue: 156000, returns: 12.0, units: 2890, buyPrice: 48.2, currentPrice: 53.9, mfSchemeCode: '105758' },
    { assetName: 'IDBI Gold ETF', assetType: 'ETF', investedAmount: 66120, currentValue: 78500, returns: 18.7, units: 12, buyPrice: 5510, currentPrice: 6541, symbol: 'IDBIGOLD.NS' },
    { assetName: 'Tata Motors', assetType: 'Equity', investedAmount: 64960, currentValue: 62000, returns: -4.5, units: 80, buyPrice: 812, currentPrice: 775, symbol: 'TATAMOTORS.NS' },
    { assetName: 'Axis Liquid Fund', assetType: 'Mutual Fund', investedAmount: 96409, currentValue: 100000, returns: 3.7, units: 42.1, buyPrice: 2290, currentPrice: 2375, mfSchemeCode: '112282' },
  ];

  await prisma.portfolioItem.createMany({
    data: holdings.map(h => ({ ...h, userId: user.id }))
  });
  console.log(`Seeded ${holdings.length} portfolio items.`);

  // 3. Financial Goals
  const goals = [
    { name: 'Emergency Fund', targetAmount: 500000, currentAmount: 342000, deadline: new Date('2027-03-31'), icon: '🛡️', monthlyRequired: 17556 },
    { name: 'Dream Home Down Payment', targetAmount: 2500000, currentAmount: 680000, deadline: new Date('2029-12-31'), icon: '🏠', monthlyRequired: 43333 },
    { name: 'European Vacation', targetAmount: 400000, currentAmount: 125000, deadline: new Date('2027-06-30'), icon: '✈️', monthlyRequired: 22917 },
    { name: 'Retirement Corpus', targetAmount: 30000000, currentAmount: 1248500, deadline: new Date('2050-03-31'), icon: '🏖️', monthlyRequired: 39930 },
  ];

  await prisma.goal.createMany({
    data: goals.map(g => ({ ...g, userId: user.id }))
  });
  console.log(`Seeded ${goals.length} goals.`);

  // 4. Spending Categories (Current Month)
  const spending = [
    { category: 'Housing', amount: 18000, percentage: 32, color: '#0A2540', month: '7' },
    { category: 'Food & Dining', amount: 9500, percentage: 17, color: '#00796B', month: '7' },
    { category: 'Transport', amount: 4200, percentage: 7, color: '#2E7D32', month: '7' },
    { category: 'Healthcare', amount: 2800, percentage: 5, color: '#C62828', month: '7' },
    { category: 'Entertainment', amount: 3100, percentage: 6, color: '#1A3A5C', month: '7' },
    { category: 'Others', amount: 18400, percentage: 33, color: '#6B7280', month: '7' },
  ];

  await prisma.spendingCategory.createMany({
    data: spending.map(s => ({ ...s, userId: user.id }))
  });
  console.log(`Seeded ${spending.length} spending categories.`);

  // 5. Generate 50 Transactions
  const transactionTypes = [
    { desc: 'Swiggy Food Order', category: 'Food & Dining', type: 'debit' },
    { desc: 'Amazon Purchase', category: 'Shopping', type: 'debit' },
    { desc: 'Uber Ride', category: 'Transport', type: 'debit' },
    { desc: 'Netflix Subscription', category: 'Entertainment', type: 'debit' },
    { desc: 'Electricity Bill', category: 'Utilities', type: 'debit' },
    { desc: 'Salary Credit', category: 'Income', type: 'credit' },
    { desc: 'SIP - HDFC Flexi Cap', category: 'Investment', type: 'debit' },
    { desc: 'Rent Payment', category: 'Housing', type: 'debit' },
    { desc: 'Zomato Order', category: 'Food & Dining', type: 'debit' },
    { desc: 'Petrol Fill-up', category: 'Transport', type: 'debit' },
    { desc: 'Pharmacy', category: 'Healthcare', type: 'debit' },
    { desc: 'Freelance Income', category: 'Income', type: 'credit' },
    { desc: 'Mobile Recharge', category: 'Utilities', type: 'debit' },
    { desc: 'Gym Membership', category: 'Healthcare', type: 'debit' },
    { desc: 'BookMyShow', category: 'Entertainment', type: 'debit' },
    { desc: 'Cashback Received', category: 'Income', type: 'credit' },
    { desc: 'Grocery Store', category: 'Food & Dining', type: 'debit' },
    { desc: 'Interest Credit - FD', category: 'Income', type: 'credit' },
    { desc: 'Insurance Premium', category: 'Insurance', type: 'debit' },
    { desc: 'Water Bill', category: 'Utilities', type: 'debit' },
  ];

  const transactionsToCreate = Array.from({ length: 50 }, (_, i) => {
    const txn = transactionTypes[i % transactionTypes.length];
    const daysAgo = Math.floor(i * 1.5);
    const date = new Date('2026-07-03');
    date.setDate(date.getDate() - daysAgo);

    const baseAmounts = {
      'Food & Dining': [280, 450, 620, 890, 350],
      Shopping: [1200, 2500, 4800, 890, 3200],
      Transport: [150, 280, 420, 650, 180],
      Entertainment: [199, 499, 350, 800, 250],
      Utilities: [950, 1200, 500, 800, 1500],
      Income: [85000, 15000, 250, 5400, 85000],
      Investment: [10000, 5000, 15000, 8000, 12000],
      Housing: [18000, 18000, 18000, 18000, 18000],
      Healthcare: [450, 1200, 800, 2500, 350],
      Insurance: [1500, 18500, 3200, 950, 1500],
    };

    const amounts = baseAmounts[txn.category] || [500, 1000, 1500, 2000, 750];
    const amount = amounts[i % amounts.length];

    return {
      userId: user.id,
      title: txn.desc,
      category: txn.category,
      type: txn.type,
      amount,
      date: date,
      status: i % 15 === 0 ? 'pending' : 'completed',
    };
  });

  await prisma.transaction.createMany({
    data: transactionsToCreate
  });
  console.log(`Seeded 50 transactions.`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

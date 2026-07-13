export const mapPortfolio = (items) => {
  if (!items) return [];
  return items.map(item => ({
    id: item.id,
    name: item.assetName,
    type: item.assetType,
    value: item.currentValue,
    returns: item.returns || 0,
    units: item.units,
    buyPrice: item.buyPrice,
    currentPrice: item.currentPrice,
    symbol: item.symbol,
    mfSchemeCode: item.mfSchemeCode
  }));
};

export const mapGoals = (goals) => {
  if (!goals) return [];
  return goals.map(goal => ({
    id: goal.id,
    name: goal.name,
    target: goal.targetAmount,
    current: goal.currentAmount,
    deadline: goal.deadline,
    icon: goal.icon || '🎯',
    monthlyRequired: goal.monthlyRequired
  }));
};

export const mapSpending = (categories) => {
  if (!categories) return [];
  return categories.map(cat => ({
    id: cat.id,
    category: cat.category,
    amount: cat.amount,
    percentage: cat.percentage,
    color: cat.color || '#000000',
    month: cat.month
  }));
};

export const mapTransactions = (transactions) => {
  if (!transactions) return [];
  return transactions.map(t => ({
    id: t.id,
    title: t.title,
    amount: t.amount,
    type: t.type,
    category: t.category,
    date: t.date,
    status: t.status
  }));
};

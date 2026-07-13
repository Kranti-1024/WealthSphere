/**
 * Calculate SIP maturity value
 * @param {number} monthlyAmount - Monthly SIP amount
 * @param {number} ratePercent - Annual return rate in percent
 * @param {number} years - Investment period in years
 * @returns {number} Maturity value
 */
export const calculateSIP = (monthlyAmount, ratePercent, years) => {
  const monthlyRate = ratePercent / 100 / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) return monthlyAmount * totalMonths;

  const maturity =
    monthlyAmount *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);

  return Math.round(maturity);
};

/**
 * Calculate EMI (Equated Monthly Installment)
 * @param {number} principal - Loan principal amount
 * @param {number} ratePercent - Annual interest rate in percent
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} Monthly EMI amount
 */
export const calculateEMI = (principal, ratePercent, tenureMonths) => {
  const monthlyRate = ratePercent / 100 / 12;

  if (monthlyRate === 0) return principal / tenureMonths;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi * 100) / 100;
};

/**
 * Generate full amortisation schedule
 * @param {number} principal - Loan principal amount
 * @param {number} ratePercent - Annual interest rate in percent
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {Array<{month: number, emi: number, principal: number, interest: number, balance: number}>}
 */
export const calculateAmortisation = (principal, ratePercent, tenureMonths) => {
  const emi = calculateEMI(principal, ratePercent, tenureMonths);
  const monthlyRate = ratePercent / 100 / 12;
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = Math.round(balance * monthlyRate * 100) / 100;
    const principalPaid = Math.round((emi - interest) * 100) / 100;
    balance = Math.max(0, Math.round((balance - principalPaid) * 100) / 100);

    schedule.push({
      month,
      emi: Math.round(emi * 100) / 100,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  return schedule;
};

/**
 * Generate net-worth forecast with confidence bands
 * @param {number} currentNetWorth - Current net worth
 * @param {number} monthlySavings - Monthly savings amount
 * @param {number} annualReturnRate - Expected annual return rate in percent
 * @param {number} years - Forecast period in years
 * @returns {Array<{year: number, value: number, lower: number, upper: number}>}
 */
export const generateForecast = (currentNetWorth, monthlySavings, annualReturnRate, years) => {
  const forecast = [];
  const monthlyReturn = annualReturnRate / 100 / 12;

  for (let year = 0; year <= years; year++) {
    const months = year * 12;
    let value = currentNetWorth;

    // Compound existing net worth
    value *= Math.pow(1 + monthlyReturn, months);

    // Add monthly savings compounded
    if (monthlyReturn > 0) {
      value +=
        monthlySavings *
        ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
    } else {
      value += monthlySavings * months;
    }

    value = Math.round(value);

    // Confidence band: widens with time
    const uncertainty = 0.05 * year; // 5% per year
    const lower = Math.round(value * (1 - uncertainty));
    const upper = Math.round(value * (1 + uncertainty));

    forecast.push({ year, value, lower, upper });
  }

  return forecast;
};

/**
 * Simplified XIRR (Extended Internal Rate of Return) approximation
 * Uses Newton-Raphson method
 * @param {Array<{amount: number, date: Date|string}>} cashflows - Array of cashflows
 * @returns {number} Annual rate of return as a decimal (e.g., 0.12 for 12%)
 */
export const calculateXIRR = (cashflows) => {
  if (!cashflows || cashflows.length < 2) return 0;

  const flows = cashflows.map((cf) => ({
    amount: cf.amount,
    date: new Date(cf.date),
  }));

  const firstDate = flows[0].date;
  const daysDiff = (d) => (d - firstDate) / (1000 * 60 * 60 * 24);

  // Newton-Raphson iteration
  let rate = 0.1; // Initial guess: 10%
  const maxIterations = 100;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (const flow of flows) {
      const years = daysDiff(flow.date) / 365;
      const factor = Math.pow(1 + rate, years);
      npv += flow.amount / factor;
      dnpv -= (years * flow.amount) / (factor * (1 + rate));
    }

    if (Math.abs(npv) < tolerance) break;
    if (Math.abs(dnpv) < tolerance) break;

    const newRate = rate - npv / dnpv;

    // Guard against divergence
    if (newRate < -0.99) {
      rate = -0.99;
    } else {
      rate = newRate;
    }
  }

  return Math.round(rate * 10000) / 10000;
};

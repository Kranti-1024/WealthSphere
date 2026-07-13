/**
 * Formats amount in Indian Rupee notation: ₹1,23,456.78
 */
export const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const [integerPart, decimalPart] = absNum.toFixed(2).split('.');

  // Indian numbering: first group of 3, then groups of 2
  let formatted = '';
  if (integerPart.length <= 3) {
    formatted = integerPart;
  } else {
    const lastThree = integerPart.slice(-3);
    const remaining = integerPart.slice(0, -3);
    formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  const result = decimalPart ? `${formatted}.${decimalPart}` : formatted;
  return `₹${isNegative ? '-' : ''}${result}`;
};

/**
 * Compact INR format: ₹12.4L, ₹1.2Cr
 */
export const formatINRCompact = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const sign = isNegative ? '-' : '';

  if (absNum >= 1e7) {
    return `${sign}₹${(absNum / 1e7).toFixed(1)}Cr`;
  }
  if (absNum >= 1e5) {
    return `${sign}₹${(absNum / 1e5).toFixed(1)}L`;
  }
  if (absNum >= 1e3) {
    return `${sign}₹${(absNum / 1e3).toFixed(1)}K`;
  }
  return `${sign}₹${absNum.toFixed(0)}`;
};

/**
 * Formats date string to DD MMM YYYY
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Formats percentage with sign: +12.5% or -4.2%
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  const num = Number(value);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};

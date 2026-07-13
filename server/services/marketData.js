const prisma = require('../lib/prisma');
const yahooFinance = require('yahoo-finance2').default;
// Some versions export YahooFinance class as default
const yf = typeof yahooFinance === 'function' ? new yahooFinance() : yahooFinance;
const axios = require('axios'); // For REST API calls (mfapi.in)

/**
 * Fetches Mutual Fund NAV from mfapi.in
 * @param {string} schemeCode - MF scheme code (e.g. '119062' for HDFC Flexi Cap)
 */
async function fetchMFPrice(schemeCode) {
  try {
    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`);
    if (response.data && response.data.data && response.data.data.length > 0) {
      // The first item is the latest NAV
      return parseFloat(response.data.data[0].nav);
    }
  } catch (error) {
    console.error(`Error fetching MF NAV for ${schemeCode}:`, error.message);
  }
  return null;
}

/**
 * Fetches Stock/ETF price from Yahoo Finance
 * @param {string} symbol - Ticker symbol (e.g. 'RELIANCE.NS')
 */
async function fetchStockPrice(symbol) {
  try {
    const quote = await yf.quote(symbol);
    return quote ? quote.regularMarketPrice || null : null;
  } catch (error) {
    console.error(`Error fetching Stock price for ${symbol}:`, error.message);
  }
  return null;
}

/**
 * Updates all portfolio items with the latest market data
 */
async function updatePortfolioMarketData() {
  console.log('Fetching latest market data in parallel...');
  try {
    const items = await prisma.portfolioItem.findMany({
      where: {
        OR: [
          { symbol: { not: null } },
          { mfSchemeCode: { not: null } }
        ]
      }
    });

    // 1. Fetch all prices in parallel first, outside of DB writes
    const updateTasks = await Promise.all(
      items.map(async (item) => {
        let latestPrice = null;
        try {
          if (item.mfSchemeCode) {
            latestPrice = await fetchMFPrice(item.mfSchemeCode);
          } else if (item.symbol) {
            latestPrice = await fetchStockPrice(item.symbol);
          }
        } catch (error) {
          console.error(`Error fetching price for ${item.assetName}:`, error.message);
        }
        return { item, latestPrice };
      })
    );

    // 2. Perform DB updates rapidly for items with changed prices
    for (const { item, latestPrice } of updateTasks) {
      if (latestPrice && latestPrice !== item.currentPrice) {
        const newValue = latestPrice * item.units;
        const totalReturnPercent = ((newValue - item.investedAmount) / item.investedAmount) * 100;

        await prisma.portfolioItem.update({
          where: { id: item.id },
          data: {
            currentPrice: latestPrice,
            currentValue: newValue,
            returns: parseFloat(totalReturnPercent.toFixed(2))
          }
        });
        console.log(`Updated ${item.assetName}: Price ₹${latestPrice}`);
      }
    }
    console.log('Market data update complete.');
  } catch (error) {
    console.error('Error during market data update:', error);
  }
}

module.exports = {
  fetchMFPrice,
  fetchStockPrice,
  updatePortfolioMarketData
};

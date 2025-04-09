const { faker } = require('@faker-js/faker');

// List of fake stock symbols
const SYMBOLS = ['AAPL', 'ADBE', 'AMZN', 'BAC', 'CSCO', 'DIS', 'GOOGL', 'HD', 'INTC', 'JPM', 'KO', 'META', 'MSFT', 'NFLX', 'NVDA', 'PEP', 'PFE', 'PYPL', 'V', 'WMT'];

// Generate a single stock record
const generateStockRecord = () => {
  // const symbol = faker.helpers.arrayElement(SYMBOLS);
  const basePrice = faker.number.float({ min: 50, max: 1000, multipleOf: 0.01 });
  const change = faker.number.float({ min: -10, max: 10, multipleOf: 0.01 });
  const changePercent = (change / basePrice) * 100;
  const volume = faker.number.int({ min: 1000, max: 1000000 });

  return {
    // symbol,
    price: basePrice,
    historicPrice: [basePrice],
    change,
    changePercent: changePercent.toFixed(2),
    volume,
    lastUpdated: new Date().toISOString(),
  };
};

// Generate multiple stock records
const generateStockData = (count = SYMBOLS.length) => {
  return SYMBOLS.map(symbol => ({
    ...generateStockRecord(),
    symbol,
  }));
};

// Update existing stock data with new prices
const updateStockData = (existingData) => {
  return existingData.map(record => {
    return updateStockDatum(record);
  });
};

const updateStockDatum = (existingDatum) => {
  const change = faker.number.float({ min: -5, max: 5, multipleOf: 0.01 });
  const newPrice = existingDatum.price + change;
  const changePercent = (change / existingDatum.price) * 100;
  // Last 20 prices.
  const historicPrice = [...existingDatum.historicPrice, newPrice].slice(-20);

  return {
    ...existingDatum,
    price: newPrice,
    historicPrice,
    change,
    changePercent: changePercent.toFixed(2),
    volume: faker.number.int({ min: 1000, max: 1000000 }),
    lastUpdated: new Date().toISOString(),
  };
};

module.exports = {
  generateStockData,
  updateStockData,
}; 
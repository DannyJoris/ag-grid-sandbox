import { faker } from '@faker-js/faker';

export interface StockData {
  symbol: string;
  price: number;
  historicPrice: number[];
  change: number;
  changePercent: string;
  volume: number;
  lastUpdated: string;
}

// List of fake stock symbols
const SYMBOLS = ['AAPL', 'ADBE', 'AMZN', 'BRK.A', 'CRM', 'DIS', 'GOOGL', 'INTC', 'JPM', 'KO', 'MA', 'META', 'MSFT', 'NFLX', 'NVDA', 'ORCL', 'PEP', 'PG', 'V', 'WMT'];

// Generate a single stock record
const generateStockRecord = (): Omit<StockData, 'symbol'> => {
  const basePrice = faker.number.float({ min: 50, max: 1000, multipleOf: 0.01 });
  const change = faker.number.float({ min: -10, max: 10, multipleOf: 0.01 });
  const changePercent = (change / basePrice) * 100;
  const volume = faker.number.int({ min: 1000, max: 1000000 });

  return {
    price: basePrice,
    historicPrice: [basePrice],
    change,
    changePercent: changePercent.toFixed(2),
    volume,
    lastUpdated: new Date().toISOString(),
  };
};

// Generate multiple stock records
export const generateStockData = (count = SYMBOLS.length): StockData[] => {
  return SYMBOLS.map(symbol => ({
    ...generateStockRecord(),
    symbol,
  }));
};

// Update existing stock data with new prices
export const updateStockData = (existingData: StockData[]): StockData[] => {
  return existingData.map(record => {
    return updateStockDatum(record);
  });
};

const updateStockDatum = (existingDatum: StockData): StockData => {
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
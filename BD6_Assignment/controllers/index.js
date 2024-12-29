let stocks = [
  { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
  { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.1 },
  { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.5 },
];

let trades = [
  {
    tradeId: 1,
    stockId: 1,
    quantity: 10,
    tradeType: 'buy',
    tradeDate: '2024-08-07',
  },
  {
    tradeId: 2,
    stockId: 2,
    quantity: 5,
    tradeType: 'sell',
    tradeDate: '2024-08-06',
  },
  {
    tradeId: 3,
    stockId: 3,
    quantity: 7,
    tradeType: 'buy',
    tradeDate: '2024-08-05',
  },
];

async function getAllStocks() {
  return stocks;
}

async function getStockByTicker(tiker) {
  return stocks.find((t) => t.ticker === tiker);
}

async function addNewTrades(trade) {
  const newTradeId = trades.length + 1;
  const newTrade = { tradeId: newTradeId, ...trade };
  trades.push(newTrade);
  return newTrade;
}

module.exports = { getAllStocks, getStockByTicker, addNewTrades, trades };

const cors = require('cors');
const express = require('express');
const app = express();
const {
  getAllStocks,
  getStockByTicker,
  addNewTrades,
} = require('./controllers');
app.use(cors());
app.use(express.json());

app.get('/stocks', async (req, res) => {
  try {
    const stocks = await getAllStocks();
    if (stocks.length === 0) {
      return res.status(404).json({ message: 'No Stocks available' });
    }
    return res.status(200).json({ stocks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/stocks/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const stock = await getStockByTicker(ticker);
    if (!stock) {
      return res.status(404).send('Stock not found');
    }
    return res.status(200).json({ stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/trades/new', (req, res) => {
  try {
    const { stockId, quantity, tradeType, tradeDate } = req.body;
    if (!stockId || !quantity || !tradeType || !tradeDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newTrade = addNewTrades(req.body);
    return res.status(201).json({ trade: newTrade });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = { app };

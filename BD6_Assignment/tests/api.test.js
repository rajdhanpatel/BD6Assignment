const request = require('supertest');
const http = require('http');
const { app } = require('../index.js');
const {
  getAllStocks,
  getStockByTicker,
  addNewTrades,
  trades,
} = require('../controllers');
const { beforeEach } = require('node:test');
jest.mock('../controllers', () => ({
  ...jest.requireActual('../controllers'),
  getAllStocks: jest.fn(),
  getStockByTicker: jest.fn(),
  addNewTrades: jest.fn(),
  trades: [
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
  ],
}));

let server;
beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});
afterAll(async () => {
  server.close();
});
describe('Controller Function tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('GET /stocks endpoint successfully retrieves all stocks', async () => {
    const mockedStocks = [
      { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
      {
        stockId: 2,
        ticker: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 2750.1,
      },
      { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.5 },
    ];
    getAllStocks.mockResolvedValue(mockedStocks);
    const result = await getAllStocks();
    expect(result).toEqual(mockedStocks);
    expect(result.length).toBe(3);
  });

  it('GET /stocks/:ticker endpoint successfully retrieves a specific stock', async () => {
    getStockByTicker.mockResolvedValue({
      stockId: 2,
      ticker: 'GOOGL',
      companyName: 'Alphabet Inc.',
      price: 2750.1,
    });

    const result = await request(server).get('/stocks/GOOGL');

    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      stock: {
        stockId: 2,
        ticker: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 2750.1,
      },
    });
  });
  it('GET /stocks/:ticker endpoint returns a 404 status code when provided with an invalid ticker', async () => {
    getStockByTicker.mockResolvedValue(null);
    const result = await request(server).get('/stocks/GOOGLES');
    expect(result.status).toBe(404);
    expect(result.text).toEqual('Stock not found');
  });

  it('should Add a New Trade', async () => {
    const initialTradesLength = trades.length;

    addNewTrades.mockImplementation(async (trade) => {
      const newTradeId = initialTradesLength + 1;
      const newTrade = { tradeId: newTradeId, ...trade };
      trades.push(newTrade);
      return newTrade;
    });

    const result = await request(server).post('/trades/new').send({
      stockId: 2,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    });

    expect(result.statusCode).toEqual(201);

    const expectedTradeId = initialTradesLength + 1;
    expect(result.body.trade).toEqual({
      tradeId: expectedTradeId,
      stockId: 2,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    });
  });

  it('should return 400 when required fields are missing', async () => {
    const result = await request(server).post('/trades/new').send({
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toEqual('Missing required fields');
  });
  it('should call getAllStocks and return the correct mocked data', async () => {
    const mockedStocks = [
      { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
      {
        stockId: 2,
        ticker: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 2750.1,
      },
      { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.5 },
    ];
    getAllStocks.mockResolvedValue(mockedStocks);
    const result = await request(server).get('/stocks');
    expect(result.statusCode).toEqual(200);
    expect(result.body.stocks).toEqual(mockedStocks);
  });
  it('should add a new trade and return the correct trade data', async () => {
    const tradeData = {
      stockId: 2,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    };
    const mockedTrade = {
      tradeId: 4,
      ...tradeData,
    };
    console.log('mockedTrade Data: ', mockedTrade);
    addNewTrades.mockResolvedValue(mockedTrade);
    const result = await request(server).post('/trades/new').send(tradeData);
    expect(result.statusCode).toEqual(201);
    expect(result.body.trade).toEqual(mockedTrade);
  });
});

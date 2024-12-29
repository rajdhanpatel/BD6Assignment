const request = require('supertest');
const {
  app,
  getBooks,
  getBookById,
  getReviews,
  gerReviewById,
} = require('../index.js');
const http = require('http');

jest.mock('../index.js', () => {
  const actualModule = jest.requireActual('../index.js');
  return {
    ...actualModule,
    getBooks: jest.fn(),
  };
});

let server;

beforeAll(async () => {
  jest.setTimeout(20000); // Increase timeout for setup
  console.log('Starting server...');
  server = http.createServer(app);
  await new Promise((resolve, reject) => {
    server.listen(3001, (err) => {
      if (err) {
        console.error('Error starting server:', err);
        reject(err);
      } else {
        console.log('Server started on port 3001');
        resolve();
      }
    });
  });
});

afterAll(async () => {
  console.log('Stopping server...');
  await new Promise((resolve) => {
    server.close(() => {
      console.log('Server stopped');
      resolve();
    });
  });
});

describe('API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get /api/books should return 404 if no books are found', async () => {
    getBooks.mockResolvedValue([]); // Mock getBooks to return an empty array
    const result = await request(server).get('/api/books');
    expect(result.statusCode).toEqual(404);
    expect(result.body.message).toEqual('No books found');
  });

  it('GET api/books/id should return 404 if No book found with this id', async () => {
    getBookById.mockResolvedValue(null);
    const result = await request(server).get('/api/books/999');
    expect(result.statusCode).toEqual(404);
    expect(result.body.message).toEqual('No book found with this id');
  });

  it('GET api/reviews should return 404 if no reviews are found', async () => {
    getReviews.mockResolvedValue([]);
    const result = await request(server).get('/api/reviews');
    expect(result.statusCode).toEqual(404);
    expect(result.body.message).toEqual('No reviews found');
  });
  it('GET api/reviews/id should return 404 if no review found with this id', async () => {
    gerReviewById.mockResolvedValue(null);
    const result = await request(server).get('/api/reviews/999');
    expect(result.statusCode).toEqual(404);
    expect(result.body.message).toEqual('No review found with this id');
  });
});

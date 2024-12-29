const request = require('supertest');
const {
  app,
  getAllReviews,
  addReview,
  getReviewById,
  addUser,
  getUserById,
} = require('../index.js');
const http = require('http');
jest.mock('../index.js', () => ({
  ...jest.requireActual('../index.js'),
  getAllReviews: jest.fn(),
  addReview: jest.fn(),
  getReviewById: jest.fn(),
  addUser: jest.fn(),
  getUserById: jest.fn(),
}));

let server;
beforeAll(async () => {
  try {
    server = http.createServer(app);
    await new Promise((resolve, reject) => {
      server.listen(3001, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (err) {
    console.error('Error starting server:', err);
    throw err;
  }
});
afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe('API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve all reviews', async () => {
    const reviews = [
      { id: 1, content: 'Great Production', userId: 1 },
      { id: 2, content: 'Not bad, could be better', userId: 2 },
    ];

    getAllReviews.mockResolvedValue(reviews);
    const result = await request(server).get('/reviews');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(reviews);
  });

  it('should retrieve a review by id', async () => {
    const mockReview = {
      id: 1,
      content: 'Great Production',
      userId: 1,
    };
    getReviewById.mockResolvedValue(mockReview);
    const result = await request(server).get('/reviews/details/1');
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockReview);
  });

  it('Should add a new review', async () => {
    const mockReview = { id: 3, content: 'Awesome', userId: 1 };
    addReview.mockResolvedValue(mockReview);
    const result = await request(server)
      .post('/reviews/new')
      .send({ content: 'Awesome', userId: 1 });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockReview);
  });

  it('should review a specific user by id', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    getUserById.mockResolvedValue(mockUser);
    const result = await request(server).get('/users/details/1');
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockUser);
  });

  it('should add a user', async () => {
    const mockUser = {
      id: 3,
      name: 'Alice brown',
      email: 'alice.brown@example.com',
    };
    addUser.mockResolvedValue(mockUser);
    const result = await request(server)
      .post('/users/new')
      .send({ name: 'Alice brown', email: 'alice.brown@example.com' });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(mockUser);
  });

  it('should return a 404 for an invalid review id', async () => {
    getReviewById.mockResolvedValue(null);
    const result = await request(server).get('/reviews/details/999');
    expect(result.statusCode).toEqual(404);
    expect(result.body.message).toEqual('Review not found');
  });
});

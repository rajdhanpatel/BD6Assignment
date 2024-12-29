const request = require('supertest');
const {
  app,
  validateUser,
  validateBook,
  validateReview,
} = require('../index.js');
const http = require('http');

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

jest.mock('../index.js', () => {
  const actualModule = jest.requireActual('../index.js');
  return {
    ...actualModule,
    validateUser: jest.fn(),
    validateBook: jest.fn(),
    validateReview: jest.fn(),
  };
});

describe('API Endpoints to add the data', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should add a new user with valid input', async () => {
    const result = await request(server)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john.doe@mail.com' });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@mail.com',
    });
  });
  it('should return 400 from invalid user input', async () => {
    const result = await request(server)
      .post('/api/users')
      .send({ name: 'John' });
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual('email is required and it should be a string');
  });

  it('should add a new book with valid input', async () => {
    const result = await request(server)
      .post('/api/books')
      .send({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual({
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
    });
  });

  it('should return 400 with invalid book input', async () => {
    const result = await request(server)
      .post('/api/books')
      .send({ title: 'The Great Gatsby' });
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual('author is required and it should be a string');
  });

  it('should add a new review with valid input', async () => {
    const result = await request(server)
      .post('/api/reviews')
      .send({ content: 'Great Writing!', userId: 1 });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual({
      id: 1,
      content: 'Great Writing!',
      userId: 1,
    });
  });
  it('should return 400 with invalid review input', async () => {
    const result = await request(server)
      .post('/api/reviews')
      .send({ userId: 1 });
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual(
      'content is required and it should be a string'
    );
  });
});
//--------------function validation-------------
describe('Validation function', () => {
  it('should validate user input correctly', () => {
    expect(
      validateUser({ name: 'John', email: 'johndoe@mail.com' })
    ).toBeNull();
    expect(validateUser({ name: 'John' })).toEqual(
      'email is required and it should be a string'
    );
    expect(validateUser({ email: 'johndoe@mail.com' })).toEqual(
      'name is required and it should be a string'
    );
  });
  it('should validate book input correctly', () => {
    expect(
      validateBook({
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      })
    ).toBeNull();
    expect(validateBook({ title: 'The Great Gatsby' })).toEqual(
      'author is required and it should be a string'
    );
    expect(validateBook({ author: 'F. Scott Fitzgerald' })).toEqual(
      'title is required and it should be a string'
    );
  });

  it('should validate review input correctly', () => {
    expect(validateReview({ content: 'Great Writing!', userId: 1 })).toBeNull();
    expect(validateReview({ content: 'Great Writing!' })).toEqual(
      'userId is required and it should be a number'
    );
    expect(validateReview({ userId: 1 })).toEqual(
      'content is required and it should be a string'
    );
  });
});

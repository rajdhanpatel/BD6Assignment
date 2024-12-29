const request = require('supertest');
const http = require('http');
const {
  app,
  validateUser,
  validateBook,
  validateReview,
} = require('../index.js');
const { getAllEmployees } = require('../controllers');
const { beforeEach } = require('node:test');

jest.mock('../controllers', () => ({
  ...jest.requireActual('../controllers'),
  getAllEmployees: jest.fn(),
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
  it('should return all employees', async () => {
    let mockedEmployees = [
      {
        employeeId: 1,
        name: 'Rahul Sharma',
        emial: 'rahul.sharma@example.com',
        departmentId: 1,
        roleId: 1,
      },
      {
        employeeId: 2,
        name: 'Priya Singh',
        emial: 'priya.singh@example.com',
        departmentId: 2,
        roleId: 2,
      },
      {
        employeeId: 3,
        name: 'Ankit Verma',
        emial: 'ankit.verma@example.com',
        departmentId: 1,
        roleId: 3,
      },
    ];
    getAllEmployees.mockResolvedValue(mockedEmployees);
    let result = getAllEmployees();
    expect(result).toBe(mockedEmployees);
    expect(result.length).toBe(3);
  });
});

describe('API Endpoint tests', () => {
  it('GET /employees should get all employees', () => {
    const result = request(server).get('/employees');
    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      employees: [
        {
          employeeId: 1,
          name: 'Rahul Sharma',
          emial: 'rahul.sharma@example.com',
          departmentId: 1,
          roleId: 1,
        },
        {
          employeeId: 2,
          name: 'Priya Singh',
          emial: 'priya.singh@example.com',
          departmentId: 2,
          roleId: 2,
        },
        {
          employeeId: 3,
          name: 'Ankit Verma',
          emial: 'ankit.verma@example.com',
          departmentId: 1,
          roleId: 3,
        },
      ],
    });
    expect(result.body.employees.length).toBe(3);
  });
  it('GET /employees/:id should get employee by id', async () => {
    const result = await request(server).get('/employees/1');
    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      employee: {
        employeeId: 1,
        name: 'Rahul Sharma',
        emial: 'rahul.sharma@example.com',
        departmentId: 1,
        roleId: 1,
      },
    });
  });
});

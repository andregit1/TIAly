// tests/auth.test.js

const request = require('supertest');
const app = require('./server');
const { sequelize, UserTest, RoleTest } = require('./helper');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Import expect from Jest
const { expect } = require('@jest/globals');

describe('Authentication routes', () => {
  // Before each test, clear the tables
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  // Test user signup
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', password: 'password' });
    
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created successfully');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe('testuser');
    // You can add more assertions as needed
  });

  // Test user signin
  it('should sign in an existing user', async () => {
    // First, create a user
    const hashedPassword = await bcrypt.hash('password', 10); // Hash the password
    await UserTest.create({ username: 'testuser', password: hashedPassword });

    const res = await request(app)
      .post('/auth/signin')
      .send({ username: 'testuser', password: 'password' });
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Signed in successfully');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe('testuser');
    // You can add more assertions as needed
  });

  // Test user signout
  it('should sign out the current user', async () => {
    // This test requires a logged-in user
    // You may need to use an agent to persist the session between requests
    // You can refer to Supertest documentation for how to achieve this
    const agent = request.agent(app);
    await agent
      .post('/auth/signup')
      .send({ username: 'testuser', password: 'password' });

    await agent
      .post('/auth/signin')
      .send({ username: 'testuser', password: 'password' });

    const res = await agent.get('/auth/signout');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Signed out successfully');
    // You can add more assertions as needed
  });
});

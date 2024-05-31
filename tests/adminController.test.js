const request = require('supertest');
const app = require('./server'); // Import your Express app
const { sequelize, UserTest, RoleTest, UrlTest } = require('./helper'); // Import necessary models from your helper file
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Mock auth token
const authToken = 'mockedAuthToken';

// Import expect from Jest
const { expect } = require('@jest/globals');

describe('Admin Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sync models to create the tables
    await UrlTest.bulkCreate([ // Use UrlTest model instead of Url
      { originalUrl: 'https://example.com/page1' },
      { originalUrl: 'https://example.com/page2' },
      { originalUrl: 'https://example.com/page3' },
    ]);

    // Create a test user for authentication
    await UserTest.create({ username: 'testuser', password: 'testpassword' });
    const hashedPassword = await bcrypt.hash('testpassword', 10); // Hash the password
    await UserTest.create({ username: 'testuser', password: hashedPassword }); // Use UserTest model instead of User

    const res = await request(app)
      .post('/auth/signin')
      .send({ username: 'testuser', password: 'testpassword' });
  });

  afterAll(async () => {
    await UrlTest.destroy({ where: {} });
    await sequelize.close(); // Close the database connection after all tests
  });

  describe('GET /admin/urls', () => {
    it('should return a list of URLs', async () => {
      const res = await request(app)
        .get('/admin/urls')
        .set('Cookie', ['user_id=1']); // Mock session cookie with user ID
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('GET /admin/urls/:id', () => {
    it('should return a single URL by ID', async () => {
      const url = await UrlTest.create({ originalUrl: 'https://example.com/test' }); // Use UrlTest model instead of Url
      const res = await request(app)
        .get(`/admin/urls/${url.id}`)
        .set('Authorization', `Bearer ${authToken}`); // Include authentication token
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', url.id);
      expect(res.body).toHaveProperty('originalUrl', url.originalUrl);
    });
  });

  describe('POST /admin/urls', () => {
    it('should create a new URL', async () => {
      const newUrl = { originalUrl: 'https://example.com/new-page' };
      const res = await request(app)
        .post('/admin/urls')
        .send(newUrl)
        .set('Authorization', `Bearer ${authToken}`); // Include authentication token
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('originalUrl', newUrl.originalUrl);
    });
  });

  describe('PUT /admin/urls/:id', () => {
    it('should update an existing URL by ID', async () => {
      const url = await UrlTest.create({ originalUrl: 'https://example.com/update-page' }); // Use UrlTest model instead of Url
      const updatedUrl = { originalUrl: 'https://example.com/updated-page' };
      const res = await request(app)
        .put(`/admin/urls/${url.id}`)
        .send(updatedUrl)
        .set('Authorization', `Bearer ${authToken}`); // Include authentication token
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', url.id);
      expect(res.body).toHaveProperty('originalUrl', updatedUrl.originalUrl);
    });
  });

  describe('DELETE /admin/urls/:id', () => {
    it('should delete a URL by ID', async () => {
      const url = await UrlTest.create({ originalUrl: 'https://example.com/delete-page' }); // Use UrlTest model instead of Url
      const res = await request(app)
        .delete(`/admin/urls/${url.id}`)
        .set('Authorization', `Bearer ${authToken}`); // Include authentication token
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Deleted successfully');
        const deletedUrl = await UrlTest.findByPk(url.id); // Use UrlTest model instead of Url
        expect(deletedUrl).toBeNull(); // Check that the URL is deleted from the database
      });
    });
  });
  
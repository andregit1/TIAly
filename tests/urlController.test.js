const request = require('supertest');
const app = require('./server'); // Import your Express app
const { sequelize, UserTest, RoleTest, UrlTest } = require('./helper');

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

describe('URL Controller', () => {
    it('should redirect to the original URL', async () => {
        const url = await UrlTest.create({ slug: '1a', originalUrl: 'https://www.techinasia.com/car-rental-startup-smove' });

        const res = await request(app).get('/1a');
        expect(res.status).toBe(301);
        expect(res.header.location).toBe('https://www.techinasia.com/car-rental-startup-smove');
    });

    it('should return 404 for non-existing slug', async () => {
        const res = await request(app).get('/non-existing-slug');
        expect(res.status).toBe(404);
    });

    it('should create a new URL', async () => {
        const newUrlData = { slug: 'new-slug', originalUrl: 'https://example.com/new-page' };
        const res = await request(app)
            .post('/url')
            .send(newUrlData);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('slug', newUrlData.slug);
        expect(res.body).toHaveProperty('originalUrl', newUrlData.originalUrl);
    });

    it('should return validation error for invalid URL', async () => {
        const invalidUrlData = { slug: 'invalid-slug', originalUrl: 'invalid-url' };
        const res = await request(app)
            .post('/url')
            .send(invalidUrlData);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

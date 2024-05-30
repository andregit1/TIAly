const request = require('supertest');
const app = require('../src/app');
const { sequelize, Url } = require('../src/models/url');

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

describe('URL Controller', () => {
    it('should redirect to the original URL', async () => {
        const url = await Url.create({ slug: '1a', originalUrl: 'https://www.techinasia.com/car-rental-startup-smove' });

        const res = await request(app).get('/1a');
        expect(res.status).toBe(301);
        expect(res.header.location).toBe('https://www.techinasia.com/car-rental-startup-smove');
    });
});

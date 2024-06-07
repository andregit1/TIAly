const { restore } = require('sinon');
const { 
  sequelize,
  assert,
  request,
  app,
  Url
} = require('./sequelize-test-setup');

const RedisMock = require('ioredis-mock');
const redis = new RedisMock();

describe('URL Shortening Service', () => {
  afterEach(async () => {
    restore();
    await redis.flushall(); // Clear Redis cache
    await Url.destroy({ where: {} }); // Clear URL table
  });

  describe('POST /urls/create', () => {
    it('should create a new shortened URL with a generated slug', async () => {
      const response = await request(app)
        .post('/urls/create')
        .send({ originalUrl: 'https://example.com' })
        .expect(200);

      assert(response.body.slug);
      assert.strictEqual(response.body.originalUrl, 'https://example.com');
    });

    it('should create a new shortened URL with a custom slug', async () => {
      const response = await request(app)
        .post('/urls/create')
        .send({ slug: 'customslug', originalUrl: 'https://example.com' })
        .expect(200);

      assert.strictEqual(response.body.slug, 'customslug');
      assert.strictEqual(response.body.originalUrl, 'https://example.com');

      const urlInDb = await Url.findOne({ where: { slug: 'customslug' } });
      assert(urlInDb);
    });

    it('should return 400 if the slug already exists', async () => {
      await Url.create({ slug: 'customslug', originalUrl: 'https://example.com' });

      const response = await request(app)
        .post('/urls/create')
        .send({ slug: 'customslug', originalUrl: 'https://example.com' })
        .expect(400);

      assert.strictEqual(response.body.message, 'Slug already exists');
    });
  });

  describe('GET /urls/:slug', () => {
    it('should redirect to the original URL if the slug exists', async () => {
      const url = await Url.create({ slug: 'customslug', originalUrl: 'https://example.com' });

      const response = await request(app)
        .get(`/urls/${url.slug}`)
        .expect(301);

      assert.strictEqual(response.header.location, 'https://example.com');
    });

    it('should return 404 if the slug does not exist', async () => {
      const response = await request(app)
        .get('/urls/nonexistentslug')
        .expect(404);

      assert.strictEqual(response.text, 'URL not found');
    });
  });
});

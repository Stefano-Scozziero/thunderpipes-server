const request = require('supertest');
const app = require('../app');

describe('Server', () => {
    it('should handle 404 for unknown routes', async () => {
        const res = await request(app).get('/api/unknown-route-for-testing');
        expect(res.statusCode).toEqual(404);
    });
});

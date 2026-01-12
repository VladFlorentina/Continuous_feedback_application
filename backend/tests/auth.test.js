const request = require('supertest');
const { app, server } = require('../index');
const db = require('../config/database');

describe('Auth API', () => {

    
    afterAll(async () => {
        await db.sequelize.close(); 
        server.close(); 
    });

    test('Health Check - GET /', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Server functional');
    });

    test('Login cu user inexistent - POST /api/auth/login', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'nu_exista@test.com',
            password: '123'
        });
        expect(res.statusCode).toEqual(401);
    });

    test('Login cu admin valid (admin2@test.com) - POST /api/auth/login', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'admin2@test.com',
            password: 'adminpassword'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.role).toBe('admin');
    });

    test('Register cu parola scurta - POST /api/auth/register', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'Test User',
            email: 'test_invalid@test.com',
            password: '123' 
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toBeDefined();
    });
});

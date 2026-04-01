const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const authRoutes = require('../src/routes/auth');
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropCollection('users').catch(() => {});
  await mongoose.connection.close();
});

// Test — Admin login with wrong password fails
test('POST /api/auth/login — rejects wrong password', async () => {
  await request(app).post('/api/auth/setup');
  
  const res = await request(app).post('/api/auth/login').send({
    email: process.env.ADMIN_EMAIL,
    password: 'wrongpassword',
  });

  expect(res.statusCode).toBe(401);
  expect(res.body.success).toBe(false);
});

// Test — Admin login with correct credentials succeeds
test('POST /api/auth/login — succeeds with correct credentials', async () => {
  const res = await request(app).post('/api/auth/login').send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.token).toBeDefined();
});
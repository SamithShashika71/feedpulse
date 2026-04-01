const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Create a test app
const app = express();
app.use(express.json());

// Mock Groq AI so tests don't make real API calls
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                category: 'Feature Request',
                sentiment: 'Positive',
                priority_score: 7,
                summary: 'User wants a new feature',
                tags: ['UI', 'Feature'],
              }),
            },
          }],
        }),
      },
    },
  }));
});

const feedbackRoutes = require('../src/routes/feedback');
const authRoutes = require('../src/routes/auth');
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

let token;
let feedbackId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Create admin and get token
  await request(app).post('/api/auth/setup');
  const res = await request(app).post('/api/auth/login').send({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  token = res.body.data?.token;
});

afterAll(async () => {
  await mongoose.connection.dropCollection('feedbacks').catch(() => {});
  await mongoose.connection.dropCollection('users').catch(() => {});
  await mongoose.connection.close();
});

// Test 1 — Valid feedback submission saves to DB and triggers AI
test('POST /api/feedback — valid submission saves to DB and triggers AI', async () => {
  const res = await request(app).post('/api/feedback').send({
    title: 'Add dark mode feature',
    description: 'Please add a dark mode option to the dashboard for better usability at night',
    category: 'Feature Request',
    submitterName: 'Test User',
    submitterEmail: 'test@example.com',
  });

  expect(res.statusCode).toBe(201);
  expect(res.body.success).toBe(true);
  expect(res.body.data.title).toBe('Add dark mode feature');
  expect(res.body.data.ai_processed).toBe(true);
  feedbackId = res.body.data._id;
});

// Test 2 — Rejects empty title
test('POST /api/feedback — rejects empty title', async () => {
  const res = await request(app).post('/api/feedback').send({
    title: '',
    description: 'This is a description that is long enough to pass validation',
    category: 'Bug',
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.success).toBe(false);
  expect(res.body.error).toBe('Validation Error');
});

// Test 3 — Rejects short description
test('POST /api/feedback — rejects description under 20 characters', async () => {
  const res = await request(app).post('/api/feedback').send({
    title: 'Valid Title',
    description: 'Too short',
    category: 'Bug',
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.success).toBe(false);
});

// Test 4 — Status update works correctly
test('PATCH /api/feedback/:id — status update works correctly', async () => {
  const res = await request(app)
    .patch(`/api/feedback/${feedbackId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'In Review' });

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.status).toBe('In Review');
});

// Test 5 — Protected routes reject unauthenticated requests
test('GET /api/feedback — rejects unauthenticated requests', async () => {
  const res = await request(app).get('/api/feedback');

  expect(res.statusCode).toBe(401);
  expect(res.body.success).toBe(false);
});
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                category: 'Bug',
                sentiment: 'Negative',
                priority_score: 8,
                summary: 'App crashes when uploading files',
                tags: ['crash', 'upload', 'bug'],
              }),
            },
          }],
        }),
      },
    },
  }));
});

const { analyzeWithGemini } = require('../src/services/gemini.service');

// Test 1 — Groq service parses response correctly
test('analyzeWithGemini — parses AI response correctly', async () => {
  const result = await analyzeWithGemini(
    'App crashes on upload',
    'The app crashes every time I try to upload a file larger than 10MB'
  );

  expect(result.success).toBe(true);
  expect(result.data.category).toBe('Bug');
  expect(result.data.sentiment).toBe('Negative');
  expect(result.data.priority_score).toBe(8);
  expect(result.data.tags).toContain('crash');
});

// Test 2 — Groq service returns correct summary
test('analyzeWithGemini — returns correct summary', async () => {
  const result = await analyzeWithGemini(
    'App crashes on upload',
    'The app crashes every time I try to upload a file larger than 10MB'
  );

  expect(result.success).toBe(true);
  expect(result.data.summary).toBe('App crashes when uploading files');
});

// Test 3 — Groq service returns tags array
test('analyzeWithGemini — returns tags as array', async () => {
  const result = await analyzeWithGemini(
    'App crashes on upload',
    'The app crashes every time I try to upload a file larger than 10MB'
  );

  expect(result.success).toBe(true);
  expect(Array.isArray(result.data.tags)).toBe(true);
  expect(result.data.tags.length).toBeGreaterThan(0);
});
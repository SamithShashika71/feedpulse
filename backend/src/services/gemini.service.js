const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeWithGemini = async (title, description) => {
  try {
    const prompt = `Analyse this product feedback. Return ONLY valid JSON with no markdown, no backticks, no explanation — just the raw JSON object with these exact fields:
{
  "category": "Bug" or "Feature Request" or "Improvement" or "Other",
  "sentiment": "Positive" or "Neutral" or "Negative",
  "priority_score": a number from 1 to 10,
  "summary": "one sentence summary of the feedback",
  "tags": ["tag1", "tag2", "tag3"]
}

Feedback Title: ${title}
Feedback Description: ${description}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return { success: true, data: parsed };
  } catch (error) {
    console.error('Groq API error:', error.message);
    return { success: false, data: null };
  }
};

module.exports = { analyzeWithGemini };
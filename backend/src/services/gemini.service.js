const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeWithGemini = async (title, description) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Clean response in case Gemini adds backticks
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return {
      success: false,
      data: null,
    };
  }
};

module.exports = { analyzeWithGemini };
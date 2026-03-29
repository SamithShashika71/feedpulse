const Feedback = require('../models/Feedback');
const { analyzeWithGemini } = require('../services/gemini.service');

// @route   POST /api/feedback
// @access  Public
const submitFeedback = async (req, res) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    // Input sanitisation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Validation Error',
        message: 'Title, description and category are required',
      });
    }

    if (title.length > 120) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Validation Error',
        message: 'Title cannot exceed 120 characters',
      });
    }

    if (description.length < 20) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Validation Error',
        message: 'Description must be at least 20 characters',
      });
    }

    const validCategories = ['Bug', 'Feature Request', 'Improvement', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Validation Error',
        message: 'Invalid category',
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      title: title.trim(),
      description: description.trim(),
      category,
      submitterName: submitterName ? submitterName.trim() : undefined,
      submitterEmail: submitterEmail ? submitterEmail.trim() : undefined,
    });

    // Call Gemini AI — feedback is saved even if AI fails
    const aiResult = await analyzeWithGemini(title, description);

    if (aiResult.success && aiResult.data) {
      feedback.ai_category = aiResult.data.category;
      feedback.ai_sentiment = aiResult.data.sentiment;
      feedback.ai_priority = aiResult.data.priority_score;
      feedback.ai_summary = aiResult.data.summary;
      feedback.ai_tags = aiResult.data.tags;
      feedback.ai_processed = true;
      await feedback.save();
    }

    res.status(201).json({
      success: true,
      data: feedback,
      error: null,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @route   GET /api/feedback
// @access  Admin
const getAllFeedback = async (req, res) => {
  try {
    const {
      category,
      status,
      sort,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ai_summary: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'priority') sortOption = { ai_priority: -1 };
    if (sort === 'sentiment') sortOption = { ai_sentiment: 1 };
    if (sort === 'date_asc') sortOption = { createdAt: 1 };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Feedback.countDocuments(query);

    const feedbacks = await Feedback.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: {
        feedbacks,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      error: null,
      message: 'Feedback fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @route   GET /api/feedback/summary
// @access  Admin
const getAISummary = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentFeedback = await Feedback.find({
      createdAt: { $gte: sevenDaysAgo },
      ai_processed: true,
    }).select('title ai_summary ai_tags ai_category ai_sentiment');

    if (recentFeedback.length === 0) {
      return res.status(200).json({
        success: true,
        data: { summary: 'No feedback received in the last 7 days.' },
        error: null,
        message: 'No recent feedback found',
      });
    }

    const feedbackText = recentFeedback
      .map((f) => `- ${f.title}: ${f.ai_summary}`)
      .join('\n');

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on these product feedback summaries from the last 7 days, identify the top 3 themes. Return ONLY valid JSON with no markdown:
{
  "themes": [
    { "theme": "theme name", "description": "brief description", "count": number },
    { "theme": "theme name", "description": "brief description", "count": number },
    { "theme": "theme name", "description": "brief description", "count": number }
  ]
}

Feedback:
${feedbackText}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    res.status(200).json({
      success: true,
      data: parsed,
      error: null,
      message: 'AI summary generated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @route   GET /api/feedback/:id
// @access  Admin
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Not Found',
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
      error: null,
      message: 'Feedback fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @route   PATCH /api/feedback/:id
// @access  Admin
const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['New', 'In Review', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Validation Error',
        message: 'Invalid status value',
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Not Found',
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
      error: null,
      message: 'Status updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @route   DELETE /api/feedback/:id
// @access  Admin
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Not Found',
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      data: null,
      error: null,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @route   POST /api/feedback/:id/reanalyze
// @access  Admin
const reanalyzeWithAI = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Not Found',
        message: 'Feedback not found',
      });
    }

    const aiResult = await analyzeWithGemini(feedback.title, feedback.description);

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        data: null,
        error: 'AI Error',
        message: 'Failed to re-analyze feedback with AI',
      });
    }

    feedback.ai_category = aiResult.data.category;
    feedback.ai_sentiment = aiResult.data.sentiment;
    feedback.ai_priority = aiResult.data.priority_score;
    feedback.ai_summary = aiResult.data.summary;
    feedback.ai_tags = aiResult.data.tags;
    feedback.ai_processed = true;
    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback,
      error: null,
      message: 'Feedback re-analyzed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @route   GET /api/feedback/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments();
    const open = await Feedback.countDocuments({ status: { $in: ['New', 'In Review'] } });

    const priorityResult = await Feedback.aggregate([
      { $match: { ai_priority: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$ai_priority' } } },
    ]);
    const avgPriority = priorityResult.length > 0
      ? Math.round(priorityResult[0].avg * 10) / 10
      : 0;

    const tagsResult = await Feedback.aggregate([
      { $unwind: '$ai_tags' },
      { $group: { _id: '$ai_tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const mostCommonTag = tagsResult.length > 0 ? tagsResult[0]._id : 'N/A';

    res.status(200).json({
      success: true,
      data: { total, open, avgPriority, mostCommonTag },
      error: null,
      message: 'Stats fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  getAISummary,
  reanalyzeWithAI,
  getStats,
};
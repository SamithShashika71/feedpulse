const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    category: {
      type: String,
      enum: ['Bug', 'Feature Request', 'Improvement', 'Other'],
      required: [true, 'Category is required'],
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Resolved'],
      default: 'New',
    },
    submitterName: {
      type: String,
      trim: true,
    },
    submitterEmail: {
      type: String,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    // AI fields — populated after Gemini responds
    ai_category: { type: String },
    ai_sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
    },
    ai_priority: {
      type: Number,
      min: 1,
      max: 10,
    },
    ai_summary: { type: String },
    ai_tags: [{ type: String }],
    ai_processed: { type: Boolean, default: false },
  },
  {
    timestamps: true, // auto createdAt + updatedAt
  }
);

// MongoDB indexes for query performance
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ ai_priority: -1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
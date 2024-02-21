const mongoose = require('mongoose');

const cosinSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  messages: [
    {
      situationJudgment_result: String,
      procedure_result: String,
      documentLists_result: String,
      similarCases_result: String,
      litigationPrediction_result: String,
      verdict_result: String,
      situationSummary_reuslt: String,
      timestamp: Date,
    },
  ],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cosin_', cosinSchema);

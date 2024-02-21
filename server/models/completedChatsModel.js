const mongoose = require('mongoose');

const completedChatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  messages: [
    {
      question: String,
      answer: String,
      timestamp: Date,
    },
  ],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CompletedChat', completedChatSchema);

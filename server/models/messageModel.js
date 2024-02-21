const mongoose = require('mongoose');

// 스키마 생성
const messageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  messages: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// 내보내기
module.exports = mongoose.model('Message', messageSchema);

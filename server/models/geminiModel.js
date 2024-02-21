const mongoose = require('mongoose');

const geminiSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  messages: [
    {
      buildingType: String,
      rentalType: String,
      perpetrator: String,
      fraudType: String,
      damageAmount: String,
      numberOfVictims: String,
      briefSituation: String,
      timestamp: Date,
    },
  ],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gemini', geminiSchema);

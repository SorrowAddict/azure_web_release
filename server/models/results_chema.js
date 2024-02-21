const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  situationJudgment: { type: String, required: true }, // 상황 판단 결과
  procedure: { type: String, required: true }, // 절차
  documentLists: { type: String, required: true }, // 써야 되는 서류 목록
  litigationPrediction: { type: String, required: true }, // 소송 결과 예측
  verdict: { type: String, required: true }, // 판결문
  situationSummary: { type: String, required: true }, // 문장 변환 결과
});

module.exports = mongoose.model('Result', resultSchema);

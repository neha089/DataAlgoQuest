const mongoose = require('mongoose');

const dataStructureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notes: [{ description: { type: String } }],
  tests: [{
    totalQuestions: { type: Number },
    totalScoreOfQuiz: { type: Number },
    currentScore: { type: Number },
    highestScore: { type: Number },
    status: { type: String },
    quiz: [{
      question: { type: String },
      answer: { type: String },
      options: [{ type: String }],
      status: { type: String }
    }]
  }]
});

module.exports = mongoose.models.DataStructure || mongoose.model('DataStructure', dataStructureSchema);

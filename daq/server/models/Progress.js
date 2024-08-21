const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
  quiz_scores: {
    type: Number,
    default: 0,
  },
  challenge_scores: {
    type: Number,
    default: 0,
  },
  // Other fields can be added here
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;

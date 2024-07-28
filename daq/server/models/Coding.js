const mongoose = require('mongoose');

const codingSchema = new mongoose.Schema({
  problems: [{
    name: { type: String, required: true },
    link: { type: String, required: true },
    status: { type: String },
    level: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    revision: { type: Boolean, default: 0 },
    notes: { type: String },
    score: { type: Number, default: function () {
      switch (this.level) {
        case 'easy': return 2;
        case 'medium': return 4;
        case 'hard': return 8;
        default: return 0;
      }
    } }
  }]
});

module.exports = mongoose.models.Coding || mongoose.model('Coding', codingSchema);
 
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bug: { type: String },
  feedback: { type: Number, min: 1, max: 5 }
});

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
 
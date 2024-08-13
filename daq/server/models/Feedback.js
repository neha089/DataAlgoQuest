const mongoose = require('mongoose');
const Schema=require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_id:{type:Schema.Types.ObjectId,ref:'User',required:true},
  bug: { type: String },
  feedback: { type: Number, min: 1, max: 5 },
  created_at:{type:Date,default:Date.now}
});

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
 
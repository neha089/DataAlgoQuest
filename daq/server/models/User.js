const mongoose = require('mongoose');
const {Schema}=mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  progress:[ProgressSchema],
  created_at:{type:Date ,default:Date.now},
  updated_at:{type:Date,default:Date.now}
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

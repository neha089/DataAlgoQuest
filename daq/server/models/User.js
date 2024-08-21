const mongoose = require('mongoose');
const { Schema } = mongoose;
const Progress = require('./progress'); // Adjust the path if necessary

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  progress:  { type: Schema.Types.ObjectId, ref: 'Progress' } , // Reference Progress schema
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

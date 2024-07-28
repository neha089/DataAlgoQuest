const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, default: "admin" },
  email: { type: String, default: "admin@gmail.com" },
  password: { type: String, required: true }
});

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

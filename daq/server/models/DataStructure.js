const mongoose = require('mongoose');
const { Schema } = mongoose; // Correctly destructure Schema from mongoose

const dataStructureSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  note: [{ type: Schema.Types.ObjectId, ref: 'Note' }], // Reference the Note schema
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.models.DataStructure || mongoose.model('DataStructure', dataStructureSchema);

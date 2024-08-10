const mongoose = require('mongoose');
const Schema=require('mongoose');

const dataStructureSchema = new Schema({
  name: { type: String, required: true },
  description :{type:String},
  notes:[NoteSchema],
  created_at:{type:Date,default:Date.now},
  updated_at:{type:Date,default:Date.now}

});

module.exports = mongoose.models.DataStructure || mongoose.model('DataStructure', dataStructureSchema);

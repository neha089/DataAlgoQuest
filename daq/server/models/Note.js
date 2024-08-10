const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Add this field
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

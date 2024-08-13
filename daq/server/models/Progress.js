const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProgressSchema = new Schema({
    data_structure_id: { type: Schema.Types.ObjectId, ref: 'DataStructure' },
    quiz_scores: [{ type: Schema.Types.ObjectId, ref: 'QuizAttempt' }],
    challenge_scores: [{ type: Schema.Types.ObjectId, ref: 'ChallengeAttempt' }]
});

module.exports = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);

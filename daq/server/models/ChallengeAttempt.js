const mongoose = require('mongoose'); // Corrected the typo
const { Schema } = mongoose; // Correctly destructure Schema from mongoose

const ChallengeAttemptSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    challenge_id: { type: Schema.Types.ObjectId, ref: 'CodingChallenge' },
    solved: { type: Boolean, default: false },
    score: { type: Number, required: true },
    completed_at: { type: Date, default: Date.now }
});
module.exports = mongoose.models.ChallengeAttempt || mongoose.model('ChallengeAttempt', ChallengeAttemptSchema);

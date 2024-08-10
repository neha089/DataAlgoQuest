const moongoose=require('moongoose');
const Schema=require('mongoose');
const ChallengeAttemptSchema =new Schema({
    user_id:{type:Schema.Types.ObjectId , ref:'User'},
    challenge:{type:Schema.Types.ObjectId , ref:'CodingChallenge'},
    solved:{type:Boolean , default:false},
    score:{type:Number , required:true},
    completed_at:{type : Date , default :Date.now}
})
module.exports = mongoose.models.ChallengeAttempt || mongoose.model('ChallengeAttempt', ChallengeAttemptSchema);

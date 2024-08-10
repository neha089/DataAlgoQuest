const mongoose = require('mongoose');
const {Schema}=mongoose;
const QuizAttemptSchema=new Schema({
    user_id:{type:Schema.Types.ObjectId,ref:'User'},
    quiz_id:{type:Schema.Types.ObjectId,ref:'Quiz'},
    score:{type:Number, required:true},
    completed_at:{type:Date,default:Date.now}
})
module.exports = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);

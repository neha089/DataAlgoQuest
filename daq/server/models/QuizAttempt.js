const mongoose = require('mongoose');
const {Schema}=mongoose;
const QuizAttemptSchema=new Schema({
    user_id:{type:Schema.Types.ObjectId,ref:'User',required:true},
    quiz_id:{type:Schema.Types.ObjectId,ref:'Quiz',required:true},
    current_score:{type:Number, required:true},
    highest_score:{type:Number,required:true},
    completed_at:{type:Date,default:Date.now},
    updated_at:{type:Date,default:Date.now}
})
module.exports = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);

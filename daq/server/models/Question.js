const mongoose = require('mongoose');
const {Schema}=mongoose;
const QuestionSchema=new Schema({
    question:{type:String,required:true},
    options:[{type:String , required:true}],
    correct_answer:{type:String, required:true}
})
module.exports = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

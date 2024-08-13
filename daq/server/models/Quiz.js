const mongoose = require('mongoose');
const {Schema}=mongoose;
const QuizSchema=new Schema({
    title:{type:String , required:true},
    question: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // Reference the Note schema
    data_structure_id:{type:Schema.Types.ObjectId,ref:'DataStructure'},
    created_at:{type:Date , default:Date.now},
    updated_at:{type:Date,default:Date.now}
})
module.exports = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const CodingChallengeSchema =  Schema({
    title: { type: String, required: true },
    problem_statement: { type: String, required: true },
    link:{type:String,required:true},
    revision:{type:Boolean , default:false},
    level: { 
        type: String, 
        required: true, 
        enum: ['hard', 'medium', 'easy'] 
    },
    data_structure_id: { type: Schema.Types.ObjectId, ref: 'DataStructure', required: true },
    note: [ { type: Schema.Types.ObjectId, ref: 'Note' } ], // Reference Progress schema
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.models.CodingChallenge || mongoose.model('CodingChallenge', CodingChallengeSchema);

const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },

    user:{
        type:String,
        required:true,
    },

    body:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model("PostComment", postCommentSchema);
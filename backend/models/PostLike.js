const mongoose = require('mongoose');

const postLikeSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
    },
    postUser:{
        type:String,
    },
});

module.exports = mongoose.model('postLike', postLikeSchema);
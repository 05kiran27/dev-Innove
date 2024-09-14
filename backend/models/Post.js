const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postTitle:{
        type:String,
    },
    postDescription:{
        type:String,
    },
    postImage:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    postLikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"postLike",
        }
    ],
    postComment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"PostComment"
        }
    ]   
});

module.exports = mongoose.model("Post", postSchema);
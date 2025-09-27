// const mongoose = require('mongoose');

// const postCommentSchema = new mongoose.Schema({
//     post:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Post",
//         required:true,
//     },

//     user:{
//         type:String,
//         required:true,
//     },

//     body:{
//         type:String,
//         required:true,
//     }
// });

// module.exports = mongoose.model("PostComment", postCommentSchema);


const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: "User", // This allows you to use .populate() to get user details
        required: true,
    },

    body: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("PostComment", postCommentSchema);

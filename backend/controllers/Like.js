const User = require('../models/User');
const Post = require('../models/Post');
const { post } = require('../routes/authRoute');
const PostLike = require('../models/PostLike')


exports.like = async (req,res) => {
    try{
        const {postId} = req.body;

        const userId = req.user.id;

        if(!postId){
            return res.status(404).json({
                success:true,
                message:"post id required ",
            })
        }

        // fetch post
        const postDetails = await Post.findById(postId);
        console.log('post details => ', postDetails);

        // validate post
        if(!postDetails){
            return res.status(404).json({
                success:false,
                message:"Post not found, or post might be deleted ",
            })
        }

        // fetch user
        const userDetails = await User.findById(
            {_id:userId},
        )

        // validate user details
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"please log in or user not found",
            })
        }

        // Check if the user has already liked the post
        const isLiked = postDetails.postLikes.includes(userId);

        if (isLiked) {
            // If the user has already liked the post, remove the like
            await Post.findByIdAndUpdate(
                {_id:postDetails._id},
                {
                    $pull:{
                        postLikes:userDetails._id,
                    }
                },
                {new:true},
            );
        } 
        
        else {
            // If the user has not liked the post, add the like
            await Post.findByIdAndUpdate(
                {_id:postDetails._id},
                {
                    $push:{
                        postLikes:userDetails._id,
                    }
                },
                {new:true},
            );
        }

        // Save the updated post
        const updatedPost = await postDetails.save();

        if (!updatedPost) {
            throw new Error("Failed to update post likes");
        }

        console.log('Updated Post:', updatedPost); 

        return res.status(200).json({
            success: true,
            message: isLiked ? "Post unliked" : "Post liked",
            likeCount: post.likeCount,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot like the post please try after some time"
        })
    }
};
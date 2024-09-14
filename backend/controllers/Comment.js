const Post = require('../models/Post');
const PostComment = require('../models/PostComment');
const User = require('../models/User');

exports.postComment = async (req,res) => {
    try{
        const {postId, body} = req.body;
        const userId = req.user.id;

        if(!postId){
            return res.status(404).json({
                success:false,
                message:"post id not found, please enter the post id",
            });
        }

        if(!body){
            return res.status(403).json({
                success:false,
                message:"please enter the comment to post comment"
            })
        }

        const postDetails = await Post.findById(postId);

        if(!postDetails){
            return res.status(404).json({
                success:false,
                message:"post not found"
            })
        }

        const userDetails = await User.findById({_id:userId});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"please log in to post comment on this post",
            })
        }

        // now post the comment
        const comment = await PostComment.create(
            {
                post:postDetails._id,
                user:userDetails._id,
                body,
            }
        )

        // add post id into post data
        await Post.findByIdAndUpdate(
            {_id:postDetails._id},
            {
                $push:{
                    postComment:comment._id,
                }
            },
            {new:true},
        );

        // return response
        return res.status(200).json({
            success:true,
            message:"comment successful",
            comment,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in posting comment",
        })
    }
};
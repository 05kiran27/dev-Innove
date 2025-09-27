const Post = require('../models/Post');
const User = require('../models/User');
const uploadFileToCloudinary = require('../utils/fileUpload');
const postLike = require('../models/PostLike');

// create course handler function
exports.createPost = async (req,res) => {
    try{
        // fetch data
        const {postTitle, postDescription} = req.body;

        console.log('post Title -> ', postTitle);
        console.log('post description -> ', postDescription);

        // get thumbnails
        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!postTitle || !postDescription){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        // user details
        const userId = req.user.id;
        const userDetails = await User.findById(userId);
        console.log("userDetails details -> ", userDetails);

        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"user not found, please login ",
            });
        }

        // upload image to cloudinary
        console.log("thumbnail -> ", thumbnail);
        const thumbnailImage = await uploadFileToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log('thumbnail image => ', thumbnailImage);

        // post like
        const postLikeDetails = await postLike.create({
            postUser:null,
        })

        // create an entry of new post
        const newPost = await Post.create({
            postTitle,
            postDescription,
            user:userDetails._id,
            postImage: thumbnailImage.secure_url,
            postLikes:postLikeDetails,
        });
        console.log('new post => ', newPost);

        // add the post into the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:userDetails._id},
            {
                $push:{
                    post:newPost._id,
                }
            },
            {new:true},
        );

        // return res
        return res.status(200).json({
            success:true,
            message:"post created successfully",
            data:newPost,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'failed to create a post',
            message:error.message,
        });
    }
};


// update post
exports.getPostDetails = async (req,res) => {
    try{
        const postId = req.params.postId;

        // validation
        if(!postId){
            return res.status(404).json({
                success:false,
                message:"post id not found while getting Post Details"
            });
        }

        // geting post details
        const postDetails = await Post.findById(
            {_id:postId},
        ).populate(
            {
                path:"user",
                populate:{
                    path:"additionalDetails"
                }
            }
        )
        // .populate('postLike')
        // .populate('postComment')
        .exec();

        console.log('post details => ', postDetails);
    
        if(!postDetails){
            return res.status(404).json({
                success:false,
                message:"Post not found ",
            })
        }

        // return response
        return res.status(200).json({
            success:true,
            message:"post details fetched successfully",
            data:postDetails,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot get post , please try after some time",
        });
    }
};


// update post 
exports.updatePost = async (req,res) => {
    try{
        const {postId, postTitle="",postDescription=""  } = req.body;

        // validate data
        if(!postId || !postTitle || !postDescription ){
            return res.status(404).json({
                success:false,
                message:"all fields are required ",
            });
        };

        // get post
        const postDetails = await Post.findById(
            {_id:postId},
        ).exec();

        // if post not foud
        if(!postDetails){
            return res.status(404).json({
                success:false,
                message:"post not found",
            })
        };
        console.log('post details => ', postDetails);

        // fetch image
        image = req.files.postImage;
        console.log("post image => ", image);

        

        // get user id from post
        const postOwner = postDetails.user;
        console.log("post ke malik ki user id => ", postOwner);

        // get user id of user or viewer
        const viewerId = req.user.id;
        console.log('viewer id => ', viewerId);

        if(postOwner != viewerId){
            return res.status(400).json({
                success:false,
                message:"you are not alowed to update the post",
            });
        }

        // upload image to cloudinary
        cloudinaryImage = await uploadFileToCloudinary(image, process.env.FOLDER_NAME);
        
        postDetails.postTitle = postTitle;
        postDetails.postDescription = postDescription;
        postDetails.postImage = cloudinaryImage.secure_url;
        
        await postDetails.save();

        // return res
        return res.status(200).json({
            success:true,
            message:"Post updated successfully",
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in deleting post, please try after some time",
        });
    }
};


// delete post 
exports.deletePost = async (req,res) => {
    try{
        // fetch post id
        const {postId} = req.body;

        const userId = req.user.id;

        // validation
        if(!postId){
            return res.status(404).json({
                success:false,
                message:"post id not found"
            })
        }

        // check post exist or not
        const postDetails = await Post.findById(
            {_id:postId},
        )
        
        if(!postDetails){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }

        // check post owner and login user
        postOwner = postDetails.user;

        if(postOwner != userId){
            return res.status(400).json({
                success:true,
                message:"You don't own this post",
            })
        }


        // delete the post
        await Post.findByIdAndDelete(postId);

        // update post schema of user
        
        await User.findByIdAndUpdate(userId, { $pull: { post: postId } })

        // return response
        return res.status(200).json({
            success:true,
            message:"Post deleted successfully",
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in deleting post, please try after some time",
        });
    }
}

exports.getUserPost = async (req,res) => {
    
    try{
        const { userId } = req.params;
        const user = User.findById({userId});

        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found while getting the all post of the user"
            })
        }

        const post = user.populate('post').exec();

        return res.status(200).json({
            success:true,
            message:"all post of the user fetch successfully ",
            post
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:`Internal server Error in getUser post`,
        })
    }
}
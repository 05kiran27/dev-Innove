const User = require('../models/User');
const Post = require('../models/Post');
const { post } = require('../routes/authRoute');
const PostLike = require('../models/PostLike')
const Notification = require('../models/Notification');


// Like Controller in Backend
exports.like = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user.id;

        if (!postId) {
            return res.status(404).json({
                success: true,
                message: "Post ID required",
            });
        }

        // Fetch post
        const postDetails = await Post.findById(postId);
        // console.log('post details => ', postDetails.user);

        // Validate post
        if (!postDetails) {
            return res.status(404).json({
                success: false,
                message: "Post not found, or post might be deleted",
            });
        }

        // Fetch user
        const userDetails = await User.findById({ _id: userId });

        // console.log('userDetails' , userDetails);

        // Validate user details
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "Please log in or user not found",
            });
        }

        // Check if the user has already liked the post
        const isLiked = postDetails.postLikes.includes(userId);

        if (isLiked) {
            // If the user has already liked the post, remove the like
            await Post.findByIdAndUpdate(
                { _id: postDetails._id },
                {
                    $pull: {
                        postLikes: userDetails._id,
                    },
                },
                { new: true },
            );

            const notification = await Notification.create({
                recipient: postDetails.user,  
                sender: userId, 
                type: 'post_unliked',
                message: `${userDetails.firstName} ${userDetails.lastName} unliked your post.`,
                referenceId: postDetails._id,
                referenceModel: 'Post'
            });

            // Push the notification ID into the recipient's notification array
            await User.findByIdAndUpdate(
                postDetails.user,
                { $push: { notification: notification._id } }, // Add the notification ID to the user's notification array
                { new: true }
            );


        } else {
            // If the user has not liked the post, add the like
            await Post.findByIdAndUpdate(
                { _id: postDetails._id },
                {
                    $push: {
                        postLikes: userDetails._id,
                    },
                },
                { new: true },
            );

            const notification = await Notification.create({
                recipient: postDetails.user,  
                sender: userId, 
                type: 'post_liked',
                message: `${userDetails.firstName} ${userDetails.lastName} liked your post.`,
                referenceId: postDetails._id,
                referenceModel: 'Post'
            });

            // Push the notification ID into the recipient's notification array
            await User.findByIdAndUpdate(
                postDetails.user,
                { $push: { notification: notification._id } }, // Add the notification ID to the user's notification array
                { new: true }
            );

        }

        // Save the updated post
        const updatedPost = await Post.findById(postId); // Fetch the updated post

        if (!updatedPost) {
            throw new Error("Failed to update post likes");
        }

        
        return res.status(200).json({
            success: true,
            message: isLiked ? "Post unliked" : "Post liked",
            likeCount: updatedPost.postLikes.length, // Return updated like count
            userHasLiked: !isLiked, // Indicate the current like status
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot like the post, please try after some time",
        });
    }
};

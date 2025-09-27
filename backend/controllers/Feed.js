const Post = require('../models/Post');

exports.postFeed = async (req, res) => {
    try {
        const userId = req.user.id; 

        const posts = await Post.find()
            .populate({
                path: "user",
            })
            .sort({ createdAt: -1 });

        if (!posts) {
            return res.status(404).json({
                success: false,
                message: "No post found",
            });
        }

        // Add userHasLiked to each post
        const postsWithLikeStatus = posts.map(post => ({
            ...post._doc, // Use _doc to get the plain JS object
            userHasLiked: post.postLikes.includes(userId) // Check if user has liked the post
        }));

        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: postsWithLikeStatus,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot get the feed",
        });
    }
};



exports.getExplore = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10 } = req.query; // Default limit to 10 posts

        // Aggregation pipeline to fetch posts in random order and join user data
        const posts = await Post.aggregate([
            { $sample: { size: parseInt(limit) } }, // Randomize posts using MongoDB's $sample
            {
                $lookup: {
                    from: 'users', // Collection name of users
                    localField: 'user', // Field in the Post model (the ObjectId reference to the user)
                    foreignField: '_id', // Field in the User model (the ObjectId field)
                    as: 'user', // The result will be stored in the `user` field
                },
            },
            {
                $unwind: '$user', // Deconstruct the user array to a single object
            },
            {
                $sort: { createdAt: -1 }, // Sort by createdAt descending
            },
            {
                $project: {
                    _id: 1,
                    caption: 1,
                    postImage: 1, // Add mediaUrl for video or image
                    createdAt: 1,
                    postLikes: 1,
                    userHasLiked: { $in: [userId, '$postLikes'] }, // Check if user has liked the post
                    'user.firstName': 1,
                    'user.images': 1, // Include user fields
                },
            },
        ]);

        if (!posts.length) {
            return res.status(404).json({
                success: false,
                message: 'No posts found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Posts fetched successfully',
            data: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot get the explore feed',
        });
    }
};

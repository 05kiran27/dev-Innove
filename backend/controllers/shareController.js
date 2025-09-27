
// const Post = require('../models/Post');

// exports.getShareableLink = async (req, res) => {
//     try {
//         const { postId } = req.params;
//         console.log('controll in sharrController');

//         // Validate post ID
//         if (!postId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Post ID is required"
//             });
//         }

//         // Fetch post details
//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found"
//             });
//         }

//         // Generate shareable link (you could include more info if needed)
//         const shareableLink = `${req.protocol}://localhost:3000/post/${postId}`;
//         console.log("shareable link => ", shareableLink);

//         return res.status(200).json({
//             success: true,
//             message: "Shareable link generated successfully",
//             link: shareableLink
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error generating shareable link"
//         });
//     }
// };

const Post = require('../models/Post');
exports.getShareableLink = async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate post ID
        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        // Fetch post details to ensure the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Generate a shareable link to the frontend route
        // while deployment use this in place of localhost ${req.get('host')}
        const shareableLink = `${req.protocol}://localhost:3000/?postId=${postId}`;

        return res.status(200).json({
            success: true,
            message: "Shareable link generated successfully",
            link: shareableLink
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error generating shareable link"
        });
    }
};

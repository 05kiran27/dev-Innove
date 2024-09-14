const Post = require('../models/Post');


exports.postFeed = async (req,res) => {
    try{
        const posts = await Post.find()
                            .populate(
                                {
                                    path:"user",
                                }
                            )
                            .sort({ createdAt: -1 });
        
        if(!posts){
            return res.status(404).json({
                success:false,
                message:"No post found",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Post fetched successfully",
            data:posts,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot get the feed",
        })
    }
}
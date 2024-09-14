const User = require('../models/userModel');

exports.getUserForSidebar = async (req,res) => {
    try{
        const loggedInUserId = req.user._id;
        const filterUser = await User.find({
            _id:{$ne:loggedInUserId}
        }).select("-password")

        return res.status(200).json(filterUser);

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"error in userController"
        })
    }
}
const User = require('../models/User');
const Profile = require('../models/Profile');
const FileUpload = require('../utils/fileUpload');
const { post } = require('../routes/userRoute');

exports.updateProfile = async (req, res) => {

    try{
        // fetch data 
        const {dateOfBirth = "", gender="", contactNumber="", about=""} = req.body;
        // fetch user id
        const id = req.user.id;

        // find user profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update data into profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;

        profileDetails.save();

        // return response
        return res.status(200).json({
            success:true,
            message:"Profile Updated successfully",
        });
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error while updating profile",
        });
    }
}


exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not provided while getting user profile",
            });
        }

        // Use await to handle the async operation
        const user = await User.findById(
            {_id:userId},
        ).populate({
            path:"post",
        }).populate({
            path:"additionalDetails",
        })
        .exec();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found while getting user profile",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in get profile controller",
        });
    }
};

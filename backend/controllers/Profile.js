const User = require('../models/User');
const Profile = require('../models/Profile');
const FileUpload = require('../utils/fileUpload');

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

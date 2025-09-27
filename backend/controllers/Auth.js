// Authentication
const User = require('../models/User')
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const mailSender = require('../utils/mailSender');
const Profile = require('../models/Profile');

require('dotenv').config();

exports.sendOtpSignup = async (req,res) => {
    try{
        const {email} = req.body;
        console.log('email -> ', email);
        const checkUserPresent = await User.findOne({email});

        // user not present
        // if(checkUserPresent){
        //     return res.status(401).json({
        //         success: false,
        //         message:"user already exists",
        //     });
        // }

        // generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });

        //check unique otp or not
        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp})
        }
        console.log('otp -> ', otp)

        // entry of otp into database
        const otpPayload = {email, otp};
        console.log('otp-payload -> ', otpPayload);
        const otpBody = await OTP.create(otpPayload);
        console.log('otp body -> ', otpBody);

        // Load the HTML template and replace the {{OTP}} placeholder
        const filePath = path.join(__dirname, '../templates/verificationMail.html');
        let htmlTemplate = fs.readFileSync(filePath, 'utf8');

        const cssFilePath = path.join(__dirname, '../templates/verificationMail.css');
        const cssStyles = fs.readFileSync(cssFilePath, 'utf8');

        // Embed CSS into HTML
        htmlTemplate = htmlTemplate.replace('{{CSS}}', cssStyles);
        
        // Replace placeholder
        htmlTemplate = htmlTemplate.replace('{{OTP}}', otp);

        // Log the processed HTML to debug
        console.log('Processed HTML:', htmlTemplate);

        // Send email
        await mailSender(email, 'Dev and Innove', htmlTemplate);

        // return response
        return res.status(200).json({
            success:true,
            message:`Otp send successfully`,
            otp,
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"error in sending mail",
            message:error.message,
        })
    }
};

// SignUp 
// exports.signUp = async(req,res) => {
//     try{
//         // fetch data from req ki body
//         const {
//             firstName,
//             lastName,
//             email,
//             password,
//             confirmPassword,
//             accountType,
//             otp,
            
//         } = req.body;

//         console.log(firstName,
//             lastName,
//             email,
//             password,
//             confirmPassword,
//             accountType,
//             otp)

//         // validate data
//         // 1) all parameters are required
//         if(!firstName || !lastName || !email || !password || !confirmPassword){
//             return res.status(403).json({
//                 success:false,
//                 message:"all filled are required",
//             })
//         }

//         // 2) match password and confirm password
//         if(password!== confirmPassword){
//             return res.status(400).json({
//                 success:false,
//                 message:`Password and confirm password does not match, please check again`
//             });
//         }

//         // check user already exist or not
//         const existingUser = await User.findOne({email});
//         if(existingUser){
//             return res.status(400).json({
//                 success:false,
//                 message:`user already registered`
//             })
//         }

//         // check otp
//         const recentOtp = await OTP.findOne({ email: email }).sort({ createdAt: -1 });;
//         console.log("recent otp -> ", recentOtp);
//         // validation of otp
//         if(otp.length != 6){
//             return res.status(400).json({
//                 success:false,
//                 message:`please fill the whole otp`
//             });
//         }
//         else if(otp !== recentOtp.otp){
//             console.log("OTP => ", otp);
//             console.log("Actual OTP => ", recentOtp.otp);
//             return res.status(400).json({
//                 success:false,
//                 message:`Otp does not match`
//             });
//         }

//         // hash password
//         const hashedPassword = await bcrypt.hash(password,10);

//         // entry  into database

//         const profileDetails = await Profile.create({
//             gender:null,
//             dateOfBirth:null,
//             about:null,
//             contactNumber:null,
//         });

        

//         const user = await User.create({
//             firstName,
//             lastName,
//             email,
//             password:hashedPassword,
//             accountType,
//             additionalDetails:profileDetails._id,

//             images:`https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
//         })

//         const payload = {
//             email:user.email,
//             id: user.id,
//             accountType : user.accountType
//         }

//         const token = jwt.sign(payload, process.env.JWT_SECRET, {
//             expiresIn:'2h'
//         });

//         user.token = token;
//         user.password = undefined;

//         const options = {
//             expiresIn: new Date(Date.now()+3*24*60*60*1000),
//             httpOnly:true,
//         }

//         res.cookie('token', token, options).status(200).json({
//             success:true,
//             user,
//             token,
//             message:'User Registered successfully',
//         })

//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:`user cannot be registered, please try after some time`,
//         });
//     }
// };

exports.signUp = async (req, res) => {
    try {
        // Fetch data from req body
        const { firstName, lastName, email, password, confirmPassword, accountType, otp } = req.body;

        // Validate fields
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"password must have length more than 6"
            })
        }

        // Match passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        // Check OTP
        const recentOtp = await OTP.findOne({ email: email }).sort({ createdAt: -1 });
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found",
            });
        }
        if (otp.length !== 6) {
            return res.status(400).json({
                success: false,
                message: "Please fill the whole OTP",
            });
        }
        if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "OTP does not match",
            });
        }

        // Proceed with hashing password and saving user
        const hashedPassword = await bcrypt.hash(password, 10);
        const profileDetails = await Profile.create({ gender: null, dateOfBirth: null, about: null, contactNumber: null });

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            images: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        const payload = { email: user.email, id: user.id, accountType: user.accountType };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

        user.token = token;
        user.password = undefined;

        const options = { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), httpOnly: true };
        res.cookie('token', token, options).status(200).json({
            success: true,
            user,
            token,
            message: "User registered successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again later",
        });
    }
};



// login
exports.login = async (req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:`All fields are required`,
            });
        };

        // check email is registered or not
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User have not registered, please registered",
            })
        }

        // check password
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email:user.email,
                id: user.id,
                accountType : user.accountType
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:'2h'
            });

            user.token = token;
            user.password = undefined;

            const options = {
                expiresIn: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            console.log("Login controller executed successfully")
            res.cookie('token', token, options).status(200).json({
                success:true,
                user,
                token,
                message:'Login successfully from backend',
            })
            
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Wrong password",
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to log in, please try after some time",
        })
    }
};

exports.logout = async (req,res) => {
    try{
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({
            success:true,
            message:'logout successfully',
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'internal server error in logout auth controller'
        })
    }
}
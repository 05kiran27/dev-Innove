const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

exports.auth = async(req,res, next) => {
    try{
        // extract token
        const token = req.cookies.token || res.body.token || req.header("Authorisation").replace("Bearer ","");

        // if token missing then return response
        if(!token){
            return res.status(404).json({
                success:false,
                message:"token is missing, please login",
            });
        }

        // verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode -> ", decode);
            req.user = decode;
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"token is invalid, please log in",
            });
        }
        console.log("auth middleware executed successfully")
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in middleware auth while authentication, please log in again"
        })
    }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is the protected route for Admin only"
            })
        }
        console.log('isAdmin executed successfully');
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be varified, please try again",
        });
    }
}
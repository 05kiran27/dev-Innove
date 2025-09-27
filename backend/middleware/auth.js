
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        // extract token from cookies, body, or header
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
        
        // if token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing, please log in",
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;  // attach the decoded user info to req
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid, please log in again",
            });
        }

        // console.log("auth middleware executed successfully")

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in auth middleware, please log in again",
        });
    }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Access denied. Admins only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error verifying user role, please try again",
        });
    }
};

const express = require('express');
const router = express.Router();

const {signUp, login, sendOtpSignup, logout} = require('../controllers/Auth');

router.post('/sendOtp', sendOtpSignup);
router.post('/signup',signUp);
router.post('/login',login);
router.post('/logout', logout);

module.exports = router;
const express = require('express');
const router = express.Router();

const {signUp, login, sendOtpSignup} = require('../controllers/Auth');

router.post('/sendOtp', sendOtpSignup);
router.post('/signup',signUp);
router.post('/login',login);

module.exports = router;
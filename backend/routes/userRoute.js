const express = require('express');
const router = express.Router();

const {auth} = require('../middleware/auth');
const {updateProfile, getProfile} = require('../controllers/Profile');


router.post('/updateProfile',auth, updateProfile);
router.get('/get-profile/:userId',auth, getProfile);


module.exports = router;
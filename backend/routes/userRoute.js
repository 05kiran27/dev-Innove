const express = require('express');
const router = express.Router();

const {auth} = require('../middleware/auth');
const {updateProfile} = require('../controllers/Profile');


router.post('/updateProfile',auth, updateProfile);

module.exports = router;
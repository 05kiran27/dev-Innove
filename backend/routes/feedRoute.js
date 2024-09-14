const express = require('express');
const router = express.Router();

const {postFeed} = require('../controllers/Feed');
const { auth } = require('../middleware/auth');


router.get('/getFeed',auth, postFeed);

module.exports = router;
const express = require('express');
const router = express.Router();


const {auth} = require('../middleware/auth');
const {postComment} = require('../controllers/Comment');


router.post('/comment', auth, postComment);

module.exports = router;
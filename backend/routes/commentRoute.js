const express = require('express');
const router = express.Router();


const {auth} = require('../middleware/auth');
const {postComment, getCommentsForPost} = require('../controllers/Comment');


router.post('/comment', auth, postComment);
router.get('/comments/:postId',auth, getCommentsForPost);

module.exports = router;
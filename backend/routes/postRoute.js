const express = require('express');
const router = express.Router();


const {auth, isAdmin} = require('../middleware/auth');
const {createPost, getPostDetails, updatePost, deletePost, getUserPost} = require('../controllers/Post');


router.post('/createPost',auth, createPost);
router.get('/getPostDetails/:postId', getPostDetails);
router.put('/updatePost',auth, updatePost);
router.delete('/deletePost', auth, deletePost);
router.get('getUserPost', auth, getUserPost );

module.exports = router;
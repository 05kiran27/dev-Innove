const express = require('express');
const router = express.Router();


const {auth, isAdmin} = require('../middleware/auth');
const {createPost, getPostDetails, updatePost, deletePost} = require('../controllers/Post');


router.post('/createPost',auth, createPost);
router.get('/getPostDetails', getPostDetails);
router.put('/updatePost',auth, updatePost);
router.delete('/deletePost', auth, deletePost);

module.exports = router;
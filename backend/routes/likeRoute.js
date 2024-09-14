const express = require('express');
const router = express.Router();

const {like} = require('../controllers/Like');
const { auth } = require('../middleware/auth');


router.post('/like', auth, like);


module.exports = router;
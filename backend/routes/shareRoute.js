
const express = require('express');
const router = express.Router();

const { getShareableLink } = require('../controllers/shareController');
const { auth } = require('../middleware/auth');

router.get('/share/:postId', auth, getShareableLink);

module.exports = router;
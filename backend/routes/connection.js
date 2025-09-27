const express = require('express');
const router = express.Router();
const { toggleConnection, respondToConnectionRequest, Follow, isFollowing, isConnected } = require('../controllers/Connection')

router.post('/user/:userId/connect/:connectedUserId', toggleConnection);
router.post('/user/:connectedUserId/connections/:requestingUserId', respondToConnectionRequest);
router.post('/user/:userId/follow/:followUserId', Follow);
router.get('/user/:userId/isfollow/:followUserId', isFollowing);
router.get('/user/:userId/isConnected/:followUserId', isConnected);

module.exports = router;

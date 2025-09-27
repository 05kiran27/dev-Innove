const express = require('express');

const router = express.Router();

const { auth } = require('../middleware/auth');
const { getUserForSidebar, getMessage, sendMessage, getConversationExist } = require('../controllers/messageController');


router.post('/message/send/:id', auth, sendMessage);
router.get('/message/:id', auth, getMessage);
router.get('/message', auth, getUserForSidebar);
router.get('/conversations/check/:id', auth, getConversationExist);

module.exports = router;
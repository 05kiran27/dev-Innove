
const express = require('express');
const {  getNotifications, getUnreadNotificationCount, markNotificationAsRead,   } = require('../controllers/Notification');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Route to get all notifications for a user
router.get('/notifications', auth, getNotifications);

// Route to mark a specific notification as read
router.patch('/notifications/mark-as-read', auth, markNotificationAsRead);

router.get('/notifications/unread-count', auth, getUnreadNotificationCount);

module.exports = router;

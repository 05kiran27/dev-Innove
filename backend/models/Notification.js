// models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // User who will receive the notification

    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // User who triggered the notification (like, comment, follow)

    type: { 
        type: String, 
        enum: [
            'connection_request', 
            'connection_accepted', 
            'connection_rejected',
            'disconnected',
            'post_liked', 
            'post_unliked',
            'post_commented',
            'new_follower',
            'unfollow'
        ], 
        required: true 
    }, // Type of the notification

    message: { 
        type: String, 
        required: true 
    }, // Custom message for the notification

    isRead: { 
        type: Boolean, 
        default: false 
    }, // Tracks if the notification is read

    createdAt: { 
        type: Date, 
        default: Date.now 
    }, // Timestamp for the notification

    referenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'referenceModel' 
    }, // Dynamic reference to the post/comment

    referenceModel: { 
        type: String, 
        enum: ['Post', 'Comment', 'User'], 
        default: 'Post' 
    } // Type of the referenced model (post/comment/user)
});

module.exports = mongoose.model('Notification', notificationSchema);

const User = require('../models/User');
const Notification = require('../models/Notification');

exports.toggleConnection = async (req, res) => {
    try {
        const { userId, connectedUserId } = req.params;

        if (!userId || !connectedUserId) {
            return res.status(404).json({
                success: false,
                message: "User IDs not provided."
            });
        }

        // Fetch the user who is making the request and the connected user
        const user = await User.findById(userId);
        const connectedUser = await User.findById(connectedUserId);

        if (!user || !connectedUser) {
            return res.status(404).json({
                success: false,
                message: "One or both users not found."
            });
        }

        // Check if users are already connected
        const isConnected = user.connection.includes(connectedUserId);
        const isPending = connectedUser.pendingConnections.includes(userId);

        if (isConnected) {
            // If already connected, disconnect both users
            await User.findByIdAndUpdate(
                userId,
                { $pull: { connection: connectedUserId, following: connectedUserId } },
                { new: true }
            );
            await User.findByIdAndUpdate(
                connectedUserId,
                { $pull: { connection: userId, followers: userId } },
                { new: true }
            );

            // Create a notification for connectedUserId (user B)
            const notification = await Notification.create({
                recipient: connectedUserId, // User B
                sender: userId, // User A
                type: 'disconnect',
                message: `${user.firstName} ${user.lastName} has disconnect you.`,
                referenceId: userId, // User A's ID
                referenceModel: 'User'
            });

            console.log('notification => ', notification);

            // Add the notification to User B's notifications array
            await User.findByIdAndUpdate(
                connectedUserId,
                { $push: { notification: notification._id } },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "User disconnected successfully."
            });
        } else if (isPending) {
            await User.findByIdAndUpdate(
                userId,
                { $pull: { following: connectedUserId } },
                { new: true }
            );
            await User.findByIdAndUpdate(
                connectedUserId,
                { $pull: { pendingConnections:userId , followers: userId } },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "connection request removed successfully"
            });
        } else {
            // Add the user to the recipient's pendingConnections and update the following/followers list
            await User.findByIdAndUpdate(
                connectedUserId,
                { 
                    $push: { pendingConnections: userId, followers: userId } // Add person A (requester) to B's followers
                },
                { new: true }
            );

            // Add the connectedUser (person B) to the user's (person A's) following list
            await User.findByIdAndUpdate(
                userId,
                { 
                    $push: { following: connectedUserId } // Add person B to person A's following
                },
                { new: true }
            );

            // Create a notification for connectedUserId (user B)
            const notification = await Notification.create({
                recipient: connectedUserId, // User B
                sender: userId, // User A
                type: 'connection_request',
                message: `${user.firstName} ${user.lastName} has sent you a connection request.`,
                referenceId: userId, // User A's ID
                referenceModel: 'User'
            });

            // Add the notification to User B's notifications array
            await User.findByIdAndUpdate(
                connectedUserId,
                { $push: { notification: notification._id } },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Connection request sent, now following user."
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in connection controller inside the toggleConnection ."
        });
    }
};


exports.respondToConnectionRequest = async (req, res) => {
    try {
        const { connectedUserId, requestingUserId } = req.params;
        const { action } = req.body; // 'accept' or 'reject'

        const connectedUser = await User.findById(connectedUserId);
        const requestingUser = await User.findById(requestingUserId);

        if (!connectedUser || !requestingUser) {
            return res.status(404).json({
                success: false,
                message: "One or both users not found."
            });
        }

        const isPending = connectedUser.pendingConnections.includes(requestingUserId);

        if (!isPending) {
            return res.status(400).json({
                success: false,
                message: "No pending connection request found."
            });
        }

        if (action === 'accept') {
            // Move the user from pendingConnections to connections
            await User.findByIdAndUpdate(
                connectedUserId,
                {
                    $pull: { pendingConnections: requestingUserId }, // Remove from pending requests
                    $addToSet: { // Use $addToSet to prevent duplicates
                        connection: requestingUserId, 
                        following: requestingUserId, // Add to following if not already present
                        followers: requestingUserId  // Add to followers if not already present
                    }
                },
                { new: true }
            );
            await User.findByIdAndUpdate(
                requestingUserId,
                {
                    $addToSet: { // Use $addToSet to prevent duplicates
                        connection: connectedUserId, 
                        following: connectedUserId, // Add to following if not already present
                        followers: connectedUserId  // Add to followers if not already present
                    }
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Connection request accepted. You are now connected."
            });
        } else if (action === 'reject') {
            // Remove the user from pendingConnections and followers list
            await User.findByIdAndUpdate(
                connectedUserId,
                { $pull: { pendingConnections: requestingUserId, followers: requestingUserId } }, // Remove from followers
                { new: true }
            );
            await User.findByIdAndUpdate(
                requestingUserId,
                { $pull: { following: connectedUserId } }, // Remove from following
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "Connection request rejected."
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid action provided."
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in connection response route."
        });
    }
};



exports.Follow = async (req, res) => {
    try {
        const { userId, followUserId } = req.params;

        if (!userId || !followUserId) {
            return res.status(400).json({
                success: false,
                message: "User IDs not provided."
            });
        }

        // Fetch both users
        const user = await User.findById(userId);
        const followUser = await User.findById(followUserId);

        if (!user || !followUser) {
            return res.status(404).json({
                success: false,
                message: "One or both users not found."
            });
        }

        // Check if already following
        const isFollowing = user.following.includes(followUserId);

        if (isFollowing) {
            // If already following, perform unfollow
            await User.findByIdAndUpdate(
                userId,
                {
                    $pull: { following: followUserId } // Remove followUserId from following list
                },
                { new: true }
            );

            await User.findByIdAndUpdate(
                followUserId,
                {
                    $pull: { followers: userId } // Remove userId from followers list
                },
                { new: true }
            );

            const notification = await Notification.create({
                recipient: followUserId,  
                sender: userId, 
                type: 'unfollow',
                message: `${user.firstName} ${user.lastName} unfollow you.`,
                referenceId: userId,
                referenceModel: 'Post'
            });
    
            // Push the notification ID into the recipient's notification array
            await User.findByIdAndUpdate(
                followUserId,
                { $push: { notification: notification._id } }, // Add the notification ID to the user's notification array
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Successfully unfollowed the user."
            });

        } else {
            // If not following, perform follow
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { following: followUserId } // Add followUserId to following list
                },
                { new: true }
            );

            await User.findByIdAndUpdate(
                followUserId,
                {
                    $addToSet: { followers: userId } // Add userId to followers list
                },
                { new: true }
            );

            const notification = await Notification.create({
                recipient: followUserId,  
                sender: userId, 
                type: 'new_follower',
                message: `${user.firstName} ${user.lastName} Follow you.`,
                referenceId: userId,
                referenceModel: 'Post'
            });
    
            // Push the notification ID into the recipient's notification array
            await User.findByIdAndUpdate(
                followUserId,
                { $push: { notification: notification._id } }, // Add the notification ID to the user's notification array
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Successfully followed the user."
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in follow route."
        });
    }
};


exports.isFollowing = async (req, res) => {
    try {
        const { userId, followUserId } = req.params;

        // Check if userId and followUserId are provided
        if (!userId || !followUserId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Follow User ID are required"
            });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find the followUser by followUserId
        const followUser = await User.findById(followUserId);
        if (!followUser) {
            return res.status(404).json({
                success: false,
                message: "Followed user not found"
            });
        }

        // Check if the user is following the followUser
        const isFollow = user.following.includes(followUserId);

        // Return the result
        return res.status(200).json({
            success: true,
            isFollowing: isFollow
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


exports.isConnected = async (req, res) => {
    try {
        const { userId, followUserId } = req.params;

        // Check if userId and followUserId are provided
        if (!userId || !followUserId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Follow User ID are required"
            });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find the followUser by followUserId
        const followUser = await User.findById(followUserId);
        if (!followUser) {
            return res.status(404).json({
                success: false,
                message: "Followed user not found"
            });
        }

        // Check if the user is following the followUser
        const isFollow = user.connection.includes(followUserId);

        // Return the result
        return res.status(200).json({
            success: true,
            isConnected: isFollow
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message');
const { getReceiverSocketId, getSenderSocketId } = require('../Socket/socket');
const { io } = require('../Socket/socket'); 


exports.getSidebarUser = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        // Step 1: Find conversations where the logged-in user is a participant, sorted by the latest message (updatedAt)
        const conversations = await Conversation.find({
            participants: loggedInUserId
        }).sort({ updatedAt: -1 }); // Sort by the most recently updated conversation

        // Step 2: Extract unique user IDs of other participants from these conversations
        const userIds = [];
        const userIdsSet = new Set();

        conversations.forEach(conversation => {
            conversation.participants.forEach(participantId => {
                // Ensure participantId is valid and not the logged-in user
                if (participantId && participantId.toString() !== loggedInUserId.toString()) {
                    if (!userIdsSet.has(participantId.toString())) {
                        userIdsSet.add(participantId.toString());
                        userIds.push(participantId.toString()); // Maintain the order of conversations
                    }
                }
            });
        });

        // Step 3: Query the User collection to retrieve user details for these IDs
        const users = await User.find({
            _id: { $in: userIds }
        }).select('-password'); // Exclude password from the result

        // Step 4: Return the users ordered by their conversation recency
        const orderedUsers = userIds.map(userId => users.find(user => user._id.toString() === userId));

        // Emit the ordered users via WebSocket to update the frontend in real-time
        io.emit('conversation-updated', orderedUsers);

        // Send the response
        return res.status(200).json(orderedUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error in getUserForSidebar'
        });
    }
};
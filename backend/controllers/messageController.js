const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message');
const { getReceiverSocketId, getSenderSocketId } = require('../Socket/socket');
const { io } = require('../Socket/socket'); 
// const { getSidebarUser } = require('./Sidebar');


// Controller for sending a message
exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message content is required."
            });
        }

        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        // Check if a conversation between sender and receiver exists
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });

            // Update the conversationRoom for both participants
            await User.findByIdAndUpdate(senderId, {
                $push: { conversationRoom: conversation._id }
            });
            await User.findByIdAndUpdate(receiverId, {
                $push: { conversationRoom: conversation._id }
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        await newMessage.save();

        // Update the conversation with the new message
        await Conversation.findByIdAndUpdate(conversation._id, {
            $push: { messages: newMessage._id }
        });

        // Emit the new message to the receiver if they are online
        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getSenderSocketId(senderId);

        console.log('senderSocketId => ', senderSocketId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        if(senderSocketId){
            io.to(senderSocketId).emit('newMessage', newMessage);
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage,
            conversationId: conversation._id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error in sending message in message controller',
        });
    }
};





// Controller for retrieving messages in a conversation
exports.getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;

        // Find the conversation involving both participants
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate('messages'); // Populate messages for easy retrieval

        if (!conversation) {
            return res.status(200).json([]); // No conversation found, return empty array
        }

        const messages = conversation.messages;

        return res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error in getMessage in message controller',
        });
    }
};


  
exports.getConversationExist = async(req,res) => {
    try{
        const userId = req.user.id;
        const { id: profileId } = req.params;
        
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, profileId] },
        });
      
        if (conversation) {
            return res.status(200).json({ 
                success:true,
                message:'conversation exist',
                conversation 
            });
        }
      
        return res.status(200).json({ 
            success:true,
            conversation: null 
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error in conversation exist controller"
        })
    }
}


exports.getUserForSidebar = async (req, res) => {
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
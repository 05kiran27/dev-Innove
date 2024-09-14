const Conversation = require('../models/conversationModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const { getReceiverSocketId } = require('../socket/socket');
const { io } = require('../socket/socket'); // Ensure you import the io instance

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
        const senderId = req.user._id;

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
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage,
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
        const senderId = req.user._id;

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

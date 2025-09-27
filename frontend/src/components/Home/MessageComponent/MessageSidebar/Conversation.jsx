import React from 'react';
import useConversation from '../../../../zustand/useConversation';
import { useSocketContext } from '../../../../context/SocketContext';

const Conversation = ({ conversation, lastIdx, emoji }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();  // Get/set the selected conversation
    const isSelected = selectedConversation?._id === conversation?._id;

    const { onlineUsers } = useSocketContext(); 
    const isOnline = conversation && onlineUsers.includes(conversation._id); 

    const handleConversationClick = () => {
        // Set the selected conversation when clicked
        setSelectedConversation(conversation);
    };

    // Conditional rendering when conversation is missing
    if (!conversation) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-black">
                    No participant to chat, please send a message to your friend.
                </p>
            </div>
        );
    }

    return (
        <>
            <div
                className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${isSelected ? 'bg-sky-500' : ''}`}
                onClick={handleConversationClick}
            >
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className="w-12 rounded-full border-[2px] border-red-500">
                        <img src={conversation.images} alt="user avatar" className="rounded-full" />
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <div className="flex gap-3 justify-between">
                        <p className="font-bold text-gray-900">
                            {conversation.firstName} {conversation.lastName}
                        </p>
                        <span className="text-xl">{emoji}</span>
                    </div>
                </div>
            </div>

            {!lastIdx && <div className="divider my-0 py-0 h-1" />}
        </>
    );
};

export default Conversation;

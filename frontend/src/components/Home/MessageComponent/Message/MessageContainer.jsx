

import React, { useEffect } from 'react';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { BsChatLeftDots } from "react-icons/bs";
import useConversation from '../../../../zustand/useConversation';
import { useAuthContext } from '../../../../context/AuthContext';

const MessageContainer = () => {
  const { selectedConversation } = useConversation();  // Get the selected conversation from global store
    const {authUser} = useAuthContext();
  if (!selectedConversation) {
    return(
        <div className='flex items-center justify-center w-full h-full flex-col gap-2'>
            <div className='px-4 text-center sm:text-xl text-gray-600 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome, {authUser?.user?.firstName}!</p>
                <p>Select a chat to start messaging.</p>
            </div>
            <BsChatLeftDots className='h-8 w-8' />
        </div>
    );
  }

  return (
    <div className='md:min-w-[450px] flex flex-col rounded-sm'>
        {selectedConversation ? (
            <>
                {/* Header: Display conversation participant's info */}
                <div className='bg-slate-300 flex items-center gap-4 px-4 py-2 mb-2'>
                    <div className='w-12 rounded-full border-[2px] border-red-500'>
                        <img src={selectedConversation.images} alt='user avatar' className='rounded-full' />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-gray-900 font-bold'>
                            {selectedConversation.firstName} {selectedConversation.lastName}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <Messages conversationId={selectedConversation.conversationId} />

                {/* Message Input */}
                <MessageInput conversationId={selectedConversation.conversationId} />
            </>
        ) : (
            <NoChatSelected authUser={authUser} />
        )}
    </div>
);
};

const NoChatSelected = ({ authUser }) => (
<div className='flex items-center justify-center w-full h-full flex-col gap-2'>
    <div className='px-4 text-center sm:text-xl text-gray-600 font-semibold flex flex-col items-center gap-2'>
        <p>Welcome, {authUser?.user?.firstName}!</p>
        <p>Select a chat to start messaging.</p>
    </div>
    <BsChatLeftDots className='h-8 w-8' />
</div>
);

export default MessageContainer;


import React from 'react';
import Conversation from './Conversation';
import useGetConversations from '../../../../hooks/useGetConversations';
import { getRandomEmoji } from '../../../../utils/emojis';

const Conversations = () => {
  const { loading, conversations } = useGetConversations();

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {loading ? (
        <span className='loading loading-spinner mx-auto'></span>
      ) : conversations.length === 0 ? (
        <div className='flex flex-col'>
          <p className='text-center text-gray-500'>
            No participants to chat with.
          </p>
          <p>
            Start a conversation with your friends.
          </p>
        </div>
      ) : (
        conversations.map((conversation, idx) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            emoji={getRandomEmoji()}
            lastIdx={idx === conversations.length - 1}
          />
        ))
      )}
    </div>
  );
};

export default Conversations;

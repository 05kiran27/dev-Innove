import React from 'react';
import useConversation from '../../../../zustand/useConversation';
import { useAuthContext } from '../../../../context/AuthContext';


// const Message = ({ message }) => {
//   const { authUser } = useAuthContext();
//   // console.log('auth user => ', authUser);
//   const { selectedConversation } = useConversation();

//   // Ensure message object is valid
//   if (!message) {
//     return null; // Or return a fallback UI
//   }

//   const senderId = message.senderId;
//   const fromMe = senderId === authUser.user._id;
//   // console.log('sender id => ', senderId);
//   // console.log('authUserId',authUser.user._id)
//   const chatClassName = fromMe ? 'chat-end' : 'chat-start'; // Align based on sender

//   // Ensure profilePic exists, or use a default image
//   console.log('selected conversation => ', selectedConversation)
//   const profilePic = fromMe
//     ? authUser.user.images
//     : selectedConversation?.images ;

//   const bubbleBgColor = fromMe ? 'bg-blue-500' : 'bg-gray-500'; // Different background colors

//   const shakeClass = message.shouldShake ? "shake" : ""

//   return (
//     <div className={`chat ${chatClassName}`}>
//       <div className='chat-image avatar'>
//         <div className='w-10 rounded-full'>
//           <img
//             alt='Profile'
//             src={profilePic}
//           />
//         </div>
//       </div>
//       <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
//         {message.message || 'No message content'}
//       </div>
//       <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
//         {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : 'Unknown time'}
//       </div>
//     </div>
//   );
// };

// export default Message;


const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  // Ensure message object is valid
  if (!message || typeof message !== 'object') {
    return null; // Return null if message is invalid or not an object
  }

  const senderId = message.senderId;
  const fromMe = senderId === authUser.user._id;
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';

  const profilePic = fromMe
    ? authUser.user.images
    : selectedConversation?.images;

  const bubbleBgColor = fromMe ? 'bg-blue-500' : 'bg-gray-500';
  const shakeClass = message.shouldShake ? "shake" : "";

  // Ensure message content is a string
  const messageContent = typeof message.message === 'string'
    ? message.message
    : JSON.stringify(message.message); // If message is an object, convert it to string for rendering

  return (
    <div className={`chat ${chatClassName}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img
            alt='Profile'
            src={profilePic || 'default_image_url'}  // Fallback to default image
          />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
        {messageContent || 'No message content'}  {/* Render message content */}
      </div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
        {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : 'Unknown time'}
      </div>
    </div>
  );
};

export default Message;
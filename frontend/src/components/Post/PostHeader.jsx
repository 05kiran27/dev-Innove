import React from 'react';
import { useNavigate } from 'react-router-dom';
import dummyProfilepic from '../../assets/dummyProfilepic.jfif';
import useConnect from '../../hooks/useConnect';
import useFollow from '../../hooks/useFollow';

const PostHeader = ({ owner, currentUser }) => {
  const navigate = useNavigate();
  const { sendConnectionRequest, isConnecting, isConnected, error: connectError } = useConnect(currentUser._id, owner._id);
  const { isFollowing, isChecking, toggleFollow, error: followError } = useFollow(currentUser._id, owner._id); // Fetch follow status on mount

  // Handle profile picture click
  const handleProfileClick = () => {
    navigate(`/profile/${owner._id}`);
  };

  // Handle connect button click
  const handleConnectClick = async () => {
    const response = await sendConnectionRequest(currentUser._id, owner._id);
    console.log('Connection response:', response);
  };

  // Handle follow button click
  const handleFollowClick = async () => {
    const response = await toggleFollow(); // Follow/unfollow request is triggered only on click
    console.log('Follow response:', response);
  };

  return (
    <div className='flex h-[100px] w-full py-3 px-7 items-center relative'>
      <div className='flex items-center'>
        {/* Profile image */}
        <div className='flex items-center gap-5'>
          <img
            src={owner.images || dummyProfilepic}
            alt='profile pic'
            className='h-[50px] w-[50px] object-cover border-[2px] border-red-500 rounded-full cursor-pointer'
            onClick={handleProfileClick} // Navigate to profile on click
          />
          {/* Post owner name */}
          <div className='flex flex-col gap-x-2'>
            <p className='font-semibold'>{`${owner.firstName} ${owner.lastName}`}</p>
            <span className='text-sm'>{owner.description || null}</span>
          </div>
        </div>

        <div className='flex items-center absolute right-7'>
          {/* Connect button */}
          <button
            className='font-semibold w-[80px] border border-transparent transition duration-300 ease-in-out transform rounded-md cursor-pointer hover:bg-gray-200 flex justify-center'
            onClick={handleConnectClick}
            disabled={isConnecting || isConnected || isChecking} // Disable the button if already connected or connecting
          >
            {isConnecting ? 'Connecting...' : (isConnected ? 'Connected' : 'Connect')}
          </button>

          {/* Follow button */}
          <button
            className='font-semibold w-[80px] border border-transparent transition duration-300 ease-in-out transform rounded-md cursor-pointer hover:bg-gray-200 flex justify-center'
            onClick={handleFollowClick} // Follow/unfollow when clicked
            disabled={isChecking || isConnecting} // Disable button during follow/unfollow request or if connecting
          >
            {isChecking ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;

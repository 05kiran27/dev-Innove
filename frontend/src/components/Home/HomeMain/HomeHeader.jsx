
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import dummyProfilepic from '../../../assets/dummyProfilepic.jfif';
import { MdOutlinePermMedia } from "react-icons/md";
import { MdEvent } from "react-icons/md";

const HomeHeader = ({ profilePic, userId }) => { // Add userId as prop
  const navigate = useNavigate(); 

  const handleProfileClick = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className='flex flex-col gap-2 w-[500px] px-3 py-4 ml-5'>
      <div className='flex items-center hover:scale-105 transition-all duration-300 mb-2'>
        <div className='flex items-center'>
          {/* Dynamic profile picture with onClick handler */}
          <img 
            src={profilePic || dummyProfilepic} 
            alt='profile pic'
            className='h-[60px] w-[60px] object-cover border-[2px] border-red-500 rounded-full cursor-pointer' 
            onClick={handleProfileClick} // Add onClick to navigate to profile page
          />
        </div>

        <div className='w-[350px] h-[60px] ml-4 border-[2px] border-gray-300 rounded-3xl flex items-center cursor-pointer'>
          <p className='ml-3'>
            Start your success with a post
          </p>
        </div>
      </div>
      <div className='flex items-center justify-around'>
        <div className='flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300'>
          <MdOutlinePermMedia className='h-[20px] w-[20px] text-blue-800' />
          <p className='text text-lg'>Media</p>
        </div>

        <div className='flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300'>
          <MdEvent className='h-[20px] w-[20px] text-blue-800' />
          <p className='text text-lg'>Event</p>
        </div>
      </div>

      {/* line */}
      <div className='w-full h-[2px] bg-slate-300'></div>
    </div>
  );
};

export default HomeHeader;




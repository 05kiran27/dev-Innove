// LogoutButton.jsx
import React from 'react';
import { BiLogOut } from "react-icons/bi";
import useLogout from '../hooks/useLogout';

const LogoutButton = () => {
  const { loading, logout } = useLogout(); // Correct usage: hook inside a functional component

  return (
    <div className='mt-auto pl-4'>
      {!loading ? (
        <div onClick={logout} className='flex w-[180px] gap-3 pr-[2px] py-[4px] border border-transparent transition duration-300 ease-in-out transform rounded-md cursor-pointer hover:bg-gray-200'>
          <BiLogOut
            className='w-[30px] h-[30px]'
          />
          <p className='text-xl font-semibold py-[2px]'>Logout</p>
        </div>
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  );
};

export default LogoutButton;

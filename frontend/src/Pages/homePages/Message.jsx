import React from 'react'
import HomeSidebar from '../../components/Home/HomeSidebar/HomeSidebar'
import Sidebar from '../../components/Home/MessageComponent/MessageSidebar/Sidebar'
import MessageContainer from '../../components/Home/MessageComponent/Message/MessageContainer'

const Message = () => {
  return (
    <div className='flex'>
        <HomeSidebar/>
        <div className='flex w-full h-screen justify-center items-center bg-bgMessage'>
          <div className='h-[600px] flex shadow-md rounded-sm'>
            <Sidebar/>
            <MessageContainer/>
          </div>
        </div>
    </div>
  )
}

export default Message
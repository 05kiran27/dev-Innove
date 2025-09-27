// import React from 'react'
// import HomeSidebar from '../../components/Home/HomeSidebar/HomeSidebar'

// const AddPost = () => {
//   return (
//     <div className='flex bg-gray-50 w-screen flex-row relative'>
//       <HomeSidebar/>
//       <div className='flex h-full w-[6px] bg-slate-700 absolute left-[251px] top-[0px]'></div>
      
//     </div>
//   )
// }

// export default AddPost


// AddPost.js
import React from 'react';
import HomeSidebar from '../../components/Home/HomeSidebar/HomeSidebar';
import AddPostForm from '../../components/Post/AddPostForm'; 

const AddPost = () => {
  return (
    <div className='flex flex-row relative'>
      <HomeSidebar />
      {/* Main content area for adding a post */}
      <div className='flex flex-col flex-grow items-center pt-10 pl-[280px]'>
        <AddPostForm />
      </div>
    </div>
  );
}

export default AddPost;

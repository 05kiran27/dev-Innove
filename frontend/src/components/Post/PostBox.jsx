
import React from 'react';
import PostHeader from './PostHeader';
import PostBody from './PostBody';
import PostFooter from './PostFooter';
import { useAuthContext } from '../../context/AuthContext';


const PostBox = ({ post }) => {
  const { authUser: loggedInUser } = useAuthContext();
  
  return (
    <div className='flex w-[600px]  px-3 py-4'>
      <div className='flex w-[550px] flex-col border-[2px] rounded-lg mb-3'>
        {/* Pass user object to PostHeader */}
        <PostHeader owner={post.user} currentUser={loggedInUser.user}/>
        
        {/* Pass postDescription and postImage to PostBody */}
        <PostBody content={post.postDescription} postTitle = {post.postTitle} image={post.postImage} />
        
        {/* Pass postLikes, postComment, postId, and userHasLiked to PostFooter */}
        <PostFooter likes={post.postLikes} comments={post.postComment} postId={post._id} userHasLiked={post.userHasLiked} />
      </div>
    </div>
  );
}

export default PostBox;


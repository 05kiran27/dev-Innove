import React, { useState, useRef, useEffect } from 'react';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { BsSend } from 'react-icons/bs';
import { AiOutlineComment, AiOutlineClose } from 'react-icons/ai'; 
import useLikePost from '../../hooks/useLikePost';
import useGetComments from '../../hooks/useGetComments';
import useAddComment from '../../hooks/useAddComment';
import useShare from '../../hooks/useShare'; 

const PostFooter = ({ likes, comments, postId, userHasLiked }) => {
  const [liked, setLiked] = useState(userHasLiked);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { likePost, loading } = useLikePost();
  const { comments: postComments, loading: commentsLoading, error: commentsError, addNewComment } = useGetComments(showComments ? postId : null);
  const { addComment, loading: addCommentLoading } = useAddComment();
  const { sharePost, shareLink, loading: shareLoading, error: shareError } = useShare(); // Use the useShare hook

  // Reference to the comments container
  const commentsContainerRef = useRef(null);

  // Function to scroll to the bottom of the comments container
  const scrollToBottom = () => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (showComments) {
      scrollToBottom(); // Scroll to the bottom when comments are shown
    }
  }, [showComments, postComments]);

  const handleLike = async () => {
    try {
      const response = await likePost(postId);
      if (response) {
        setLiked(response.userHasLiked);
        setLikeCount(response.likeCount);
      }
    } catch (error) {
      console.error('Failed to like/unlike the post', error);
    }
  };

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    try {
      const addedComment = await addComment(postId, newComment);
      if (addedComment) {
        addNewComment(addedComment); // Add the new comment to the existing comments
        setNewComment(''); // Clear the input field
        scrollToBottom(); // Scroll to the bottom after adding a new comment
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = () => {
    sharePost(postId); // Call sharePost from useShare
  };

  return (
    <div className='flex flex-col pt-2 px-3 mb-4 gap-4 relative'>
      {/* Like/Unlike Button */}
      <div className='flex items-center gap-4 relative'>
        <div onClick={handleLike} className='cursor-pointer flex gap-4'>
          {liked ? (
            <IoIosHeart className='h-[25px] w-[25px] text-red-600' />
          ) : (
            <IoIosHeartEmpty className='h-[25px] w-[25px]' />
          )}
          <span>{likeCount} Likes</span>
        </div>

        {/* Comment Section */}
        <div className='flex items-center cursor-pointer' onClick={handleShowComments}>
          <AiOutlineComment className='h-[25px] w-[25px]' />
          <span className='ml-2'>{comments.length} Comments</span>
        </div>

        {/* Share Button */}
        <div className='flex items-center cursor-pointer' onClick={handleShare}>
          <BsSend className='h-[25px] w-[25px] ' />
          <span className='ml-2'>Share</span>
        </div>
      </div>

      {/* Display Comments */}
      {showComments && (
        <div className='mt-4 flex flex-col w-[400px] max-h-[380px] bg-slate-200 absolute top-[-340px] left-[600px] rounded-lg p-4'>
          {/* Close Button */}
          <div className='flex justify-end'>
            <AiOutlineClose
              onClick={() => setShowComments(false)}
              className='cursor-pointer text-gray-600'
              size={20}
            />
          </div>
          
          {/* Comments Container */}
          <div ref={commentsContainerRef} className='flex-grow overflow-y-auto'>
            {commentsLoading ? (
              <div>Loading comments...</div>
            ) : commentsError ? (
              <div>Error loading comments: {commentsError}</div>
            ) : postComments.length > 0 ? (
              postComments.map(comment => (
                <div key={comment._id} className='border-t pt-2 flex items-center gap-2'>
                  {/* User Profile Image */}
                  {comment.user.images && (
                    <img 
                      src={comment.user.images} 
                      alt={`${comment.user.firstName} ${comment.user.lastName}`} 
                      className='h-8 w-8 rounded-full' 
                    />
                  )}
                  {/* User Name and Comment */}
                  <div>
                    <strong>{comment.user.firstName} {comment.user.lastName}:</strong> {comment.body}
                  </div>
                </div>
              ))
            ) : (
              <div>No comments yet.</div>
            )}
          </div>
          
          {/* Input to add a new comment */}
          <div className='flex items-center gap-2 mt-4'>
            <input
              type='text'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Add a comment...'
              className='flex-grow p-2 border rounded'
              disabled={addCommentLoading}
            />
            <button onClick={handleAddComment} className='p-2 bg-blue-500 text-white rounded' disabled={addCommentLoading}>
              {addCommentLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFooter;

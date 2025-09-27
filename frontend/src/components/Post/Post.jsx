import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to navigate to home

const Post = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = post.postDescription.split(' ');
  const showReadMore = words.length > 10;
  const navigate = useNavigate(); // Initialize navigate hook

  // Handle post click to navigate to home page with postId
  const handlePostClick = () => {
    navigate(`/?postId=${post._id}`); // Navigate to home page with postId as query param
  };

  return (
    <div className="flex flex-col p-4 w-[48%] bg-gray-100 rounded-md shadow cursor-pointer" onClick={handlePostClick}>
      <h3 className="text-xl font-bold">{post.postTitle}</h3>

      <div className="text-gray-700">
        {isExpanded ? (
          <span>{post.postDescription}</span>
        ) : (
          <span>
            {words.slice(0, 10).join(' ')}
            {showReadMore ? '...' : ''}
          </span>
        )}

        {showReadMore && (
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 cursor-pointer ml-1"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </span>
        )}
      </div>

      {post.postImage && (
        <img
          src={post.postImage}
          alt={post.postTitle}
          className="w-full h-auto mt-4 rounded-md"
        />
      )}
    </div>
  );
};

export default Post;

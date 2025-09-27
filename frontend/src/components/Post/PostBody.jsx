
import React, { useState } from 'react';

const PostBody = ({ content, image, postTitle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const words = content.trim().split(/\s+/);
  const isLongContent = words.length > 20;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="post-body w-full px-3">
      <p className='font-semibold text-lg'>{postTitle}</p>
      {/* Post content */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-none' : 'max-h-[100px] overflow-hidden'}`}>
        <p>{isExpanded ? content : words.slice(0, 20).join(' ') + '...'}</p>
      </div>

      {/* Show "Read More"/"Show Less" button */}
      {isLongContent && (
        <button onClick={toggleReadMore} className="text-blue-500 mt-2">
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      )}

      {/* Post image */}
      {image && <img src={image} alt="post" className="post w-full object-contain mt-3" />}
    </div>
  );
}

export default PostBody;



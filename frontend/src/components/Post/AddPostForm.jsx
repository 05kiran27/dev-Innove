import React, { useState } from 'react';
import toast from 'react-hot-toast'; // Import toast
import useAddPost from '../../hooks/useAddPost';

const AddPostForm = ({ onClose, onPostCreate }) => {  // Accept onPostCreate as a prop
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const { addPost } = useAddPost(); // No need to use loading state here

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postTitle || !postDescription || !thumbnailImage) {
      toast.error('Please fill in all fields and select an image');
      return;
    }

    // Close the modal and show loader before starting post creation
    onClose();
    onPostCreate(true); // Trigger the full-screen loader in HomeMain

    const postData = {
      postTitle,
      postDescription,
      thumbnailImage,
    };

    const result = await addPost(postData);
    if (result) {
      toast.success('Post created successfully'); // Show success toast
      onPostCreate(false); // Hide the loader
    } else {
      onPostCreate(false); // Stop the full-screen loader if there is an error
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setThumbnailImage(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Modal Background */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white p-8 rounded-lg w-1/3 z-60 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input 
              type="text" 
              value={postTitle} 
              onChange={(e) => setPostTitle(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea 
              value={postDescription} 
              onChange={(e) => setPostDescription(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Thumbnail Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              required 
            />
          </div>
          <div className="flex justify-end space-x-2">
            {/* Cancel Button */}
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            {/* Submit Button */}
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostForm;

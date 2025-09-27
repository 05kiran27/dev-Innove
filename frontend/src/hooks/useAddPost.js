
import { useState } from 'react';

const useAddPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPost = async ({ postTitle, postDescription, thumbnailImage }) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('dv-token');
      const formData = new FormData();
      formData.append('postTitle', postTitle);
      formData.append('postDescription', postDescription);
      formData.append('thumbnailImage', thumbnailImage);

      const res = await fetch('http://localhost:4000/api/v1/post/createPost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return { addPost, loading, error };
};

export default useAddPost;

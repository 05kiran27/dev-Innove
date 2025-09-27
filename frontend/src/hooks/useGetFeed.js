
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useGetFeed = () => {
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const getFeed = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('dv-token');

        if (!token) {
          throw new Error('Token not found. Please log in again.');
        }

        const res = await fetch('http://localhost:4000/api/v1/feed/getFeed', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch feed');
        }

        // Set feed including userHasLiked field
        setFeed(data.data);
      } catch (error) {
        toast.error(error.message || 'An unexpected error occurred while fetching the feed');
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, []);

  return { loading, feed };
};

export default useGetFeed;


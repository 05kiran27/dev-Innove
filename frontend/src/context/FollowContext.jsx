import { createContext, useState, useContext } from 'react';

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [followStatus, setFollowStatus] = useState({}); // Store follow statuses globally

  const updateFollowStatus = (ownerId, isFollowing) => {
    setFollowStatus(prev => ({
      ...prev,
      [ownerId]: isFollowing, // Update status for specific user
    }));
  };

  return (
    <FollowContext.Provider value={{ followStatus, updateFollowStatus }}>
      {children}
    </FollowContext.Provider>
  );
};

// Custom hook to use FollowContext
export const useFollowContext = () => {
  return useContext(FollowContext);
};

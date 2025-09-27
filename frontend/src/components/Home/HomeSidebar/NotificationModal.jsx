import React, { useRef, useEffect } from 'react';
import useNotification from '../../../hooks/useNotification';

// NotificationModal component
const NotificationModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const { loading, error, data } = useNotification(isOpen); // Use custom hook to fetch notifications
  // Close the modal when clicking outside of the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal when clicked outside
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="fixed inset-0 flex  z-50">
      <div ref={modalRef} className="bg-white p-6 mt-4 rounded-md shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>

        {/* Loading state */}
        {loading && <p>Loading notifications...</p>}

        {/* Error state */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Notification list */}
        {!loading && !error && data.length > 0 ? (
          <ul className="space-y-4">
            {data.map((notification, index) => (
              <li key={index} className="flex items-center gap-4 border-b pb-2">
                {/* Sender's Profile Picture */}
                <img 
                  src={notification.sender.images || '/path/to/default-avatar.jpg'} // Fallback for missing profilePic
                  alt={`${notification.senderName}'s profile picture`}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* Notification details */}
                <div>
                  <p className="font-semibold">{notification.senderName}</p> {/* Sender Name */}
                  <p>{notification.message}</p> {/* Notification Message */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>No notifications available</p>
        )}

        <button
          onClick={onClose}
          className="absolute top-5 cursor-pointer left-[350px] text-red-500 font-bold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useSignup from '../../hooks/useSignup';
import toast from 'react-hot-toast';

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const { userData } = state; // Get the user data from the previous page
  const { loading, signup } = useSignup();
  const navigate = useNavigate();

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call backend signup with userData and otp
    const signupSuccess = await signup({ ...userData, otp });
    if (signupSuccess) {
      // Redirect to home page after successful signup
      navigate('/');
    } else {
      // Stay on the page and show an error
      // toast.error("OTP does not match. Please try again.");
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-full max-w-lg p-8 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Verify OTP</h2>

        {/* OTP Input */}
        <div className='mb-4'>
          <label className='block mb-1'>Enter OTP</label>
          <input
            type='text'
            placeholder='OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Submit Button */}
        <div className='mb-4'>
          <button 
            type='submit' 
            disabled={loading}
            className='w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors'
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;

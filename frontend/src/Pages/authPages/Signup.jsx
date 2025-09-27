import React, { useState } from 'react';
import RoleCheckbox from './RoleCheckbox';
import { Link, useNavigate } from 'react-router-dom';
import useSendOtp from '../../hooks/useSendOtp';
import toast from 'react-hot-toast';  // Import toast for notifications

const Signup = () => {
    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: ""
    });

    const { loading, sendOtp } = useSendOtp();
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
        if (!inputs.firstName || !inputs.lastName || !inputs.email || !inputs.password || !inputs.confirmPassword || !inputs.accountType) {
            toast.error('All fields are required!');
            return;
        }

        // validate password must have length more than 6
        if(inputs.password.length < 6){
            toast.error('password required more than 6 character');
            return;
        }


        // Validate password and confirm password match
        if (inputs.password !== inputs.confirmPassword) {
            toast.error('Password and Confirm Password do not match!');
            return;
        }

        // Call backend to send OTP
        const otpSent = await sendOtp(inputs);
        if (otpSent) {
            // Store user data and navigate to OTP verification page
            navigate('/verify-otp', { state: { userData: inputs } });
        }
    };

    // Handle role checkbox change
    const handleCheckboxChange = (accountType) => {
        setInputs((prevInputs) => ({ ...prevInputs, accountType }));
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <form onSubmit={handleSubmit} className='w-full max-w-lg p-8 bg-white rounded-lg shadow-md'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Sign Up</h2>
                
                <div className='flex gap-8'>
                    {/* First Name */}
                    <div className='mb-4'>
                        <label className='block mb-1'>First Name</label>
                        <input
                            type='text'
                            placeholder='First Name'
                            value={inputs.firstName}
                            onChange={(e) => setInputs({ ...inputs, firstName: e.target.value })}
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    {/* Last Name */}
                    <div className='mb-4'>
                        <label className='block mb-1'>Last Name</label>
                        <input
                            type='text'
                            placeholder='Last Name'
                            value={inputs.lastName}
                            onChange={(e) => setInputs({ ...inputs, lastName: e.target.value })}
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                </div>

                {/* Email */}
                <div className='mb-4'>
                    <label className='block mb-1'>Email</label>
                    <input
                        type='email'
                        placeholder='Email'
                        value={inputs.email}
                        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                {/* Password */}
                <div className='mb-4'>
                    <label className='block mb-1'>Password</label>
                    <input
                        type='password'
                        placeholder='Password'
                        value={inputs.password}
                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                {/* Confirm Password */}
                <div className='mb-4'>
                    <label className='block mb-1'>Confirm Password</label>
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        value={inputs.confirmPassword}
                        onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                {/* Role Selection */}
                <RoleCheckbox onCheckboxChange={handleCheckboxChange} selectedRole={inputs.accountType} />

                {/* Submit Button */}
                <div className='mb-4'>
                    <button 
                        type='submit' 
                        disabled={loading}
                        className='w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors'
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </div>
                <div className='flex pl-5'>
                    <Link to={'/login'} className='hover:text-blue-400 transition-colors'>
                        Already have an account ?
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;

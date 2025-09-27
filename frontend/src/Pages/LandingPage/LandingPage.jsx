
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import logo from '../../assets/logo1.jfif';
import innovator from '../../assets/innovator.jfif';
import developer from '../../assets/developer.jfif'

const LandingPage = () => {
  const navigate = useNavigate();  

  // Handlers for navigation
  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleSignupClick = () => {
    navigate('/Signup');
  };

  return (
        <div className='w-full h-screen bg-blue-950'>
            {/* Navbar */}
            <header className='navbar flex w-full h-[80px] items-center px-32 pt-6'>
                {/* LOGO and name start */}
                <div className='text-white flex justify-center w-1/4 bg-transparent ml-10 pl-10'>
                    {/* add logo */}
                    <img src={logo} alt="Logo" className='h-10 w-10 bg-transparent rounded-full' />
                    <p className='text-2xl font-bold pl-3'>Dev&Innove</p>
                </div>

                {/* nav links */}
                <div className='flex w-2/4 justify-center'>
                    <Link className='text-white text-xl px-5 cursor-pointer'>Home</Link>
                    <Link className='text-white text-xl px-5 cursor-pointer'>About Us</Link>
                    <Link className='text-white text-xl px-5 cursor-pointer'>Contact Us</Link>
                </div>

                {/* login and Signup button */}
                <div className='flex'>
                    <div className='flex items-center px-2'>
                        <button 
                            className='py-2 px-5 text-white text-md border border-blue-400 font-bold rounded-md
                            transform transition-transform duration-300 hover:scale-105'
                            onClick={handleLoginClick}  // Handle login button click
                        >
                            Login
                        </button>
                    </div>
                    <div className='flex items-center px-2'>
                        <button 
                            className='py-2 px-5 text-white text-md border border-blue-400 font-bold rounded-md
                            transform transition-transform duration-300 hover:scale-105'
                            onClick={handleSignupClick}  // Handle signup button click
                        >
                        Sign up
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero section */}
            <section className='flex  justify-between text-center text-white h-[600px] px-10 mt-5'>
                {/* left section */}
                <div className='flex flex-col w-1/2 items-center justify-center p-6 '>
                    <div className='flex justify-center items-center flex-col p-8'>
                        <img 
                            src={developer} 
                            alt='developer' 
                            className='w-[500px] h-[350px] object-cover pb-3 rounded-lg'
                        />
                        <h1 className='text-4xl font-bold mb-4'>
                            <Typewriter
                                options={{
                                strings: ['Innovate Your World', 'Empower Your Dreams', 'Transform Your Future'],
                                autoStart: true,
                                loop: true,
                                deleteSpeed: 50,
                                delay: 50,
                                }}
                            />
                        </h1>
                        <p className='text-lg mt-4 font-bold '>Welcome to Dev&Innove - Where innovation meets inspiration.</p>
                
                    </div>
                </div>

                {/* right section */}
                <div className='flex w-1/2 items-center justify-center p-6'>
                    <div className='flex flex-col items-center justify-center p-8 '>
                        <p className='text-lg mb-4'>
                            Welcome to Dev&Innove, where innovation and creativity come together to shape a brighter future. Whether you're here to enhance your skills, connect with like-minded individuals, or explore groundbreaking ideas, you're in the right place. 
                        </p>
                        <img 
                            src={innovator} 
                            alt='innovator' 
                            className='w-[500px] h-[350px] object-cover rounded-lg '
                        />
                    </div>
                </div>
            </section>

            {/* footer section */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-4">
                    {/* <!-- Logo and Description --> */}
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center flex-col">
                            <p className='text-xl font-bold'>Dev&Innove</p>
                            <p className="text-sm ml-3">The Ultimate Platform for the startups.</p>
                        </div>
                    </div>

                    {/* <!-- Quick Links --> */}
                    <div className="mb-6 md:mb-0">
                        <h4 className="font-semibold mb-3">Quick Links</h4>
                        <ul>
                            <li className="mb-2"><a href="#" className="hover:text-gray-300 text-sm">Home</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-gray-300 text-sm">About</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-gray-300 text-sm">DevChallenge</a></li>
                            <li><a href="#" className="hover:text-gray-300 text-sm">Contact</a></li>
                        </ul>
                    </div>

                    {/* <!-- Legal Links --> */}
                    <div className="mb-6 md:mb-0">
                        <h4 className="font-semibold mb-3">Legal</h4>
                        <ul>
                            <li className="mb-2"><a href="#" className="hover:text-gray-300 text-sm">Privacy Policy</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-gray-300 text-sm">Terms of Use</a></li>
                        </ul>
                    </div>

                    {/* <!-- Contact Info --> */}
                    <div>
                        <h4 className="font-semibold mb-3">Get in Touch</h4>
                        <p className="text-sm">Email: <a href="mailto:support@codehelp.in" className="hover:text-gray-300">support@devinnove.in</a></p>
                    </div>
                </div>

                {/* <!-- Footer Bottom --> */}
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs">
                    <p>&copy; 2024 Sorting dev&Innove Technologies Pvt Ltd. All Rights Reserved.</p>
                </div>
            </footer>

            
        </div>
    );
}

export default LandingPage;

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
import Home from './Pages/homePages/Home';
import Login from './Pages/authPages/Login';
import Signup from './Pages/authPages/Signup';
import VerifyOtp from './Pages/authPages/VerifyOtp';
import PostDetails from './components/Post/PostDetails';
import AddPost from './Pages/homePages/AddPost';
import UserProfile from './components/user/UserProfile';
import LandingPage from './Pages/LandingPage/LandingPage'; 
import Message from './Pages/homePages/Message';
import ReelsFeed from './components/Home/Explore/ReelsFeed';
import Explore from './Pages/homePages/Explore';
import Upload from './components/WebcamFeed'
import Criminal from './components/Criminal';
import Newsform from './components/Newsform.jsx';
import Deepfake from './components/Deepfake.jsx';


function App() {
  const { authUser } = useAuthContext(); // Assuming authUser contains authentication status

  return (
    <div className='p-4 h-screen flex flex-col'>
      <Routes>
        {/* Landing Page */}
        <Route path='/landing-page' element={<LandingPage />} />

        {/* OTP Verification */}
        <Route path='/verify-otp' element={<VerifyOtp />} />

        {/* Home Route - Protected */}
        <Route path='/' element={authUser?.success ? <Home /> : <Navigate to="/landing-page" />} />

        {/* Auth Routes */}
        <Route path='/login' element={authUser?.success ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={authUser?.success ? <Navigate to='/' /> : <Signup />} />

        {/* Post Details Route */}
        <Route path='/post/:postId' element={<PostDetails />} />

        {/* Add Post Route */}
        <Route path='/add-post' element={authUser?.success ? <AddPost /> : <Navigate to="/login" />} />

        {/* User Profile Route with Dynamic ID */}
        <Route path='/profile/:userId' element={<UserProfile />} />

        <Route path='/messaging' element={authUser?.success ? <Message /> : <Navigate to="/login" />}/>

        <Route path='explore' element={authUser?.success ? <Explore/> : <Navigate to='/login'/>}/>

        <Route path='/Upload' element = { <Deepfake/>} />

        <Route path='/detect' element = { <Criminal/>}/>

        <Route path='/predict ' element = {<Newsform/>}/>

        <Route path='/predictions ' element = {<Deepfake/>}/>


      </Routes>

      {/* Toaster Notifications */}
      <Toaster />
    </div>
  );
}

export default App;




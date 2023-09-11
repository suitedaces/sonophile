import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from './spotify';

function Navbar() {

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
      // Fetch user's profile data using the getUser function
      getUser()
      .then(response => {
          setUserProfile(response.data);
      })
      .catch(error => {
          console.error("Error fetching user profile:", error);
      });
  }, []);
    return (
        <div className="z-50 fixed bottom-0 border-card rounded-sm lg:left-0 w-full lg:w-48 bg-gray-900 shadow-inner lg:h-screen text-white lg:pt-16 flex flex-col justify-center">
          <div className='lg:space-y-4 flex flex-col justify-center h-full mb-40'>
              <NavLink className='lg:rounded-r-full text-xl flex justify-center lg:justify-start items-center sm:space-x-2 py-3 px-4 lg:px-6 lg:py-2 hover:bg-card hover:text-spotify w-1/5 lg:w-full' to='/' activeClassName='text-spotify lg:bg-spotify lg:text-white'>
                <span>🏠</span>
                <span className='hidden sm:block hover:text-green-400 '>Home</span>
              </NavLink>
              <NavLink className='lg:rounded-r-full text-xl flex justify-center lg:justify-start items-center sm:space-x-2 py-3 px-4 lg:px-6 lg:py-2 hover:bg-card hover:text-spotify w-1/5 lg:w-full' to='/search' activeClassName='text-spotify lg:bg-spotify lg:text-white'>
                <span>✨</span>
                <span className='hidden sm:block hover:text-green-400'>Mood</span>
              </NavLink>
              <NavLink className='lg:rounded-r-full text-xl flex justify-center lg:justify-start items-center sm:space-x-2 py-3 px-4 lg:px-6 lg:py-2 hover:bg-card hover:text-spotify w-1/5 lg:w-full' to='/artist' activeClassName='text-spotify lg:bg-spotify lg:text-white'>
                <span>👨🏽‍🎤</span>
                <span className='hidden sm:block hover:text-green-400'>Top Artists</span>
              </NavLink>
              <NavLink className='lg:rounded-r-full text-xl flex justify-center lg:justify-start items-center sm:space-x-2 py-3 px-4 lg:px-6 lg:py-2 hover:bg-card hover:text-spotify w-1/5 lg:w-full' to='/track' activeClassName='text-spotify lg:bg-spotify lg:text-white'>
                <span>🎵</span>
                <span className='hidden sm:block hover:text-green-400'>Top Songs</span>
              </NavLink>
            </div>
            {/* Display user's name and profile picture */}
            {userProfile && (
                <div className="flex flex-col items-center mt-4 absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <img src={userProfile.images[0]?.url} alt="User Profile" className="w-12 h-12 rounded-full object-cover" />
                    <p className="mt-2">{userProfile.display_name}</p>
                </div>
            )}
        </div>
    );
}

export default Navbar;
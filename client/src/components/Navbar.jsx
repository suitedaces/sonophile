import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from '../spotifyApi';

function Navbar() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    getUser()
      .then(response => {
        setUserProfile(response.data);
      })
      .catch(error => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  const navItemClasses = "flex items-center space-x-4 py-3 px-4 lg:px-6 w-full lg:w-full text-xl hover:bg-card hover:text-green-400 hover:bg-card hover:text-green-400 transform transition-transform duration-200 hover:scale-105";
  const activeClasses = "text-spotify lg:bg-spotify lg:text-white";

  return (
    <div className="z-50 fixed bottom-0 lg:bottom-auto lg:top-0 border-card rounded-t-lg lg:left-0 w-full lg:w-48 bg-gray-900 shadow-inner lg:h-screen text-white flex flex-row lg:flex-col justify-around lg:justify-center lg:pt-6 lg:pb-14">
      <NavLink to="/" className={navItemClasses} activeClassName={activeClasses}>
        <span>🏠</span>
        <span className="hidden lg:block">Home</span>
      </NavLink>
      <NavLink to="/search" className={navItemClasses} activeClassName={activeClasses}>
        <span>✨</span>
        <span className="hidden lg:block">Mood</span>
      </NavLink>
      <NavLink to="/artist" className={navItemClasses} activeClassName={activeClasses}>
        <span>👨🏽‍🎤</span>
        <span className="hidden lg:block">Top Artists</span>
      </NavLink>
      <NavLink to="/track" className={navItemClasses} activeClassName={activeClasses}>
        <span>🎵</span>
        <span className="hidden lg:block">Top Songs</span>
      </NavLink>
      {userProfile && (
        <div className="hidden lg:flex flex-col items-center mt-4 absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <img src={userProfile.images[0]?.url} alt="User Profile" className="w-12 h-12 rounded-full object-cover" />
          <p className="mt-2 text-md bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-transparent bg-clip-text text-md">{userProfile.display_name}</p>
        </div>
      )}
    </div>
  );
}

export default Navbar;

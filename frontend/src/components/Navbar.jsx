import { useState, useEffect } from 'react'
import Logo from '../assets/logo.svg?react'
import imageAva from '../assets/image-avatar.jpg'
import IconMoon from '../assets/icon-moon.svg?react'
import IconSun from '../assets/icon-sun.svg?react'
import { useTheme } from '../contexts/useTheme'
import { getProfileImage, updateProfileImage } from '../utils/http'

function Navbar() {
  const { isDarkMode, toggleTheme, isLoading } = useTheme();
  const [profileImage, setProfileImage] = useState(imageAva);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Load profile image on component mount
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const imageUrl = await getProfileImage();
        if (imageUrl) {
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error('Failed to load profile image:', error);
      } finally {
        setIsImageLoading(false);
      }
    };

    loadProfileImage();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const imageData = reader.result;
      try {
        // Update the UI immediately for better UX
        setProfileImage(imageData);
        // Save to backend
        await updateProfileImage(imageData);
      } catch (error) {
        console.error('Failed to update profile image:', error);
        // Revert to previous image on error
        const previousImage = await getProfileImage() || imageAva;
        setProfileImage(previousImage);
      }
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className='bg-pri-400 dark:bg-pri-300 lg:w-[103px] fixed top-0 h-20 lg:h-auto lg:bottom-0 left-0 lg:left-auto right-0 lg:right-auto lg:rounded-tr-3xl flex lg:flex-col justify-between z-60'>
      <div className="relative w-20 h-20 lg:w-full lg:h-auto">
      <div className="bg-pri-100 w-full h-20 lg:h-[103px] rounded-tr-xl rounded-br-xl lg:rounded-tr-3xl lg:rounded-br-3xl"></div>
      <div className="bg-pri-200 w-full h-10 lg:h-[51.5px] rounded-tr-xl rounded-br-xl lg:rounded-tl-3xl lg:rounded-br-3xl absolute top-1/2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
        <Logo />
      </div>
      </div>

      <div className="flex lg:flex-col justify-between items-center w-36 lg:w-full pr-6 lg:pr-0 lg:pb-6 lg:h-[140px]">
        <button 
          onClick={toggleTheme}
          disabled={isLoading}
          className="cursor-pointer p-2 rounded-full hover:bg-bg-secondary transition-colors"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-sec-100 border-t-sec-200 border-r-sec-200 rounded-full animate-spin" />
          ) : isDarkMode ? (
            <IconSun className="text-[#858BB2]" />
          ) : (
            <IconMoon className="text-sec-300" />
          )}
        </button> 

        <div className="w-0.5 lg:w-full h-full lg:h-0.5 bg-sec-200"></div>
         
        <div className="relative h-12 w-12">
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <label 
            htmlFor="profile-upload" 
            className="block w-full h-full cursor-pointer"
          >
            {isImageLoading ? (
              <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </label>
        </div>
      </div>
    </div>
  )
}

export default Navbar
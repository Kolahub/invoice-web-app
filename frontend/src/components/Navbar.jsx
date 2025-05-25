import { useState } from 'react'
import Logo from '../assets/logo.svg?react'
import imageAva from '../assets/image-avatar.jpg'
import IconMoon from '../assets/icon-moon.svg?react'

function Navbar() {
  const [profileImage, setProfileImage] = useState(() => {
    // Try to load image from localStorage on initial render
    const savedImage = localStorage.getItem('profileImage');
    return savedImage || imageAva;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setProfileImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='bg-pri-400 lg:w-[103px] fixed top-0 h-20 lg:h-auto lg:bottom-0 left-0 lg:left-auto right-0 lg:right-auto lg:rounded-tr-3xl flex lg:flex-col justify-between z-60'>
      <div className="relative w-20 h-20 lg:w-full lg:h-auto">
      <div className="bg-pri-100 w-full h-20 lg:h-[103px] rounded-tr-xl rounded-br-xl lg:rounded-tr-3xl lg:rounded-br-3xl"></div>
      <div className="bg-pri-200 w-full h-10 lg:h-[51.5px] rounded-tr-xl rounded-br-xl lg:rounded-tl-3xl lg:rounded-br-3xl absolute top-1/2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
        <Logo />
      </div>
      </div>

      <div className="flex lg:flex-col justify-between items-center w-36 lg:w-full pr-6 lg:pr-0 lg:pb-6 lg:h-[140px]">
        <button className="">
          <IconMoon />
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
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default Navbar
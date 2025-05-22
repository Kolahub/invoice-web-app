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
    <div className='bg-pri-400 lg:w-[103px] fixed lg:top-0 lg:bottom-0 rounded-tr-4xl flex lg:flex-col justify-between z-60'>
      <div className="relative w-full">
      <div className="bg-pri-100 w-full h-[103px] rounded-tr-4xl rounded-br-4xl"></div>
      <div className="bg-pri-200 w-full h-[51.5px] rounded-tl-4xl rounded-br-4xl absolute top-1/2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
        <Logo />
      </div>
      </div>

      <div className="flex lg:flex-col justify-between items-center lg:pb-6 lg:h-[140px]">
        <button className="">
          <IconMoon />
        </button> 

        <div className="w-full h-0.5 bg-sec-200"></div>
         
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
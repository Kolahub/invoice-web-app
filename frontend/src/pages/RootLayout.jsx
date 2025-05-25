import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function RootLayout() {
  return (
    <div className='font-display bg-bg-100 min-h-screen'>
        <Navbar />

        <div className="px-6 sm:px-12 lg:px-0 lg:ml-[350px] lg:w-[750px]">
        <Outlet />
        </div>
    </div>
  )
}

export default RootLayout
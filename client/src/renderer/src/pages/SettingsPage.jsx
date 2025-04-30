import React from 'react'
import Navbar from '../components/Navbar'

const SettingsPage = () => {
  return (
    <>
        <Navbar />
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-4xl font-bold'>Settings</h1>
            <p className='mt-4 text-lg'>This is the settings page.</p>
        </div>
    </>
  )
}

export default SettingsPage
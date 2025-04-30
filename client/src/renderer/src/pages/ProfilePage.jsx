import React from 'react'
import Navbar from '../components/Navbar'

const ProfilePage = () => {
    return (
        <>
        <Navbar />
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-4xl font-bold'>Profile Page</h1>
                <p className='mt-4 text-lg'>This is the profile page.</p>
            </div>
        </>
    )
}

export default ProfilePage
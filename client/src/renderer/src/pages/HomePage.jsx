import React from 'react'
import Navbar from '../components/Navbar'


const HomePage = () => {
    return (
        <>
            <Navbar />

            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-4xl font-bold'>Welcome to the Chat Application</h1>
                <p className='mt-4 text-lg'>This is the home page.</p>
            </div>
        </>
    )
}

export default HomePage
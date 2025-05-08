import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, MessageSquare, Settings, User, Users } from 'lucide-react';

const Navbar = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        // Prevent default form submission
        e.preventDefault();

        const result = await logout();
        if (result.success) {
            navigate(result.redirectUrl);
        }
    };


    return (
        <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
            <div className="container mx-auto px-4 h-16">
                <div className="flex justify-between items-center h-full">
                    <div className='flex items-center gap-8'>
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className='size-9 rounded-lg bg-primary-content flex items-center justify-center'>
                                <MessageSquare className='w-5 h-5 ' />
                            </div>
                            <h1 className="text-lg font-bold">ChatApp</h1>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link to="/manage" className="btn btn-primary btn-sm gap-2 hover:opacity-80 transition-all">
                            <Users className='size-5' />
                            <span className='hidden sm:inline'>Contacts</span>
                        </Link>
                        <Link to="/profile" className="btn btn-primary btn-sm gap-2 hover:opacity-80 transition-all">
                            <User className='size-5' />
                            <span className='hidden sm:inline'>Profile</span>
                        </Link>
                        <Link to="/settings" className="btn btn-primary btn-sm gap-2 hover:opacity-80 transition-all">
                            <Settings className='size-5' />
                            <span className='hidden sm:inline'>Settings</span>
                        </Link>
                        <button onClick={handleLogout} className="btn btn-primary btn-sm gap-2 hover:opacity-80 transition-all">
                            <LogOut className='size-5' />
                            <span className='hidden sm:inline'>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
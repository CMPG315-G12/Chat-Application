import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!authUser) {
      checkAuth();
    }
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) return (
    <div className='flex justify-center items-center h-screen'>
      <Loader className='w-10 h-10 text-blue-500 animate-spin' />
    </div>
  );

  return (
    <div>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/signup" />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to="/signup" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/signup" />} />
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
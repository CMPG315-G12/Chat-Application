import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Edit, Check, X, Github, Mail, LogIn, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

// Discord-style avatar options
const AVATAR_OPTIONS = [
  'https://cdn.discordapp.com/embed/avatars/0.png',
  'https://cdn.discordapp.com/embed/avatars/1.png',
  'https://cdn.discordapp.com/embed/avatars/2.png',
  'https://cdn.discordapp.com/embed/avatars/3.png',
  'https://cdn.discordapp.com/embed/avatars/4.png'
];

const ProfilePage = () => {
  const { authUser, updateAuthUser } = useAuthStore();
  
  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customAvatar, setCustomAvatar] = useState(null);
  const [customAvatarPreview, setCustomAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  
  const fileInputRef = useRef(null);
  
  // Load user data when component mounts
  useEffect(() => {
    if (authUser) {
      setDisplayName(authUser.displayName || '');
      setSelectedAvatar(authUser.profilePic || AVATAR_OPTIONS[0]);
      
      // Get linked providers (in a real app, this would come from the API)
      const userProviders = authUser.providers || [];
      setProviders(userProviders);
    }
  }, [authUser]);
  
  // Handle display name update
  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }
    
    setIsLoading(true);
    try {
      // Call API to update display name
      const response = await axiosInstance.put('/auth/update-profile', { displayName });
      toast.success('Display name updated successfully');
      setIsEditingName(false);
      
      // Update the user in auth store
      if (updateAuthUser) {
        updateAuthUser({
          ...authUser,
          displayName: response.data.displayName || displayName
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update display name');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle custom avatar file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // File type validation (only allow images)
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Size validation (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }
    
    setCustomAvatar(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setCustomAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle avatar update (both predefined and custom)
  const handleUpdateAvatar = async (avatarUrl) => {
    setIsLoading(true);
    try {
      let finalAvatarUrl = avatarUrl;
      
      // If we have a custom avatar file, upload it first
      if (customAvatar) {
        const formData = new FormData();
        formData.append('avatar', customAvatar);
        
        // Upload the image
        const uploadResponse = await axiosInstance.post('/auth/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        finalAvatarUrl = uploadResponse.data.profilePic;
      }
      
      // Update user profile with new avatar URL
      const response = await axiosInstance.put('/auth/update-profile', { profilePic: finalAvatarUrl });
      
      setSelectedAvatar(finalAvatarUrl);
      setIsAvatarPickerOpen(false);
      setCustomAvatar(null);
      setCustomAvatarPreview(null);
      
      toast.success('Avatar updated successfully');
      
      // Update the user in auth store
      if (updateAuthUser) {
        updateAuthUser({
          ...authUser,
          profilePic: finalAvatarUrl
        });
      }
    } catch (error) {
      toast.error('Failed to update avatar');
      console.error('Avatar update error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle linking new provider
  const handleLinkProvider = (provider) => {
    // This would be handled by your OAuth implementation
    toast.info(`Linking with ${provider} would open OAuth flow`);
  };
  
  // Handle unlinking a provider
  const handleUnlinkProvider = async (providerId) => {
    if (providers.length <= 1) {
      toast.error('Cannot remove the last login method');
      return;
    }
    
    // Remove provider logic would go here
    toast.info(`This would unlink ${providerId} from your account`);
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link to="/manage" className="btn btn-primary btn-sm">
            Manage Friends & Groups
          </Link>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className="avatar">
                  <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={customAvatarPreview || selectedAvatar} alt="User avatar" />
                  </div>
                </div>
                <button
                  className="btn btn-circle btn-sm absolute bottom-0 right-0 bg-primary text-primary-content"
                  onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                >
                  <Camera size={18} />
                </button>
                
                {/* Avatar Picker */}
                {isAvatarPickerOpen && (
                  <div className="absolute top-full mt-4 p-4 bg-base-300 rounded-lg shadow-lg z-10 min-w-[280px]">
                    <h3 className="font-medium mb-2 text-center">Choose an avatar</h3>
                    
                    {/* Upload own image section */}
                    <div className="mb-4 p-3 bg-base-200 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Upload your own</h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="btn btn-sm btn-outline flex-1"
                        >
                          <Upload size={14} className="mr-2" />
                          Select image
                        </button>
                        
                        {customAvatarPreview && (
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full">
                              <img src={customAvatarPreview} alt="Custom avatar preview" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Default avatars grid */}
                    <h4 className="text-sm font-medium mb-2">Or choose a default</h4>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {AVATAR_OPTIONS.map((avatar, index) => (
                        <div
                          key={index}
                          className={`avatar cursor-pointer ${
                            selectedAvatar === avatar && !customAvatarPreview 
                              ? 'ring-2 ring-primary rounded-full' 
                              : ''
                          }`}
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setCustomAvatar(null);
                            setCustomAvatarPreview(null);
                          }}
                        >
                          <div className="w-12 h-12 rounded-full">
                            <img src={avatar} alt={`Avatar option ${index + 1}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => {
                          setIsAvatarPickerOpen(false);
                          setCustomAvatar(null);
                          setCustomAvatarPreview(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleUpdateAvatar(selectedAvatar)}
                        disabled={isLoading}
                      >
                        {isLoading ? <span className="loading loading-spinner"></span> : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                {/* Display Name */}
                <div className="mb-4">
                  <label className="text-sm font-semibold opacity-70">Display Name</label>
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="input input-bordered w-full max-w-xs"
                        />
                        <button
                          className="btn btn-circle btn-sm btn-success text-white"
                          onClick={handleUpdateDisplayName}
                          disabled={isLoading}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="btn btn-circle btn-sm btn-error text-white"
                          onClick={() => {
                            setIsEditingName(false);
                            setDisplayName(authUser?.displayName || '');
                          }}
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold">{displayName || authUser?.fullName || 'User'}</h2>
                        <button
                          className="btn btn-circle btn-sm btn-ghost"
                          onClick={() => setIsEditingName(true)}
                        >
                          <Edit size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div className="mb-4">
                  <label className="text-sm font-semibold opacity-70">Email</label>
                  <div className="flex items-center gap-2">
                    <p className="text-base">{authUser?.email || 'No email available'}</p>
                  </div>
                </div>
                
                {/* Member Since */}
                <div>
                  <label className="text-sm font-semibold opacity-70">Member Since</label>
                  <p className="text-base">
                    {authUser?.createdAt 
                      ? new Date(authUser.createdAt).toLocaleDateString() 
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Linked Accounts Section */}
            <div className="divider">Linked Accounts</div>
            <div className="space-y-3">
              {/* Provider Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email Provider Card (always present) */}
                <div className="bg-base-100 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email & Password</h3>
                      <p className="text-xs opacity-70">{authUser?.email}</p>
                    </div>
                  </div>
                  <div className="badge badge-neutral">Primary</div>
                </div>
                
                {/* GitHub Provider */}
                <div className="bg-base-100 rounded-lg p-4 flex justify-between items-center opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="bg-base-300 p-2 rounded-full">
                      <Github className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">GitHub</h3>
                      <p className="text-xs">Not connected</p>
                    </div>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => handleLinkProvider('github')}
                  >
                    <LogIn size={14} className="mr-1" />
                    Connect
                  </button>
                </div>
                
                {/* Additional providers would go here */}
                {/* Display dynamically linked providers */}
                {providers.map((provider) => (
                  <div key={provider.id} className="bg-base-100 rounded-lg p-4 flex justify-between items-center">
                    {/* Provider details would go here */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Settings Section */}
        <div className="card bg-base-200 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title text-xl">Account Settings</h2>
            <div className="divider my-0"></div>
            
            <Link to="/settings" className="btn btn-outline w-full md:w-auto">
              Manage Account Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
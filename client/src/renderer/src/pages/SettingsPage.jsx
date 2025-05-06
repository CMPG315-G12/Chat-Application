import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const { authUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: authUser?.username || '',
    phone: authUser?.phone || '',
    password: '',
    profilePic: null
  });
  const [isLightMode, setIsLightMode] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      // Handle account deletion
      logout();
    }
  };

  React.useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [isLightMode]);

  return (
    <div className="flex h-screen bg-[var(--chat-area-bg)]">
      {/* Sidebar */}
      <div className="w-60 bg-[var(--sidebar-bg)] p-4">
        <Link to="/" className="flex items-center text-[var(--text-primary)] mb-8">
          <ArrowLeft className="mr-2" size={20} />
          Back
        </Link>
        
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left py-2 px-3 rounded ${activeTab === 'profile' ? 'bg-[var(--info-bar-bg)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--info-bar-bg)]'}`}
          >
            Your Profile
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full text-left py-2 px-3 rounded ${activeTab === 'theme' ? 'bg-[var(--info-bar-bg)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--info-bar-bg)]'}`}
          >
            Theme
          </button>
          <button
            onClick={() => setActiveTab('delete')}
            className={`w-full text-left py-2 px-3 rounded ${activeTab === 'delete' ? 'bg-[var(--info-bar-bg)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--info-bar-bg)]'}`}
          >
            Delete Account
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Your Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[var(--info-bar-bg)] mb-4 overflow-hidden">
                  {authUser?.profilePic ? (
                    <img 
                      src={authUser.profilePic} 
                      alt={authUser.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {authUser?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm text-[var(--text-secondary)]"
                  onChange={(e) => setFormData({ ...formData, profilePic: e.target.files[0] })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-4 py-2 outline-none"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-4 py-2 outline-none"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Must start with 0 and be 10 digits long
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-4 py-2 outline-none"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--accent-color)] text-white rounded"
                disabled={!formData.username || !formData.phone}
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'theme' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Theme</h2>
            
            <div className="flex items-center justify-between p-4 bg-[var(--info-bar-bg)] rounded">
              <span className="text-[var(--text-primary)]">Light Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isLightMode}
                  onChange={() => setIsLightMode(!isLightMode)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="mt-6 p-4 bg-[var(--info-bar-bg)] rounded">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Preview</h3>
              <div className="flex">
                <div className="w-8 h-8 bg-[var(--sidebar-bg)]"></div>
                <div className="w-8 h-8 bg-[var(--info-bar-bg)]"></div>
                <div className="w-8 h-8 bg-[var(--chat-area-bg)]"></div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'delete' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Delete Your Account</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-[var(--button-danger)] text-white rounded"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
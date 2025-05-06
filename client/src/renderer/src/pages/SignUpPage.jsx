import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    phone: '',
    password: '',
    profilePic: null
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate phone number
    if (!formData.phone.match(/^0\d{9}$/)) {
      alert('Phone number must start with 0 and be 10 digits long');
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('password', formData.password);
    if (formData.profilePic) {
      formDataToSend.append('profilePic', formData.profilePic);
    }
    
    signup(formDataToSend);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--sidebar-bg)]">
      <div className="w-full max-w-md p-8 bg-[var(--info-bar-bg)] rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {isRegistering ? 'Create an account' : 'Welcome back!'}
          </h2>
          <p className="text-[var(--text-secondary)]">
            {isRegistering ? 'Enter your details to get started' : 'We missed you!'}
          </p>
        </div>

        {!isRegistering ? (
          <div className="space-y-4">
            <button
              onClick={() => setIsRegistering(true)}
              className="w-full py-2 bg-[var(--accent-color)] text-white rounded flex items-center justify-center"
            >
              New User? Register
              <ArrowRight className="ml-2" size={16} />
            </button>
            
            <div className="relative flex items-center my-6">
              <div className="flex-1 border-t border-[var(--chat-area-bg)]"></div>
              <span className="px-2 text-sm text-[var(--text-secondary)] bg-[var(--info-bar-bg)]">OR</span>
              <div className="flex-1 border-t border-[var(--chat-area-bg)]"></div>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-4 py-2 outline-none"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-4 py-2 outline-none"
                    placeholder="Enter your password"
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
                className="w-full py-2 bg-[var(--accent-color)] text-white rounded flex items-center justify-center"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-4 py-2 outline-none"
                placeholder="Choose a username"
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
                placeholder="0123456789"
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
                  required
                  className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-4 py-2 outline-none"
                  placeholder="Create a password"
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
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-[var(--text-secondary)]"
                onChange={(e) => setFormData({ ...formData, profilePic: e.target.files[0] })}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                className="flex-1 py-2 border border-[var(--text-secondary)] text-[var(--text-primary)] rounded"
                onClick={() => setIsRegistering(false)}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[var(--accent-color)] text-white rounded flex items-center justify-center"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        )}
        
        <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[var(--accent-color)] hover:underline"
          >
            {isRegistering ? 'Log in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
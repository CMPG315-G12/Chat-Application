import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const LogInPage = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const { providerSignup } = useAuthStore();
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        // Prevent default form submission
        e.preventDefault();

        login(formData);
    };

    return (
        <>
            {/* Login Page Container */}
            <div className="flex items-center justify-center min-h-screen min-w-10 --color-background-mute">
                {/* Sign Up Puck */}
                <div className="w-full max-w-xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                    </div>

                    {/* Title and Description */}
                    <h2 className="text-2xl font-bold text-center text-gray-800">
                        Log In
                    </h2>
                    <p className="text-sm text-center text-gray-500">
                        Sign in with:
                    </p>

                    {/* OAuth Buttons */}
                    <div className="flex justify-between space-x-3 ">
                        {[
                            {
                                name: "Google",
                                provider: "google",
                                styles: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
                                svg: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6 mr-2">
                                        <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.4 3.5 29.5 1.5 24 1.5 14.8 1.5 7.2 7.8 4.5 16.1l7.4 5.7C13.3 14.2 18.2 9.5 24 9.5z" />
                                        <path fill="#4285F4" d="M46.5 24c0-1.6-.2-3.2-.5-4.7H24v9h12.7c-.6 3-2.4 5.5-4.9 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-17.2z" />
                                        <path fill="#FBBC05" d="M9.9 28.2c-.7-2-.7-4.2 0-6.2l-7.4-5.7c-2.5 5-2.5 11 0 16.9l7.4-5.7z" />
                                        <path fill="#34A853" d="M24 46.5c5.5 0 10.4-1.8 13.9-4.9l-7.4-5.7c-2.1 1.4-4.8 2.2-7.5 2.2-5.8 0-10.7-4.7-12.3-10.8l-7.4 5.7C7.2 40.2 14.8 46.5 24 46.5z" />
                                        <path fill="none" d="M0 0h48v48H0z" />
                                    </svg>
                                ),
                            },
                            {
                                name: "GitHub",
                                provider: "github",
                                styles: "text-white bg-gray-800 hover:bg-gray-700",
                                svg: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
                                        <path
                                            fill="currentColor"
                                            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.108-.776.42-1.305.763-1.605-2.665-.305-5.466-1.333-5.466-5.93 0-1.31.468-2.382 1.236-3.222-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.292-1.552 3.3-1.23 3.3-1.23.653 1.653.24 2.873.117 3.176.768.84 1.236 1.912 1.236 3.222 0 4.61-2.807 5.623-5.478 5.92.432.372.816 1.102.816 2.222v3.293c0 .32.216.694.828.576C20.565 21.796 24 17.297 24 12 24 5.37 18.63 0 12 0z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                name: "Discord",
                                provider: "discord",
                                styles: "text-white bg-indigo-600 hover:bg-indigo-500",
                                svg: (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6 mr-2">
                                        <path
                                            fill="currentColor"
                                            d="M41.625 10.77c-3.98-3.204-10.277-3.747-10.547-3.766a.99.99 0 0 0-.988.586c-.016.023-.152.34-.305.832 2.633.445 5.867 1.34 8.793 3.156a1 1 0 1 1-1.055 1.7C32.493 10.155 26.211 10 25 10c-1.21 0-7.496.156-12.523 3.277a1 1 0 0 1-1.055-1.7c2.926-1.811 6.16-2.71 8.793-3.151-.152-.496-.29-.809-.3-.836a.99.99 0 0 0-.993-.586c-.27.02-6.567.562-10.602 3.808C6.215 12.762 2 24.152 2 34c0 .176.047.344.133.496 2.906 5.11 10.84 6.445 12.648 6.504h.032a1 1 0 0 0 .808-.41l1.828-2.516c-4.933-1.273-7.453-3.437-7.597-3.566a1 1 0 0 1 1.324-1.5C11.234 33.062 15.875 37 25 37c9.14 0 13.781-3.953 13.828-3.992a1 1 0 0 1 1.41.094.996.996 0 0 1-.09 1.406c-.144.129-2.664 2.293-7.597 3.566l1.828 2.516a1 1 0 0 0 .809.41h.03c1.81-.059 9.743-1.395 12.65-6.504A1 1 0 0 0 48 34c0-9.848-4.215-21.238-6.375-23.23M18.5 30c-1.934 0-3.5-1.79-3.5-4s1.566-4 3.5-4 3.5 1.79 3.5 4-1.566 4-3.5 4m13 0c-1.934 0-3.5-1.79-3.5-4s1.566-4 3.5-4 3.5 1.79 3.5 4-1.566 4-3.5 4"
                                        />
                                    </svg>
                                ),
                            },
                        ].map(({ name, provider, styles, svg }) => (
                            <button
                                key={provider}
                                onClick={() => providerSignup(provider)}
                                className={`flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${styles}`}
                            >
                                {svg}
                                {name}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center justify-center">
                        <span className="absolute px-2 text-sm text-gray-500 bg-white">
                            Or continue with
                        </span>
                        <div className="w-full border-t border-gray-300"></div>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email */}
                        <fieldset className="Fieldset">
                            <legend className="fieldset-legend text-gray-700">Email</legend>
                            <label className="input validator w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input
                                    type="email"
                                    placeholder="mail@site.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                />
                            </label>
                            <div className="validator-hint hidden">Enter valid email address</div>
                        </fieldset>

                        {/* Password */}
                        <fieldset className="Fieldset">
                            <div className='flex justify-between'>
                                <legend className="fieldset-legend justify-start text-gray-700">Password</legend>
                                <legend className="fieldset-legend justify-end text-gray-700" >
                                    <Link to="/forgot-password" className="text-sm link text-indigo-600 hover:underline">
                                        Forgot Password?
                                    </Link>
                                </legend>
                            </div>
                            <label className="input validator w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Password"
                                    minLength="8"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-base-content/40" />
                                    )}
                                </button>
                            </label>
                            <div className="validator-hint hidden">  Must be more than 8 characters, including
                                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                            </div>
                        </fieldset>

                        {/* Submit Button */}
                        <button type='submit' className='btn w-full' disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Log In "
                            )}
                        </button>
                    </form>

                    {/* To Login */}
                    <p className="text-sm text-center text-gray-500">
                        Do not have an account?{" "}
                        <Link to="/signup" className="link text-indigo-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default LogInPage
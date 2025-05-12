import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="text-center max-w-md">
        {/* Emoji and Heading */}
        <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
        <p className="text-5xl mb-6">😕</p>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-accent mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Home Button */}
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
        >
          Return to Chat
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
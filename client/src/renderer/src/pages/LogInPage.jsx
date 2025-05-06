import React from 'react';
import { Link } from 'react-router-dom';

const LogInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--sidebar-bg)]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Redirecting to authentication...
        </h1>
        <p className="text-[var(--text-secondary)]">
          If you're not redirected automatically, <Link to="/signup" className="text-[var(--accent-color)] hover:underline">click here</Link>.
        </p>
      </div>
    </div>
  );
};

export default LogInPage;
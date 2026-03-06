import React from 'react';
import { useAuthStore } from '../../store/authStore';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-6">Profile</h1>
      <div className="neu-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-stone to-ink flex items-center justify-center text-bone text-3xl font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">{user?.fullName || 'User'}</h2>
            <p className="text-ink-light">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <p className="text-stone">Profile page coming soon...</p>
      </div>
    </div>
  );
};

export default Profile;

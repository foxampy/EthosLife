import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchV1 = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-6">Search</h1>
      <div className="neu-card p-6">
        <p className="text-stone">Search query: {query || 'None'}</p>
        <p className="text-stone mt-4">Search results coming soon...</p>
      </div>
    </div>
  );
};

export default SearchV1;

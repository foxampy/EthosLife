import React from 'react';

const Environment = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-2">Environment</h1>
      <p className="text-ink-light mb-8">Track environmental factors affecting your health</p>

      {/* Air Quality */}
      <div className="neu-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone">Air Quality</h2>
          <span className="text-3xl">🌬️</span>
        </div>
        <div className="text-center py-8">
          <p className="text-ink-light mb-4">Air quality tracking coming soon</p>
          <p className="text-sm text-clay">
            We'll help you monitor air quality in your area and its impact on your health
          </p>
        </div>
      </div>

      {/* Sun Exposure */}
      <div className="neu-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone">Sun Exposure</h2>
          <span className="text-3xl">☀️</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="neu-card p-4 text-center">
            <p className="text-3xl mb-2">🌅</p>
            <p className="font-semibold text-ink">Morning Sun</p>
            <p className="text-sm text-ink-light">15-30 min recommended</p>
          </div>
          <div className="neu-card p-4 text-center">
            <p className="text-3xl mb-2">🌞</p>
            <p className="font-semibold text-ink">Vitamin D</p>
            <p className="text-sm text-ink-light">Essential for health</p>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">Workspace Ergonomics</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <p className="font-medium text-ink">Ergonomic chair</p>
              <p className="text-sm text-ink-light">Supports proper posture</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <p className="font-medium text-ink">Monitor at eye level</p>
              <p className="text-sm text-ink-light">Reduces neck strain</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <p className="font-medium text-ink">Natural lighting</p>
              <p className="text-sm text-ink-light">Better for eye health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="neu-card p-6">
        <h2 className="text-lg font-semibold text-stone mb-4">Environmental Health Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <span className="text-stone">🌿</span>
            <p className="text-ink-light">Add indoor plants to improve air quality</p>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-stone">💧</span>
            <p className="text-ink-light">Use a humidifier in dry environments</p>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-stone">🪟</span>
            <p className="text-ink-light">Open windows regularly for fresh air</p>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-stone">🔇</span>
            <p className="text-ink-light">Minimize noise pollution for better sleep</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Environment;

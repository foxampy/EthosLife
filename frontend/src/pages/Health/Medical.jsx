import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const Medical = () => {
  const [activeTab, setActiveTab] = useState('records');
  const { register } = useForm();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-2">Medical Records</h1>
      <p className="text-ink-light mb-8">Manage your health records and medications</p>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['records', 'medications', 'visits', 'conditions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl font-medium capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'bg-stone text-bone shadow-neu-inset'
                : 'neu-card hover:bg-sand'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="neu-card p-6">
        {activeTab === 'records' && (
          <div>
            <h2 className="text-lg font-semibold text-stone mb-4">Health Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone mb-2">Blood Type</label>
                <select {...register('bloodType')} className="neu-input">
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone mb-2">Height (cm)</label>
                <input type="number" {...register('height')} className="neu-input" placeholder="175" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone mb-2">Allergies</label>
                <textarea {...register('allergies')} className="neu-input" rows="2" placeholder="List any allergies" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone mb-2">Chronic Conditions</label>
                <textarea {...register('conditions')} className="neu-input" rows="2" placeholder="Any chronic conditions" />
              </div>
            </div>
            <button className="neu-button mt-4">Save Information</button>
          </div>
        )}

        {activeTab === 'medications' && (
          <div>
            <h2 className="text-lg font-semibold text-stone mb-4">Current Medications</h2>
            <p className="text-ink-light mb-4">Track your medications and supplements</p>
            <button className="neu-button-secondary neu-card px-4 py-2 mb-4">+ Add Medication</button>
            <div className="text-center py-8 text-ink-light">
              No medications added yet
            </div>
          </div>
        )}

        {activeTab === 'visits' && (
          <div>
            <h2 className="text-lg font-semibold text-stone mb-4">Doctor Visits</h2>
            <p className="text-ink-light mb-4">Keep track of your medical appointments</p>
            <button className="neu-button-secondary neu-card px-4 py-2 mb-4">+ Add Visit</button>
            <div className="text-center py-8 text-ink-light">
              No visits recorded yet
            </div>
          </div>
        )}

        {activeTab === 'conditions' && (
          <div>
            <h2 className="text-lg font-semibold text-stone mb-4">Health Conditions</h2>
            <p className="text-ink-light mb-4">Manage your health conditions history</p>
            <button className="neu-button-secondary neu-card px-4 py-2 mb-4">+ Add Condition</button>
            <div className="text-center py-8 text-ink-light">
              No conditions recorded
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medical;

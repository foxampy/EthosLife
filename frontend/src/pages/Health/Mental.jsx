import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

const moods = [
  { id: 1, emoji: '😢', label: 'Very Low' },
  { id: 2, emoji: '😕', label: 'Low' },
  { id: 3, emoji: '😐', label: 'Neutral' },
  { id: 4, emoji: '🙂', label: 'Good' },
  { id: 5, emoji: '😄', label: 'Great' },
];

const Mental = () => {
  const [moodLogs, setMoodLogs] = useState([]);
  const { register, handleSubmit, reset, watch } = useForm();
  const selectedMood = watch('mood');
  const queryClient = useQueryClient();

  const addMoodMutation = useMutation(
    async (data) => {
      await api.post('/health/metrics', {
        category: 'mental',
        metricType: 'mood',
        value: data.mood,
        unit: 'score',
        notes: data.notes
      });
    },
    {
      onSuccess: () => {
        toast.success('Mood logged!');
        queryClient.invalidateQueries('dashboard');
        reset();
      }
    }
  );

  const onSubmit = (data) => {
    addMoodMutation.mutate(data);
    setMoodLogs([...moodLogs, { ...data, date: new Date() }]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-2">Mental Health</h1>
      <p className="text-ink-light mb-8">Track your mood and mental wellbeing</p>

      {/* Mood Tracker */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">How are you feeling?</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center space-x-4">
            {moods.map((mood) => (
              <label key={mood.id} className="cursor-pointer">
                <input
                  type="radio"
                  {...register('mood')}
                  value={mood.id}
                  className="hidden peer"
                />
                <div className={`text-4xl p-3 rounded-xl transition-all ${
                  selectedMood == mood.id 
                    ? 'bg-stone scale-110' 
                    : 'bg-sand hover:bg-clay hover:text-bone'
                }`}>
                  {mood.emoji}
                </div>
                <p className="text-xs text-center mt-1 text-ink-light">{mood.label}</p>
              </label>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Notes (optional)</label>
            <textarea 
              {...register('notes')} 
              className="neu-input"
              rows="3"
              placeholder="What's on your mind?"
            />
          </div>
          
          <button type="submit" className="neu-button w-full">
            Log Mood
          </button>
        </form>
      </div>

      {/* Stress & Energy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="neu-card p-6">
          <h3 className="font-semibold text-stone mb-3">Stress Level</h3>
          <input type="range" min="1" max="10" className="w-full" />
          <div className="flex justify-between text-xs text-ink-light mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        <div className="neu-card p-6">
          <h3 className="font-semibold text-stone mb-3">Energy Level</h3>
          <input type="range" min="1" max="10" className="w-full" />
          <div className="flex justify-between text-xs text-ink-light mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Mood History */}
      <div className="neu-card p-6">
        <h2 className="text-lg font-semibold text-stone mb-4">Mood History</h2>
        {moodLogs.length === 0 ? (
          <p className="text-ink-light text-center py-8">No mood logs yet</p>
        ) : (
          <div className="space-y-3">
            {moodLogs.map((log, index) => {
              const mood = moods.find(m => m.id == log.mood);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-sand rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{mood?.emoji || '😐'}</span>
                    <div>
                      <span className="font-semibold text-ink">{mood?.label || 'Neutral'}</span>
                      {log.notes && <p className="text-sm text-ink-light">{log.notes}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mental;

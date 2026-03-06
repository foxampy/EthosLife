import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

const workoutTypes = [
  { id: 'cardio', name: 'Cardio', icon: '🏃' },
  { id: 'strength', name: 'Strength', icon: '🏋️' },
  { id: 'yoga', name: 'Yoga', icon: '🧘' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'cycling', name: 'Cycling', icon: '🚴' },
  { id: 'other', name: 'Other', icon: '💪' },
];

const Fitness = () => {
  const [workouts, setWorkouts] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const addWorkoutMutation = useMutation(
    async (data) => {
      await api.post('/health/metrics', {
        category: 'fitness',
        metricType: 'workout',
        value: data.duration,
        unit: 'minutes',
        notes: `${data.workoutType}: ${data.notes || ''}`
      });
    },
    {
      onSuccess: () => {
        toast.success('Workout logged!');
        queryClient.invalidateQueries('dashboard');
        reset();
      }
    }
  );

  const onSubmit = (data) => {
    addWorkoutMutation.mutate(data);
    setWorkouts([...workouts, { ...data, time: new Date() }]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-2">Fitness</h1>
      <p className="text-ink-light mb-8">Track your workouts and activity</p>

      {/* Workout Form */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">Log Workout</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {workoutTypes.map((type) => (
              <label key={type.id} className="cursor-pointer">
                <input
                  type="radio"
                  {...register('workoutType')}
                  value={type.id}
                  className="hidden peer"
                  defaultChecked={type.id === 'cardio'}
                />
                <div className="neu-card p-3 text-center peer-checked:bg-stone peer-checked:text-bone transition-all">
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-xs">{type.name}</div>
                </div>
              </label>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Duration (min)</label>
              <input 
                type="number" 
                {...register('duration', { required: true })} 
                className="neu-input"
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Calories (optional)</label>
              <input 
                type="number" 
                {...register('calories')} 
                className="neu-input"
                placeholder="300"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Notes</label>
            <textarea 
              {...register('notes')} 
              className="neu-input"
              rows="2"
              placeholder="How did it feel?"
            />
          </div>
          
          <button type="submit" className="neu-button w-full">
            Log Workout
          </button>
        </form>
      </div>

      {/* Recent Workouts */}
      <div className="neu-card p-6">
        <h2 className="text-lg font-semibold text-stone mb-4">Recent Workouts</h2>
        {workouts.length === 0 ? (
          <p className="text-ink-light text-center py-8">No workouts logged yet</p>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout, index) => {
              const type = workoutTypes.find(t => t.id === workout.workoutType);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-sand rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type?.icon || '💪'}</span>
                    <div>
                      <span className="font-semibold text-ink">{type?.name || workout.workoutType}</span>
                      {workout.notes && <p className="text-sm text-ink-light">{workout.notes}</p>}
                    </div>
                  </div>
                  <span className="text-stone font-semibold">{workout.duration} min</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fitness;

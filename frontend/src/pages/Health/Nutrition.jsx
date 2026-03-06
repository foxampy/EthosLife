import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Nutrition = () => {
  const [meals, setMeals] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const addMealMutation = useMutation(
    async (data) => {
      // Add as health metric
      await api.post('/health/metrics', {
        category: 'nutrition',
        metricType: 'meal',
        value: data.calories || 0,
        unit: 'kcal',
        notes: `${data.mealType}: ${data.description}`
      });
    },
    {
      onSuccess: () => {
        toast.success('Meal logged successfully!');
        queryClient.invalidateQueries('dashboard');
        reset();
      },
      onError: () => {
        toast.error('Failed to log meal');
      }
    }
  );

  const onSubmit = (data) => {
    addMealMutation.mutate(data);
    setMeals([...meals, { ...data, time: new Date() }]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-2">Nutrition</h1>
      <p className="text-ink-light mb-8">Track your meals and nutrition</p>

      {/* Add Meal Form */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">Log a Meal</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Meal Type</label>
            <select {...register('mealType')} className="neu-input">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Calories (optional)</label>
            <input 
              type="number" 
              {...register('calories')} 
              className="neu-input"
              placeholder="e.g., 500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-stone mb-2">Description</label>
            <textarea 
              {...register('description', { required: true })} 
              className="neu-input"
              rows="3"
              placeholder="What did you eat?"
            />
          </div>
          <div className="md:col-span-2">
            <button 
              type="submit" 
              className="neu-button w-full"
              disabled={addMealMutation.isLoading}
            >
              {addMealMutation.isLoading ? 'Saving...' : 'Log Meal'}
            </button>
          </div>
        </form>
      </div>

      {/* Today's Meals */}
      <div className="neu-card p-6">
        <h2 className="text-lg font-semibold text-stone mb-4">Today's Meals</h2>
        {meals.length === 0 ? (
          <p className="text-ink-light text-center py-8">No meals logged today</p>
        ) : (
          <div className="space-y-3">
            {meals.map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-sand rounded-xl">
                <div>
                  <span className="font-semibold text-ink capitalize">{meal.mealType}</span>
                  <p className="text-sm text-ink-light">{meal.description}</p>
                </div>
                {meal.calories && (
                  <span className="text-stone font-semibold">{meal.calories} kcal</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;

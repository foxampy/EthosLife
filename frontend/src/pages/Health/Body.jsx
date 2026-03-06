import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Body = () => {
  const [measurements, setMeasurements] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const addWeightMutation = useMutation(
    async (data) => {
      await api.post('/health/metrics', {
        category: 'weight',
        metricType: 'weight',
        value: data.weight,
        unit: 'kg',
        notes: `Body fat: ${data.bodyFat || '-'}%`
      });
    },
    {
      onSuccess: () => {
        toast.success('Weight recorded!');
        queryClient.invalidateQueries('dashboard');
        reset();
      }
    }
  );

  const onSubmit = (data) => {
    addWeightMutation.mutate(data);
    setMeasurements([...measurements, { ...data, date: new Date() }]);
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return '-';
    return (weight / ((height / 100) ** 2)).toFixed(1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-2">Body Composition</h1>
      <p className="text-ink-light mb-8">Track weight, measurements, and body metrics</p>

      {/* BMI Calculator */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">BMI Calculator</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-ink-light">Weight</p>
            <p className="text-2xl font-bold text-ink">-- kg</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-ink-light">Height</p>
            <p className="text-2xl font-bold text-ink">-- cm</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-ink-light">BMI</p>
            <p className="text-2xl font-bold text-stone">--</p>
          </div>
        </div>
        <p className="text-sm text-ink-light text-center">
          BMI Categories: Underweight (&lt;18.5) | Normal (18.5-24.9) | Overweight (25-29.9) | Obese (≥30)
        </p>
      </div>

      {/* Weight Entry */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">Log Weight</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Weight (kg)</label>
            <input 
              type="number" 
              step="0.1"
              {...register('weight', { required: true })} 
              className="neu-input"
              placeholder="75.5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Body Fat %</label>
            <input 
              type="number" 
              step="0.1"
              {...register('bodyFat')} 
              className="neu-input"
              placeholder="20%"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">Date</label>
            <input 
              type="date" 
              {...register('date')} 
              className="neu-input"
            />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="neu-button w-full">
              Record Weight
            </button>
          </div>
        </form>
      </div>

      {/* Measurements */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">Body Measurements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Chest', 'Waist', 'Hips', 'Arms', 'Thighs'].map((measurement) => (
            <div key={measurement} className="neu-card p-3 text-center">
              <p className="text-sm text-ink-light">{measurement}</p>
              <p className="text-xl font-bold text-ink">-- cm</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="neu-card p-6">
        <h2 className="text-lg font-semibold text-stone mb-4">Weight History</h2>
        {measurements.length === 0 ? (
          <p className="text-ink-light text-center py-8">No weight records yet</p>
        ) : (
          <div className="space-y-3">
            {measurements.map((m, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-sand rounded-xl">
                <span className="text-ink-light">
                  {new Date(m.date).toLocaleDateString()}
                </span>
                <span className="font-bold text-ink">{m.weight} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;

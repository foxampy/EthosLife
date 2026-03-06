import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Sleep = () => {
  const [sleepLogs, setSleepLogs] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const addSleepMutation = useMutation(
    async (data) => {
      const duration = calculateDuration(data.bedtime, data.waketime);
      await api.post('/health/metrics', {
        category: 'sleep',
        metricType: 'duration',
        value: duration,
        unit: 'hours',
        notes: `Quality: ${data.quality}/10`
      });
    },
    {
      onSuccess: () => {
        toast.success('Sleep logged!');
        queryClient.invalidateQueries('dashboard');
        reset();
      }
    }
  );

  const calculateDuration = (bedtime, waketime) => {
    const bed = new Date(`2000-01-01T${bedtime}`);
    let wake = new Date(`2000-01-01T${waketime}`);
    if (wake < bed) wake.setDate(wake.getDate() + 1);
    return ((wake - bed) / (1000 * 60 * 60)).toFixed(1);
  };

  const onSubmit = (data) => {
    addSleepMutation.mutate(data);
    setSleepLogs([...sleepLogs, { ...data, date: new Date() }]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-2">Sleep</h1>
      <p className="text-ink-light mb-8">Track your sleep patterns</p>

      {/* Sleep Tips */}
      <div className="neu-card p-6 mb-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <h2 className="text-lg font-semibold text-stone mb-3">💡 Sleep Tips</h2>
        <ul className="space-y-2 text-ink-light">
          <li>• Aim for 7-9 hours of sleep</li>
          <li>• Keep consistent sleep schedule</li>
          <li>• Avoid screens 1 hour before bed</li>
          <li>• Keep bedroom cool and dark</li>
        </ul>
      </div>

      {/* Sleep Form */}
      <div className="neu-card p-6 mb-8">
        <h2 className="text-lg font-semibold text-stone mb-4">Log Sleep</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Bedtime</label>
              <input 
                type="time" 
                {...register('bedtime', { required: true })} 
                className="neu-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">Wake time</label>
              <input 
                type="time" 
                {...register('waketime', { required: true })} 
                className="neu-input"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-stone mb-2">
              Sleep Quality (1-10)
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              {...register('quality')} 
              className="w-full"
            />
            <div className="flex justify-between text-xs text-ink-light mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <button type="submit" className="neu-button w-full">
            Log Sleep
          </button>
        </form>
      </div>

      {/* Sleep History */}
      <div className="neu-card p-6">
        <h2 className="text-lg font-semibold text-stone mb-4">Sleep History</h2>
        {sleepLogs.length === 0 ? (
          <p className="text-ink-light text-center py-8">No sleep logs yet</p>
        ) : (
          <div className="space-y-3">
            {sleepLogs.map((log, index) => {
              const duration = calculateDuration(log.bedtime, log.waketime);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-sand rounded-xl">
                  <div>
                    <span className="font-semibold text-ink">
                      {log.bedtime} - {log.waketime}
                    </span>
                    <p className="text-sm text-ink-light">
                      Quality: {log.quality || 5}/10
                    </p>
                  </div>
                  <span className="text-stone font-semibold">{duration}h</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sleep;

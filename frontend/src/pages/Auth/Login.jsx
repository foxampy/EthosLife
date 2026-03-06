import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Initialize Google Sign-In
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    try {
      const result = await googleLogin({ credential: response.credential });
      if (result.success) {
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Google login failed');
      }
    } catch (error) {
      toast.error('An error occurred during Google login');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Welcome Back</h1>
          <p className="text-ink-light">Sign in to your EthosLife account</p>
        </div>

        {/* Login Card */}
        <div className="neu-card p-8">
          {/* Google Sign In */}
          <div className="mb-6">
            <div id="googleSignInButton" className="w-full"></div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-clay"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-bone text-clay">Or continue with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                className="neu-input"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="neu-input"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-ink-light">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-stone hover:text-ink">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="neu-button w-full disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Telegram Login */}
          <div className="mt-6">
            <p className="text-center text-sm text-ink-light mb-3">Or sign in with</p>
            <TelegramAuthButton />
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-ink-light">
          Don't have an account?{' '}
          <Link to="/register" className="text-stone font-semibold hover:text-ink">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

// Telegram Auth Button Component
const TelegramAuthButton = () => {
  useEffect(() => {
    // Load Telegram widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'ethoslife_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', `${window.location.origin}/api/auth/telegram`);
    script.setAttribute('data-request-access', 'write');
    
    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center">
      <div id="telegram-login-container"></div>
    </div>
  );
};

export default Login;

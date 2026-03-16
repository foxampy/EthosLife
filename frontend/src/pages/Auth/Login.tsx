/**
 * Login Page - EthosLife
 * Clean, simple login form with retrofuturism design
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Chrome, Apple } from 'lucide-react';
import { ElCard, ElCardContent } from '../../components/ElCore/ElCard';
import { ElButton } from '../../components/ElCore/ElButton';
import { ElInput } from '../../components/ElCore/ElInput';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = t('auth.emailRequired') || 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.invalidEmail') || 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired') || 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    // Visual only - social login placeholder
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bone-200)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(0,217,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0,217,255,0.2) 0%, transparent 50%),
              repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(44,40,34,0.02) 35px, rgba(44,40,34,0.02) 70px)
            `,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[var(--bone-200)] shadow-[8px_8px_16px_rgba(44,40,34,0.12),-8px_-8px_16px_rgba(255,255,255,0.6)] mb-4"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--stone-500)] bg-clip-text text-transparent">
              E
            </span>
          </motion.div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {t('auth.loginTitle') || 'Welcome Back'}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {t('auth.loginSubtitle') || 'Sign in to continue your health journey'}
          </p>
        </div>

        {/* Login Card */}
        <ElCard variant="elevated" padding="lg" className="w-full">
          <ElCardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <ElInput
                type="email"
                name="email"
                label={t('auth.email') || 'Email Address'}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email}
                fullWidth
                required
              />

              {/* Password Field */}
              <div className="relative">
                <ElInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label={t('auth.password') || 'Password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  leftIcon={<Lock className="w-5 h-5" />}
                  error={errors.password}
                  fullWidth
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-lg bg-[var(--bone-200)] shadow-[inset_2px_2px_4px_rgba(44,40,34,0.08),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] peer-checked:bg-[var(--neon-cyan)] peer-checked:shadow-[0_0_10px_rgba(0,217,255,0.4)] transition-all duration-200" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {t('auth.rememberMe') || 'Remember me'}
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-[var(--neon-cyan)] hover:text-[var(--stone-600)] transition-colors font-medium"
                >
                  {t('auth.forgotPassword') || 'Forgot password?'}
                </Link>
              </div>

              {/* Submit Button */}
              <ElButton
                type="submit"
                variant="gradient"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                {t('nav.login') || 'Login'}
              </ElButton>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--bone-400)]/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[var(--bone-200)] text-[var(--text-tertiary)]">
                  {t('auth.orContinueWith') || 'Or continue with'}
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <ElButton
                type="button"
                variant="elevated"
                size="md"
                leftIcon={<Chrome className="w-5 h-5 text-[#4285F4]" />}
                onClick={() => handleSocialLogin('Google')}
              >
                Google
              </ElButton>
              <ElButton
                type="button"
                variant="elevated"
                size="md"
                leftIcon={<Apple className="w-5 h-5" />}
                onClick={() => handleSocialLogin('Apple')}
              >
                Apple
              </ElButton>
            </div>
          </ElCardContent>
        </ElCard>

        {/* Register Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-[var(--text-secondary)]">
            {t('auth.noAccount') || "Don't have an account?"}{' '}
            <Link
              to="/register"
              className="text-[var(--neon-cyan)] hover:text-[var(--stone-600)] transition-colors font-semibold"
            >
              {t('auth.signUpNow') || 'Sign up now'}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

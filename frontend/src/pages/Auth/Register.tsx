/**
 * Register Page - EthosLife
 * Step-by-step registration with retrofuturism design
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Check, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import { ElCard, ElCardContent } from '../../components/ElCore/ElCard';
import { ElButton } from '../../components/ElCore/ElButton';
import { ElInput } from '../../components/ElCore/ElInput';

type RegistrationStep = 1 | 2 | 3;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: RegistrationStep) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = t('auth.nameRequired') || 'Full name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = t('auth.emailRequired') || 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('auth.invalidEmail') || 'Please enter a valid email';
      }
    }
    
    if (step === 2) {
      if (!formData.password) {
        newErrors.password = t('auth.passwordRequired') || 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = t('auth.weakPassword') || 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.passwordMismatch') || 'Passwords do not match';
      }
    }
    
    if (step === 3) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = t('auth.termsRequired') || 'You must agree to the terms';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev < 3 ? (prev + 1) as RegistrationStep : prev));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => (prev > 1 ? (prev - 1) as RegistrationStep : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-[var(--neon-cyan)]'];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const stepTitles = [
    t('auth.step1Title') || 'Personal Info',
    t('auth.step2Title') || 'Create Password',
    t('auth.step3Title') || 'Terms & Conditions',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bone-200)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 80% 20%, rgba(0,217,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(0,217,255,0.2) 0%, transparent 50%),
              repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(44,40,34,0.02) 35px, rgba(44,40,34,0.02) 70px)
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
        <div className="text-center mb-6">
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
            {t('auth.registerTitle') || 'Join EthosLife'}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {t('auth.registerSubtitle') || 'Start your personalized wellness journey today'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: step <= currentStep ? 'var(--neon-cyan)' : 'var(--bone-400)',
                  scale: step === currentStep ? 1.1 : 1,
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step <= currentStep ? 'text-white shadow-[0_0_15px_rgba(0,217,255,0.4)]' : 'text-[var(--text-tertiary)]'
                }`}
              >
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </motion.div>
              {step < 3 && (
                <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                  step < currentStep ? 'bg-[var(--neon-cyan)]' : 'bg-[var(--bone-400)]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Registration Card */}
        <ElCard variant="elevated" padding="lg" className="w-full">
          <ElCardContent>
            {/* Step Title */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {stepTitles[currentStep - 1]}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {t('auth.step')} {currentStep} {t('auth.of')} 3
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <ElInput
                      type="text"
                      name="fullName"
                      label={t('auth.fullName') || 'Full Name'}
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      leftIcon={<User className="w-5 h-5" />}
                      error={errors.fullName}
                      fullWidth
                      required
                    />

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
                  </motion.div>
                )}

                {/* Step 2: Password */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
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

                    {/* Password Strength */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`flex-1 rounded-full transition-all duration-300 ${
                                level <= passwordStrength.strength ? passwordStrength.color : 'bg-[var(--bone-400)]'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {t('auth.passwordStrength') || 'Password strength'}: {' '}
                          <span className="font-medium text-[var(--text-primary)]">
                            {passwordStrength.label}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="relative">
                      <ElInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        label={t('auth.confirmPassword') || 'Confirm Password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        leftIcon={<Lock className="w-5 h-5" />}
                        error={errors.confirmPassword}
                        fullWidth
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-[38px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Terms */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="p-4 rounded-2xl bg-[var(--bone-300)]/50 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bone-200)] shadow-[4px_4px_8px_rgba(44,40,34,0.08),-4px_-4px_8px_rgba(255,255,255,0.5)] flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-[var(--neon-cyan)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                            {t('auth.yourDataIsSafe') || 'Your data is safe'}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {t('auth.dataProtectionDesc') || 'We use industry-standard encryption and never share your personal information with third parties without your consent.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-2xl transition-all duration-200 ${
                      errors.agreeToTerms 
                        ? 'bg-rose-50 border border-rose-200' 
                        : 'hover:bg-[var(--bone-300)]/30'
                    }`}>
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-6 h-6 rounded-xl bg-[var(--bone-200)] shadow-[inset_3px_3px_6px_rgba(44,40,34,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] peer-checked:bg-[var(--neon-cyan)] peer-checked:shadow-[0_0_10px_rgba(0,217,255,0.4)] transition-all duration-200" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {t('auth.agreeToTerms') || 'I agree to the'}{' '}
                        <Link to="/terms" className="text-[var(--neon-cyan)] hover:underline">
                          {t('nav.terms') || 'Terms of Service'}
                        </Link>{' '}
                        {t('auth.and') || 'and'}{' '}
                        <Link to="/privacy" className="text-[var(--neon-cyan)] hover:underline">
                          {t('nav.privacy') || 'Privacy Policy'}
                        </Link>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-rose-500 -mt-3 ml-1">{errors.agreeToTerms}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {currentStep > 1 && (
                  <ElButton
                    type="button"
                    variant="elevated"
                    size="lg"
                    leftIcon={<ArrowLeft className="w-5 h-5" />}
                    onClick={handleBack}
                    className="flex-shrink-0"
                  >
                    {t('common.back') || 'Back'}
                  </ElButton>
                )}
                
                {currentStep < 3 ? (
                  <ElButton
                    type="button"
                    variant="gradient"
                    size="lg"
                    fullWidth
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={handleNext}
                  >
                    {t('common.continue') || 'Continue'}
                  </ElButton>
                ) : (
                  <ElButton
                    type="submit"
                    variant="gradient"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    rightIcon={<Check className="w-5 h-5" />}
                  >
                    {t('common.finish') || 'Create Account'}
                  </ElButton>
                )}
              </div>
            </form>
          </ElCardContent>
        </ElCard>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-[var(--text-secondary)]">
            {t('auth.hasAccount') || 'Already have an account?'} {' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[var(--neon-cyan)] hover:text-[var(--stone-600)] transition-colors font-semibold"
            >
              {t('auth.signInNow') || 'Sign in now'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;

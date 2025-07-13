"use client";

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/auth-modal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup } = useAuth();

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setFormData({
        email: '',
        password: '',
        username: '',
        displayName: '',
        confirmPassword: '',
      });
    }
  }, [isOpen, initialMode]);

  // Debug mode changes
  useEffect(() => {
    console.log('Modal mode changed to:', mode);
  }, [mode]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (mode === 'signup') {
      if (!formData.username) {
        setError('Username is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(
          formData.email, 
          formData.password, 
          formData.username,
          formData.displayName || formData.username
        );
      }

      if (result.success) {
        onClose();
        setFormData({
          email: '',
          password: '',
          username: '',
          displayName: '',
          confirmPassword: '',
        });
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    console.log('Switching mode from', mode, 'to', mode === 'login' ? 'signup' : 'login');
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setFormData({
      email: '',
      password: '',
      username: '',
      displayName: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-enter">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all modal-content-enter">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00F0FF] to-[#1E90FF] bg-clip-text text-transparent">
                {mode === 'login' ? 'Welcome Back!' : 'Join Vind'}
              </h2>
              <p className="text-gray-800 text-sm mt-1">
                {mode === 'login' 
                  ? 'Sign in to your account to continue' 
                  : 'Create your account to start sharing amazing videos'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <>
              <div className="relative">
                <label className="block text-sm font-medium text-black mb-2">
                  Username *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1E90FF] w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF] outline-none transition-all bg-white text-black placeholder-gray-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-700 mt-1">This will be your @username on Vind</p>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-black mb-2">
                  Display Name (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1E90FF] w-5 h-5" />
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Your display name"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF] outline-none transition-all bg-white text-black placeholder-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-700 mt-1">How others will see your name</p>
              </div>
            </>
          )}

          <div className="relative">
            <label className="block text-sm font-medium text-black mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1E90FF] w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF] outline-none transition-all bg-white text-black placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-black mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1E90FF] w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={mode === 'signup' ? "Create a strong password" : "Enter your password"}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF] outline-none transition-all bg-white text-black placeholder-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BF00FF] hover:text-[#9900CC] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {mode === 'signup' && (
              <p className="text-xs text-gray-700 mt-1">Must be at least 6 characters long</p>
            )}
          </div>

          {mode === 'signup' && (
            <div className="relative">
              <label className="block text-sm font-medium text-black mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1E90FF] w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F0FF] focus:border-[#00F0FF] outline-none transition-all bg-white text-black placeholder-gray-500"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm error-enter">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="ml-3 font-medium">{error}</div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00F0FF] to-[#1E90FF] text-black py-3 rounded-lg hover:from-[#00D4E6] hover:to-[#1A7FE6] transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl auth-button"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In to Vind' : 'Create Vind Account'
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-600">or</span>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-700 text-sm mb-4">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={switchMode}
              className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#00F0FF] hover:text-[#00F0FF] font-semibold transition-all duration-200 transform hover:scale-105"
            >
              {mode === 'login' ? '✨ Create a new account' : '🔑 Sign in to existing account'}
            </button>
          </div>
        </div>

        {/* Terms */}
        {mode === 'signup' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700 text-center leading-relaxed">
              By creating an account, you agree to Vind's{' '}
              <a href="#" className="text-primary-500 hover:text-primary-600 underline font-medium">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-primary-500 hover:text-primary-600 underline font-medium">
                Privacy Policy
              </a>
              . We'll never share your personal information without your consent.
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

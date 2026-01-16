/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../services/api";
import { isAuthenticated } from '../context/auth';
import { Users, Lock, Mail, AlertCircle, Briefcase } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      const role = localStorage.getItem('role');
      navigate(role === 'admin' ? '/admin/dashboard' : '/hr/dashboard');
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return 'Email is required';
    if (!pattern.test(email)) return 'Invalid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const newErrors = { ...errors };
    
    if (field === 'email') {
      newErrors.email = validateEmail(formData.email);
    } else if (field === 'password') {
      newErrors.password = validatePassword(formData.password);
    }
    
    setErrors(newErrors);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const newErrors = { ...errors };
      if (field === 'email') {
        newErrors.email = validateEmail(value);
      } else if (field === 'password') {
        newErrors.password = validatePassword(value);
      }
      setErrors(newErrors);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'hr') {
        navigate('/hr/dashboard');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A7E6FF] to-white flex">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#050C9C] to-[#3572EF] rounded-2xl mb-4 shadow-lg">
              <img
                src="/GRW.png"
                alt="Company Logo"
                className="w-15 h-15 object-contain"
              />
            </div>
            <h1 className="text-3xl font-semibold text-[#050C9C] mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your CTMS account
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Authentication Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-[#050C9C] mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@hr.gamagerecruiters.lk"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    onKeyPress={(e) => e.key === 'Enter' && onSubmit(e)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                      touched.email && errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-[#050C9C] mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    onKeyPress={(e) => e.key === 'Enter' && onSubmit(e)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                      touched.password && errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                    }`}
                  />
                </div>
                {touched.password && errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={onSubmit}
                disabled={loading}
                className={`w-full bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-3 px-6 rounded-xl font-medium shadow-lg shadow-[#3572EF]/30 transition-all duration-200 ${
                  loading 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-xl hover:shadow-[#3572EF]/40 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </div>
          {/* Help Text */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Need help? Contact{' '}
            <a href="mailto:support@ctms.com" className="text-[#3572EF] hover:text-[#050C9C] font-medium">
              077 479 5371
            </a>
          </p>
        </div>
      </div>

      {/* Right Panel - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#050C9C] to-[#3572EF] items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3ABEF9] rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <div className="mb-8">
            <Users className="w-16 h-16 mb-6 opacity-90" />
            <h2 className="text-4xl font-semibold mb-4">
              Candidate Tracking Management System
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Streamline your recruitment process with our comprehensive CTMS platform.
            </p>
          </div>

          <div className="space-y-4 mt-12">
            {[
              { icon: Users, text: 'Manage candidates efficiently' },
              { icon: Briefcase, text: 'Track job openings and applications' },
              { icon: Lock, text: 'Secure and compliant data handling' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <p className="text-white/90">{feature.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-white/60">
              Developed by GR IT Solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
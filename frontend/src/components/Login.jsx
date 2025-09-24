import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import API from "../services/api";
import { isAuthenticated } from '../context/auth';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      const role = localStorage.getItem('role');
      navigate(role === 'admin' ? '/admin/dashboard' : '/hr/dashboard');
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await API.post('/auth/login', {
        email: data.email,
        password: data.password
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
    <div className="flex h-screen bg-gradient-to-br from-teal-50 to-gray-300">
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-2/3 max-w-lg p-12 bg-teal-50 rounded-xl shadow-2xl border border-gray-100 transform hover:scale-105 transition duration-300">
          <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-teal-400 focus:border-transparent'
                }`}
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                }`}
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <button
              className={`w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 transition duration-200 font-semibold ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
    
        </div>
      </div>
      <div className="w-1/2 bg-gray-300 flex items-center justify-center overflow-hidden rounded-l-3xl">
        <img 
          src="https://img.freepik.com/free-photo/application-contact-communication-connection-concept_53876-132755.jpg?semt=ais_incoming&w=740&q=80" 
          alt="Login" 
          className="w-full h-full object-cover transform hover:scale-105 transition duration-300" 
        />
      </div>
    </div>
  );
};

export default Login;
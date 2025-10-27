/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import API from "../services/api";
import { isAuthenticated } from '../context/auth';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82] overflow-hidden">
      <motion.div 
        className="w-1/2 flex items-center justify-center relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="w-2/3 max-w-md p-8 bg-white/90 rounded-2xl shadow-2xl border border-[#00df82]/20 backdrop-blur-md transform hover:shadow-3xl transition-all duration-500"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-4xl font-bold text-[#03624c] mb-6 text-center bg-gradient-to-r from-[#03624c] to-[#00df82] bg-clip-text"
            variants={itemVariants}
          >
            Login
          </motion.h2>

    
          
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 transition duration-300 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#03624c]/20 focus:ring-[#00df82]/40'
                } bg-white/80 placeholder-gray-400`}
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
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className={`w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 transition duration-300 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-[#03624c]/20 focus:ring-[#00df82]/40'
                } bg-white/80 placeholder-gray-400`}
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
            </motion.div>
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 223, 130, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white py-3 rounded-xl hover:from-[#00df82] hover:to-[#03624c] focus:ring-4 focus:ring-[#00df82]/50 transition duration-300 font-semibold ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
          
          <motion.div 
            className="mt-6 text-center text-sm text-gray-600"
            variants={itemVariants}
          >
            {/* <a href="/forgot-password" className="text-[#00df82] hover:text-[#03624c] underline transition duration-200">Forgot Password?</a> */}
          </motion.div>
        </motion.div>
      </motion.div>
      <div className="w-1/2 relative overflow-hidden">
        <motion.img 
          src="https://img.freepik.com/free-photo/application-contact-communication-connection-concept_53876-132755.jpg?semt=ais_incoming&w=740&q=80" 
          alt="Login Background" 
          className="w-full h-full object-cover absolute top-0 left-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1, rotate: 2 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03624c]/50 to-[#030f0f]/50"></div>
        <motion.div 
          className="absolute top-1/4 right-10 text-white text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00df82] to-[#03624c]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Welcome Back!
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
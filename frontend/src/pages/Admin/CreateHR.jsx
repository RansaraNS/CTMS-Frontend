/* eslint-disable no-unused-vars */
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUserPlus, FiUsers, FiEye, FiLogOut } from 'react-icons/fi';

const CreateHR = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register-hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        reset();
      } else {
        alert(result.message || 'Failed to create HR');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82] font-sans overflow-hidden">
      <div className="flex flex-1 flex-col w-full">
        {/* Navbar */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white p-4 flex justify-between items-center w-full shadow-lg"
        >
          <div className="flex items-center">
            <motion.img
              src="/GR.jpg"
              alt="Company Logo"
              transition={{ duration: 0.5 }}
              className="w-10 h-10 mr-3 object-contain"
            />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00df82]">
              Candidate Tracking System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#03624c] px-4 py-2 rounded-full shadow-lg"
            >
              <span className="font-medium">Welcome, Admin</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 shadow-lg font-medium flex items-center justify-center"
            >
              <FiLogOut className="mr-2" /> Logout
            </motion.button>
          </div>
        </motion.nav>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-64 bg-gradient-to-b from-[#030f0f] to-[#03624c] text-white h-full shadow-2xl"
          >
            <nav className="flex flex-col h-full py-6">
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/dashboard')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiHome className="mr-3 text-lg" /> Dashboard
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/create-hr')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiUserPlus className="mr-3 text-lg" /> Create HR
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/manage-hr')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiUsers className="mr-3 text-lg" /> Manage HR
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/view-interviews')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiEye className="mr-3 text-lg" /> View Interviews
              </motion.button>
            </nav>
          </motion.div>

          <div className="flex-1 p-10 overflow-auto">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={formVariants} 
              className="max-w-3xl mx-auto"
            >
              {/* Hero Section */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-gradient-to-r from-[#03624c] via-[#030f0f] to-[#00df82] rounded-3xl p-2 mb-12 text-white shadow-2xl"
              >
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-4">Create New HR</h1>
                  <p className="text-white">Add a new Human Resource professional to your team</p>
                </div>
              </motion.div>

              {/* Form Card */}
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={containerVariants}
                className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="name">
                      Full Name
                      <span className="text-[#00df82] ml-1">★</span>
                    </label>
                    <input
                      className={`w-full px-6 py-5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00df82]/20 transition-all duration-300 shadow-md ${
                        errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-[#03624c]'
                      }`}
                      id="name"
                      type="text"
                      placeholder="Enter full name (e.g., John Doe)"
                      {...register('name', { 
                        required: 'Full name is required', 
                        minLength: { value: 2, message: 'Name must be at least 2 characters' } 
                      })}
                    />
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-sm text-red-600 flex items-center"
                      >
                        <span className="mr-1">⚠️</span> {errors.name.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="email">
                      Email Address
                      <span className="text-[#00df82] ml-1">★</span>
                    </label>
                    <input
                      className={`w-full px-6 py-5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00df82]/20 transition-all duration-300 shadow-md ${
                        errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-[#03624c]'
                      }`}
                      id="email"
                      type="email"
                      placeholder="Enter email (e.g., john.doe@company.com)"
                      {...register('email', { 
                        required: 'Email is required', 
                        pattern: { 
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                          message: 'Invalid email address' 
                        } 
                      })}
                    />
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-sm text-red-600 flex items-center"
                      >
                        <span className="mr-1">⚠️</span> {errors.email.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="password">
                      Password
                      <span className="text-[#00df82] ml-1">★</span>
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full px-6 py-5 pr-14 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00df82]/20 transition-all duration-300 shadow-md ${
                          errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-[#03624c]'
                        }`}
                        id="password"
                        type="password"
                        placeholder="Enter secure password (minimum 6 characters)"
                        {...register('password', { 
                          required: 'Password is required', 
                          minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                        })}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-sm text-red-600 flex items-center"
                      >
                        <span className="mr-1">⚠️</span> {errors.password.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <label className="block text-gray-700 text-sm font-semibold" htmlFor="role">
                      Role
                      <span className="text-[#00df82] ml-1">★</span>
                    </label>
                    <div className="relative">
                      <input
                        className={`w-full px-6 py-5 pr-14 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00df82]/20 transition-all duration-300 shadow-md ${
                          errors.role ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-[#03624c]'
                        }`}
                        id="role"
                        type="text"
                        placeholder="Enter role (e.g., HR)"
                        {...register('role', { 
                          required: 'Role is required', 
                          pattern: { value: /^(hr)$/i, message: 'Role must be "hr"' } 
                        })}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <span className="text-sm bg-gray-100 px-3 py-2 rounded-full">HR</span>
                      </div>
                    </div>
                    {errors.role && (
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-sm text-red-600 flex items-center"
                      >
                        <span className="mr-1">⚠️</span> {errors.role.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.button 
                    variants={itemVariants} 
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 223, 130, 0.3)' }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition duration-300 focus:ring-2 focus:ring-[#00df82]/50"
                  >
                    <span className="inline-flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create New HR
                    </span>
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHR;
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Briefcase, Mail, Lock, Shield, AlertCircle, UserPlus } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const CreateHR = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Create HR Personnel</h1>
              <p className="text-sm text-gray-600">Add new human resources staff member</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-[#050C9C]">Welcome, Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Form Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-[#050C9C]">New HR Registration</h2>
                    <p className="text-sm text-gray-600">Fill in the details to create a new HR account</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#050C9C] mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter full name (e.g., Saman Gunawardena)"
                      {...register('name', { 
                        required: 'Full name is required', 
                        minLength: { value: 2, message: 'Name must be at least 2 characters' } 
                      })}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                        errors.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#050C9C] mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="saman.g@hr.gamagerecruiters.lk"
                      {...register('email', { 
                        required: 'Email is required',
                        validate: {
                          validFormat: (value) => {
                            const emailRegex = /^[a-zA-Z0-9._%+-]+@hr\.gamagerecruiters\.lk$/;
                            return emailRegex.test(value) || 'Email must end with @hr.gamagerecruiters.lk';
                          }
                        }
                      })}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Email must end with @hr.gamagerecruiters.lk
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#050C9C] mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter secure password (minimum 6 characters)"
                      {...register('password', { 
                        required: 'Password is required', 
                        minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                      })}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                        errors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-[#050C9C] mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="role"
                      type="text"
                      placeholder="Enter role (e.g., HR)"
                      {...register('role', { 
                        required: 'Role is required', 
                        pattern: { value: /^(hr)$/i, message: 'Role must be "hr"' } 
                      })}
                      className={`w-full pl-12 pr-20 py-3 border rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 outline-none ${
                        errors.role
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-xs bg-[#A7E6FF] text-[#050C9C] px-3 py-1 rounded-lg font-medium">
                        HR
                      </span>
                    </div>
                  </div>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-[#3572EF]/30 transition-all duration-200 ${
                    isSubmitting
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:shadow-xl hover:shadow-[#3572EF]/40 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating HR...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create New HR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateHR;
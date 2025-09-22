import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = (data) => {
   
    if (data.email === 'admin@gmail.com' && data.password === 'admin123') {
      localStorage.setItem('role', 'admin');
      navigate('/admin/dashboard');
    } else if (data.email.endsWith('@hr.gamagerecruiters.lk') && data.password.length >= 6) {
      
      localStorage.setItem('role', 'hr');
      navigate('/hr/dashboard');
    } else {
      alert('Invalid credentials. Please try again.');
    }
    reset(); // Reset form after submission
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-50 to-gray-300">
      <div className="w-1/2 flex items-center justify-center">
        {/* Left Side - Login Form with Frame */}
        <div className="w-2/3 max-w-lg p-12 bg-teal-50 rounded-xl shadow-2xl border border-gray-100 transform hover:scale-105 transition duration-300">
          <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 transition duration-200 font-semibold"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="w-1/2 bg-gray-300 flex items-center justify-center overflow-hidden rounded-l-3xl">
        <img src="https://img.freepik.com/free-photo/application-contact-communication-connection-concept_53876-132755.jpg?semt=ais_incoming&w=740&q=80" alt="Login Image" className="w-full h-full object-cover transform hover:scale-105 transition duration-300" />
      </div>
    </div>
  );
};

export default Login;
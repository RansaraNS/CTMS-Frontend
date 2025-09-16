import React from 'react';

const Login = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-teal-100 to-gray-800">
      <div className="w-1/2 flex items-center justify-center">
        {/* Left Side - Login Form with Frame */}
        <div className="w-3/4 max-w-md p-8 bg-teal-50 rounded-xl shadow-2xl border border-gray-100 transform hover:scale-105 transition duration-300">
          <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">Login</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
                id="email"
                type="text"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
            <button
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 transition duration-200 font-semibold"
              type="button"
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
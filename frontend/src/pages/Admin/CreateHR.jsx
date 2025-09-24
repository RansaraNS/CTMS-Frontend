import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateHR = () => {
  const navigate = useNavigate();

    const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // If you have a token
    localStorage.removeItem('user'); // If you store user info
    
    // Redirect to login page
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-teal-600 text-white p-4 flex justify-between items-center w-full">
          <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, Admin</span>
          </div>
          <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded">Logout</button>
        </nav>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          <div className="w-64 bg-gray-800 text-white h-full">
            <nav className="flex flex-col h-full">
              <button onClick={() => navigateTo('/admin/dashboard')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">🏠</span> Dashboard
              </button>
              <button onClick={() => navigateTo('/admin/create-hr')} className="flex items-center p-4 bg-blue-600 hover:bg-blue-600">
                <span className="mr-2">👥</span> Create HR
              </button>
              <button onClick={() => navigateTo('/admin/manage-hr')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">📊</span> Manage HR
              </button>
             
            </nav>
          </div>

          {/* Main Content Area with Create HR Form */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition duration-300">
              <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Create New HR</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    id="email"
                    type="email"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="role">
                    Role
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    id="role"
                    type="text"
                    placeholder="Enter role"
                  />
                </div>
                <button
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 transition duration-200 font-semibold"
                  type="button"
                >
                  Create HR
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHR;
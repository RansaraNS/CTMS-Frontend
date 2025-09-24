import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
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
               <button onClick={() => navigateTo('/admin/dashboard')} className="flex items-center p-4 bg-blue-600 hover:bg-blue-600 ">
            <span className="mr-2">🏠</span> Dashboard
          </button>
          <button onClick={() => navigateTo('/admin/create-hr')} className="flex items-center p-4 hover:bg-gray-700">
            <span className="mr-2">👥</span> Create HR
          </button>
          <button onClick={() => navigateTo('/admin/manage-hr')} className="flex items-center p-4 hover:bg-gray-700">
            <span className="mr-2">📊</span> Manage HR
          </button>
         
            </nav>
          </div>

          <div className="flex-1 p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-800">Admin Dashboard</h2>
            </div>
            </div>

         
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


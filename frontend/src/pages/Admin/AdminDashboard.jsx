import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [latestHrs, setLatestHrs] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  // Fetch the latest 3 HRs
  useEffect(() => {
    const fetchLatestHrs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/latest-hrs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setLatestHrs(result);
        } else {
          console.error(result.message || 'Failed to fetch latest HRs');
        }
      } catch (error) {
        console.error('An error occurred while fetching latest HRs', error);
      }
    };
    fetchLatestHrs();
  }, []);

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
              <button onClick={() => navigateTo('/admin/dashboard')} className="flex items-center p-4 bg-blue-600 hover:bg-blue-600">
                <span className="mr-2">🏠</span> Dashboard
              </button>
              <button onClick={() => navigateTo('/admin/create-hr')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">👥</span> Create HR
              </button>
              <button onClick={() => navigateTo('/admin/manage-hr')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">📊</span> Manage HR
              </button>
              <button onClick={() => navigateTo('/admin/view-interviews')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">👁️</span> View Interviews
              </button>
            </nav>
          </div>

          <div className="flex-1 p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">Admin Dashboard</h2>

              {/* Recent HR Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-700">Recent HR</h3>
                  <button
                    onClick={() => navigateTo('/admin/manage-hr')}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition duration-200"
                  >
                    View All HRs
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {latestHrs.length > 0 ? (
                    latestHrs.map((hr) => (
                      <div key={hr._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-600">Name: {hr.name}</p>
                        <p className="text-gray-600">Email: {hr.email}</p>
                        <p className="text-gray-600">Role: {hr.role}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent HR data available.</p>
                  )}
                </div>
                <hr className="my-4 border-t border-gray-200" /> {/* Horizontal line */}
              </div>

             
              {/* Quick Actions Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <button
                    onClick={() => navigateTo('/admin/create-hr')}
                    className="bg-blue-500 text-white font-bold rounded-lg hover:bg-teal-700 transition duration-200 flex items-center justify-center"
                  >
                    <span className="mr-2">👥</span> Add New HR
                  </button>
                  <button
                    onClick={() => navigateTo('/admin/view-interviews')} // Replace with actual report route if available
                    className="bg-blue-500 text-white font-bold p-4 rounded-lg hover:bg-teal-700 transition duration-200 flex items-center justify-center"
                  >
                    <span className="mr-2">👁️</span> View  All Interviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
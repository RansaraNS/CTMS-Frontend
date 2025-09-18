import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleGenerateReport = () => {
    alert('Candidate Report Generated! (Mock functionality)');
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
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
            <span className="mr-4">Welcome, HR</span>
          </div>
          <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded">Logout</button>
        </nav>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          <div className="w-64 bg-gray-800 text-white h-full">
            <nav className="flex flex-col h-full">
              <button onClick={() => navigateTo('/hr/dashboard')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">🏠</span> HR Dashboard
              </button>
              <button onClick={() => navigateTo('/hr/add-candidate')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">👤</span> Add Candidate
              </button>
              <button onClick={() => navigateTo('/hr/schedule-interview')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">🗓️</span> Schedule Interview
              </button>
              <button onClick={() => navigateTo('/interviews')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">📊</span> Manage Interviews
              </button>
              <button onClick={() => navigateTo('/candidates')} className="flex items-center p-4 bg-blue-600 hover:bg-blue-600">
                <span className="mr-2">🔍</span> View Candidates
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-800">Manage Candidates</h2>
              
              {/* Search Bar and Generate Report - Horizontal Line */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search candidates by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
                <button
                  onClick={handleGenerateReport}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition duration-200"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
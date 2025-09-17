import React from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleInterview = () => {
  const navigate = useNavigate();

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
              <button onClick={() => navigateTo('/hr/schedule-interview')} className="flex items-center p-4 bg-blue-600 hover:bg-blue-600">
                <span className="mr-2">🗓️</span> Schedule Interview
              </button>
              <button onClick={() => navigateTo('/interviews')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">📊</span> Manage Interviews
              </button>
              <button onClick={() => navigateTo('/candidates')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">🔍</span> View Candidates
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Schedule Interview</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                      id="name"
                      type="text"
                      placeholder="Enter candidate name"
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
                      placeholder="Enter candidate email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="date">
                      Date
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                      id="date"
                      type="date"
                      placeholder="Select interview date"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="time">
                      Start Time
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                      id="time"
                      type="time"
                      placeholder="Select interview start time"
                    />
                  </div>
                </div>
                 <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="time">
                      End Time
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                      id="time"
                      type="time"
                      placeholder="Select interview end time"
                    />
                  </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="meetingLink">
                    Meeting Link
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    id="meetingLink"
                    type="url"
                    placeholder="Enter meeting link (e.g., Zoom/Google Meet)"
                  />
                </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="note">
                    Note
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 h-24 resize-none"
                    id="note"
                    placeholder="Add any additional notes"
                  ></textarea>
                </div>
                <button
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 transition duration-200 font-semibold"
                  type="button"
                >
                  Schedule
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;
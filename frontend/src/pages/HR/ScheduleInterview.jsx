import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    startTime: '',
    endTime: '',
    meetingLink: '',
    note: ''
  });
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required.';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day
      if (selectedDate <= today) {
        newErrors.date = 'Date must be in the future.';
      }
    }

    // Start Time validation
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required.';
    }

    // End Time validation
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required.';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time.';
    }

    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
              <form className="space-y-6" >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="name"
                      type="text"
                      placeholder="Enter candidate name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="email"
                      type="email"
                      placeholder="Enter candidate email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="date">
                      Date
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="startTime">
                      Start Time
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.startTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                    {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="endTime">
                      End Time
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.endTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                    {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="meetingLink">
                      Meeting Link
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.meetingLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="meetingLink"
                      type="url"
                      placeholder="Enter meeting link (e.g., Zoom/Google Meet)"
                      value={formData.meetingLink}
                      onChange={handleChange}
                    />
                    {errors.meetingLink && <p className="mt-1 text-sm text-red-600">{errors.meetingLink}</p>}
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
                    value={formData.note}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
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
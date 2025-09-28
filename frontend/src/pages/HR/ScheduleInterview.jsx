/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateId: '',
    interviewDate: '',
    interviewTime: '',
    interviewType: 'technical',
    interviewers: '',
    meetingLink: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  // Fetch only NEW candidates for dropdown
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        // Add status filter to only get new candidates
        const response = await fetch('http://localhost:5000/api/candidates?page=1&limit=100&status=new', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }

        const data = await response.json();
        setCandidates(Array.isArray(data) ? data : data.candidates || []);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setErrors({ fetch: 'Failed to load candidates. Please try again.' });
      }
    };

    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }

    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const combineDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return null;

    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    return date.toISOString();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.candidateId) {
      newErrors.candidateId = 'Please select a candidate.';
    }

    if (!formData.interviewDate) {
      newErrors.interviewDate = 'Date is required.';
    } else {
      const selectedDate = new Date(formData.interviewDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.interviewDate = 'Date must be today or in the future.';
      }
    }

    if (!formData.interviewTime) {
      newErrors.interviewTime = 'Time is required.';
    } else {
      if (formData.interviewDate === new Date().toISOString().split('T')[0]) {
        const now = new Date();
        const selectedTime = new Date();
        const [hours, minutes] = formData.interviewTime.split(':').map(Number);
        selectedTime.setHours(hours, minutes, 0, 0);

        if (selectedTime <= now) {
          newErrors.interviewTime = 'Time must be in the future.';
        }
      }
    }

    if (!formData.interviewType) {
      newErrors.interviewType = 'Interview type is required.';
    }

    if (!formData.interviewers) {
      newErrors.interviewers = 'Interviewers are required.';
    }

    if (!formData.meetingLink) {
      newErrors.meetingLink = 'Meeting link is required.';
    } else if (!isValidUrl(formData.meetingLink)) {
      newErrors.meetingLink = 'Please enter a valid URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const interviewDateTime = combineDateTime(formData.interviewDate, formData.interviewTime);

      if (!interviewDateTime) {
        throw new Error('Invalid date or time format');
      }

      const requestBody = {
        candidateId: formData.candidateId,
        interviewDate: interviewDateTime,
        interviewType: formData.interviewType,
        interviewers: formData.interviewers.split(',').map(i => i.trim()),
        meetingLink: formData.meetingLink
      };

      const response = await fetch('http://localhost:5000/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to schedule interview: ${response.status}`);
      }

      setSuccessMessage('Interview scheduled successfully!');

      setFormData({
        candidateId: '',
        interviewDate: '',
        interviewTime: '',
        interviewType: 'technical',
        interviewers: '',
        meetingLink: ''
      });

      setErrors({});

    } catch (error) {
      console.error('Error scheduling interview:', error);
      setErrors({
        submit: error.message || 'An error occurred while scheduling the interview. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinTime = () => {
    if (formData.interviewDate === new Date().toISOString().split('T')[0]) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 15);
      return now.toTimeString().slice(0, 5);
    }
    return '00:00';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Navbar */}
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
              Candidate Tracking Management System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#03624c] px-4 py-2 rounded-full shadow-lg"
            >
              <span className="font-medium">Welcome, {user?.name || "HR"}</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 shadow-lg font-medium"
            >
              Logout
            </motion.button>
          </div>
        </motion.nav>

        {/* Sidebar + Main Content */}
        <div className="flex flex-1">
          {/* Enhanced Sidebar */}
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
                onClick={() => navigateTo("/hr/dashboard")}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <span className="mr-3 text-xl">🏠</span>
                <span className="font-semibold">HR Dashboard</span>
              </motion.button>

              {[
                { path: "/hr/add-candidate", icon: "👤", label: "Add Candidate" },
                { path: "/hr/schedule-interview", icon: "🗓️", label: "Schedule Interview" },
                { path: "/interviews", icon: "📊", label: "Manage Interviews" },
                { path: "/candidates", icon: "🔍", label: "View Candidates" },
              ].map((item, index) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10, backgroundColor: "rgba(0,223,130,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo(item.path)}
                  className={`flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 ${item.path === "/hr/schedule-interview"
                      ? "bg-gradient-to-r from-[#03624c] to-[#030f0f]"
                      : "hover:bg-white hover:bg-opacity-10"
                    }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-start min-h-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#03624c] to-[#030f0f] bg-clip-text text-transparent"
                >
                  Schedule Interview
                </motion.h2>

                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl"
                    >
                      ✅ {successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Messages */}
                <AnimatePresence>
                  {errors.fetch && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
                    >
                      ❌ {errors.fetch}
                    </motion.div>
                  )}

                  {errors.submit && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
                    >
                      ❌ {errors.submit}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Info message when no new candidates available */}
                {candidates.length === 0 && !errors.fetch && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                  >
                    <p className="text-blue-700 flex items-center">
                      <span className="mr-2">ℹ️</span>
                      No new candidates available for scheduling.
                      <button
                        onClick={() => navigateTo("/hr/add-candidate")}
                        className="ml-2 text-[#00df82] hover:text-[#03624c] font-medium underline"
                      >
                        Add a new candidate first.
                      </button>
                    </p>
                  </motion.div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Candidate Selection */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="candidateId">
                      Select Candidate *
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 shadow-sm ${errors.candidateId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00df82]'
                        }`}
                      id="candidateId"
                      value={formData.candidateId}
                      onChange={handleChange}
                      disabled={candidates.length === 0}
                    >
                      <option value="">
                        {candidates.length === 0 ? 'No new candidates available' : 'Select a candidate'}
                      </option>
                      {candidates.map((candidate) => (
                        <option key={candidate._id} value={candidate._id}>
                          {candidate.firstName} {candidate.lastName} - {candidate.position} ({candidate.email})
                        </option>
                      ))}
                    </select>
                    {errors.candidateId && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.candidateId}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Date and Time */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="interviewDate">
                        Interview Date *
                      </label>
                      <input
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 shadow-sm ${errors.interviewDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00df82]'
                          }`}
                        id="interviewDate"
                        type="date"
                        value={formData.interviewDate}
                        onChange={handleChange}
                        min={getMinDate()}
                      />
                      {errors.interviewDate && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.interviewDate}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="interviewTime">
                        Interview Time *
                      </label>
                      <input
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 shadow-sm ${errors.interviewTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00df82]'
                          }`}
                        id="interviewTime"
                        type="time"
                        value={formData.interviewTime}
                        onChange={handleChange}
                        min={formData.interviewDate === getMinDate() ? getMinTime() : "09:30"}
                        max="17:30"
                      />

                      {errors.interviewTime && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.interviewTime}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Interview Type and Interviewers */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="interviewType">
                        Interview Type *
                      </label>
                      <select
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 shadow-sm ${errors.interviewType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00df82]'
                          }`}
                        id="interviewType"
                        value={formData.interviewType}
                        onChange={handleChange}
                      >
                        <option value="First Round">First Round</option>
                        <option value="Secound Round">Secound Round</option>
                        <option value="technical">Technical</option>
                      </select>
                      {errors.interviewType && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.interviewType}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="interviewers">
                        Interviewers (comma separated) *
                      </label>
                      <input
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 shadow-sm ${errors.interviewers ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00df82]'
                          }`}
                        id="interviewers"
                        type="text"
                        placeholder="e.g., john@company.com, jane@company.com"
                        value={formData.interviewers}
                        onChange={handleChange}
                      />
                      {errors.interviewers && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.interviewers}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Meeting Link */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-gray-700 text-sm font-semibold mb-3" htmlFor="meetingLink">
                      Meeting Link *
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 shadow-sm ${errors.meetingLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#00df82]'
                        }`}
                      id="meetingLink"
                      type="url"
                      placeholder="https://meet.google.com/abc-def-ghi"
                      value={formData.meetingLink}
                      onChange={handleChange}
                    />
                    {errors.meetingLink && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {errors.meetingLink}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white py-4 rounded-xl hover:from-[#00df82] hover:to-[#03624c] focus:ring-4 focus:ring-[#00df82] transition duration-200 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting || candidates.length === 0}
                  >
                    {isSubmitting ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                    ) : (
                      '🗓️ Schedule Interview'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleInterview;
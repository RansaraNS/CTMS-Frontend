/* eslint-disable no-self-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/Sidebar";

const InterviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Enhanced helper to safely format dates and handle objects
  const formatDate = (date) => {
    if (!date) return "N/A";

    // Handle MongoDB date objects { $date: ... }
    if (typeof date === "object" && "$date" in date) {
      date = date.$date;
    }

    try {
      const dateObj = new Date(date);
      return isNaN(dateObj.getTime()) ? "Invalid Date" : dateObj.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  // Process interview data properly
  const processInterviewData = (fetchedInterview) => {
    if (!fetchedInterview) return null;

    const processed = { ...fetchedInterview };

    // Process dates
    if (processed.interviewDate) {
      processed.interviewDate = formatDate(processed.interviewDate);
    }
    if (processed.submittedAt) {
      processed.submittedAt = formatDate(processed.submittedAt);
    }
    if (processed.createdAt) {
      processed.createdAt = formatDate(processed.createdAt);
    }
    if (processed.updatedAt) {
      processed.updatedAt = formatDate(processed.updatedAt);
    }

    // Process candidate object
    if (processed.candidate && typeof processed.candidate === 'object') {
      processed.candidate = { ...processed.candidate };
      // Add any candidate-specific processing if needed
    }

    // Process interviewers array - ensure it's properly formatted
    if (processed.interviewers) {
      if (Array.isArray(processed.interviewers)) {
        // If it's already an array, use it as is
        processed.interviewers = processed.interviewers.join(', ');
      } else if (typeof processed.interviewers === 'string') {
        // If it's a string, try to parse it as JSON
        try {
          const parsed = JSON.parse(processed.interviewers);
          if (Array.isArray(parsed)) {
            processed.interviewers = parsed.join(', ');
          }
        } catch {
          // If parsing fails, use the string as is
          processed.interviewers = processed.interviewers;
        }
      }
    }

    // Process feedback if it exists
    if (processed.feedback && typeof processed.feedback === 'object') {
      // If feedback is an object, stringify it for display
      try {
        processed.feedback = JSON.stringify(processed.feedback, null, 2);
      } catch {
        processed.feedback = "Unable to display feedback";
      }
    }

    return processed;
  };

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await fetch(
          `http://localhost:5000/api/interviews/${id}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.interview) {
          throw new Error("Interview not found");
        }

        // Process the interview data properly
        const processedInterview = processInterviewData(data.interview);
        setInterview(processedInterview);
      } catch (error) {
        console.error("Error fetching interview details:", error);
        setError(error.message);
        setInterview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800 border border-blue-200', label: 'Scheduled' },
      completed: { color: 'bg-green-100 text-green-800 border border-green-200', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800 border border-red-200', label: 'Cancelled' },
      pending: { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', label: 'Pending' },
      'in-progress': { color: 'bg-purple-100 text-purple-800 border border-purple-200', label: 'In Progress' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 border border-gray-200', label: status };
    
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.color} shadow-sm`}>
        {config.label}
      </span>
    );
  };

  // Helper to safely render values
  const safeRender = (value, defaultValue = "N/A") => {
    if (value === null || value === undefined || value === "") return defaultValue;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
      >
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
          
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-[#00df82] border-t-transparent rounded-full mx-auto"
              ></motion.div>
              <p className="mt-4 text-gray-600 text-lg font-medium">Loading interview details...</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
      >
        <div className="flex-1 flex flex-col">
          {/* Enhanced Navbar */}
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white p-4 flex justify-between items-center w-full shadow-lg"
          >
            <div className="flex items-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-3xl mr-3"
              >
                📊
              </motion.div>
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
          
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full mx-4"
            >
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Interview</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/interviews')}
                className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:from-[#00df82] hover:to-[#03624c] font-semibold shadow-lg"
              >
                Back to Interviews
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!interview) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
      >
        <div className="flex-1 flex flex-col">
          {/* Enhanced Navbar */}
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white p-4 flex justify-between items-center w-full shadow-lg"
          >
            <div className="flex items-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-3xl mr-3"
              >
                📊
              </motion.div>
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
          
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full mx-4"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Interview Not Found</h3>
              <p className="text-gray-600 mb-6">No interview details found for the specified ID.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/interviews')}
                className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:from-[#00df82] hover:to-[#03624c] font-semibold shadow-lg"
              >
                Back to Interviews
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

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
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-3xl mr-3"
            >
              📊
            </motion.div>
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
           <Sidebar/>
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
                className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
              >
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
                    >
                      ❌ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center mb-8"
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#03624c] to-[#030f0f] bg-clip-text text-transparent">
                    Interview Details - {safeRender(interview.candidate?.firstName)} {safeRender(interview.candidate?.lastName)}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/interviews')}
                    className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:from-[#00df82] hover:to-[#03624c] font-semibold shadow-lg"
                  >
                    ← Back to Interviews
                  </motion.button>
                </motion.div>

                {/* Candidate Details */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8 p-6 bg-gradient-to-r from-[#03624c] to-[#030f0f] rounded-2xl border border-gray-200"
                >
                  <h3 className="font-semibold text-lg mb-4 text-white">👤 Candidate Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p><strong className="text-[#00df82]">Full Name:</strong> <span className="text-white font-bold">{safeRender(interview.candidate?.firstName)} {safeRender(interview.candidate?.lastName)}</span></p>
                      <p><strong className="text-[#00df82]">Position:</strong> <span className="text-white font-bold">{safeRender(interview.candidate?.position)}</span></p>
                      <p><strong className="text-[#00df82]">Email:</strong> <span className="text-white font-bold">{safeRender(interview.candidate?.email)}</span></p>
                    </div>
                    <div className="space-y-3">
                      {/* <p><strong className="text-gray-700">Phone:</strong> {safeRender(interview.candidate?.phone)}</p> */}
                    </div>
                  </div>
                </motion.div>

                {/* Interview Details */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="font-semibold text-lg mb-6 text-gray-800">📋 Interview Details</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      {[
                        { label: 'Interview Date', value: safeRender(interview.interviewDate), icon: '📅' },
                        { label: 'Interview Type', value: safeRender(interview.interviewType), icon: '🎯' },
                        { label: 'Status', value: interview.status ? getStatusBadge(interview.status) : "N/A", icon: '📊' },
                        { label: 'Interviewers', value: safeRender(interview.interviewers), icon: '👥' },
                      ].map((item, index) => (
                        <motion.div 
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex justify-between items-center p-4 px-1 bg-white rounded-xl border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center space-x-1">
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium text-gray-700">{item.label}:</span>
                          </div>
                          <div className="text-right max-w-xs">
                            {item.label === 'Status' ? item.value : <span className="font-semibold text-gray-800 break-words">{item.value}</span>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Additional Details */}
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-[#03624c] to-[#030f0f] p-6 rounded-2xl border border-[#00df82]"
                      >
                        <div className="space-y-3">
                          {interview.meetingLink && interview.meetingLink !== "N/A" && (
                            <div>
                              <strong className="text-white">Meeting Link:</strong>
                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-2 text-[#00df82] underline hover:text-white break-all"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                          {interview.notes && interview.notes !== "N/A" && (
                            <div>
                              <strong className="text-white">Notes:</strong>
                              <p className="mt-1 text-gray-200 whitespace-pre-wrap break-words">{safeRender(interview.notes)}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex space-x-4 pt-6 border-t border-gray-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/interviews/${id}/feedback`)}
                    className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:from-[#00df82] hover:to-[#03624c] font-semibold shadow-lg"
                  >
                    📝 View/Add Feedback
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewDetail;
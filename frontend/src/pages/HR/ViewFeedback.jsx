/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';

const ViewFeedback = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInterview(data.interview);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setError('Failed to load interview details. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getOutcomeBadge = (outcome) => {
    const outcomeConfig = {
      passed: { color: 'bg-green-100 text-green-800 border border-green-200', label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800 border border-red-200', label: 'Failed' },
      pending: { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', label: 'Pending' },
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800 border border-purple-200', label: 'Recommended for Next Round' }
    };

    const config = outcomeConfig[outcome] || { color: 'bg-gray-100 text-gray-800 border border-gray-200', label: outcome };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.color} shadow-sm`}>
        {config.label}
      </span>
    );
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
              <p className="mt-4 text-gray-600 text-lg font-medium">Loading feedback details...</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!interview || !interview.feedback) {
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full mx-4"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Feedback Found</h3>
              <p className="text-gray-600 mb-6">No feedback available for this interview.</p>
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

  const { candidate, interviewDate, interviewType, interviewers, feedback } = interview;

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
                    Interview Feedback - {candidate?.firstName} {candidate?.lastName}
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

                {/* Interview Details */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8 p-6 bg-gradient-to-r from-[#03624c] to-[#030f0f] rounded-2xl border border-gray-200"
                >
                  <h3 className="font-semibold text-lg mb-4 text-white">📋 Interview Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p>
                        <strong className="text-[#00df82]">Candidate:</strong>{" "}
                        <span className="text-white font-bold">
                          {candidate?.firstName} {candidate?.lastName}
                        </span>
                      </p>
                      <p>
                        <strong className="text-[#00df82]">Position:</strong>{" "}
                        <span className="text-white font-bold">{candidate?.position}</span>
                      </p>
                      <p>
                        <strong className="text-[#00df82]">Email:</strong>{" "}
                        <span className="text-white font-bold">{candidate?.email}</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p>
                        <strong className="text-[#00df82]">Interview Date:</strong>{" "}
                        <span className="text-white font-bold">
                          {new Date(interviewDate).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        <strong className="text-[#00df82]">Type:</strong>{" "}
                        <span className="text-white font-bold capitalize">{interviewType}</span>
                      </p>
                      <p>
                        <strong className="text-[#00df82]">Interviewers:</strong>{" "}
                        <span className="text-white font-bold">{interviewers?.join(", ")}</span>
                      </p>
                    </div>

                  </div>
                </motion.div>

                {/* Feedback Summary */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="font-semibold text-lg mb-6 text-gray-800">📊 Feedback Summary</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ratings */}
                    <div className="space-y-6">
                      {[
                        { label: 'Technical Skills', value: feedback.technicalSkills, color: 'from-[#03624c] to-[#030f0f]' },
                        { label: 'Communication', value: feedback.communication, color: 'from-green-500 to-green-600' },
                        { label: 'Problem Solving', value: feedback.problemSolving, color: 'from-purple-500 to-purple-600' },
                        { label: 'Cultural Fit', value: feedback.culturalFit, color: 'from-orange-500 to-orange-600' }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                        >
                          <span className="font-medium text-gray-700">{item.label}:</span>
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-gray-800">{item.value}/5</span>
                            <div className="flex">
                              <span className="text-yellow-400 text-lg">{getRatingStars(item.value)}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Overall Rating and Details */}
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-[#03624c] to-[#030f0f] p-6 rounded-2xl border border-[#00df82]"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold text-white">Overall Rating:</span>
                          <span className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                            {feedback.overallRating}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className="bg-gradient-to-r from-[#03622c] to-[#030f0f] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(feedback.overallRating / 5) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>0</span>
                          <span>5</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-4"
                      >
                        <div>
                          <span className="font-medium text-gray-700 block mb-2">Outcome:</span>
                          {getOutcomeBadge(feedback.outcome)}
                        </div>

                        <div>
                          <span className="font-medium text-gray-700">Submitted By:</span>
                          <p className="mt-1 text-gray-600">{feedback.submittedBy}</p>
                        </div>

                        {feedback.submittedAt && (
                          <div>
                            <span className="font-medium text-gray-700">Submitted On:</span>
                            <p className="mt-1 text-gray-600">{new Date(feedback.submittedAt).toLocaleString()}</p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Additional Notes */}
                {feedback.notes && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-8"
                  >
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">📝 Additional Notes</h3>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{feedback.notes}</p>
                    </div>
                  </motion.div>
                )}

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
                    onClick={() => navigate(`/interviews/${interviewId}/feedback`)}
                    className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:from-[#00df82] hover:to-[#03624c] font-semibold shadow-lg"
                  >
                    ✏️ Edit Feedback
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()}
                    className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:from-[#00df82] hover:to-[#03624c] font-semibold shadow-lg"
                  >
                    🖨️ Print Feedback
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

export default ViewFeedback;
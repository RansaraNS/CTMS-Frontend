/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  // Initialize with proper default values
  const [feedback, setFeedback] = useState({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    culturalFit: 0,
    overallRating: 0,
    notes: '',
    submittedBy: user?.name || '',
    outcome: 'pending'
  });

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
      
      if (data.interview?.feedback) {
        // Ensure all required fields are present
        const existingFeedback = data.interview.feedback;
        setFeedback({
          technicalSkills: existingFeedback.technicalSkills || 0,
          communication: existingFeedback.communication || 0,
          problemSolving: existingFeedback.problemSolving || 0,
          culturalFit: existingFeedback.culturalFit || 0,
          overallRating: existingFeedback.overallRating || 0,
          notes: existingFeedback.notes || '',
          submittedBy: existingFeedback.submittedBy || user?.name || '',
          outcome: existingFeedback.outcome || 'pending'
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setError('Failed to load interview details');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (category, value) => {
    const ratingValue = parseInt(value) || 0;
    const newFeedback = {
      ...feedback,
      [category]: ratingValue
    };
    
    // Calculate overall rating safely
    const { technicalSkills, communication, problemSolving, culturalFit } = newFeedback;
    const total = (technicalSkills || 0) + (communication || 0) + (problemSolving || 0) + (culturalFit || 0);
    const average = total > 0 ? total / 4 : 0;
    
    setFeedback({
      ...newFeedback,
      overallRating: Math.round(average * 2) / 2 // Round to nearest 0.5
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}/feedback`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feedback: feedback,
          outcome: feedback.outcome
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      alert('Feedback submitted successfully!');
      navigate('/interviews');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
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

  const getOverallRating = () => {
    const rating = feedback.overallRating || 0;
    return rating.toFixed(1);
  };

  const getRatingPercentage = () => {
    const rating = feedback.overallRating || 0;
    return (rating / 5) * 100;
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen bg-gradient-to-br from-gray-50 to-teal-50"
      >
        <div className="flex-1 flex flex-col">
          {/* Enhanced Navbar */}
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-4 flex justify-between items-center w-full shadow-lg"
          >
            <div className="flex items-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-3xl mr-3"
              >
                📊
              </motion.div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">
                Candidate Tracking Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-teal-700 px-4 py-2 rounded-full shadow-lg"
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
                className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"
              ></motion.div>
              <p className="mt-4 text-gray-600 text-lg font-medium">Loading interview details...</p>
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
      className="flex min-h-screen bg-gradient-to-br from-gray-50 to-teal-50"
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Navbar */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-4 flex justify-between items-center w-full shadow-lg"
        >
          <div className="flex items-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-3xl mr-3"
            >
              📊
            </motion.div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">
              Candidate Tracking Management System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-teal-700 px-4 py-2 rounded-full shadow-lg"
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
            className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-full shadow-2xl"
          >
            <nav className="flex flex-col h-full py-6">
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo("/hr/dashboard")}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(255,255,255,0.1)] hover:bg-opacity-10"
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
                  whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo(item.path)}
                  className="flex items-center p-4 hover:bg-white hover:bg-opacity-10 mx-2 rounded-lg mb-1 transition-all duration-200"
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
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Interview Feedback - {interview?.candidate?.firstName} {interview?.candidate?.lastName}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/interviews')}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 font-semibold shadow-lg"
                  >
                    ← Back to Interviews
                  </motion.button>
                </motion.div>

                {/* Interview Details */}
                {interview && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-teal-50 rounded-2xl border border-gray-200"
                  >
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">📋 Interview Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p><strong className="text-gray-700">Candidate:</strong> {interview.candidate?.firstName} {interview.candidate?.lastName}</p>
                        <p><strong className="text-gray-700">Position:</strong> {interview.candidate?.position}</p>
                        <p><strong className="text-gray-700">Email:</strong> {interview.candidate?.email}</p>
                      </div>
                      <div className="space-y-3">
                        <p><strong className="text-gray-700">Interview Date:</strong> {new Date(interview.interviewDate).toLocaleString()}</p>
                        <p><strong className="text-gray-700">Type:</strong> <span className="capitalize">{interview.interviewType}</span></p>
                        <p><strong className="text-gray-700">Interviewers:</strong> {interview.interviewers?.join(', ')}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Candidate Assessment */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    <h3 className="font-semibold text-2xl text-gray-800 mb-4">📊 Candidate Assessment</h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {[
                        { key: 'technicalSkills', label: 'Technical Skills', icon: '💻' },
                        { key: 'communication', label: 'Communication', icon: '🗣️' },
                        { key: 'problemSolving', label: 'Problem Solving', icon: '🧩' },
                        { key: 'culturalFit', label: 'Cultural Fit', icon: '🤝' }
                      ].map(({ key, label, icon }, index) => (
                        <motion.div 
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm"
                        >
                          <label className="block text-lg font-semibold text-gray-800 mb-4">
                            {icon} {label}:
                          </label>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <motion.label 
                                  key={rating} 
                                  className="flex items-center cursor-pointer"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <input
                                    type="radio"
                                    name={key}
                                    value={rating}
                                    checked={(feedback[key] || 0) === rating}
                                    onChange={(e) => handleRatingChange(key, e.target.value)}
                                    className="sr-only"
                                  />
                                  <span className={`text-2xl p-2 rounded-full transition-all duration-200 ${
                                    (feedback[key] || 0) === rating 
                                      ? 'bg-yellow-100 text-yellow-500 scale-110' 
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  }`}>
                                    {rating <= (feedback[key] || 0) ? '★' : '☆'}
                                  </span>
                                </motion.label>
                              ))}
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500 font-medium">
                                Current Rating:
                              </span>
                              <span className="font-bold text-lg bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                                {feedback[key] || 0}/5
                              </span>
                              <div className="flex text-yellow-400 text-lg">
                                {getRatingStars(feedback[key] || 0)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Overall Rating */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      <div>
                        <span className="font-semibold text-lg text-gray-800">Overall Rating:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent ml-3">
                          {getOverallRating()}/5
                        </span>
                      </div>
                      <div className="w-full md:w-64">
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div 
                            className="bg-gradient-to-r from-teal-600 to-blue-600 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${getRatingPercentage()}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>0</span>
                          <span>5</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Interview Outcome */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      🎯 Interview Outcome:
                    </label>
                    <select
                      name="outcome"
                      value={feedback.outcome || 'pending'}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg shadow-sm"
                      required
                    >
                      <option value="pending">⏳ Pending Decision</option>
                      <option value="passed">✅ Passed</option>
                      <option value="failed">❌ Failed</option>
                      <option value="recommended-next-round">⭐ Recommended for Next Round</option>
                    </select>
                  </motion.div>

                  {/* Submitted By */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      ✍️ Submitted By:
                    </label>
                    <input
                      type="text"
                      name="submittedBy"
                      value={feedback.submittedBy || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg shadow-sm"
                      required
                    />
                  </motion.div>

                  {/* Additional Notes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      📝 Additional Notes:
                    </label>
                    <textarea
                      name="notes"
                      value={feedback.notes || ''}
                      onChange={handleInputChange}
                      placeholder="Enter detailed feedback, strengths, areas for improvement, etc."
                      rows="6"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg shadow-sm resize-vertical"
                    />
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex space-x-4 pt-6 border-t border-gray-200"
                  >
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.05 }}
                      whileTap={{ scale: submitting ? 1 : 0.95 }}
                      className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-teal-700 hover:to-blue-700 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {submitting ? (
                        <span className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          ></motion.div>
                          Submitting...
                        </span>
                      ) : (
                        '✅ Submit Feedback'
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => navigate('/interviews')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 font-semibold shadow-lg text-lg"
                    >
                      ❌ Cancel
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewFeedback;
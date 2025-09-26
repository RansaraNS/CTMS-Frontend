import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUserPlus, FiUsers, FiEye, FiLogOut } from 'react-icons/fi';

const InterviewReport = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setInterview(data.interview);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const getOutcomeBadge = (outcome) => {
    const outcomeConfig = {
      passed: { color: 'bg-[#00df82]/20 text-[#00df82]', label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800', label: 'Recommended for Next Round' },
    };
    const config = outcomeConfig[outcome] || { color: 'bg-gray-100 text-gray-800', label: outcome };
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>{config.label}</span>;
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

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82] font-sans overflow-hidden">
        <div className="flex flex-1 flex-col w-full">
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
                Candidate Tracking System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#03624c] px-4 py-2 rounded-full shadow-lg"
              >
                <span className="font-medium">Welcome, Admin</span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 shadow-lg font-medium"
              >
                <FiLogOut className="mr-2" /> Logout
              </motion.button>
            </div>
          </motion.nav>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00df82]"></div>
              <p className="mt-6 text-gray-200 text-lg">Loading interview report...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview || !interview.feedback) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82] font-sans overflow-hidden">
        <div className="flex flex-1 flex-col w-full">
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
                Candidate Tracking System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#03624c] px-4 py-2 rounded-full shadow-lg"
              >
                <span className="font-medium">Welcome, Admin</span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 shadow-lg font-medium flex items-center justify-center"
              >
                <FiLogOut className="mr-2" /> Logout
              </motion.button>
            </div>
          </motion.nav>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-200 text-xl">No feedback found for this interview.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/admin/view-interviews')} className="mt-6 bg-[#03624c] text-white px-6 py-3 rounded-xl hover:bg-[#00df82] focus:ring-2 focus:ring-[#00df82]/50 transition duration-200">
                Back to Interviews
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { candidate, interviewDate, interviewType, interviewers, feedback } = interview;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82] font-sans overflow-hidden">
      <div className="flex flex-1 flex-col w-full">
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
              Candidate Tracking System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#03624c] px-4 py-2 rounded-full shadow-lg"
            >
              <span className="font-medium">Welcome, Admin</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 shadow-lg font-medium flex items-center justify-center"
            >
              <FiLogOut className="mr-2" /> Logout
            </motion.button>
          </div>
        </motion.nav>

        <div className="flex flex-1">
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
                onClick={() => navigateTo('/admin/dashboard')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiHome className="mr-3 text-lg" /> Dashboard
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/create-hr')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiUserPlus className="mr-3 text-lg" /> Create HR
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/manage-hr')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiUsers className="mr-3 text-lg" /> Manage HR
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/view-interviews')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiEye className="mr-3 text-lg" /> View Interviews
              </motion.button>
            </nav>
          </motion.div>

          <div className="flex-1 p-10 overflow-auto">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-[#03624c] to-[#030f0f] bg-clip-text text-transparent">Interview Report - {candidate?.firstName} {candidate?.lastName}</h2>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/admin/view-interviews')} className="bg-[#03624c] text-white px-6 py-3 rounded-xl hover:bg-[#00df82] focus:ring-2 focus:ring-[#00df82]/50 transition duration-200">
                  Back to View Interviews
                </motion.button>
              </div>

              <motion.div variants={itemVariants} className="mb-8 p-6 bg-white rounded-xl shadow-md">
                <h3 className="font-semibold text-xl text-gray-800 mb-5">Interview Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-700 text-lg"><strong>Candidate:</strong> {candidate?.firstName} {candidate?.lastName}</p>
                    <p className="text-gray-600 text-md"><strong>Position:</strong> {candidate?.position}</p>
                    <p className="text-gray-600 text-md"><strong>Email:</strong> {candidate?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-lg"><strong>Interview Date:</strong> {new Date(interviewDate).toLocaleString()}</p>
                    <p className="text-gray-600 text-md"><strong>Type:</strong> {interviewType}</p>
                    <p className="text-gray-600 text-md"><strong>Interviewers:</strong> {interviewers?.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="font-semibold text-xl text-gray-800 mb-5">Feedback Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {[
                      { label: 'Technical Skills', value: feedback.technicalSkills },
                      { label: 'Communication', value: feedback.communication },
                      { label: 'Problem Solving', value: feedback.problemSolving },
                      { label: 'Cultural Fit', value: feedback.culturalFit },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-4 bg-[#03624c]/10 rounded-lg shadow-md">
                        <span className="font-medium text-gray-700 text-lg">{item.label}:</span>
                        <div className="flex items-center">
                          <span className="mr-3 text-gray-600 text-md">{item.value}/5</span>
                          <span className="text-[#00df82] text-xl">{getRatingStars(item.value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-6">
                    <div className="p-4 bg-[#03624c]/10 rounded-lg shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-gray-800 text-lg">Overall Rating:</span>
                        <span className="text-2xl font-bold text-[#03624c]">{feedback.overallRating}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-[#00df82] h-4 rounded-full" style={{ width: `${(feedback.overallRating / 5) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="p-4 bg-[#03624c]/10 rounded-lg shadow-md">
                      <span className="font-medium text-gray-700 text-lg">Outcome:</span>
                      <div className="mt-3">{getOutcomeBadge(feedback.outcome)}</div>
                    </div>
                    <div className="p-4 bg-[#03624c]/10 rounded-lg shadow-md">
                      <span className="font-medium text-gray-700 text-lg">Submitted By:</span>
                      <p className="mt-2 text-gray-600 text-md">{feedback.submittedBy}</p>
                    </div>
                    {feedback.submittedAt && (
                      <div className="p-4 bg-[#03624c]/10 rounded-lg shadow-md">
                        <span className="font-medium text-gray-700 text-lg">Submitted On:</span>
                        <p className="mt-2 text-gray-600 text-md">{new Date(feedback.submittedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {feedback.notes && (
                <motion.div variants={itemVariants} className="mb-8">
                  <h3 className="font-semibold text-xl text-gray-800 mb-5">Additional Notes</h3>
                  <div className="p-6 bg-[#03624c]/10 rounded-xl shadow-md">
                    <p className="whitespace-pre-wrap text-gray-700 text-lg">{feedback.notes}</p>
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="flex space-x-6 pt-8 border-t border-gray-200">
                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 223, 130, 0.3)' }} whileTap={{ scale: 0.95 }} onClick={() => window.print()} className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:from-[#00df82] hover:to-[#03624c] focus:ring-2 focus:ring-[#00df82]/50 transition duration-200">
                  Print Report
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
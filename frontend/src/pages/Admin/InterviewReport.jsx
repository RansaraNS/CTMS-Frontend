/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';

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
      passed: { color: 'bg-[#d1f4e0] text-[#1a7f5a]', label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800', label: 'Recommended for Next Round' },
    };
    const config = outcomeConfig[outcome] || { color: 'bg-gray-100 text-gray-800', label: outcome };
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>{config.label}</span>;
  };

  const handlePrint = () => {
    window.print();
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
      <div className="flex min-h-screen bg-gradient-to-br from-[#0d4d3d] via-[#0a3830] to-[#0d574a] font-sans overflow-hidden">
        <div className="flex flex-1 flex-col w-full">
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-[#0d4d3d] to-[#0a3830] text-white p-4 flex justify-between items-center w-full shadow-lg"
          >
            <div className="flex items-center">
              <motion.img
                src="/GR.jpg"
                alt="Company Logo"
                transition={{ duration: 0.5 }}
                className="w-10 h-10 mr-3 object-contain"
              />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#5dd4a8]">
                Candidate Tracking System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0d4d3d] px-4 py-2 rounded-full shadow-lg"
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
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5dd4a8]"></div>
              <p className="mt-6 text-gray-200 text-lg">Loading interview report...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview || !interview.feedback) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0d4d3d] via-[#0a3830] to-[#0d574a] font-sans overflow-hidden">
        <div className="flex flex-1 flex-col w-full">
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-[#0d4d3d] to-[#0a3830] text-white p-4 flex justify-between items-center w-full shadow-lg"
          >
            <div className="flex items-center">
              <motion.img
                src="/GR.jpg"
                alt="Company Logo"
                transition={{ duration: 0.5 }}
                className="w-10 h-10 mr-3 object-contain"
              />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#5dd4a8]">
                Candidate Tracking System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0d4d3d] px-4 py-2 rounded-full shadow-lg"
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
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/admin/view-interviews')} className="mt-6 bg-[#0d4d3d] text-white px-6 py-3 rounded-xl hover:bg-[#1a6b54] focus:ring-2 focus:ring-[#5dd4a8]/50 transition duration-200">
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
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          .print-header {
            display: block !important;
          }
        }
        @media screen {
          .print-header {
            display: none;
          }
        }
      `}</style>

      <div className="flex min-h-screen bg-gradient-to-br from-[#0d4d3d] via-[#0a3830] to-[#0d574a] font-sans overflow-hidden">
        <div className="flex flex-1 flex-col w-full">
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="no-print bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white p-4 flex justify-between items-center w-full shadow-lg"
          >
            <div className="flex items-center">
              <motion.img
                src="/GR.jpg"
                alt="Company Logo"
                transition={{ duration: 0.5 }}
                className="w-10 h-10 mr-3 object-contain"
              />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#5dd4a8]">
                Candidate Tracking System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0d4d3d] px-4 py-2 rounded-full shadow-lg"
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
            <div className="no-print">
              <AdminSidebar/>
            </div>

            <div className="flex-1 p-10 overflow-auto">
              <div className="print-area">
                {/* Print Header - Only visible when printing */}
                <div className="print-header mb-8 text-center border-b-2 border-gray-300 pb-4">
                  <h1 className="text-3xl font-bold text-[#0d4d3d] mb-2">Candidate Tracking System</h1>
                  <h2 className="text-xl text-gray-600">Interview Feedback Report</h2>
                </div>

                <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
                  <div className="flex justify-between items-center mb-8 no-print">
                    <h2 className="text-3xl font-bold text-[#0d4d3d]">Interview Feedback - {candidate?.firstName} {candidate?.lastName}</h2>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/admin/view-interviews')} className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:bg-[#1a6b54] focus:ring-2 focus:ring-[#5dd4a8]/50 transition duration-200">
                      ← Back to Interviews
                    </motion.button>
                  </div>

                  <motion.div variants={itemVariants} className="mb-8 p-6 bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white rounded-xl shadow-md">
                    <h3 className="font-semibold text-xl mb-5 flex items-center">📋 Interview Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[#b3f5d9] text-sm mb-1"><strong>Candidate:</strong></p>
                        <p className="text-white text-lg mb-3">{candidate?.firstName} {candidate?.lastName}</p>
                        <p className="text-[#b3f5d9] text-sm mb-1"><strong>Position:</strong></p>
                        <p className="text-white text-md mb-3">{candidate?.position}</p>
                        <p className="text-[#b3f5d9] text-sm mb-1"><strong>Email:</strong></p>
                        <p className="text-white text-md">{candidate?.email}</p>
                      </div>
                      <div>
                        <p className="text-[#b3f5d9] text-sm mb-1"><strong>Interview Date:</strong></p>
                        <p className="text-white text-lg mb-3">{new Date(interviewDate).toLocaleString()}</p>
                        <p className="text-[#b3f5d9] text-sm mb-1"><strong>Type:</strong></p>
                        <p className="text-white text-md mb-3">{interviewType}</p>
                        <p className="text-[#b3f5d9] text-sm mb-1"><strong>Interviewers:</strong></p>
                        <p className="text-white text-md">{interviewers?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mb-8">
                    <h3 className="font-semibold text-xl text-gray-800 mb-5 flex items-center">📊 Feedback Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        {[
                          { label: 'Technical Skills', value: feedback.technicalSkills },
                          { label: 'Communication', value: feedback.communication },
                          { label: 'Problem Solving', value: feedback.problemSolving },
                          { label: 'Cultural Fit', value: feedback.culturalFit },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <span className="font-medium text-gray-700 text-lg">{item.label}:</span>
                            <div className="flex items-center">
                              <span className="mr-3 text-gray-600 text-md font-semibold">{item.value}/5</span>
                              <span className="text-[#f4b942] text-xl">{getRatingStars(item.value)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-6">
                        <div className="p-5 bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white rounded-lg shadow-md">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg">Overall Rating:</span>
                            <span className="text-3xl font-bold">{feedback.overallRating}/5</span>
                          </div>
                          <div className="w-full bg-[#1a6b54] rounded-full h-3">
                            <div className="bg-[#5dd4a8] h-3 rounded-full" style={{ width: `${(feedback.overallRating / 5) * 100}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-2 text-gray-300">
                            <span>0</span>
                            <span>5</span>
                          </div>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                          <span className="font-medium text-gray-700 text-lg">Outcome:</span>
                          <div className="mt-3">{getOutcomeBadge(feedback.outcome)}</div>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                          <span className="font-medium text-gray-700 text-lg">Submitted By:</span>
                          <p className="mt-2 text-gray-600 text-md">{feedback.submittedBy}</p>
                        </div>
                        {feedback.submittedAt && (
                          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <span className="font-medium text-gray-700 text-lg">Submitted On:</span>
                            <p className="mt-2 text-gray-600 text-md">{new Date(feedback.submittedAt).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {feedback.notes && (
                    <motion.div variants={itemVariants} className="mb-8">
                      <h3 className="font-semibold text-xl text-gray-800 mb-5 flex items-center">📝 Additional Notes</h3>
                      <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                        <p className="whitespace-pre-wrap text-gray-700 text-lg">{feedback.notes}</p>
                      </div>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="flex space-x-6 pt-8 border-t border-gray-200 no-print">
                    <motion.button 
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(13, 77, 61, 0.3)' }} 
                      whileTap={{ scale: 0.95 }} 
                      onClick={handlePrint}
                      className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white px-6 py-3 rounded-xl hover:bg-[#1a6b54] focus:ring-2 focus:ring-[#5dd4a8]/50 transition duration-200 flex items-center"
                    >
                      🖨️ Print Feedback
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewReport;
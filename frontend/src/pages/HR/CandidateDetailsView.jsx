/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CandidateDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCandidateDetails();
  }, [id]);

  const fetchCandidateDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/candidates/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/');
          return;
        }
        if (response.status === 404) {
          throw new Error('Candidate not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCandidate(data.candidate);
      setInterviews(data.interviews || []);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      setError(error.message || 'Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-gray-100 text-gray-800', label: 'New' },
      contacted: { color: 'bg-blue-100 text-blue-800', label: 'Contacted' },
      interviewed: { color: 'bg-yellow-100 text-yellow-800', label: 'Interviewed' },
      hired: { color: 'bg-green-100 text-green-800', label: 'Hired' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      terminated: { color: 'bg-orange-100 text-orange-800', label: 'Terminated' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} shadow-sm`}
      >
        {config.label}
      </motion.span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFeedback = (feedback) => {
    if (!feedback) return null;
    
    if (typeof feedback === 'string') {
      return <p className="text-sm text-gray-600"><strong>Feedback:</strong> {feedback}</p>;
    }
    
    if (typeof feedback === 'object') {
      return (
        <div className="mt-2">
          <p className="text-sm font-semibold text-gray-700">Interview Feedback:</p>
          {feedback.technicalSkills && (
            <p className="text-sm text-gray-600"><strong>Technical Skills:</strong> {feedback.technicalSkills}</p>
          )}
          {feedback.communication && (
            <p className="text-sm text-gray-600"><strong>Communication:</strong> {feedback.communication}</p>
          )}
          {feedback.problemSolving && (
            <p className="text-sm text-gray-600"><strong>Problem Solving:</strong> {feedback.problemSolving}</p>
          )}
          {feedback.culturalFit && (
            <p className="text-sm text-gray-600"><strong>Cultural Fit:</strong> {feedback.culturalFit}</p>
          )}
          {feedback.overallRating && (
            <p className="text-sm text-gray-600"><strong>Overall Rating:</strong> {feedback.overallRating}</p>
          )}
          {feedback.notes && (
            <p className="text-sm text-gray-600"><strong>Notes:</strong> {feedback.notes}</p>
          )}
          {feedback.outcome && (
            <p className="text-sm text-gray-600"><strong>Outcome:</strong> {feedback.outcome}</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  const handleBack = () => {
    navigate('/candidates');
  };

  const handleEdit = () => {
    navigate(`/hr/edit-candidate/${id}`);
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

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 to-blue-100"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
          }}
          className="rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent"
        ></motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen bg-gradient-to-br from-gray-50 to-teal-50"
      >
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl max-w-md text-center shadow-lg"
          >
            <p className="font-bold text-lg mb-2">Error</p>
            <p>{error}</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700 shadow-lg"
            >
              Back to Candidates
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!candidate) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen bg-gradient-to-br from-gray-50 to-teal-50"
      >
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-gray-600 text-lg mb-4">Candidate not found</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700 shadow-lg"
            >
              Back to Candidates
            </motion.button>
          </motion.div>
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
                      {/* Logo image */}
                      <motion.img
                        src="/GR.jpg" // make sure this is in public folder
                        alt="Company Logo"
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 mr-3 object-contain"
                      />
          
                      {/* Title */}
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
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <motion.button 
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="flex items-center text-teal-600 hover:text-teal-800 font-medium"
                >
                  ← Back to Candidates
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg font-medium"
                >
                  ✏️ Edit Candidate
                </motion.button>
              </div>

              {/* Candidate Profile Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex-shrink-0 h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm"
                      >
                        <span className="text-white text-3xl font-bold">
                          {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                        </span>
                      </motion.div>
                      <div className="ml-6">
                        <h2 className="text-3xl font-bold">
                          {candidate.firstName} {candidate.lastName}
                        </h2>
                        <p className="text-teal-100 text-lg">{candidate.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(candidate.status)}
                      <p className="text-teal-100 mt-2">Added on {formatDate(candidate.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">👤</span> Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900 font-medium">{candidate.email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900 font-medium">{candidate.phone || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <label className="text-sm font-medium text-gray-500">Source</label>
                          <p className="text-gray-900 font-medium">{candidate.source || 'N/A'}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Professional Information
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">💼</span> Professional Information
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <label className="text-sm font-medium text-gray-500">Experience</label>
                          <p className="text-gray-900 font-medium">{candidate.experience ? `${candidate.experience} years` : 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <label className="text-sm font-medium text-gray-500">Current Company</label>
                          <p className="text-gray-900 font-medium">{candidate.currentCompany || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <label className="text-sm font-medium text-gray-500">Expected Salary</label>
                          <p className="text-gray-900 font-medium">{candidate.expectedSalary || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <label className="text-sm font-medium text-gray-500">Notice Period</label>
                          <p className="text-gray-900 font-medium">{candidate.noticePeriod || 'N/A'}</p>
                        </div>
                      </div>
                    </motion.div> */}
                  </div>

                  {/* Skills */}
                  {candidate.skills && candidate.skills.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🛠️</span> Skills
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {candidate.skills.map((skill, index) => (
                          <motion.span 
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Notes */}
                  {candidate.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📝</span> Notes
                      </h3>
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                        <p className="text-gray-700 whitespace-pre-wrap">{candidate.notes}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Rejection/Termination Reason */}
                  {(candidate.rejectionReason || candidate.terminationReason) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">⚠️</span> 
                        {candidate.rejectionReason ? 'Rejection Reason' : 'Termination Reason'}
                      </h3>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                        <p className="text-red-700">
                          {candidate.rejectionReason || candidate.terminationReason}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Interview History */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-50 to-teal-50 px-6 py-4 border-b">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">📊</span> Interview History ({interviews.length})
                  </h3>
                </div>
                <div className="p-6">
                  {interviews.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="text-6xl mb-4">📅</div>
                      <p className="text-gray-500 text-lg">No interviews scheduled yet.</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {interviews.map((interview, index) => (
                          <motion.div 
                            key={interview._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2 }}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">{interview.interviewType}</h4>
                                <p className="text-gray-600">With {interview.interviewerName}</p>
                                <p className="text-sm text-gray-500">{formatDate(interview.interviewDate)}</p>
                              </div>
                              <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                  interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                } shadow-sm`}
                              >
                                {interview.status}
                              </motion.span>
                            </div>
                            {renderFeedback(interview.feedback)}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateDetailsView;
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
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState('');

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
          localStorage.removeItem('user');
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

  // Function to handle CV download
  const handleDownloadCV = async () => {
    if (!candidate?.cv) return;
    
    setCvLoading(true);
    setCvError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/candidates/${id}/cv`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to download CV' }));
        throw new Error(errorData.message || `Failed to download CV: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error('CV file is empty or corrupted');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from CV path or use candidate name
      const filename = candidate.cv.split('/').pop() || 
        `${candidate.firstName}_${candidate.lastName}_CV.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      setCvError(error.message);
    } finally {
      setCvLoading(false);
    }
  };

  // Function to handle CV view
  const handleViewCV = async () => {
    if (!candidate?.cv) return;
    
    setCvLoading(true);
    setCvError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/candidates/${id}/cv`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to load CV' }));
        throw new Error(errorData.message || `Failed to load CV: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error('CV file is empty or corrupted');
      }

      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Don't revoke the URL immediately as it's being used in a new tab
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error viewing CV:', error);
      setCvError(error.message);
    } finally {
      setCvLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-[#82162fff] text-white', label: 'New' },
      scheduled: { color: 'bg-[#03624c] text-white', label: 'scheduled' },
      hired: { color: 'bg-[#00df82] text-white', label: 'Hired' },
      rejected: { color: 'bg-red-500 text-white', label: 'Rejected' },
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

  const handleRetry = () => {
    fetchCandidateDetails();
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
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
          className="rounded-full h-16 w-16 border-4 border-[#00df82] border-t-transparent"
        ></motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
      >
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl max-w-md text-center shadow-lg"
          >
            <p className="font-bold text-lg mb-2">Error</p>
            <p className="mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                className="bg-[#03624c] text-white px-6 py-2 rounded-xl hover:bg-[#00df82] shadow-lg"
              >
                Retry
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 shadow-lg"
              >
                Back to Candidates
              </motion.button>
            </div>
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
        className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
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
              className="bg-[#03624c] text-white px-6 py-2 rounded-xl hover:bg-[#00df82] shadow-lg"
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
          {/* Sidebar */}
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
                  className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200"
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
                  className="flex items-center text-[#00df82] hover:text-[#03624c] font-medium"
                >
                  ← Back to Candidates
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="bg-[#03624c] text-white px-6 py-3 rounded-xl hover:bg-[#00df82] shadow-lg font-medium"
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
                <div className="bg-gradient-to-r from-[#03624c] to-[#030f0f] p-6 text-white">
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
                        <p className="text-[#00df82] text-lg">{candidate.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(candidate.status)}
                      <p className="text-[#00df82] mt-2">Added on {formatDate(candidate.createdAt)}</p>
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
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <div className="mt-1  ">{getStatusBadge(candidate.status)}</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Professional Information */}

                       {/* Skills */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-8"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">🛠️</span> Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills?.length > 0 ? candidate.skills.map((skill, index) => (
                        <motion.span 
                          key={index} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-3 py-1 rounded-full bg-[#00df82] text-white text-sm font-medium shadow-sm"
                        >
                          {skill}
                        </motion.span>
                      )) : <p className="text-gray-600">No skills listed</p>}
                    </div>
                  </motion.div>
                    
                  </div>

               

                  {/* Notes */}
                  {candidate.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📝</span> Notes
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-900 font-medium whitespace-pre-wrap">{candidate.notes}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* CV Section */}
                  {candidate.cv && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📄</span> Curriculum Vitae (CV)
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex flex-col gap-4">
                          <div className="flex gap-4 flex-wrap">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleViewCV}
                              disabled={cvLoading}
                              className="bg-[#03624c] text-white px-6 py-3 rounded-lg hover:bg-[#00df82] disabled:opacity-50 shadow-md flex items-center gap-2"
                            >
                              <span>👁️</span>
                              {cvLoading ? 'Loading...' : 'View CV'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleDownloadCV}
                              disabled={cvLoading}
                              className="bg-[#00df82] text-white px-6 py-3 rounded-lg hover:bg-[#03624c] disabled:opacity-50 shadow-md flex items-center gap-2"
                            >
                              <span>📥</span>
                              {cvLoading ? 'Downloading...' : 'Download CV'}
                            </motion.button>
                          </div>
                          
                          {cvError && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                            >
                              <p className="font-medium">CV Error:</p>
                              <p className="text-sm">{cvError}</p>
                              <button 
                                onClick={() => setCvError('')}
                                className="text-red-600 hover:text-red-800 text-sm mt-2"
                              >
                                Dismiss
                              </button>
                            </motion.div>
                          )}
                          
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>File:</strong> {candidate.cv.split('/').pop()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Interviews */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">📊</span> Interview History
                    </h3>
                    {interviews.length > 0 ? (
                      <div className="space-y-4">
                        {interviews.map((interview, index) => (
                          <motion.div 
                            key={interview._id || index} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-[#03624c]"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p><strong>Date:</strong> {formatDate(interview.interviewDate || interview.date)}</p>
                                <p><strong>Type:</strong> {interview.type || 'N/A'}</p>
                                <p><strong>Status:</strong> {interview.status || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>Interviewers:</strong> {interview.interviewers?.join(', ') || 'N/A'}</p>
                                <p><strong>Round:</strong> {interview.round || 'N/A'}</p>
                              </div>
                            </div>
                            {renderFeedback(interview.feedback)}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-xl text-center">
                        <p className="text-gray-600">No interviews scheduled for this candidate</p>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigateTo('/hr/schedule-interview')}
                          className="mt-4 bg-[#03624c] text-white px-6 py-2 rounded-lg hover:bg-[#00df82]"
                        >
                          Schedule Interview
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
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
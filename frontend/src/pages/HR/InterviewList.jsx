/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';

const InterviewList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');
  const [joinedInterviews, setJoinedInterviews] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: '', // 'cancel', 'delete', 'success', 'error'
    title: '',
    message: '',
    interviewId: null,
    onConfirm: null
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedJoined = JSON.parse(localStorage.getItem('joinedInterviews')) || [];
    setJoinedInterviews(storedJoined);
    fetchInterviews();
  }, []);

  useEffect(() => {
    filterInterviews();
  }, [searchTerm, statusFilter, dateFilter, interviews]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/interviews', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setInterviews(data.interviews || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError('Failed to load interviews. Please try refreshing the page.');
      setLoading(false);
    }
  };

  const filterInterviews = () => {
    let filtered = interviews;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(interview => interview.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(interview => {
        const interviewDate = new Date(interview.interviewDate).toDateString();
        const filterDate = new Date(dateFilter).toDateString();
        return interviewDate === filterDate;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(interview => {
        const candidate = interview.candidate || {};
        return (
          candidate.firstName?.toLowerCase().includes(term) ||
          candidate.lastName?.toLowerCase().includes(term) ||
          candidate.email?.toLowerCase().includes(term) ||
          candidate.position?.toLowerCase().includes(term)
        );
      });
    }

    setFilteredInterviews(filtered);
  };

  // Modal functions
  const showConfirmationModal = (type, interviewId, interviewDetails = {}) => {
    const candidate = interviewDetails.candidate || {};
    const candidateName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'this interview';
    
    const modalConfigs = {
      cancel: {
        title: 'Cancel Interview',
        message: `Are you sure you want to cancel the interview with ${candidateName}?`,
        type: 'cancel'
      },
      delete: {
        title: 'Delete Interview',
        message: `Are you sure you want to permanently delete the interview with ${candidateName}? This action cannot be undone.`,
        type: 'delete'
      }
    };

    setModalConfig({
      ...modalConfigs[type],
      interviewId,
      onConfirm: () => handleConfirmAction(type, interviewId)
    });
    setShowModal(true);
  };

  const showResultModal = (type, title, message) => {
    setModalConfig({
      type,
      title,
      message,
      interviewId: null,
      onConfirm: () => setShowModal(false)
    });
    setShowModal(true);
  };

  const handleConfirmAction = async (type, interviewId) => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (type === 'cancel') {
        response = await fetch(`http://localhost:5000/api/interviews/${interviewId}/cancel`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else if (type === 'delete') {
        response = await fetch(`http://localhost:5000/api/interviews/${interviewId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to ${type} interview`);
      }

      await fetchInterviews();
      
      // Show success message
      showResultModal(
        'success', 
        `${type === 'cancel' ? 'Cancelled' : 'Deleted'} Successfully`, 
        `Interview has been ${type === 'cancel' ? 'cancelled' : 'deleted'} successfully.`
      );
      
    } catch (error) {
      console.error(`Error ${type}ing interview:`, error);
      
      // Show error message
      showResultModal(
        'error', 
        `Failed to ${type === 'cancel' ? 'Cancel' : 'Delete'}`, 
        `Failed to ${type} the interview. Please try again.`
      );
    }
  };

  const handleCancelInterview = (interviewId) => {
    const interview = interviews.find(i => i._id === interviewId);
    showConfirmationModal('cancel', interviewId, interview);
  };

  const handleDeleteInterview = (interviewId) => {
    const interview = interviews.find(i => i._id === interviewId);
    showConfirmationModal('delete', interviewId, interview);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalConfig({
      type: '',
      title: '',
      message: '',
      interviewId: null,
      onConfirm: null
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-[#03624c] text-white', label: 'Scheduled' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      'no-show': { color: 'bg-orange-100 text-orange-800', label: 'No Show' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} shadow-sm`}
      >
        {config.label}
      </motion.span>
    );
  };

  const getOutcomeBadge = (outcome) => {
    if (!outcome) return null;
    
    const outcomeConfig = {
      passed: { color: 'bg-green-100 text-green-800', label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800', label: 'Next Round' }
    };

    const config = outcomeConfig[outcome] || { color: 'bg-gray-100 text-gray-800', label: outcome };
    
    return (
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} shadow-sm`}
      >
        {config.label}
      </motion.span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddFeedback = (interviewId) => {
    navigate(`/interviews/${interviewId}/feedback`);
  };

  const handleViewFeedback = (interviewId) => {
    navigate(`/interviews/${interviewId}/view-feedback`);
  };

  const handleReschedule = (interviewId) => {
    navigate(`/interviews/${interviewId}/reschedule`);
  };

  const handleJoinMeeting = (interviewId) => {
    setJoinedInterviews(prev => {
      const updated = [...prev, interviewId];
      localStorage.setItem('joinedInterviews', JSON.stringify(updated));
      return updated;
    });
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('joinedInterviews');
    navigate('/');
  };

  const Modal = () => {
    if (!showModal) return null;

    const getModalStyles = () => {
      switch (modalConfig.type) {
        case 'success':
          return {
            border: 'border-green-500',
            button: 'bg-green-600 hover:bg-green-700',
            icon: '✅'
          };
        case 'error':
          return {
            border: 'border-red-500',
            button: 'bg-red-600 hover:bg-red-700',
            icon: '❌'
          };
        case 'cancel':
          return {
            border: 'border-orange-500',
            button: 'bg-orange-600 hover:bg-orange-700',
            icon: '⚠️'
          };
        case 'delete':
          return {
            border: 'border-red-500',
            button: 'bg-red-600 hover:bg-red-700',
            icon: '🗑️'
          };
        default:
          return {
            border: 'border-gray-500',
            button: 'bg-[#03624c] hover:bg-[#024a3a]',
            icon: 'ℹ️'
          };
      }
    };

    const styles = getModalStyles();
    const isConfirmation = modalConfig.type === 'cancel' || modalConfig.type === 'delete';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-6 border-t-4 ${styles.border}`}>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{styles.icon}</span>
              <h3 className="text-xl font-bold text-gray-900">{modalConfig.title}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">{modalConfig.message}</p>
            
            <div className="flex justify-end space-x-3">
              {isConfirmation && (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={modalConfig.onConfirm || closeModal}
                className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${styles.button}`}
              >
                {isConfirmation ? 'Confirm' : 'OK'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
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

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          >
            <strong>Note:</strong> {error}
          </motion.div>
        )}

        {/* Sidebar + Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar/>

          {/* Main Content */}
          <div className="flex-1 p-5 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Filters Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 relative">
                    <input type="text" placeholder="Search interviews by candidate name, email, or position..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent shadow-sm"/>
                    <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent shadow-sm"/>
                    
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent shadow-sm">
                      <option value="all">All Statuses</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Statistics Cards */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[{ title: "Total Interviews", value: interviews.length, color: "#03624c" },
                  { title: "Scheduled", value: interviews.filter(i => i.status === 'scheduled').length, color: "#030f0f" },
                  { title: "Completed", value: interviews.filter(i => i.status === 'completed').length, color: "#00df82" },
                  { title: "Cancelled", value: interviews.filter(i => i.status === 'cancelled').length, color: "#e93b63ff" },
                ].map((stat, index) => (
                  <motion.div key={stat.title} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 + 0.3 }} whileHover={{ scale: 1.05, y: -5, transition: { type: "spring", stiffness: 300 } }} className={`bg-gradient-to-br from-[${stat.color}] to-[${stat.color}] text-white p-6 rounded-2xl shadow-lg cursor-pointer`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">{stat.title}</p>
                        <motion.p key={stat.value} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-3xl font-bold">{stat.value}</motion.p>
                      </div>
                      <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="text-4xl">
                        {stat.title === "Total Interviews" ? "📊" : stat.title === "Scheduled" ? "🗓️" : stat.title === "Completed" ? "✅" : "❌"}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Interviews Table */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-xl overflow-y-auto">
                {filteredInterviews.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-500 text-lg">No interviews found matching your criteria.</p>
                  </motion.div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-[#03624c] to-[#030f0f]">
                        <tr>
                          {["Candidate & Position","Date & Time","Type","Interviewers","Status","Outcome","Actions"].map(header => (
                            <th key={header} className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 ">
                        <AnimatePresence>
                          {filteredInterviews.map((interview, index) => {
                            const candidate = interview.candidate || {};
                            const hasJoined = joinedInterviews.includes(interview._id);
                            return (
                              <motion.tr key={interview._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">{candidate.firstName} {candidate.lastName}</div>
                                  <div className="text-sm text-gray-500">{candidate.position}</div>
                                  <div className="text-sm text-gray-400">{candidate.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(interview.interviewDate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{interview.interviewType}</td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">{interview.interviewers?.map((i, idx) => <div key={idx}>{i}</div>) || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(interview.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getOutcomeBadge(interview.feedback?.outcome)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex flex-col space-y-2">
                                    {interview.status === 'completed' && (
                                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleViewFeedback(interview._id)} className="text-[#00df82] hover:text-[#03624c] text-left font-medium">
                                        View Feedback
                                      </motion.button>
                                    )}
                                    
                                    {interview.status === 'scheduled' && (
                                      <>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAddFeedback(interview._id)} disabled={!hasJoined} className={`text-green-600 hover:text-green-900 text-left font-medium ${!hasJoined ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                          Add Feedback
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleReschedule(interview._id)} className="text-[#00df82] hover:text-[#03624c] text-left font-medium">
                                          Reschedule
                                        </motion.button>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleCancelInterview(interview._id)} className="text-orange-600 hover:text-orange-900 text-left font-medium">
                                          Cancel
                                        </motion.button>
                                      </>
                                    )}

                                    {!interview.feedback?.outcome && (
                                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleDeleteInterview(interview._id)} className="text-red-600 hover:text-red-900 text-left font-medium">
                                        Delete
                                      </motion.button>
                                    )}
                                    
                                    {interview.meetingLink && interview.status === 'scheduled' && (
                                      <motion.a whileHover={{ scale: 1.05 }} href={interview.meetingLink} target="_blank" rel="noopener noreferrer" onClick={() => handleJoinMeeting(interview._id)} className="text-[#00df82] hover:text-[#03624c] text-left font-medium">
                                        Join Meeting
                                      </motion.a>
                                    )}
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      <AnimatePresence>
        {showModal && <Modal />}
      </AnimatePresence>
    </motion.div>
  );
};

export default InterviewList;
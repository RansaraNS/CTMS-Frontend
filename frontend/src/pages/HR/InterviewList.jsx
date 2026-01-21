/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  LogOut, User, Briefcase, Search, Calendar, Filter, 
  Eye, Edit, Trash2, XCircle, Video, Clock, CheckCircle,
  AlertCircle, Users, FileText, TrendingUp
} from 'lucide-react';

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
  
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: '',
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
      
      showResultModal(
        'success', 
        `${type === 'cancel' ? 'Cancelled' : 'Deleted'} Successfully`, 
        `Interview has been ${type === 'cancel' ? 'cancelled' : 'deleted'} successfully.`
      );
      
    } catch (error) {
      console.error(`Error ${type}ing interview:`, error);
      
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
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
      'no-show': { color: 'bg-orange-100 text-orange-800', label: 'No Show', icon: AlertCircle }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status, icon: Clock };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getOutcomeBadge = (outcome) => {
    if (!outcome) return null;
    
    const outcomeConfig = {
      passed: { color: 'bg-[#3ABEF9]/20 text-[#050C9C]', label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800', label: 'Next Round' }
    };

    const config = outcomeConfig[outcome] || { color: 'bg-gray-100 text-gray-800', label: outcome };
    
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
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
            icon: CheckCircle,
            iconColor: 'text-green-500',
            button: 'bg-green-600 hover:bg-green-700'
          };
        case 'error':
          return {
            icon: AlertCircle,
            iconColor: 'text-red-500',
            button: 'bg-red-600 hover:bg-red-700'
          };
        case 'cancel':
          return {
            icon: AlertCircle,
            iconColor: 'text-orange-500',
            button: 'bg-orange-600 hover:bg-orange-700'
          };
        case 'delete':
          return {
            icon: Trash2,
            iconColor: 'text-red-500',
            button: 'bg-red-600 hover:bg-red-700'
          };
        default:
          return {
            icon: AlertCircle,
            iconColor: 'text-gray-500',
            button: 'bg-[#3572EF] hover:bg-[#050C9C]'
          };
      }
    };

    const styles = getModalStyles();
    const Icon = styles.icon;
    const isConfirmation = modalConfig.type === 'cancel' || modalConfig.type === 'delete';

    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={closeModal}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-${modalConfig.type === 'success' ? 'green' : modalConfig.type === 'error' ? 'red' : modalConfig.type === 'cancel' ? 'orange' : 'red'}-100 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${styles.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-[#050C9C]">{modalConfig.title}</h3>
            </div>
            
            <p className="text-gray-600 mb-6 ml-15">{modalConfig.message}</p>
            
            <div className="flex justify-end gap-3">
              {isConfirmation && (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={modalConfig.onConfirm || closeModal}
                className={`px-6 py-2 text-white font-medium rounded-xl transition-colors duration-200 ${styles.button}`}
              >
                {isConfirmation ? 'Confirm' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stats = [
    { title: "Total Interviews", value: interviews.length, icon: TrendingUp, color: "from-[#050C9C] to-[#3572EF]" },
    { title: "Scheduled", value: interviews.filter(i => i.status === 'scheduled').length, icon: Clock, color: "from-[#3572EF] to-[#3ABEF9]" },
    { title: "Completed", value: interviews.filter(i => i.status === 'completed').length, icon: CheckCircle, color: "from-green-500 to-green-600" },
    { title: "Cancelled", value: interviews.filter(i => i.status === 'cancelled').length, icon: XCircle, color: "from-red-500 to-red-600" },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Animated container with pulsing effect */}
            <div className="relative mb-6">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 w-32 h-32 border-4 border-[#3572EF] border-t-transparent rounded-full animate-spin mx-auto"></div>
              
              {/* Middle rotating ring - slower */}
              <div className="absolute inset-0 w-32 h-32 border-4 border-[#3ABEF9] border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDuration: '1.5s' }}></div>
              
              {/* Inner glow effect */}
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-[#3572EF]/20 to-[#3ABEF9]/20 rounded-full animate-pulse mx-auto"></div>
              
              {/* Company Logo */}
              <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
                <img 
                  src="/GRW.png" 
                  alt="Gamage Recruiters" 
                  className="w-20 h-20 object-contain animate-pulse"
                  style={{ animationDuration: '2s' }}
                />
              </div>
            </div>
            
            {/* Loading text with animated dots */}
            <p className="text-[#050C9C] font-semibold text-lg mb-2">
              Loading Interviews
              <span className="inline-flex ml-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </span>
            </p>
            
            {/* Subtitle */}
            <p className="text-[#3572EF] text-sm font-medium">
              Please wait while we prepare your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Manage Interviews</h1>
              <p className="text-sm text-gray-600">View and manage all scheduled interviews</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-[#050C9C]">Welcome, {user?.name || "HR"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Note</p>
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-8xl mx-auto space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#050C9C]">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search interviews by candidate name, email, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200 appearance-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Interviews Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              {filteredInterviews.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No interviews found matching your criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#050C9C] to-[#3572EF] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Candidate & Position</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Interviewers</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Outcome</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInterviews.map((interview) => {
                        const candidate = interview.candidate || {};
                        const hasJoined = joinedInterviews.includes(interview._id);
                        return (
                          <tr key={interview._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-[#050C9C]">
                                {candidate.firstName} {candidate.lastName}
                              </div>
                              <div className="text-sm text-gray-600">{candidate.position}</div>
                              <div className="text-xs text-gray-500">{candidate.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(interview.interviewDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#A7E6FF] text-[#050C9C] text-xs font-medium capitalize">
                                {interview.interviewType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-700">
                                {interview.interviewers?.map((i, idx) => (
                                  <div key={idx} className="flex items-center gap-1 mb-1">
                                    <User className="w-3 h-3 text-gray-400" />
                                    {i}
                                  </div>
                                )) || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(interview.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getOutcomeBadge(interview.feedback?.outcome)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {interview.status === 'completed' && (
                                  <button
                                    onClick={() => handleViewFeedback(interview._id)}
                                    className="p-2 text-[#3572EF] hover:bg-[#3572EF]/10 rounded-lg transition-colors duration-200"
                                    title="View Feedback"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                                
                                {interview.status === 'scheduled' && (
                                  <>
                                    <button
                                      onClick={() => handleAddFeedback(interview._id)}
                                      disabled={!hasJoined}
                                      className={`p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 ${!hasJoined ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      title="Add Feedback"
                                    >
                                      <FileText className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleReschedule(interview._id)}
                                      className="p-2 text-[#3572EF] hover:bg-[#3572EF]/10 rounded-lg transition-colors duration-200"
                                      title="Reschedule"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleCancelInterview(interview._id)}
                                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                      title="Cancel"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                )}

                                {!interview.feedback?.outcome && (
                                  <button
                                    onClick={() => handleDeleteInterview(interview._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                
                                {interview.meetingLink && interview.status === 'scheduled' && (
                                  <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => handleJoinMeeting(interview._id)}
                                    className="p-2 text-[#3572EF] hover:bg-[#3572EF]/10 rounded-lg transition-colors duration-200"
                                    title="Join Meeting"
                                  >
                                    <Video className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && <Modal />}
    </div>
  );
};

export default InterviewList;
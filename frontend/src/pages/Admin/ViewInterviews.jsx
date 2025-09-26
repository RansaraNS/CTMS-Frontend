import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUserPlus, FiUsers, FiEye, FiLogOut } from 'react-icons/fi';

const ViewInterviews = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    filterInterviews();
  }, [searchTerm, statusFilter, dateFilter, interviews]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/interviews', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setInterviews(data.interviews || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setLoading(false);
    }
  };

  const filterInterviews = () => {
    let filtered = interviews;
    if (statusFilter !== 'all') filtered = filtered.filter(interview => interview.status === statusFilter);
    if (dateFilter) filtered = filtered.filter(interview => new Date(interview.interviewDate).toDateString() === new Date(dateFilter).toDateString());
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(interview => {
        const candidate = interview.candidate || {};
        return candidate.firstName?.toLowerCase().includes(term) || candidate.lastName?.toLowerCase().includes(term) || candidate.email?.toLowerCase().includes(term) || candidate.position?.toLowerCase().includes(term);
      });
    }
    setFilteredInterviews(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      'no-show': { color: 'bg-orange-100 text-orange-800', label: 'No Show' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  const getOutcomeBadge = (outcome) => {
    if (!outcome) return null;
    const outcomeConfig = {
      passed: { color: 'bg-green-100 text-green-800', label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800', label: 'Next Round' },
    };
    const config = outcomeConfig[outcome] || { color: 'bg-gray-100 text-gray-800', label: outcome };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A');

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
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 font-sans overflow-hidden">
        <div className="flex flex-1 flex-col w-full">
          <nav className="bg-gradient-to-r from-teal-800 to-blue-900 text-white p-6 flex justify-between items-center shadow-lg backdrop-blur-md">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-6 bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">Candidate Tracking System</h1>
              <span className="text-md">{new Date('2025-09-26T05:41:00+05:30').toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short', hour12: true })}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-6 text-md font-medium">Welcome, Admin</span>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#1e40af' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center bg-blue-800 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
              >
                <FiLogOut className="mr-2" /> Logout
              </motion.button>
            </div>
          </nav>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading interviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 font-sans overflow-hidden">
      <div className="flex flex-1 flex-col w-full">
        <nav className="bg-gradient-to-r from-teal-800 to-blue-900 text-white p-6 flex justify-between items-center shadow-lg backdrop-blur-md">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-6 bg-gradient-to-r text-white bg-clip-text text-transparent">Candidate Tracking System</h1>
           
          </div>
          <div className="flex items-center">
            <span className="mr-6 text-md font-medium">Welcome, Admin</span>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#1e40af' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center bg-blue-800 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
            >
              <FiLogOut className="mr-2" /> Logout
            </motion.button>
          </div>
        </nav>

        <div className="flex flex-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 256 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 text-white h-full shadow-lg min-w-[256px]"
          >
            <nav className="flex flex-col h-full p-6">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/admin/dashboard')}
                className="flex items-center p-3 mb-4 bg-gray-700/80 text-white rounded-xl hover:bg-gray-600 transition duration-200 shadow-md"
              >
                <FiHome className="mr-3 text-lg" /> Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/admin/create-hr')}
                className="flex items-center p-3 mb-4 bg-gray-700/80 text-white rounded-xl hover:bg-gray-600 transition duration-200 shadow-md"
              >
                <FiUserPlus className="mr-3 text-lg" /> Create HR
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/admin/manage-hr')}
                className="flex items-center p-3 mb-4 bg-gray-700/80 text-white rounded-xl hover:bg-gray-600 transition duration-200 shadow-md"
              >
                <FiUsers className="mr-3 text-lg" /> Manage HR
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/admin/view-interviews')}
                className="flex items-center p-3 mb-4 bg-blue-600/80 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
              >
                <FiEye className="mr-3 text-lg" /> View Interviews
              </motion.button>
            </nav>
          </motion.div>

          <div className="flex-1 p-10 overflow-auto">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-10">
              <h2 className="text-4xl font-bold text-gray-800 text-center bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">View Interviews</h2>
              <motion.div variants={itemVariants} >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search by candidate name, email, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-teal-500/20 shadow-lg"
                    />
                    <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="border-0 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-teal-500/20 shadow-md"
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-0 rounded-xl px-4 py-3 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-teal-500/20 shadow-md"
                    >
                      <option value="all">All Statuses</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-xl text-center bg-gradient-to-br from-teal-50 to-blue-50">
                  <div className="text-3xl font-bold text-teal-600">{interviews.length}</div>
                  <div className="text-md text-gray-500">Total Interviews</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-xl text-center bg-gradient-to-br from-blue-50 to-teal-50">
                  <div className="text-3xl font-bold text-blue-600">{interviews.filter(i => i.status === 'scheduled').length}</div>
                  <div className="text-md text-gray-500">Scheduled</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-xl text-center bg-gradient-to-br from-green-50 to-teal-50">
                  <div className="text-3xl font-bold text-green-600">{interviews.filter(i => i.status === 'completed').length}</div>
                  <div className="text-md text-gray-500">Completed</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-xl text-center bg-gradient-to-br from-red-50 to-teal-50">
                  <div className="text-3xl font-bold text-red-600">{interviews.filter(i => i.status === 'cancelled').length}</div>
                  <div className="text-md text-gray-500">Cancelled</div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                {filteredInterviews.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500 text-xl">No interviews found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-teal-100 to-blue-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Candidate & Position</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Interviewers</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Outcome</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredInterviews.map((interview) => {
                          const candidate = interview.candidate || {};
                          return (
                            <motion.tr key={interview._id} variants={itemVariants} className="hover:bg-teal-50/50 transition duration-300">
                              <td className="px-6 py-5">
                                <div className="text-sm font-medium text-gray-900">{candidate.firstName} {candidate.lastName}</div>
                                <div className="text-sm text-gray-500">{candidate.position}</div>
                                <div className="text-sm text-gray-400">{candidate.email}</div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{formatDate(interview.interviewDate)}</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 capitalize">{interview.interviewType}</td>
                              <td className="px-6 py-5">
                                <div className="text-sm text-gray-900">{interview.interviewers?.map((interviewer, index) => <div key={index}>{interviewer}</div>) || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">{getStatusBadge(interview.status)}</td>
                              <td className="px-6 py-5 whitespace-nowrap">{getOutcomeBadge(interview.feedback?.outcome)}</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col space-y-2">
                                  {interview.status === 'completed' && (
                                    <motion.button whileHover={{ scale: 1.1, color: '#2563eb' }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/admin/${interview._id}/report-interviews`)} className="text-blue-600 hover:text-blue-800 text-left">
                                      View Feedback
                                    </motion.button>
                                  )}
                                  {interview.meetingLink && interview.status === 'scheduled' && (
                                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 text-left">
                                      Join Meeting
                                    </a>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInterviews;
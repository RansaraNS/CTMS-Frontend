/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';

const CandidateDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

     const response = await fetch('http://localhost:5000/api/candidates', {         
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCandidates(data.candidates || data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterCandidates();
  }, [searchTerm, statusFilter, candidates]);

  const filterCandidates = () => {
    let filtered = candidates;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate =>
        (candidate.firstName?.toLowerCase().includes(term) ||
        candidate.lastName?.toLowerCase().includes(term) ||
        candidate.email?.toLowerCase().includes(term) ||
        candidate.position?.toLowerCase().includes(term))
      );
    }

    setFilteredCandidates(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-gray-100 text-gray-800', label: 'New' },
      contacted: { color: 'bg-[#03624c] text-white', label: 'Contacted' },
      interviewed: { color: 'bg-yellow-100 text-yellow-800', label: 'Interviewed' },
      hired: { color: 'bg-green-100 text-green-800', label: 'Hired' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      terminated: { color: 'bg-orange-100 text-orange-800', label: 'Terminated' }
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

  const handleGenerateReport = () => {
    const headers = ['Name', 'Email', 'Position', 'Status', 'Source', 'Last Updated'];
    const csvData = filteredCandidates.map(candidate => [
      `${candidate.firstName} ${candidate.lastName}`,
      candidate.email,
      candidate.position,
      candidate.status,
      candidate.source || 'N/A',
      formatDate(candidate.updatedAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewCandidate = (candidateId) => {
    navigate(`/candidates/${candidateId}`);
  };

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (window.confirm(`Are you sure you want to delete ${candidateName}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setCandidates(candidates.filter(c => c._id !== candidateId));
          alert('Candidate deleted successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete candidate');
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert(error.message || 'Failed to delete candidate');
      }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          {/* Enhanced Sidebar */}
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
                  className={`flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 ${
                    item.path === "/candidates" 
                      ? "bg-gradient-to-r from-[#03624c] to-[#030f0f]" 
                      : "hover:bg-white hover:bg-opacity-10"
                  }`}
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
              <div className="flex justify-between items-center">
                <motion.h2 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold bg-gradient-to-r from-[#03624c] to-[#030f0f] bg-clip-text text-transparent"
                >
                  Manage Candidates
                </motion.h2>
              </div>

              {/* Filters Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search candidates by name, email, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent shadow-sm"
                    />
                    <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent shadow-sm"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                      <option value="terminated">Terminated</option>
                    </select>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerateReport}
                      className="bg-[#03624c] text-white px-6 py-3 rounded-xl hover:bg-[#00df82] focus:ring-2 focus:ring-[#00df82] transition duration-200 shadow-sm"
                    >
                      📊 Generate Report
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchCandidates}
                      className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition duration-200 shadow-sm"
                    >
                      🔄 Refresh
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Statistics Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
              >
                {[
                  { title: "Total Candidates", value: candidates.length, color: "#03624c", icon: "👥" },
                  { title: "Interviewed", value: candidates.filter(c => c.status === 'interviewed').length, color: "#030f0f", icon: "📅" },
                  { title: "Hired", value: candidates.filter(c => c.status === 'hired').length, color: "#00df82", icon: "✅" },
                  { title: "Rejected", value: candidates.filter(c => c.status === 'rejected').length, color: "red", icon: "❌" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    className={`bg-gradient-to-br from-[${stat.color}] to-[${stat.color}] text-white p-6 rounded-2xl shadow-lg cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">{stat.title}</p>
                        <motion.p 
                          key={stat.value}
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="text-3xl font-bold"
                        >
                          {stat.value}
                        </motion.p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className="text-4xl"
                      >
                        {stat.icon}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Candidates Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {filteredCandidates.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-500 text-lg">
                      {candidates.length === 0 ? 'No candidates found.' : 'No candidates match your search criteria.'}
                    </p>
                    {candidates.length === 0 && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo('/hr/add-candidate')}
                        className="mt-4 bg-[#03624c] text-white px-6 py-3 rounded-xl hover:bg-[#00df82] shadow-lg"
                      >
                        Add Your First Candidate
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-[#03624c] to-[#030f0f]">
                        <tr>
                          {[
                            "Candidate",
                            "Position",
                            "Status",
                            "Source",
                            "Last Updated",
                            "Actions"
                          ].map((header, index) => (
                            <th key={header} className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                          {filteredCandidates.map((candidate, index) => (
                            <motion.tr 
                              key={candidate._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="flex-shrink-0 h-10 w-10 bg-[#03624c] rounded-full flex items-center justify-center shadow-sm"
                                  >
                                    <span className="text-white font-medium">
                                      {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                    </span>
                                  </motion.div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {candidate.firstName} {candidate.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">{candidate.email}</div>
                                    <div className="text-sm text-gray-400">{candidate.phone}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{candidate.position}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(candidate.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {candidate.source || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(candidate.updatedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col space-y-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewCandidate(candidate._id)}
                                    className="text-[#00df82] hover:text-[#03624c] text-left font-medium"
                                  >
                                    👁️ View Details
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDeleteCandidate(candidate._id, `${candidate.firstName} ${candidate.lastName}`)}
                                    className="text-red-600 hover:text-red-900 text-left font-medium"
                                  >
                                    🗑️ Delete
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
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
    </motion.div>
  );
};

export default CandidateDetails;
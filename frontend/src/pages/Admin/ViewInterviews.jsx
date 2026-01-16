/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Briefcase, Search, Calendar, Filter, Eye, Video, Users, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

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
      const response = await fetch('http://localhost:5000/api/interviews', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
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
    if (dateFilter) filtered = filtered.filter(interview => 
      new Date(interview.interviewDate).toDateString() === new Date(dateFilter).toDateString()
    );
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(interview => {
        const candidate = interview.candidate || {};
        return candidate.firstName?.toLowerCase().includes(term) || 
               candidate.lastName?.toLowerCase().includes(term) || 
               candidate.email?.toLowerCase().includes(term) || 
               candidate.position?.toLowerCase().includes(term);
      });
    }
    setFilteredInterviews(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
      'no-show': { color: 'bg-orange-100 text-orange-800', label: 'No Show', icon: AlertCircle },
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
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800', label: 'Next Round' },
    };
    const config = outcomeConfig[outcome] || { color: 'bg-gray-100 text-gray-800', label: outcome };
    return <span className={`px-3 py-1 rounded-lg text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => (
    dateString ? new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : 'N/A'
  );

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const stats = [
    { 
      title: "Total Interviews", 
      value: interviews.length, 
      icon: Users,
      color: "from-[#050C9C] to-[#3572EF]"
    },
    { 
      title: "Scheduled", 
      value: interviews.filter(i => i.status === 'scheduled').length, 
      icon: Clock,
      color: "from-[#3572EF] to-[#3ABEF9]"
    },
    { 
      title: "Completed", 
      value: interviews.filter(i => i.status === 'completed').length, 
      icon: CheckCircle,
      color: "from-[#3ABEF9] to-[#A7E6FF]"
    },
    { 
      title: "Cancelled", 
      value: interviews.filter(i => i.status === 'cancelled').length, 
      icon: XCircle,
      color: "from-red-500 to-red-600"
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3572EF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#050C9C] font-medium">Loading interviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">View Interviews</h1>
              <p className="text-sm text-gray-600">Monitor and manage all scheduled interviews</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-[#050C9C]">Welcome, Admin</span>
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-[#050C9C]">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
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
                    placeholder="Search by candidate name, email, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
                                {interview.interviewers?.map((interviewer, index) => (
                                  <div key={index} className="flex items-center gap-1 mb-1">
                                    <User className="w-3 h-3 text-gray-400" />
                                    {interviewer}
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
                              <div className="flex flex-col gap-2">
                                {interview.status === 'completed' && (
                                  <button
                                    onClick={() => navigate(`/admin/${interview._id}/report-interviews`)}
                                    className="flex items-center gap-1 text-[#3572EF] hover:text-[#050C9C] text-sm font-medium transition-colors duration-200"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Feedback
                                  </button>
                                )}
                                {interview.meetingLink && interview.status === 'scheduled' && (
                                  <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-[#3572EF] hover:text-[#050C9C] text-sm font-medium transition-colors duration-200"
                                  >
                                    <Video className="w-4 h-4" />
                                    Join Meeting
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
    </div>
  );
};

export default ViewInterviews;
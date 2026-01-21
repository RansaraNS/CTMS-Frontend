import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, Search, Filter, Download, RefreshCw, 
  UserPlus, Users, Calendar, CheckCircle, XCircle, 
  Eye, Trash2, Mail, Phone, Briefcase, AlertCircle
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const CandidateDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: '', title: '', message: '', candidateId: null, candidateName: '', onConfirm: null
  });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => { fetchCandidates(); }, []);
  useEffect(() => { filterCandidates(); }, [searchTerm, statusFilter, candidates]);

  const fetchCandidates = async () => {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('http://localhost:5000/api/candidates', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token'); localStorage.removeItem('role');
          navigate('/'); return;
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

  const filterCandidates = () => {
    let filtered = candidates;
    if (statusFilter !== 'all') filtered = filtered.filter(c => c.status === statusFilter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.firstName?.toLowerCase().includes(term) || c.lastName?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) || c.position?.toLowerCase().includes(term)
      );
    }
    setFilteredCandidates(filtered);
  };

  const showConfirmationModal = (type, candidateId, candidateName) => {
    setModalConfig({
      type: 'delete', title: 'Delete Candidate',
      message: `Are you sure you want to delete ${candidateName}? This action cannot be undone.`,
      candidateId, candidateName, onConfirm: () => handleConfirmAction(type, candidateId)
    });
    setShowModal(true);
  };

  const showResultModal = (type, title, message) => {
    setModalConfig({ type, title, message, candidateId: null, candidateName: '', onConfirm: () => setShowModal(false) });
    setShowModal(true);
  };

  const handleConfirmAction = async (type, candidateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${type} candidate`);
      }
      setCandidates(candidates.filter(c => c._id !== candidateId));
      showResultModal('success', 'Deleted Successfully', 'Candidate has been deleted successfully.');
    } catch (error) {
      console.error(`Error ${type}ing candidate:`, error);
      showResultModal('error', 'Failed to Delete', error.message || 'Failed to delete candidate. Please try again.');
    }
  };

  const handleDeleteCandidate = (id, name) => showConfirmationModal('delete', id, name);
  const closeModal = () => {
    setShowModal(false);
    setModalConfig({ type: '', title: '', message: '', candidateId: null, candidateName: '', onConfirm: null });
  };

  const getStatusBadge = (status) => {
    const config = {
      new: { color: 'bg-gray-100 text-gray-800', icon: <UserPlus className="w-3 h-3" />, label: 'New' },
      contacted: { color: 'bg-blue-100 text-blue-800', icon: <Mail className="w-3 h-3" />, label: 'Contacted' },
      interviewed: { color: 'bg-yellow-100 text-yellow-800', icon: <Calendar className="w-3 h-3" />, label: 'Interviewed' },
      hired: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" />, label: 'Hired' },
      rejected: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" />, label: 'Rejected' },
      terminated: { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="w-3 h-3" />, label: 'Terminated' }
    }[status] || { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-3 h-3" />, label: status };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color} shadow-sm`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const handleGenerateReport = () => {
    const headers = ['Name', 'Email', 'Position', 'Status', 'Source', 'Last Updated'];
    const csvData = filteredCandidates.map(c => [
      `${c.firstName} ${c.lastName}`, c.email, c.position, c.status,
      c.source || 'N/A', formatDate(c.updatedAt)
    ]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.map(f => `"${f}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewCandidate = (id) => navigate(`/candidates/${id}`);
  const handleLogout = () => {
    ['role', 'token', 'user'].forEach(item => localStorage.removeItem(item));
    navigate('/');
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const Modal = () => {
    if (!showModal) return null;
    const styles = {
      success: { border: 'border-green-500', button: 'bg-green-600 hover:bg-green-700', icon: <CheckCircle className="w-6 h-6 text-green-500" /> },
      error: { border: 'border-red-500', button: 'bg-red-600 hover:bg-red-700', icon: <XCircle className="w-6 h-6 text-red-500" /> },
      delete: { border: 'border-red-500', button: 'bg-red-600 hover:bg-red-700', icon: <Trash2 className="w-6 h-6 text-red-500" /> }
    }[modalConfig.type] || { border: 'border-gray-500', button: 'bg-[#050C9C] hover:bg-[#3572EF]', icon: <AlertCircle className="w-6 h-6 text-gray-500" /> };
    const isConfirmation = modalConfig.type === 'delete';
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white rounded-2xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <div className={`p-6 border-t-4 ${styles.border}`}>
            <div className="flex items-center mb-4">
              <span className="mr-3">{styles.icon}</span>
              <h3 className="text-xl font-bold text-gray-900">{modalConfig.title}</h3>
            </div>
            <p className="text-gray-600 mb-6">{modalConfig.message}</p>
            <div className="flex justify-end space-x-3">
              {isConfirmation && <button onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors">Cancel</button>}
              <button onClick={modalConfig.onConfirm || closeModal} className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${styles.button}`}>{isConfirmation ? 'Confirm' : 'OK'}</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 w-32 h-32 border-4 border-[#3572EF] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-32 h-32 border-4 border-[#3ABEF9] border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-[#3572EF]/20 to-[#3ABEF9]/20 rounded-full animate-pulse mx-auto"></div>
              <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
                <img src="/GRW.png" alt="Gamage Recruiters" className="w-20 h-20 object-contain animate-pulse" style={{ animationDuration: '2s' }} />
              </div>
            </div>
            <p className="text-[#050C9C] font-semibold text-lg mb-2">Loading Candidates<span className="inline-flex ml-1"><span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span><span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span><span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span></span></p>
            <p className="text-[#3572EF] text-sm font-medium">Please wait while we prepare your data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Candidate Management</h1>
              <p className="text-sm text-gray-600">View and manage all candidates</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-[#050C9C]">Welcome, {user?.name || "HR"}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-50 border-l-4 border-yellow-500 px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div><p className="font-medium text-yellow-800">Note</p><p className="text-sm text-yellow-700">{error}</p></div>
            </div>
          </motion.div>
        )}

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Search candidates by name, email, or position..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3572EF] focus:border-transparent shadow-sm" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3572EF] focus:border-transparent shadow-sm appearance-none">
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                  <button onClick={handleGenerateReport} className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button onClick={fetchCandidates} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium">
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Total Candidates", value: candidates.length, icon: Users, color: "from-[#050C9C] to-[#3572EF]" },
                { title: "Interviewed", value: candidates.filter(c => c.status === 'interviewed').length, icon: Calendar, color: "from-yellow-500 to-yellow-600" },
                { title: "Hired", value: candidates.filter(c => c.status === 'hired').length, icon: CheckCircle, color: "from-green-500 to-green-600" },
                { title: "Rejected", value: candidates.filter(c => c.status === 'rejected').length, icon: XCircle, color: "from-red-500 to-red-600" }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#050C9C]">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#050C9C] mb-3">{candidates.length === 0 ? 'No Candidates Found' : 'No Matching Results'}</h3>
                  <p className="text-gray-600 mb-8">{candidates.length === 0 ? 'Get started by adding your first candidate' : 'Try adjusting your search or filters'}</p>
                  {candidates.length === 0 && (
                    <button onClick={() => navigate('/hr/add-candidate')} className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 mx-auto">
                      <UserPlus className="w-4 h-4" /> Add First Candidate
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-[#050C9C] to-[#3572EF]">
                      <tr>
                        {[
                          { label: "Candidate", icon: <User className="w-4 h-4" /> },
                          { label: "Position", icon: <Briefcase className="w-4 h-4" /> },
                          { label: "Contact", icon: <Mail className="w-4 h-4" /> },
                          { label: "Status", icon: <CheckCircle className="w-4 h-4" /> },
                          { label: "Source", icon: <Users className="w-4 h-4" /> },
                          { label: "Updated", icon: <Calendar className="w-4 h-4" /> },
                          { label: "Actions", icon: <Eye className="w-4 h-4" /> }
                        ].map(h => (
                          <th key={h.label} className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            <div className="flex items-center gap-2">{h.icon}{h.label}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {filteredCandidates.map((candidate, index) => (
                          <motion.tr key={candidate._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} whileHover={{ backgroundColor: "#f9fafb" }} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] flex items-center justify-center text-white font-bold">
                                  {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-900">{candidate.firstName} {candidate.lastName}</div>
                                  <div className="text-xs text-gray-500">{candidate.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4"><div className="text-sm font-medium text-[#050C9C]">{candidate.position}</div></td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-xs text-gray-600"><Mail className="w-3 h-3" />{candidate.email}</div>
                                <div className="flex items-center gap-1 text-xs text-gray-600"><Phone className="w-3 h-3" />{candidate.phone || 'N/A'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">{getStatusBadge(candidate.status)}</td>
                            <td className="px-6 py-4"><span className="text-sm text-gray-600">{candidate.source || 'N/A'}</span></td>
                            <td className="px-6 py-4"><span className="text-sm text-gray-600">{formatDate(candidate.updatedAt)}</span></td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex flex-col gap-2">
                                <button onClick={() => handleViewCandidate(candidate._id)} className="flex items-center gap-2 text-[#3572EF] hover:text-[#050C9C] font-medium transition-colors">
                                  <Eye className="w-4 h-4" /> View
                                </button>
                                <button onClick={() => handleDeleteCandidate(candidate._id, `${candidate.firstName} ${candidate.lastName}`)} className="flex items-center gap-2 text-red-600 hover:text-red-900 font-medium transition-colors">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <AnimatePresence>{showModal && <Modal />}</AnimatePresence>
    </div>
  );
};

export default CandidateDetails;
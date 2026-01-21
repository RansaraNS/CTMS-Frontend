import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ArrowLeft, Mail, Phone, FileText, Calendar, 
  Briefcase, Download, Eye, Award, MessageSquare, Users as UsersIcon,
  AlertCircle, CheckCircle, XCircle, Clock, Star, Brain, TrendingUp
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

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

  useEffect(() => { fetchCandidateDetails(); }, [id]);

  const fetchCandidateDetails = async () => {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`http://localhost:5000/api/candidates/${id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        if (response.status === 401) {
          ['token', 'role', 'user'].forEach(i => localStorage.removeItem(i));
          navigate('/'); return;
        }
        if (response.status === 404) throw new Error('Candidate not found');
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

  const handleDownloadCV = async () => {
    if (!candidate?.cv) return;
    setCvLoading(true); setCvError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/candidates/${id}/cv`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to download CV' }));
        throw new Error(errorData.message || `Failed to download CV: ${response.status}`);
      }
      const blob = await response.blob();
      if (blob.size === 0) throw new Error('CV file is empty or corrupted');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = candidate.cv.split('/').pop() || `${candidate.firstName}_${candidate.lastName}_CV.pdf`;
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

  const handleViewCV = async () => {
    if (!candidate?.cv) return;
    setCvLoading(true); setCvError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/candidates/${id}/cv`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to load CV' }));
        throw new Error(errorData.message || `Failed to load CV: ${response.status}`);
      }
      const blob = await response.blob();
      if (blob.size === 0) throw new Error('CV file is empty or corrupted');
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error viewing CV:', error);
      setCvError(error.message);
    } finally {
      setCvLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      new: { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-3 h-3" />, label: 'New' },
      contacted: { color: 'bg-blue-100 text-blue-800', icon: <Mail className="w-3 h-3" />, label: 'Contacted' },
      scheduled: { color: 'bg-purple-100 text-purple-800', icon: <Calendar className="w-3 h-3" />, label: 'Scheduled' },
      interviewed: { color: 'bg-yellow-100 text-yellow-800', icon: <UsersIcon className="w-3 h-3" />, label: 'Interviewed' },
      hired: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" />, label: 'Hired' },
      rejected: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" />, label: 'Rejected' }
    }[status] || { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-3 h-3" />, label: status };
    return (
      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold ${config.color} shadow-sm`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const renderFeedback = (feedback) => {
    if (!feedback) return null;
    if (typeof feedback === 'string') return <p className="text-sm text-gray-600"><strong>Feedback:</strong> {feedback}</p>;
    if (typeof feedback === 'object') {
      const ratings = [
        { label: 'Technical Skills', value: feedback.technicalSkills, icon: Brain },
        { label: 'Communication', value: feedback.communication, icon: MessageSquare },
        { label: 'Problem Solving', value: feedback.problemSolving, icon: TrendingUp },
        { label: 'Cultural Fit', value: feedback.culturalFit, icon: UsersIcon }
      ];
      return (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-[#050C9C]">Interview Feedback</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ratings.map(r => r.value && (
              <div key={r.label} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <r.icon className="w-4 h-4 text-[#3572EF]" />
                  <span className="text-sm font-medium text-gray-700">{r.label}</span>
                </div>
                <div className="flex gap-0.5">{getRatingStars(r.value)}</div>
              </div>
            ))}
          </div>
          {feedback.overallRating && (
            <div className="bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Overall Rating</span>
                <span className="text-2xl font-bold">{feedback.overallRating}/5</span>
              </div>
            </div>
          )}
          {feedback.notes && <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-700"><strong>Notes:</strong> {feedback.notes}</p></div>}
          {feedback.outcome && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Outcome:</span>
              {getStatusBadge(feedback.outcome)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleLogout = () => {
    ['role', 'token', 'user'].forEach(i => localStorage.removeItem(i));
    navigate('/');
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
            <p className="text-[#050C9C] font-semibold text-lg mb-2">Loading Candidate Details<span className="inline-flex ml-1"><span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span><span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span><span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span></span></p>
            <p className="text-[#3572EF] text-sm font-medium">Please wait while we prepare your data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-[#050C9C]">Candidate Details</h1>
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
          <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#050C9C] mb-3">{error || 'Candidate Not Found'}</h3>
              <p className="text-gray-600 mb-8">Unable to load candidate information</p>
              <div className="flex gap-3 justify-center">
                <button onClick={fetchCandidateDetails} className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                  Retry
                </button>
                <button onClick={() => navigate('/candidates')} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </div>
            </div>
          </main>
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
            <button onClick={() => navigate('/candidates')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <ArrowLeft className="w-5 h-5 text-[#050C9C]" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Candidate Profile</h1>
              <p className="text-sm text-gray-600">{candidate.firstName} {candidate.lastName}</p>
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

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#050C9C] to-[#3572EF] rounded-2xl p-8 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                    <span className="text-4xl font-bold">{candidate.firstName?.[0]}{candidate.lastName?.[0]}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{candidate.firstName} {candidate.lastName}</h2>
                    <p className="text-[#A7E6FF] text-lg flex items-center gap-2">
                      <Briefcase className="w-5 h-5" /> {candidate.position}
                    </p>
                    <p className="text-sm opacity-75 mt-2">Added {formatDate(candidate.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(candidate.status)}
                </div>
              </div>
            </motion.div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Info */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-[#3572EF]" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-[#3572EF]" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{candidate.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <UsersIcon className="w-5 h-5 text-[#3572EF]" />
                    <div>
                      <p className="text-xs text-gray-500">Source</p>
                      <p className="font-medium text-gray-900">{candidate.source || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.length > 0 ? candidate.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white text-sm font-medium shadow-sm">
                      {skill}
                    </span>
                  )) : <p className="text-gray-500">No skills listed</p>}
                </div>
              </motion.div>
            </div>

            {/* Notes */}
            {candidate.notes && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Notes
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{candidate.notes}</p>
                </div>
              </motion.div>
            )}

            {/* CV Section */}
            {candidate.cv && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Curriculum Vitae
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={handleViewCV} disabled={cvLoading} className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50">
                      <Eye className="w-4 h-4" /> {cvLoading ? 'Loading...' : 'View CV'}
                    </button>
                    <button onClick={handleDownloadCV} disabled={cvLoading} className="flex items-center gap-2 bg-white border-2 border-[#3572EF] text-[#3572EF] px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50">
                      <Download className="w-4 h-4" /> {cvLoading ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                  {cvError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-red-800">Error</p>
                          <p className="text-sm text-red-700">{cvError}</p>
                          <button onClick={() => setCvError('')} className="text-red-600 hover:text-red-800 text-sm mt-2 font-medium">Dismiss</button>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <strong>File:</strong> {candidate.cv.split('/').pop()}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Interview History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Interview History
              </h3>
              {interviews.length > 0 ? (
                <div className="space-y-4">
                  {interviews.map((interview, i) => (
                    <div key={interview._id || i} className="bg-gray-50 p-5 rounded-xl border-l-4 border-[#3572EF]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-[#3572EF]" />
                            <span className="font-medium">{formatDate(interview.interviewDate || interview.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="w-4 h-4 text-[#3572EF]" />
                            <span>{interview.interviewType || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <UsersIcon className="w-4 h-4 text-[#3572EF]" />
                            <span>{interview.interviewers?.join(', ') || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(interview.status || 'pending')}
                          </div>
                        </div>
                      </div>
                      {renderFeedback(interview.feedback)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-6">No interviews scheduled for this candidate</p>
                  <button onClick={() => navigate('/hr/schedule-interview')} className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 mx-auto">
                    <Calendar className="w-4 h-4" /> Schedule Interview
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateDetailsView;
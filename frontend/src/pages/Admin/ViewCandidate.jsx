/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  LogOut, User, Briefcase, ArrowLeft, Mail, Phone, Tag, Calendar, 
  FileText, Download, Eye, Clock, CheckCircle, Award, MessageSquare,
  Users, AlertCircle
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const ViewCandidate = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState('');

  useEffect(() => {
    fetchCandidateDetails();
  }, [Id]);

  const fetchCandidateDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`http://localhost:5000/api/candidates/${Id}`, {
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

  const handleDownloadCV = async () => {
    if (!candidate?.cv) return;
   
    setCvLoading(true);
    setCvError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/candidates/${Id}/cv`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to download CV' }));
        throw new Error(errorData.message || `Failed to download CV: ${response.status}`);
      }
      const blob = await response.blob();
     
      if (blob.size === 0) {
        throw new Error('CV file is empty or corrupted');
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
     
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

  const handleViewCV = async () => {
    if (!candidate?.cv) return;
   
    setCvLoading(true);
    setCvError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/candidates/${Id}/cv`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to load CV' }));
        throw new Error(errorData.message || `Failed to load CV: ${response.status}`);
      }
      const blob = await response.blob();
     
      if (blob.size === 0) {
        throw new Error('CV file is empty or corrupted');
      }
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
    const statusConfig = {
      new: { color: 'bg-gray-100 text-gray-800', label: 'New', icon: Clock },
      contacted: { color: 'bg-blue-100 text-blue-800', label: 'Contacted', icon: Phone },
      interviewed: { color: 'bg-yellow-100 text-yellow-800', label: 'Interviewed', icon: Calendar },
      scheduled: { color: 'bg-purple-100 text-purple-800', label: 'Scheduled', icon: Calendar },
      hired: { color: 'bg-green-100 text-green-800', label: 'Hired', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: AlertCircle },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status, icon: Clock };
    const Icon = config.icon;
   
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
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
      return <p className="text-sm text-gray-600 mt-2"><strong>Feedback:</strong> {feedback}</p>;
    }
   
    if (typeof feedback === 'object') {
      return (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-semibold text-[#050C9C]">Interview Feedback:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {feedback.technicalSkills && (
              <p className="text-gray-600"><strong>Technical Skills:</strong> {feedback.technicalSkills}</p>
            )}
            {feedback.communication && (
              <p className="text-gray-600"><strong>Communication:</strong> {feedback.communication}</p>
            )}
            {feedback.problemSolving && (
              <p className="text-gray-600"><strong>Problem Solving:</strong> {feedback.problemSolving}</p>
            )}
            {feedback.culturalFit && (
              <p className="text-gray-600"><strong>Cultural Fit:</strong> {feedback.culturalFit}</p>
            )}
            {feedback.overallRating && (
              <p className="text-gray-600"><strong>Overall Rating:</strong> {feedback.overallRating}</p>
            )}
            {feedback.outcome && (
              <p className="text-gray-600"><strong>Outcome:</strong> {feedback.outcome}</p>
            )}
          </div>
          {feedback.notes && (
            <p className="text-sm text-gray-600"><strong>Notes:</strong> {feedback.notes}</p>
          )}
        </div>
      );
    }
   
    return null;
  };

  const handleBack = () => {
    navigate('/admin/manage-candidate');
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleRetry = () => {
    fetchCandidateDetails();
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3572EF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#050C9C] font-medium">Loading candidate details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-200">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="font-bold text-xl mb-2 text-[#050C9C]">Error</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Retry
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Back to Candidates
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Candidate not found</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Back to Candidates
            </button>
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
            <div className="w-10 h-10 bg-gradient-to-br from-[#050C9C] to-[#3572EF] rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Candidate Profile</h1>
              <p className="text-sm text-gray-600">View detailed candidate information</p>
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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#3572EF] hover:text-[#050C9C] font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Candidates
            </button>

            {/* Candidate Profile Header */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#050C9C] to-[#3572EF] p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                      {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        {candidate.firstName} {candidate.lastName}
                      </h2>
                      <p className="text-[#A7E6FF] text-lg flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {candidate.position}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(candidate.status)}
                    <p className="text-white/80 mt-3 flex items-center gap-2 justify-end text-sm">
                      <Calendar className="w-4 h-4" />
                      Added {formatDate(candidate.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500">Email</label>
                          <p className="text-gray-900 font-medium">{candidate.email}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900 font-medium">{candidate.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                        <Tag className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500">Source</label>
                          <p className="text-gray-900 font-medium">{candidate.source || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500">Status</label>
                          <div className="mt-1">{getStatusBadge(candidate.status)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Skills & Expertise
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl min-h-[200px]">
                      {candidate.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white text-sm font-medium shadow-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No skills listed</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {candidate.notes && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Notes
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <p className="text-gray-900 whitespace-pre-wrap">{candidate.notes}</p>
                    </div>
                  </div>
                )}

                {/* CV Section */}
                {candidate.cv && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Curriculum Vitae (CV)
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex items-center gap-4 flex-wrap">
                        <button
                          onClick={handleViewCV}
                          disabled={cvLoading}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          <Eye className="w-5 h-5" />
                          {cvLoading ? 'Loading...' : 'View CV'}
                        </button>
                        <button
                          onClick={handleDownloadCV}
                          disabled={cvLoading}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#050C9C] to-[#3572EF] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          <Download className="w-5 h-5" />
                          {cvLoading ? 'Downloading...' : 'Download CV'}
                        </button>
                      </div>
                     
                      {cvError && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-red-800">CV Error</p>
                              <p className="text-sm text-red-700 mt-1">{cvError}</p>
                              <button
                                onClick={() => setCvError('')}
                                className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                     
                      <p className="text-sm text-gray-600 mt-4">
                        <strong>File:</strong> {candidate.cv.split('/').pop()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Interview History */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Interview History
                  </h3>
                  {interviews.length > 0 ? (
                    <div className="space-y-4">
                      {interviews.map((interview, index) => (
                        <div
                          key={interview._id || index}
                          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm"><strong className="text-[#050C9C]">Date:</strong> <span className="text-gray-700">{formatDate(interview.interviewDate || interview.date)}</span></p>
                              <p className="text-sm"><strong className="text-[#050C9C]">Type:</strong> <span className="inline-flex items-center px-2 py-1 rounded bg-[#A7E6FF] text-[#050C9C] text-xs font-medium ml-2">{interview.type || 'N/A'}</span></p>
                              <p className="text-sm"><strong className="text-[#050C9C]">Status:</strong> <span className="text-gray-700">{interview.status || 'N/A'}</span></p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm"><strong className="text-[#050C9C]">Interviewers:</strong> <span className="text-gray-700">{interview.interviewers?.join(', ') || 'N/A'}</span></p>
                              <p className="text-sm"><strong className="text-[#050C9C]">Round:</strong> <span className="text-gray-700">{interview.round || 'N/A'}</span></p>
                            </div>
                          </div>
                          {renderFeedback(interview.feedback)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-12 rounded-xl text-center">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No interviews scheduled for this candidate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewCandidate;
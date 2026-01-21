import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, User, ArrowLeft, Printer, Calendar, Mail, Briefcase,
  Star, Award, MessageSquare, Brain, Users as UsersIcon, TrendingUp,
  CheckCircle, XCircle, Clock, AlertCircle, FileText
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const InterviewReport = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);

  useEffect(() => { fetchInterviewDetails(); }, [interviewId]);

  const fetchInterviewDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setInterview(data.interview);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const getOutcomeBadge = (outcome) => {
    const config = {
      passed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" />, label: 'Failed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800', icon: <TrendingUp className="w-4 h-4" />, label: 'Next Round' }
    }[outcome] || { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-4 h-4" />, label: outcome };
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${config.color} shadow-sm`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const handlePrint = () => window.print();
  const handleLogout = () => {
    ['role', 'token', 'user'].forEach(i => localStorage.removeItem(i));
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <AdminSidebar />
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
            <p className="text-[#050C9C] font-semibold text-lg mb-2">Loading Report<span className="inline-flex ml-1"><span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span><span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span><span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span></span></p>
            <p className="text-[#3572EF] text-sm font-medium">Please wait while we prepare your data</p>
          </div>
        </div>
      </div>
    );
  }

  if (!interview || !interview.feedback) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
            <h1 className="text-xl font-semibold text-[#050C9C]">Interview Report</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-[#050C9C]">Welcome, Admin</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#050C9C] mb-3">No Feedback Available</h3>
              <p className="text-gray-600 mb-8">No feedback found for this interview</p>
              <button onClick={() => navigate('/admin/view-interviews')} className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 mx-auto">
                <ArrowLeft className="w-4 h-4" /> Back to Interviews
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { candidate, interviewDate, interviewType, interviewers, feedback } = interview;
  const ratingCategories = [
    { label: 'Technical Skills', value: feedback.technicalSkills, icon: Brain, color: 'from-[#050C9C] to-[#3572EF]' },
    { label: 'Communication', value: feedback.communication, icon: MessageSquare, color: 'from-green-500 to-green-600' },
    { label: 'Problem Solving', value: feedback.problemSolving, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Cultural Fit', value: feedback.culturalFit, icon: UsersIcon, color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
          .print-header { display: block !important; }
        }
        @media screen { .print-header { display: none; } }
      `}</style>

      <div className="flex h-screen bg-[#A7E6FF]">
        <div className="no-print"><AdminSidebar /></div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="no-print bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin/view-interviews')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <ArrowLeft className="w-5 h-5 text-[#050C9C]" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[#050C9C]">Interview Report</h1>
                <p className="text-sm text-gray-600">{candidate?.firstName} {candidate?.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-[#050C9C]">Welcome, Admin</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8">
            <div className="print-area max-w-6xl mx-auto space-y-6">
              {/* Print Header */}
              <div className="print-header mb-8 text-center border-b-2 border-gray-300 pb-4">
                <h1 className="text-3xl font-bold text-[#050C9C] mb-2">Gamage Recruiters</h1>
                <h2 className="text-xl text-gray-600">Interview Feedback Report</h2>
              </div>

              {/* Interview Details */}
              <div className="bg-gradient-to-br from-[#050C9C] to-[#3572EF] rounded-2xl p-8 shadow-lg text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Interview Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#A7E6FF]">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Candidate</span>
                    </div>
                    <p className="text-lg font-semibold">{candidate?.firstName} {candidate?.lastName}</p>
                    <p className="text-sm opacity-90">{candidate?.position}</p>
                    <p className="text-sm opacity-75">{candidate?.email}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#A7E6FF]">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Interview Date</span>
                    </div>
                    <p className="text-lg font-semibold">{new Date(interviewDate).toLocaleDateString()}</p>
                    <p className="text-sm opacity-90">{new Date(interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm opacity-75 capitalize">{interviewType} Interview</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#A7E6FF]">
                      <UsersIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Interviewers</span>
                    </div>
                    {interviewers?.map((interviewer, idx) => (
                      <p key={idx} className="text-sm opacity-90">{interviewer}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rating Categories */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-semibold text-[#050C9C] flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Performance Ratings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ratingCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div key={category.label} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-semibold text-gray-800">{category.label}</span>
                            </div>
                            <span className="text-2xl font-bold text-[#050C9C]">{category.value}/5</span>
                          </div>
                          <div className="flex gap-1">
                            {getRatingStars(category.value)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#050C9C] flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Summary
                  </h3>

                  <div className="bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-2xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">Overall Rating</span>
                      <span className="text-3xl font-bold">{feedback.overallRating}/5</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                      <div className="bg-white h-3 rounded-full transition-all duration-500" style={{ width: `${(feedback.overallRating / 5) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm opacity-75">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <p className="text-sm font-medium text-gray-600 mb-3">Decision</p>
                    {getOutcomeBadge(feedback.outcome)}
                  </div>

                  
                </div>
              </div>

              {/* Notes */}
              {feedback.notes && (
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Additional Notes
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{feedback.notes}</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Submitted By</p>
                      <p className="font-semibold text-[#050C9C]">{feedback.submittedBy}</p>
                    </div>
                    {feedback.submittedAt && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Submitted On</p>
                        <p className="text-sm text-gray-800">{new Date(feedback.submittedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

              {/* Actions */}
              <div className="no-print flex gap-4 pt-4">
                <button onClick={handlePrint} className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                  <Printer className="w-4 h-4" /> Print Report
                </button>
                <button onClick={() => navigate('/admin/view-interviews')} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200">
                  <ArrowLeft className="w-4 h-4" /> Back to Interviews
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default InterviewReport;
/* eslint-disable no-self-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { 
  LogOut, User, Briefcase, ArrowLeft, Calendar, 
  Clock, Users, Video, FileText, CheckCircle,
  AlertCircle, XCircle, MessageSquare, Mail, 
  MapPin, Building, Phone
} from 'lucide-react';

const InterviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Enhanced helper to safely format dates and handle objects
  const formatDate = (date) => {
    if (!date) return "N/A";

    // Handle MongoDB date objects { $date: ... }
    if (typeof date === "object" && "$date" in date) {
      date = date.$date;
    }

    try {
      const dateObj = new Date(date);
      return isNaN(dateObj.getTime()) ? "Invalid Date" : dateObj.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  // Process interview data properly
  const processInterviewData = (fetchedInterview) => {
    if (!fetchedInterview) return null;

    const processed = { ...fetchedInterview };

    // Process dates
    if (processed.interviewDate) {
      processed.interviewDate = formatDate(processed.interviewDate);
    }
    if (processed.submittedAt) {
      processed.submittedAt = formatDate(processed.submittedAt);
    }
    if (processed.createdAt) {
      processed.createdAt = formatDate(processed.createdAt);
    }
    if (processed.updatedAt) {
      processed.updatedAt = formatDate(processed.updatedAt);
    }

    // Process candidate object
    if (processed.candidate && typeof processed.candidate === 'object') {
      processed.candidate = { ...processed.candidate };
    }

    // Process interviewers array
    if (processed.interviewers) {
      if (Array.isArray(processed.interviewers)) {
        processed.interviewers = processed.interviewers.join(', ');
      } else if (typeof processed.interviewers === 'string') {
        try {
          const parsed = JSON.parse(processed.interviewers);
          if (Array.isArray(parsed)) {
            processed.interviewers = parsed.join(', ');
          }
        } catch {
          processed.interviewers = processed.interviewers;
        }
      }
    }

    // Process feedback if it exists
    if (processed.feedback && typeof processed.feedback === 'object') {
      try {
        processed.feedback = JSON.stringify(processed.feedback, null, 2);
      } catch {
        processed.feedback = "Unable to display feedback";
      }
    }

    return processed;
  };

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await fetch(
          `http://localhost:5000/api/interviews/${id}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.interview) {
          throw new Error("Interview not found");
        }

        const processedInterview = processInterviewData(data.interview);
        setInterview(processedInterview);
      } catch (error) {
        console.error("Error fetching interview details:", error);
        setError(error.message);
        setInterview(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { 
        color: 'bg-blue-50 text-blue-700 border border-blue-200', 
        icon: Clock,
        label: 'Scheduled' 
      },
      completed: { 
        color: 'bg-green-50 text-green-700 border border-green-200', 
        icon: CheckCircle,
        label: 'Completed' 
      },
      cancelled: { 
        color: 'bg-red-50 text-red-700 border border-red-200', 
        icon: XCircle,
        label: 'Cancelled' 
      },
      pending: { 
        color: 'bg-yellow-50 text-yellow-700 border border-yellow-200', 
        icon: AlertCircle,
        label: 'Pending' 
      },
      'in-progress': { 
        color: 'bg-purple-50 text-purple-700 border border-purple-200', 
        icon: Clock,
        label: 'In Progress' 
      }
    };

    const config = statusConfig[status] || { 
      color: 'bg-gray-50 text-gray-700 border border-gray-200', 
      icon: AlertCircle,
      label: status 
    };
    
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  // Helper to safely render values
  const safeRender = (value, defaultValue = "N/A") => {
    if (value === null || value === undefined || value === "") return defaultValue;
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3572EF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#050C9C] font-medium">Loading interview details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#050C9C] to-[#3572EF] rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#050C9C]">Interview Details</h1>
                <p className="text-sm text-gray-600">View complete interview information</p>
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

          {/* Error Content */}
          <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Interview</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/interviews')}
                className="w-full bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Back to Interviews
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#050C9C] to-[#3572EF] rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#050C9C]">Interview Details</h1>
                <p className="text-sm text-gray-600">View complete interview information</p>
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

          {/* Not Found Content */}
          <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Interview Not Found</h3>
              <p className="text-gray-600 mb-6">No interview details found for the specified ID.</p>
              <button
                onClick={() => navigate('/interviews')}
                className="w-full bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Back to Interviews
              </button>
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
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Interview Details</h1>
              <p className="text-sm text-gray-600">Complete interview information and candidate profile</p>
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => navigate('/interviews')}
              className="mb-6 flex items-center gap-2 text-[#3572EF] hover:text-[#050C9C] font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Interviews
            </button>

            <div className="space-y-6">
              {/* Candidate Header Card */}
              <div className="bg-gradient-to-r from-[#050C9C] to-[#3572EF] rounded-2xl p-8 text-white shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {safeRender(interview.candidate?.firstName)} {safeRender(interview.candidate?.lastName)}
                        </h2>
                        <p className="text-[#A7E6FF] font-medium">{safeRender(interview.candidate?.position)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#A7E6FF]" />
                        <span className="text-sm">{safeRender(interview.candidate?.email)}</span>
                      </div>
                      {interview.candidate?.phone && interview.candidate.phone !== "N/A" && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#A7E6FF]" />
                          <span className="text-sm">{safeRender(interview.candidate?.phone)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {getStatusBadge(interview.status)}
                  </div>
                </div>
              </div>

              {/* Interview Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interview Details Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Interview Schedule
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#3572EF]" />
                        <span className="text-sm font-medium text-gray-700">Date & Time</span>
                      </div>
                      <span className="text-sm font-semibold text-[#050C9C] text-right">{safeRender(interview.interviewDate)}</span>
                    </div>

                    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#3572EF]" />
                        <span className="text-sm font-medium text-gray-700">Interview Type</span>
                      </div>
                      <span className="text-sm font-semibold text-[#050C9C] capitalize">{safeRender(interview.interviewType)}</span>
                    </div>

                    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#3572EF]" />
                        <span className="text-sm font-medium text-gray-700">Interviewers</span>
                      </div>
                      <span className="text-sm font-semibold text-[#050C9C] text-right max-w-xs break-words">{safeRender(interview.interviewers)}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Details
                  </h3>
                  <div className="space-y-4">
                    {interview.meetingLink && interview.meetingLink !== "N/A" && (
                      <div className="p-3 bg-gradient-to-r from-[#3ABEF9]/10 to-[#3572EF]/10 rounded-xl border border-[#3ABEF9]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-4 h-4 text-[#3572EF]" />
                          <span className="text-sm font-medium text-gray-700">Meeting Link</span>
                        </div>
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-[#3572EF] hover:text-[#050C9C] font-semibold underline break-all"
                        >
                          Join Interview Meeting
                        </a>
                      </div>
                    )}

                    {interview.notes && interview.notes !== "N/A" && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-[#3572EF]" />
                          <span className="text-sm font-medium text-gray-700">Notes</span>
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{safeRender(interview.notes)}</p>
                      </div>
                    )}

                    {(!interview.meetingLink || interview.meetingLink === "N/A") && 
                     (!interview.notes || interview.notes === "N/A") && (
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm text-gray-500">No additional details available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              {interview.feedback && interview.feedback !== "N/A" && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-[#050C9C] mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Interview Feedback
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words font-mono">
                      {safeRender(interview.feedback)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => navigate(`/interviews/${id}/feedback`)}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <MessageSquare className="w-5 h-5" />
                  {interview.feedback && interview.feedback !== "N/A" ? 'View/Edit Feedback' : 'Add Feedback'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewDetail;
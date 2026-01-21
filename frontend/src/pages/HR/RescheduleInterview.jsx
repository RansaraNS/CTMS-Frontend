/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { 
  LogOut, User, Calendar, ArrowLeft, AlertCircle,
  CheckCircle, Clock, Video, Briefcase, Mail,
  MapPin, RefreshCw
} from 'lucide-react';

const RescheduleInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/interviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch interview");
      const data = await res.json();
      setInterview(data.interview);
      setInterviewDate(data.interview.interviewDate.slice(0, 16));
      setMeetingLink(data.interview.meetingLink || "");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load interview.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Validate date restrictions
  const isValidDate = (dateStr) => {
    const selectedDate = new Date(dateStr);
    const now = new Date();

    if (selectedDate < now) {
      setError("Cannot select past date/time.");
      return false;
    }

    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      setError("Interviews cannot be scheduled on weekends.");
      return false;
    }

    const hours = selectedDate.getHours();
    if (hours < 9 || hours >= 18) {
      setError("Interview time must be between 09:00 and 18:00.");
      return false;
    }

    return true;
  };

  // Validate meeting link
  const isValidURL = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (err) {
      setError("Invalid meeting link URL.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!isValidDate(interviewDate)) {
      setIsSubmitting(false);
      return;
    }

    if (!isValidURL(meetingLink)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/interviews/${id}/reschedule`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewDate, meetingLink }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reschedule interview");

      setSuccess("Interview rescheduled successfully!");
      setTimeout(() => navigate("/interviews"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to reschedule interview.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Loading Interviews Details
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
              <h1 className="text-xl font-semibold text-[#050C9C]">Reschedule Interview</h1>
              <p className="text-sm text-gray-600">Update interview date and meeting details</p>
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
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/interviews')}
              className="mb-6 flex items-center gap-2 text-[#3572EF] hover:text-[#050C9C] font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Interviews
            </button>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-800 font-medium">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-800 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Candidate Information Card */}
              {interview && (
                <div className="bg-gradient-to-r from-[#050C9C] to-[#3572EF] rounded-2xl p-6 text-white shadow-md">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Current Interview Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-[#A7E6FF]">Candidate:</span>{" "}
                        <span className="font-semibold">
                          {interview.candidate?.firstName} {interview.candidate?.lastName}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-[#A7E6FF]">Position:</span>{" "}
                        <span className="font-semibold">{interview.candidate?.position}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-[#A7E6FF]">Email:</span>{" "}
                        <span className="font-semibold">{interview.candidate?.email}</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-[#A7E6FF]">Current Date:</span>{" "}
                        <span className="font-semibold">
                          {new Date(interview.interviewDate).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-[#A7E6FF]">Type:</span>{" "}
                        <span className="font-semibold capitalize">{interview.interviewType}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-[#A7E6FF]">Status:</span>{" "}
                        <span className="font-semibold capitalize">{interview.status}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reschedule Form */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                <h3 className="text-lg font-semibold text-[#050C9C] mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  New Schedule Details
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Interview Date & Time */}
                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Interview Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => {
                        setInterviewDate(e.target.value);
                        setError("");
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                      required
                    />
                    <p className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Weekdays only, between 09:00 and 18:00
                    </p>
                  </div>

                  {/* Meeting Link */}
                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Meeting Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => {
                        setMeetingLink(e.target.value);
                        setError("");
                      }}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                    />
                    <p className="mt-2 text-xs text-gray-600">
                      Provide a video meeting link for remote interviews
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-r from-[#3ABEF9]/10 to-[#3572EF]/10 border border-[#3ABEF9]/20 rounded-xl p-4">
                    <h4 className="font-semibold text-sm text-[#050C9C] mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#3572EF]" />
                      Scheduling Guidelines
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1 ml-6 list-disc">
                      <li>Interviews must be scheduled during business hours (9.30 AM - 5.30 PM)</li>
                      <li>Weekend scheduling is not permitted</li>
                      <li>Past dates and times cannot be selected</li>
                      <li>All times are in your local timezone</li>
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Rescheduling...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5" />
                          Reschedule Interview
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/interviews')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-[#050C9C] mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  What Happens Next?
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-[#3ABEF9]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-[#3572EF]">1</span>
                    </div>
                    <p>Interview schedule will be updated with the new date and time</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-[#3ABEF9]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-[#3572EF]">2</span>
                    </div>
                    <p>Candidate will receive notification of the schedule change</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-[#3ABEF9]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-[#3572EF]">3</span>
                    </div>
                    <p>Updated meeting link will be shared if provided</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RescheduleInterview;
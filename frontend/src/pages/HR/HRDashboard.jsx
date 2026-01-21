/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../services/api";
import Sidebar from "../../components/Sidebar";
import { 
  LogOut, User, Briefcase, Users, UserPlus, Calendar, 
  CheckCircle, XCircle, TrendingUp, Clock, Eye, ArrowRight,
  FileText, BarChart3
} from 'lucide-react';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCandidates: 0,
    newCandidates: 0,
    interviewedCandidates: 0,
    hiredCandidates: 0,
    rejectedCandidates: 0,
    upcomingInterviews: 0,
    todayInterviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [timeRange, setTimeRange] = useState("week");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const statsResponse = await API.get("/candidates/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Stats API error:", error);
        setStats({
          totalCandidates: 0,
          newCandidates: 0,
          interviewedCandidates: 0,
          hiredCandidates: 0,
          rejectedCandidates: 0,
          upcomingInterviews: 0,
          todayInterviews: 0,
        });
      }

      try {
        const candidatesResponse = await API.get("/candidates?limit=5", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentCandidates(candidatesResponse.data.candidates || []);
      } catch (error) {
        console.error("Candidates API error:", error);
        setRecentCandidates([]);
      }

      try {
        const interviewsResponse = await API.get("/interviews/upcoming?limit=3", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpcomingInterviews(interviewsResponse.data.interviews || []);
      } catch (error) {
        console.error("Interviews API error:", error);
        setUpcomingInterviews([]);
        setError("Upcoming interviews feature is currently unavailable.");
      }

    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Failed to load dashboard data. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navigateTo = (path) => {
    navigate(path);
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
              Loading Dashboard
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

  const statCards = [
    { 
      title: "Total Candidates", 
      value: stats.totalCandidates, 
      icon: Users, 
      color: "from-[#050C9C] to-[#3572EF]",
      bgColor: "bg-blue-50"
    },
    { 
      title: "New Candidates", 
      value: stats.newCandidates, 
      icon: UserPlus, 
      color: "from-[#3572EF] to-[#3ABEF9]",
      bgColor: "bg-cyan-50"
    },
    { 
      title: "To Interview", 
      value: stats.interviewedCandidates, 
      icon: Calendar, 
      color: "from-[#3ABEF9] to-[#A7E6FF]",
      bgColor: "bg-sky-50"
    },
    { 
      title: "Hired", 
      value: stats.hiredCandidates, 
      icon: CheckCircle, 
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    { 
      title: "Rejected", 
      value: stats.rejectedCandidates, 
      icon: XCircle, 
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    },
    { 
      title: "Conversion Rate", 
      value: stats.totalCandidates ? ((stats.hiredCandidates / stats.totalCandidates) * 100).toFixed(1) + "%" : "0%", 
      icon: TrendingUp, 
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
  ];

  const quickActions = [
    { 
      title: "Add Candidate", 
      description: "Add a new candidate to the system", 
      icon: UserPlus, 
      path: "/hr/add-candidate", 
      color: "from-[#3572EF] to-[#3ABEF9]" 
    },
    { 
      title: "Schedule Interview", 
      description: "Schedule a new interview", 
      icon: Calendar, 
      path: "/hr/schedule-interview", 
      color: "from-[#050C9C] to-[#3572EF]" 
    },
    { 
      title: "View All Candidates", 
      description: "Manage all candidates", 
      icon: Users, 
      path: "/candidates", 
      color: "from-[#3ABEF9] to-[#A7E6FF]" 
    },
  ];

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">HR Dashboard</h1>
              <p className="text-sm text-gray-600">Candidate Tracking Management System</p>
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
              <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Note</p>
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Time Range Filter */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-[#050C9C]">Overview</h2>
              <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md border border-gray-200">
                {["week", "month", "quarter", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-200 ${
                      timeRange === range
                        ? "bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
                  >
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

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Candidates */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-[#050C9C] text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Candidates
                  </h3>
                </div>
                <div className="p-6">
                  {recentCandidates.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {recentCandidates.map((candidate) => (
                        <div
                          key={candidate._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-xl flex items-center justify-center text-white font-semibold">
                              {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {candidate.firstName} {candidate.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{candidate.position}</p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              candidate.status === "new"
                                ? "bg-gray-100 text-gray-800"
                                : candidate.status === "contacted"
                                ? "bg-blue-100 text-blue-800"
                                : candidate.status === "scheduled"
                                ? "bg-purple-100 text-purple-800"
                                : candidate.status === "hired"
                                ? "bg-green-100 text-green-800"
                                : candidate.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {candidate.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No recent candidates found</p>
                    </div>
                  )}
                  <button
                    onClick={() => navigateTo("/candidates")}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    View All Candidates
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Upcoming Interviews */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-[#050C9C] text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Interviews
                  </h3>
                </div>
                <div className="p-6">
                  {upcomingInterviews.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {upcomingInterviews.map((interview) => (
                        <div
                          key={interview._id}
                          onClick={() => navigateTo(`/interviews/${interview._id}`)}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-gray-900">
                              {interview.candidate?.firstName} {interview.candidate?.lastName || "Candidate"}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded bg-[#A7E6FF] text-[#050C9C] text-xs font-medium">
                              {interview.interviewType}
                            </span>
                          </div>
                          <p className="text-sm text-[#3572EF] font-medium flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(interview.interviewDate).toLocaleDateString()} at{" "}
                            {new Date(interview.interviewDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No upcoming interviews</p>
                    </div>
                  )}
                  <button
                    onClick={() => navigateTo("/interviews")}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#050C9C] to-[#3572EF] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    View All Interviews
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-semibold text-[#050C9C] mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => navigateTo(action.path)}
                      className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-200 text-left group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-[#050C9C] text-lg mb-2">{action.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                      <div className="flex items-center text-[#3572EF] font-medium text-sm group-hover:gap-2 transition-all duration-200">
                        Get started
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;
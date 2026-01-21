/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserPlus, Eye, User, Briefcase, Users, Calendar } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [latestHrs, setLatestHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    totalHRs: 12,
    totalCandidates: 45,
    activeInterviews: 8,
    pendingReviews: 15
  });

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchLatestHrs = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/auth/latest-hrs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const result = await response.json();
        if (response.ok) {
          setLatestHrs(result);
        } else {
          console.error(result.message || 'Failed to fetch latest HRs');
        }
      } catch (error) {
        console.error('An error occurred while fetching latest HRs', error);
      }
      setLoading(false);
    };
    fetchLatestHrs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <AdminSidebar />
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
              Loading Candidates
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
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Candidate Tracking Management System</p>
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

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total HR Personnel', value: stats.totalHRs, icon: Users, color: 'from-[#3572EF] to-[#3ABEF9]' },
                { label: 'Total Candidates', value: stats.totalCandidates, icon: User, color: 'from-[#050C9C] to-[#3572EF]' },
                { label: 'Active Interviews', value: stats.activeInterviews, icon: Calendar, color: 'from-[#3ABEF9] to-[#A7E6FF]' },
                { label: 'Pending Reviews', value: stats.pendingReviews, icon: Eye, color: 'from-[#3572EF] to-[#3ABEF9]' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#050C9C] mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent HR Personnel */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#050C9C]">Recent HR Personnel</h2>
                <button
                  onClick={() => navigateTo('/admin/manage-hr')}
                  className="px-4 py-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  View All HRs
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestHrs.length > 0 ? (
                  latestHrs.map((hr) => (
                    <div
                      key={hr._id}
                      className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-[#3ABEF9] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#050C9C] mb-1 truncate">{hr.name}</p>
                          <p className="text-sm text-gray-600 mb-1 truncate">{hr.email}</p>
                          <div className="inline-flex items-center px-2 py-1 bg-[#A7E6FF] rounded-lg">
                            <span className="text-xs font-medium text-[#050C9C]">{hr.role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent HR data available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-[#050C9C] mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigateTo('/admin/create-hr')}
                  className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                >
                  <UserPlus className="w-6 h-6" />
                  Add New HR Personnel
                </button>
                <button
                  onClick={() => navigateTo('/admin/view-interviews')}
                  className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-[#050C9C] to-[#3572EF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
                >
                  <Eye className="w-6 h-6" />
                  View All Interviews
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
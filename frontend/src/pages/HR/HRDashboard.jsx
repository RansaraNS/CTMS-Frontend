// src/pages/HR/HRDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCandidates: 0,
    newCandidates: 0,
    interviewedCandidates: 0,
    hiredCandidates: 0,
    rejectedCandidates: 0,
    upcomingInterviews: 0,
    todayInterviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsResponse, candidatesResponse, interviewsResponse] = await Promise.all([
        axios.get('/api/reports/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/candidates?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/interviews/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsResponse.data);
      setRecentCandidates(candidatesResponse.data.candidates || []);
      setUpcomingInterviews(interviewsResponse.data.interviews || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-teal-600 text-white p-4 flex justify-between items-center w-full">
          <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, HR</span>
            <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded hover:bg-teal-700">
              Logout
            </button>
          </div>
        </nav>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 text-white h-full">
            <nav className="flex flex-col h-full">
              <button 
                onClick={() => navigateTo('/hr/dashboard')} 
                className="flex items-center p-4 bg-teal-700 hover:bg-teal-600"
              >
                <span className="mr-2">🏠</span> HR Dashboard
              </button>
              <button 
                onClick={() => navigateTo('/hr/add-candidate')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">👤</span> Add Candidate
              </button>
              <button 
                onClick={() => navigateTo('/hr/schedule-interview')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">🗓️</span> Schedule Interview
              </button>
              <button 
                onClick={() => navigateTo('/interviews')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">📊</span> Manage Interviews
              </button>
              <button 
                onClick={() => navigateTo('/candidates')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">🔍</span> View Candidates
              </button>
              <button 
                onClick={() => navigateTo('/hr/reports')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">📈</span> Reports
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">HR Dashboard Overview</h2>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Candidates" 
                value={stats.totalCandidates} 
                icon="👥"
                color="blue"
              />
              <StatCard 
                title="New Candidates" 
                value={stats.newCandidates} 
                icon="🆕"
                color="green"
              />
              <StatCard 
                title="Interviewed" 
                value={stats.interviewedCandidates} 
                icon="📋"
                color="purple"
              />
              <StatCard 
                title="Hired" 
                value={stats.hiredCandidates} 
                icon="✅"
                color="teal"
              />
              <StatCard 
                title="Rejected" 
                value={stats.rejectedCandidates} 
                icon="❌"
                color="red"
              />
              <StatCard 
                title="Upcoming Interviews" 
                value={stats.upcomingInterviews} 
                icon="📅"
                color="orange"
              />
              <StatCard 
                title="Today's Interviews" 
                value={stats.todayInterviews} 
                icon="🎯"
                color="yellow"
              />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Candidates */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800">Recent Candidates</h3>
                </div>
                <div className="p-4">
                  {recentCandidates.length > 0 ? (
                    <div className="space-y-3">
                      {recentCandidates.map(candidate => (
                        <div key={candidate._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{candidate.firstName} {candidate.lastName}</p>
                            <p className="text-sm text-gray-600">{candidate.position}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            candidate.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            candidate.status === 'interviewed' ? 'bg-purple-100 text-purple-800' :
                            candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {candidate.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent candidates</p>
                  )}
                  <button 
                    onClick={() => navigateTo('/candidates')}
                    className="w-full mt-4 bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
                  >
                    View All Candidates
                  </button>
                </div>
              </div>

              {/* Upcoming Interviews */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800">Upcoming Interviews</h3>
                </div>
                <div className="p-4">
                  {upcomingInterviews.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingInterviews.map(interview => (
                        <div key={interview._id} className="p-2 hover:bg-gray-50 rounded">
                          <p className="font-medium">{interview.candidate?.firstName} {interview.candidate?.lastName}</p>
                          <p className="text-sm text-gray-600">{interview.interviewType}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(interview.interviewDate).toLocaleDateString()} at {interview.interviewTime}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No upcoming interviews</p>
                  )}
                  <button 
                    onClick={() => navigateTo('/interviews')}
                    className="w-full mt-4 bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
                  >
                    View All Interviews
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActionCard 
                  title="Add Candidate" 
                  description="Add a new candidate to the system"
                  icon="👤"
                  onClick={() => navigateTo('/hr/add-candidate')}
                />
                <ActionCard 
                  title="Schedule Interview" 
                  description="Schedule a new interview"
                  icon="🗓️"
                  onClick={() => navigateTo('/hr/schedule-interview')}
                />
                <ActionCard 
                  title="View Reports" 
                  description="Generate and view reports"
                  icon="📈"
                  onClick={() => navigateTo('/hr/reports')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 border-blue-300 text-blue-800',
    green: 'bg-green-100 border-green-300 text-green-800',
    purple: 'bg-purple-100 border-purple-300 text-purple-800',
    teal: 'bg-teal-100 border-teal-300 text-teal-800',
    red: 'bg-red-100 border-red-300 text-red-800',
    orange: 'bg-orange-100 border-orange-300 text-orange-800',
    yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]} transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, icon, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-left hover:bg-teal-50"
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-3">{icon}</span>
        <h4 className="font-semibold text-gray-800">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};

export default HRDashboard;
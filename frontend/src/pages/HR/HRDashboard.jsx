/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
        const statsResponse = await axios.get("http://localhost:5000/api/candidates/dashboard/stats", {
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
        const candidatesResponse = await axios.get("http://localhost:5000/api/candidates?limit=5", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentCandidates(candidatesResponse.data.candidates || []);
      } catch (error) {
        console.error("Candidates API error:", error);
        setRecentCandidates([]);
      }

      try {
        const interviewsResponse = await axios.get("http://localhost:5000/api/interviews/upcoming?limit=3", {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity },
          }}
          className="rounded-full h-16 w-16 border-4 border-[#00df82] border-t-transparent"
        ></motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
    >
      <div className="flex-1 flex flex-col">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white p-4 flex justify-between items-center w-full shadow-lg"
        >
          <div className="flex items-center">
            <motion.img
              src="/GR.jpg"
              alt="Company Logo"
              transition={{ duration: 0.5 }}
              className="w-10 h-10 mr-3 object-contain"
            />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00df82]">
              Candidate Tracking Management System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#03624c] px-4 py-2 rounded-full shadow-lg"
            >
              <span className="font-medium">Welcome, {user?.name || "HR"}</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 shadow-lg font-medium"
            >
              Logout
            </motion.button>
          </div>
        </motion.nav>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          >
            <strong>Note:</strong> {error}
          </motion.div>
        )}

        <div className="flex flex-1">
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-64 bg-gradient-to-b from-[#030f0f] to-[#03624c] text-white h-full shadow-2xl"
          >
            <nav className="flex flex-col h-full py-6">
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo("/hr/dashboard")}
                className="flex items-center p-4 bg-gradient-to-r from-[#03624c] to-[#030f0f] mx-4 rounded-xl mb-2 shadow-lg"
              >
                <span className="mr-3 text-xl">🏠</span>
                <span className="font-semibold">HR Dashboard</span>
              </motion.button>
              {[
                { path: "/hr/add-candidate", icon: "👤", label: "Add Candidate" },
                { path: "/hr/schedule-interview", icon: "🗓️", label: "Schedule Interview" },
                { path: "/interviews", icon: "📊", label: "Manage Interviews" },
                { path: "/candidates", icon: "🔍", label: "View Candidates" },
              ].map((item, index) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10, backgroundColor: "rgba(0,223,130,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateTo(item.path)}
                  className="flex items-center p-4 hover:bg-white hover:bg-opacity-10 mx-2 rounded-lg mb-1 transition-all duration-200"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          <div className="flex-1 p-6 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-[#030f0f] to-[#03624c] bg-clip-text text-transparent"
              >
                {/* HR Dashboard Overview */}
              </motion.h2>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex space-x-2 bg-white rounded-lg p-1 shadow-lg"
              >
                {["week", "month", "quarter", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md font-medium capitalize transition-all ${timeRange === range
                      ? "bg-[#00df82] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </motion.div>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                { title: "Total Candidates", value: stats.totalCandidates, icon: "👥", color: "#00df82" },
                { title: "New Candidates", value: stats.newCandidates, icon: "🆕", color: "#03624c" },
                { title: "Have To Interview", value: stats.interviewedCandidates, icon: "📋", color: "#030f0f" },
                { title: "Hired", value: stats.hiredCandidates, icon: "✅", color: "#00df82" },
                { title: "Rejected", value: stats.rejectedCandidates, icon: "❌", color: "#03624c" },
                { title: "Conversion Rate", value: stats.totalCandidates ? ((stats.hiredCandidates / stats.totalCandidates) * 100).toFixed(1) + "%" : "0%", icon: "📊", color: "#030f0f" },
              ].map((stat, index) => (
                <StatCard key={stat.title} {...stat} index={index} />
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <RecentCandidatesSection
                recentCandidates={recentCandidates}
                navigateTo={navigateTo}
              />
              <UpcomingInterviewsSection
                upcomingInterviews={upcomingInterviews}
                navigateTo={navigateTo}
              />
            </div>

            <QuickActionsSection navigateTo={navigateTo} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced StatCard Component
const StatCard = ({ title, value, icon, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      className={`bg-[${color}] text-white p-6 rounded-2xl shadow-lg cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <motion.p
            key={value}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold"
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 5 }}
          className="text-4xl"
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced Section Components
const RecentCandidatesSection = ({ recentCandidates, navigateTo }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white rounded-2xl shadow-xl overflow-hidden"
  >
    <div className="p-6 border-b">
      <h3 className="font-semibold text-gray-800 text-lg">Recent Candidates</h3>
    </div>
    <div className="p-6">
      <AnimatePresence>
        {recentCandidates.length > 0 ? (
          <div className="space-y-3">
            {recentCandidates.map((candidate, index) => (
              <motion.div
                key={candidate._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {candidate.firstName} {candidate.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                </div>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.status === "new"
                      ? "bg-[#82162fff] text-white"
                      : candidate.status === "scheduled"
                        ? "bg-[#03624c] text-white"
                        : candidate.status === "hired"
                          ? "bg-[#00df82] text-white"
                          : candidate.status === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 text-gray-800"
                    }`}
                >

                  {candidate.status}
                </motion.span>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 text-center py-8"
          >
            No recent candidates found
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigateTo("/candidates")}
        className="w-full mt-6 bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
      >
        View All Candidates
      </motion.button>
    </div>
  </motion.div>
);

const UpcomingInterviewsSection = ({ upcomingInterviews, navigateTo }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white rounded-2xl shadow-xl overflow-hidden"
  >
    <div className="p-6 border-b">
      <h3 className="font-semibold text-gray-800 text-lg">Upcoming Interviews</h3>
    </div>
    <div className="p-6">
      <AnimatePresence>
        {upcomingInterviews.length > 0 ? (
          <div className="space-y-3">
            {upcomingInterviews.map((interview, index) => (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigateTo(`/interviews/${interview._id}`)}
              >
                <p className="font-medium text-gray-900">
                  {interview.candidate?.firstName} {interview.candidate?.lastName || "Candidate"}
                </p>
                <p className="text-sm text-gray-600">{interview.interviewType}</p>
                <p className="text-sm text-[#00df82] font-medium">
                  {new Date(interview.interviewDate).toLocaleDateString()} at{" "}
                  {new Date(interview.interviewDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 text-center py-8"
          >
            No upcoming interviews
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigateTo("/interviews")}
        className="w-full mt-6 bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
      >
        View All Interviews
      </motion.button>
    </div>
  </motion.div>
);

const QuickActionsSection = ({ navigateTo }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="mt-8"
  >
    <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#030f0f] to-[#03624c] bg-clip-text text-transparent">
      Quick Actions
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: "Add Candidate", description: "Add a new candidate to the system", icon: "👤", path: "/hr/add-candidate", color: "#00df82" },
        { title: "Schedule Interview", description: "Schedule a new interview", icon: "🗓️", path: "/hr/schedule-interview", color: "#03624c" },
        { title: "Generate Reports", description: "Create detailed analytics reports", icon: "📈", path: "/reports", color: "#030f0f" },
      ].map((action, index) => (
        <ActionCard key={action.title} {...action} index={index} navigateTo={navigateTo} />
      ))}
    </div>
  </motion.div>
);

const ActionCard = ({ title, description, icon, path, color, index, navigateTo }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.8 }}
      whileHover={{
        scale: 1.05,
        y: -5
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigateTo(path)}
      className={`p-6 bg-[${color}] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left`}
    >
      <div className="flex items-center mb-3">
        <motion.span
          whileHover={{ scale: 1.2, rotate: 5 }}
          className="text-3xl mr-3"
        >
          {icon}
        </motion.span>
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
      <p className="text-sm opacity-90">{description}</p>
      <motion.div
        whileHover={{ x: 5 }}
        className="flex items-center mt-4 text-sm font-medium"
      >
        Get started
        <span className="ml-2">→</span>
      </motion.div>
    </motion.button>
  );
};

export default HRDashboard;
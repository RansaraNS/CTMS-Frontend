/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RescheduleInterview = () => {
  const { id } = useParams(); // interview id
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
      setInterviewDate(data.interview.interviewDate.slice(0, 16)); // datetime-local
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

  const navigateTo = (path) => {
    navigate(path);
  };

  // Validate date restrictions
  const isValidDate = (dateStr) => {
    const selectedDate = new Date(dateStr);
    const now = new Date();

    // Cannot select past date/time
    if (selectedDate < now) {
      setError("Cannot select past date/time.");
      return false;
    }

    // Cannot select weekends
    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      setError("Interviews cannot be scheduled on weekends.");
      return false;
    }

    // Business hours: 9 AM to 6 PM
    const hours = selectedDate.getHours();
    if (hours < 9 || hours >= 18) {
      setError("Interview time must be between 09:00 and 18:00.");
      return false;
    }

    return true;
  };

  // Validate meeting link (optional)
  const isValidURL = (url) => {
    if (!url) return true; // optional
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82]"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
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
      className="flex min-h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82]"
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
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

        {/* Sidebar + Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
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
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <span className="mr-3 text-xl">🏠</span> 
                <span className="font-semibold">HR Dashboard</span>
              </motion.button>
              
              {[{ path: "/hr/add-candidate", icon: "👤", label: "Add Candidate" },
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
                  className={`flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 ${
                    item.path === "/interviews" 
                      ? "bg-gradient-to-r from-[#03624c] to-[#030f0f]" 
                      : "hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* <div className="flex justify-between items-center">
                <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold bg-gradient-to-r from-[#03624c] to-[#030f0f] bg-clip-text text-transparent">
                  Reschedule Interview
                </motion.h2>
              </div> */}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-[#00df82]/20">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
                    >
                      ❌ {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl"
                    >
                      ✅ {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Candidate:</label>
                    <p className="text-gray-700">{interview.candidate.firstName} {interview.candidate.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Position:</label>
                    <p className="text-gray-700">{interview.candidate.position}</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Interview Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00df82] shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Meeting Link (optional)</label>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://zoom.us/..."
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00df82] shadow-sm"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 20px rgba(0, 223, 130, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white py-4 rounded-xl hover:from-[#00df82] hover:to-[#03624c] focus:ring-4 focus:ring-[#00df82]/50 transition duration-200 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                    ) : (
                      '🗓️ Reschedule Interview'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RescheduleInterview;
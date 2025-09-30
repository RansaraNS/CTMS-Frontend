/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUserPlus, FiUsers, FiEye, FiLogOut, FiUser } from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [latestHrs, setLatestHrs] = useState([]);

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
    };
    fetchLatestHrs();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82] font-sans overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full">
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
              Candidate Tracking System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#03624c] px-4 py-2 rounded-full shadow-lg"
            >
              <span className="font-medium">Welcome, Admin</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 shadow-lg font-medium flex items-center justify-center"
            >
              <FiLogOut className="mr-2" /> Logout
            </motion.button>
          </div>
        </motion.nav>

        {/* Sidebar and Main Content */}
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
                onClick={() => navigateTo('/admin/dashboard')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 bg-gradient-to-r from-[#03624c] to-[#030f0f]"
              >
                <FiHome className="mr-3 text-lg" /> Dashboard
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/create-hr')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)]"
              >
                <FiUserPlus className="mr-3 text-lg" /> Create HR
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/manage-hr')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)]"
              >
                <FiUsers className="mr-3 text-lg" /> Manage HR
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/view-interviews')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)]"
              >
                <FiEye className="mr-3 text-lg" /> View Interviews
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/manage-candidate')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)]"
              >
                <FiUsers className="mr-3 text-lg" /> Manage Candidates
              </motion.button>
            </nav>
          </motion.div>

          {/* Main Panel */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-10">
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl font-bold text-white text-center bg-gradient-to-r from-[#03624c] to-[#00df82] bg-clip-text text-transparent"
              >
                Admin Dashboard
              </motion.h2>
              

              {/* Recent HR Section */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-semibold text-white">Recent HR Personnel</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/manage-hr')}
                    className="bg-gradient-to-r from-[#00df82] to-[#03624c] text-white px-6 py-3 rounded-xl shadow-md font-semibold hover:opacity-90"
                  >
                    View All HRs
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {latestHrs.length > 0 ? (
                      latestHrs.map((hr) => (
                        <motion.div
                          key={hr._id}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={itemVariants}
                          whileHover={{ scale: 1.03, y: -4 }}
                          className="bg-white/90 p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-start gap-2"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-[#00df82]/20 rounded-full flex items-center justify-center">
                              <FiUser className="text-[#03624c] text-xl" />
                            </div>
                            <p className="text-gray-800 font-semibold text-lg">{hr.name}</p>
                          </div>
                          <p className="text-gray-600 text-sm">📧 {hr.email}</p>
                          <p className="text-gray-600 text-sm">👔 Role: {hr.role}</p>
                        </motion.div>
                      ))
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-200 text-center col-span-full text-lg"
                      >
                        No recent HR data available.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Quick Actions Section */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-white/20 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30"
              >
                <h3 className="text-2xl font-semibold text-white mb-8">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/create-hr')}
                    className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white font-bold py-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg"
                  >
                    <FiUserPlus className="text-2xl" /> Add New HR
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/view-interviews')}
                    className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white font-bold py-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg"
                  >
                    <FiEye className="text-2xl" /> View All Interviews
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

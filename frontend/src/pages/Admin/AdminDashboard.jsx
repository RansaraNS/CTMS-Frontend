import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUserPlus, FiUsers, FiEye, FiLogOut } from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [latestHrs, setLatestHrs] = useState([]);
  const currentDate = new Date('2025-09-26T05:29:00+05:30').toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    hour12: true,
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

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 font-sans overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-teal-800 to-blue-900 text-white p-6 flex justify-between items-center shadow-lg backdrop-blur-md">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-6 bg-gradient-to-r text-white bg-clip-text text-transparent">Candidate Tracking System</h1>
            
          </div>
          <div className="flex items-center">
            <span className="mr-6 text-md font-medium">Welcome, Admin</span>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#1e40af' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center bg-blue-800 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
            >
              <FiLogOut className="mr-2" /> Logout
            </motion.button>
          </div>
        </nav>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 256 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 text-white h-full shadow-lg min-w-[256px]"
          >
            <nav className="flex flex-col h-full p-6">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/admin/dashboard')}
                className="flex items-center p-3 mb-4 bg-blue-600/80 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-md"
              >
                <FiHome className="mr-3 text-lg" /> Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/admin/create-hr')}
                className="flex items-center p-3 mb-4 bg-gray-700/80 text-white rounded-xl hover:bg-gray-600 transition duration-200 shadow-md"
              >
                <FiUserPlus className="mr-3 text-lg" /> Create HR
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/admin/manage-hr')}
                className="flex items-center p-3 mb-4 bg-gray-700/80 text-white rounded-xl hover:bg-gray-600 transition duration-200 shadow-md"
              >
                <FiUsers className="mr-3 text-lg" /> Manage HR
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/admin/view-interviews')}
                className="flex items-center p-3 mb-4 bg-gray-700/80 text-white rounded-xl hover:bg-gray-600 transition duration-200 shadow-md"
              >
                <FiEye className="mr-3 text-lg" /> View Interviews
              </motion.button>
            </nav>
          </motion.div>

          <div className="flex-1 p-10 overflow-auto">
            <div className="space-y-10">
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-bold text-gray-800 text-center bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
              >
                Admin Dashboard
              </motion.h2>

              {/* Recent HR Section */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800">Recent HR Personnel</h3>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#14b8a6' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/manage-hr')}
                    className="bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition duration-300 font-semibold"
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
                          className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:bg-teal-50/50 transition duration-300 shadow-md"
                        >
                          <p className="text-gray-700 font-medium text-lg">Name: {hr.name}</p>
                          <p className="text-gray-600 text-md">Email: {hr.email}</p>
                          <p className="text-gray-600 text-md">Role: {hr.role}</p>
                        </motion.div>
                      ))
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500 text-center col-span-full text-lg"
                      >
                        No recent HR data available.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <hr className="my-8 border-t border-gray-300" />
              </motion.div>

              {/* Quick Actions Section */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-8">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(20, 184, 166, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/create-hr')}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-5 rounded-xl hover:from-teal-700 hover:to-blue-700 transition duration-300 flex items-center justify-center text-lg"
                  >
                    <FiUserPlus className="mr-3" /> Add New HR
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(20, 184, 166, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/view-interviews')}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-5 rounded-xl hover:from-teal-700 hover:to-blue-700 transition duration-300 flex items-center justify-center text-lg"
                  >
                    <FiEye className="mr-3" /> View All Interviews
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
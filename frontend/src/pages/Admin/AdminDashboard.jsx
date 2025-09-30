/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUserPlus, FiUsers, FiEye, FiLogOut } from 'react-icons/fi';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [latestHrs, setLatestHrs] = useState([]);
  const currentDate = new Date('2025-09-26T22:18:00+0530').toLocaleString('en-US', {
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
         <AdminSidebar/>

          <div className="flex-1 p-6 overflow-auto">
            <div className="space-y-10">
             

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
                    whileHover={{ scale: 1.05, backgroundColor: '#00df82' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/manage-hr')}
                    className="bg-[#03624c] text-white px-6 py-3 rounded-xl hover:bg-[#00df82] transition duration-300 font-semibold"
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
                          className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:bg-[#00df82]/50 transition duration-300 shadow-md"
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
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 223, 130, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/create-hr')}
                    className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white font-bold py-5 rounded-xl hover:from-[#00df82] hover:to-[#03624c] transition duration-300 flex items-center justify-center text-lg"
                  >
                    <FiUserPlus className="mr-3" /> Add New HR
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0, 223, 130, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/admin/view-interviews')}
                    className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white font-bold py-5 rounded-xl hover:from-[#00df82] hover:to-[#03624c] transition duration-300 flex items-center justify-center text-lg"
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
/* eslint-disable no-unused-vars */
 
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUserPlus, FiUsers, FiEye } from 'react-icons/fi';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const navigateTo = (path) => {
    navigate(path);
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: <FiHome className="text-lg" />, label: "Dashboard" },
    { path: "/admin/create-hr", icon: <FiUserPlus className="text-lg" />, label: "Create HR" },
    { path: "/admin/manage-hr", icon: <FiUsers className="text-lg" />, label: "Manage HR" },
    { path: "/admin/view-interviews", icon: <FiEye className="text-lg" />, label: "View Interviews" },
    { path: "/admin/manage-candidate", icon: <FiUsers className="text-lg" />, label: "Manage Candidate" },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-64 bg-gradient-to-b from-[#030f0f] to-[#03624c] text-white h-full shadow-2xl"
    >
      <nav className="flex flex-col h-full py-6">
  
     

        {/* Navigation Items */}
        <div className="flex-1">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                x: 10, 
                backgroundColor: "rgba(0,223,130,0.1)",
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo(item.path)}
              className={`flex items-center  w-[245px] p-4 mx-2 rounded-lg mb-1 transition-all duration-200 ${
                isActivePath(item.path)
                  ? "bg-gradient-to-r from-[#03624c] to-[#030f0f] shadow-lg"
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <span className={`mr-3 ${
                isActivePath(item.path) ? "text-[#00df82]" : "text-gray-300"
              }`}>
                {item.icon}
              </span>
              <span className={`font-medium ${
                isActivePath(item.path) ? "text-white font-semibold" : "text-gray-300"
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator dot */}
              {isActivePath(item.path) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-2 h-2 bg-[#00df82] rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-4 pt-4 border-t border-gray-700"
        >
          <div className="text-center text-xs text-gray-400">
            <p>Admin Panel</p>
            <p>Candidate Tracking System</p>
          </div>
        </motion.div>
      </nav>
    </motion.div>
  );
};

export default AdminSidebar;
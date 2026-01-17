/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, UserPlus, Users, Eye, Briefcase } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const navigateTo = (path) => {
    navigate(path);
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { path: "/admin/create-hr", icon: UserPlus, label: "Create HR" },
    { path: "/admin/manage-hr", icon: Users, label: "Manage HR" },
    { path: "/admin/view-interviews", icon: Eye, label: "View Interviews" },
    { path: "/admin/manage-candidate", icon: Users, label: "Manage Candidate" },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-[#050C9C] text-white h-screen flex flex-col shadow-xl">
      {/* Header */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div>
            <img
                src="/GRW.png"
                alt="Company Logo"
                className="w-15 h-15 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">CTMS Admin</h1>
            <p className="text-xs text-white/60">Management Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] shadow-lg shadow-[#3572EF]/30"
                    : "hover:bg-white/5 active:bg-white/10"
                }`}
              >
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-white" : "text-white/60 group-hover:text-white/80"
                  }`}
                />
                <span className={`font-medium transition-colors ${
                  isActive ? "text-white" : "text-white/70 group-hover:text-white/90"
                }`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs font-medium text-white/60">Developed by</p>
          <p className="text-xs text-white/40 mt-1">GR IT Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
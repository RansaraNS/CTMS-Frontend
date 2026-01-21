/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, UserPlus, Calendar, History, Eye, Briefcase, FileText } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const navigateTo = (path) => {
    navigate(path);
  };

  const menuItems = [
    { path: "/hr/dashboard", icon: Home, label: "HR Dashboard" },
    { path: "/hr/add-candidate", icon: UserPlus, label: "Add Candidate" },
    { path: "/hr/schedule-interview", icon: Calendar, label: "Schedule Interview" },
    { path: "/interviews", icon: History, label: "Manage Interviews" },
    { path: "/candidates", icon: Eye, label: "View Candidates" },
    { path: "/hr/reports", icon: FileText, label: "Reports" },
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
            <h1 className="text-lg font-semibold text-white">CTMS HR</h1>
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
          <p className="text-xs font-medium text-white/60">Powered by GR IT Solutions.</p>
          <p className="text-xs text-white/40 mt-1">
           © {new Date().getFullYear()} Gamage Recruiters. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
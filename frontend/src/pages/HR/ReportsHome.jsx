/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import GenerateInterviewsReport from "./GenerateInterviewsReports";
import GenerateCandidatesReport from "./GenerateCandidatesReports";
import { 
  LogOut, User, FileText, Users, Calendar, 
  BarChart3, Download, TrendingUp
} from 'lucide-react';

const ReportsHome = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("interviews");

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#A7E6FF]">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-xl font-semibold text-[#050C9C]">Reports Dashboard</h1>
                            <p className="text-sm text-gray-600">Generate and download comprehensive reports</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-[#050C9C]">Welcome, {user?.name || "HR"}</span>
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

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Main Report Card */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200 bg-gray-50">
                                <nav className="flex" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab("interviews")}
                                        className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-200 relative ${
                                            activeTab === "interviews"
                                                ? "text-[#050C9C] bg-white"
                                                : "text-gray-600 hover:text-[#3572EF] hover:bg-gray-100"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Interviews Report
                                        </div>
                                        {activeTab === "interviews" && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9]"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("candidates")}
                                        className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-200 relative ${
                                            activeTab === "candidates"
                                                ? "text-[#050C9C] bg-white"
                                                : "text-gray-600 hover:text-[#3572EF] hover:bg-gray-100"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Candidates Report
                                        </div>
                                        {activeTab === "candidates" && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9]"></div>
                                        )}
                                    </button>
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {/* Report Content */}
                                <div className="min-h-[400px]">
                                    {activeTab === "interviews" && <GenerateInterviewsReport />}
                                    {activeTab === "candidates" && <GenerateCandidatesReport />}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ReportsHome;
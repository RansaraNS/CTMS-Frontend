/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import GenerateInterviewsReport from "./GenerateInterviewsReports";
import GenerateCandidatesReport from "./GenerateCandidatesReports";


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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
        >
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Enhanced Navbar */}
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

                {/* Sidebar + Main Content */}
                <div className="flex flex-1">
                    {/* Enhanced Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <div className="flex-1 p-6 overflow-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl border border-gray-200 min-h-full"
                        >
                            {/* Reports Header */}
                            <div className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white p-6 rounded-t-2xl">
                                <motion.h2
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl font-bold text-center mb-2"
                                >
                                    Reports Dashboard
                                </motion.h2>
                                <p className="text-center text-gray-200">
                                    Generate and download comprehensive reports
                                </p>
                            </div>

                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab("interviews")}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                            activeTab === "interviews"
                                                ? "border-[#00df82] text-[#03624c]"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Interviews Report
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("candidates")}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                            activeTab === "candidates"
                                                ? "border-[#00df82] text-[#03624c]"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        Candidates Report
                                    </button>
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === "interviews" && <GenerateInterviewsReport />}
                                {activeTab === "candidates" && <GenerateCandidatesReport />}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportsHome;
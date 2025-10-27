/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const GenerateInterviewsReport = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:5000/api/report/interviews/report", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.data.success) {
                    setInterviews(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching interviews", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    // ✅ PDF Download
    const downloadPDF = () => {
        window.open("http://localhost:5000/api/report/interviews/pdf", "_blank");
    };

    // ✅ Excel Download
    const downloadExcel = () => {
        window.open("http://localhost:5000/api/report/interviews/excel", "_blank");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03624c]"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                <h3 className="text-2xl font-bold text-gray-800">Interviews Report</h3>
                
                {/* Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadPDF}
                        className="bg-[#03624c] text-white px-4 py-2 rounded-lg hover:bg-[#024c3a] transition duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                        <span>📄</span>
                        <span>Download PDF</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadExcel}
                        className="bg-[#00df82] text-gray-800 px-4 py-2 rounded-lg hover:bg-[#00c46b] transition duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                        <span>📊</span>
                        <span>Download Excel</span>
                    </motion.button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden w-full">
                <div className="w-full overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Candidate</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Interview Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Interviewer</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {interviews.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-4xl mb-2">📊</span>
                                            <p className="text-lg">No interviews found</p>
                                            <p className="text-sm text-gray-400">No interview data available for reporting</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                interviews.map((iData, index) => (
                                    <tr 
                                        key={index}
                                        className="hover:bg-gray-50 transition duration-150"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{iData.no}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[120px] truncate">
                                            {iData.candidateName}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-[150px] truncate">
                                            {iData.email}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {iData.phone}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-[150px]">
                                            {iData.interviewDate !== "N/A"
                                                ? new Date(iData.interviewDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                iData.interviewType === 'technical' 
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : iData.interviewType === 'First Round'
                                                    ? 'bg-green-100 text-green-800'
                                                    : iData.interviewType === 'Second Round'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {iData.interviewType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                iData.status === 'scheduled' 
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : iData.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : iData.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {iData.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-[120px] truncate">
                                            {iData.interviewer || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

      
        </div>
    );
};

export default GenerateInterviewsReport;
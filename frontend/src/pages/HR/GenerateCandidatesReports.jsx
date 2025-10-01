/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const GenerateCandidatesReport = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:5000/api/report/candidates/report", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.data.success) {
                    setCandidates(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching candidates", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    // ✅ PDF Download
    const downloadPDF = () => {
        window.open("http://localhost:5000/api/report/candidates/pdf", "_blank");
    };

    // ✅ Excel Download
    const downloadExcel = () => {
        window.open("http://localhost:5000/api/report/candidates/excel", "_blank");
    };

    // ✅ Add this function above the return()
    const downloadInterviewReport = (candidateId) => {
        window.open(`http://localhost:5000/api/report/candidate/${candidateId}`, "_blank");
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03624c]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Candidates Report</h3>
                
                {/* Download Buttons */}
                <div className="flex space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadPDF}
                        className="bg-[#03624c] text-white px-6 py-2 rounded-lg hover:bg-[#024c3a] transition duration-200 flex items-center space-x-2"
                    >
                        <span>📄</span>
                        <span>Download PDF</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadExcel}
                        className="bg-[#00df82] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#00c46b] transition duration-200 flex items-center space-x-2"
                    >
                        <span>📊</span>
                        <span>Download Excel</span>
                    </motion.button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Interview Report
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {candidates.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-4xl mb-2">👥</span>
                                            <p className="text-lg">No candidates found</p>
                                            <p className="text-sm text-gray-400">No candidate data available for reporting</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                candidates.map((c, index) => (
                                    <tr 
                                        key={c._id}
                                        className="hover:bg-gray-50 transition duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {c.firstName} {c.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.email || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.phone || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.position || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                c.status === 'new' 
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : c.status === 'scheduled'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : c.status === 'interviewed'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : c.status === 'hired'
                                                    ? 'bg-green-100 text-green-800'
                                                    : c.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {c.status || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.source || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => downloadInterviewReport(c._id)}
                                                className="bg-[#03624c] text-white px-4 py-2 rounded-lg hover:bg-[#024c3a] transition duration-200 text-sm"
                                            >
                                                Download
                                            </motion.button>
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

export default GenerateCandidatesReport;
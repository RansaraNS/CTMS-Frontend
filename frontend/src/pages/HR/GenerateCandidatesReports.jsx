import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Download, FileText, FileSpreadsheet, Users, 
  Mail, Phone, Briefcase, CheckCircle, XCircle,
  Clock, AlertCircle, UserPlus
} from "lucide-react";

const GenerateCandidatesReport = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:5000/api/report/candidates/report", {
                    headers: { 'Authorization': `Bearer ${token}` }
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

    const downloadPDF = () => {
        window.open("http://localhost:5000/api/report/candidates/pdf", "_blank");
    };

    const downloadExcel = () => {
        window.open("http://localhost:5000/api/report/candidates/excel", "_blank");
    };

    const downloadInterviewReport = (candidateId) => {
        window.open(`http://localhost:5000/api/report/candidate/${candidateId}`, "_blank");
    };

    const getStatusBadge = (status) => {
        const config = {
            new: { color: 'bg-gray-100 text-gray-800', icon: <UserPlus className="w-3 h-3" />, label: 'New' },
            contacted: { color: 'bg-blue-100 text-blue-800', icon: <Mail className="w-3 h-3" />, label: 'Contacted' },
            scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" />, label: 'Scheduled' },
            interviewed: { color: 'bg-purple-100 text-purple-800', icon: <Users className="w-3 h-3" />, label: 'Interviewed' },
            hired: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" />, label: 'Hired' },
            rejected: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" />, label: 'Rejected' }
        }[status] || { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-3 h-3" />, label: status };
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color} shadow-sm`}>
                {config.icon} {config.label}
            </span>
        );
    };

    if (loading) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Animated container with pulsing effect */}
            <div className="relative mb-6">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 w-32 h-32 border-4 border-[#3572EF] border-t-transparent rounded-full animate-spin mx-auto"></div>
              
              {/* Middle rotating ring - slower */}
              <div className="absolute inset-0 w-32 h-32 border-4 border-[#3ABEF9] border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDuration: '1.5s' }}></div>
              
              {/* Inner glow effect */}
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-[#3572EF]/20 to-[#3ABEF9]/20 rounded-full animate-pulse mx-auto"></div>
              
              {/* Company Logo */}
              <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
                <img 
                  src="/GRW.png" 
                  alt="Gamage Recruiters" 
                  className="w-20 h-20 object-contain animate-pulse"
                  style={{ animationDuration: '2s' }}
                />
              </div>
            </div>
            
            {/* Loading text with animated dots */}
            <p className="text-[#050C9C] font-semibold text-lg mb-2">
              Loading Candidat Details
              <span className="inline-flex ml-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </span>
            </p>
            
            {/* Subtitle */}
            <p className="text-[#3572EF] text-sm font-medium">
              Please wait while we prepare your data
            </p>
          </div>
        </div>
    );
  }

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-[#050C9C] flex items-center gap-3">
                        <FileText className="w-7 h-7" />
                        Candidates Report
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Generate and download comprehensive candidate reports
                    </p>
                </div>

                {/* Download Buttons */}
                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadPDF}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                    >
                        <FileText className="w-4 h-4" />
                        <span>Download PDF</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadExcel}
                        className="flex items-center gap-2 bg-white border-2 border-[#3572EF] text-[#3572EF] px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Download Excel</span>
                    </motion.button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: "Total Candidates", value: candidates.length, icon: Users, color: "from-[#050C9C] to-[#3572EF]" },
                    { title: "Hired", value: candidates.filter(c => c.status === 'hired').length, icon: CheckCircle, color: "from-green-500 to-green-600" },
                    { title: "Interviewed", value: candidates.filter(c => c.status === 'interviewed').length, icon: Clock, color: "from-purple-500 to-purple-600" },
                    { title: "Rejected", value: candidates.filter(c => c.status === 'rejected').length, icon: XCircle, color: "from-red-500 to-red-600" }
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-5 shadow-md border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-[#050C9C]">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {candidates.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#050C9C] mb-2">No Candidates Found</h3>
                        <p className="text-gray-600">No candidate data available for reporting</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-[#050C9C] to-[#3572EF]">
                                <tr>
                                    {[
                                        { label: "Name", icon: <Users className="w-4 h-4" /> },
                                        { label: "Email", icon: <Mail className="w-4 h-4" /> },
                                        { label: "Phone", icon: <Phone className="w-4 h-4" /> },
                                        { label: "Position", icon: <Briefcase className="w-4 h-4" /> },
                                        { label: "Status", icon: <CheckCircle className="w-4 h-4" /> },
                                        { label: "Source", icon: null },
                                    ].map((header, idx) => (
                                        <th key={idx} className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                {header.icon}
                                                {header.label}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {candidates.map((c, index) => (
                                    <motion.tr
                                        key={c._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {c.firstName} {c.lastName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-[#3572EF]" />
                                                {c.email || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-[#3572EF]" />
                                                {c.phone || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-[#050C9C]">
                                                {c.position || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(c.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {c.source || "N/A"}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateCandidatesReport;
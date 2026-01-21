import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Download, FileText, FileSpreadsheet, Calendar, 
  Mail, Phone, Briefcase, CheckCircle, XCircle,
  Clock, AlertCircle, Users, Video
} from "lucide-react";

const GenerateInterviewsReport = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:5000/api/report/interviews/report", {
                    headers: { 'Authorization': `Bearer ${token}` }
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

    const downloadPDF = () => {
        window.open("http://localhost:5000/api/report/interviews/pdf", "_blank");
    };

    const downloadExcel = () => {
        window.open("http://localhost:5000/api/report/interviews/excel", "_blank");
    };

    const getStatusBadge = (status) => {
        const config = {
            scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" />, label: 'Scheduled' },
            completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" />, label: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" />, label: 'Cancelled' },
            'no-show': { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="w-3 h-3" />, label: 'No Show' }
        }[status] || { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-3 h-3" />, label: status };
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color} shadow-sm`}>
                {config.icon} {config.label}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const config = {
            technical: { color: 'bg-blue-100 text-blue-800', icon: <Briefcase className="w-3 h-3" /> },
            'First Round': { color: 'bg-green-100 text-green-800', icon: <Users className="w-3 h-3" /> },
            'Second Round': { color: 'bg-purple-100 text-purple-800', icon: <Users className="w-3 h-3" /> },
            behavioral: { color: 'bg-indigo-100 text-indigo-800', icon: <Users className="w-3 h-3" /> },
            final: { color: 'bg-pink-100 text-pink-800', icon: <Video className="w-3 h-3" /> }
        }[type] || { color: 'bg-gray-100 text-gray-800', icon: <Briefcase className="w-3 h-3" /> };
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color} shadow-sm`}>
                {config.icon} {type}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 w-16 h-16 border-4 border-[#3572EF] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-[#3ABEF9] border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-[#050C9C] font-medium">Loading report data...</p>
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
                        <Calendar className="w-7 h-7" />
                        Interviews Report
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Generate and download comprehensive interview reports
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
                    { title: "Total Interviews", value: interviews.length, icon: Calendar, color: "from-[#050C9C] to-[#3572EF]" },
                    { title: "Scheduled", value: interviews.filter(i => i.status === 'scheduled').length, icon: Clock, color: "from-yellow-500 to-yellow-600" },
                    { title: "Completed", value: interviews.filter(i => i.status === 'completed').length, icon: CheckCircle, color: "from-green-500 to-green-600" },
                    { title: "Cancelled", value: interviews.filter(i => i.status === 'cancelled').length, icon: XCircle, color: "from-red-500 to-red-600" }
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
                {interviews.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#050C9C] mb-2">No Interviews Found</h3>
                        <p className="text-gray-600">No interview data available for reporting</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-[#050C9C] to-[#3572EF]">
                                <tr>
                                    {[
                                        { label: "Candidate", icon: <Users className="w-4 h-4" /> },
                                        { label: "Email", icon: <Mail className="w-4 h-4" /> },
                                        { label: "Phone", icon: <Phone className="w-4 h-4" /> },
                                        { label: "Interview Date", icon: <Calendar className="w-4 h-4" /> },
                                        { label: "Type", icon: <Briefcase className="w-4 h-4" /> },
                                        { label: "Status", icon: <CheckCircle className="w-4 h-4" /> },
                                        { label: "Interviewer", icon: <Users className="w-4 h-4" /> }
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
                                {interviews.map((iData, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {iData.candidateName || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 max-w-[200px] truncate">
                                                <Mail className="w-4 h-4 text-[#3572EF] flex-shrink-0" />
                                                <span className="truncate">{iData.email || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-[#3572EF]" />
                                                {iData.phone || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-[#050C9C] font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {iData.interviewDate !== "N/A"
                                                    ? new Date(iData.interviewDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getTypeBadge(iData.interviewType)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(iData.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-[#3572EF]" />
                                                <span className="max-w-[150px] truncate">{iData.interviewer || "N/A"}</span>
                                            </div>
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

export default GenerateInterviewsReport;
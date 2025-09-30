import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUserPlus, FiUsers, FiEye, FiLogOut, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CandidateReportAdmin = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoBase64, setLogoBase64] = useState('');

  useEffect(() => {
    // Get candidates from localStorage
    const storedCandidates = localStorage.getItem('reportCandidates');
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    }
    
    // Convert logo to base64
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      setLogoBase64(dataURL);
    };
    img.src = '/GR.jpg';
    
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    const time = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return { date, time };
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const { date, time } = getCurrentDateTime();

    // Add logo if available
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 15, 10, 20, 20);
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    // Add company name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Gamage Recruiters', 40, 20);
    
    // Add subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Candidate Report', 40, 28);

    // Add date and time on the right (stacked vertically)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${date}`, 235, 18);
    doc.text(`Time: ${time}`, 235, 24);

    // Add horizontal line
    doc.setDrawColor(3, 98, 76);
    doc.setLineWidth(0.5);
    doc.line(15, 35, 282, 35);

    // Prepare table data
    const tableData = candidates.map((candidate, index) => [
      index + 1,
      `${candidate.firstName} ${candidate.lastName}`,
      candidate.email,
      candidate.phone || 'N/A',
      candidate.position,
      candidate.status,
      candidate.source || 'N/A'
    ]);

    // Calculate exact column widths to fit page without extra space
    const pageWidth = doc.internal.pageSize.width;
    const leftMargin = 15;
    const rightMargin = 15;
    const availableWidth = pageWidth - leftMargin - rightMargin;

    // Add table with updated styling - no extra spacing
    autoTable(doc, {
      startY: 40,
      head: [['No', 'Name', 'Email', 'Phone Number', 'Position', 'Status', 'Source']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [3, 98, 76],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 10,
        cellPadding: 4
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 9,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 35, halign: 'left' },
        2: { cellWidth: 58, halign: 'left' },
        3: { cellWidth: 35, halign: 'left' },
        4: { cellWidth: 50, halign: 'left' },
        5: { cellWidth: 28, halign: 'center' },
        6: { cellWidth: 31, halign: 'center' }
      },
      margin: { left: 15, right: 15 },
      tableLineColor: [200, 200, 200],
      tableLineWidth: 0.1,
      tableWidth: 'auto'
    });

    // Save the PDF
    const fileName = `Candidate-Report-${date.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
          }}
          className="rounded-full h-16 w-16 border-4 border-[#00df82] border-t-transparent"
        ></motion.div>
      </motion.div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#03624c] via-[#030f0f] to-[#00df82] font-sans overflow-hidden">
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
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-64 bg-gradient-to-b from-[#030f0f] to-[#03624c] text-white h-full shadow-2xl"
          >
            <nav className="flex flex-col h-full py-6">
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/dashboard')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiHome className="mr-3 text-lg" /> Dashboard
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/create-hr')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiUserPlus className="mr-3 text-lg" /> Create HR
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/manage-hr')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiUsers className="mr-3 text-lg" /> Manage HR
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/view-interviews')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 hover:bg-[rgba(0,223,130,0.1)] hover:bg-opacity-10"
              >
                <FiEye className="mr-3 text-lg" /> View Interviews
              </motion.button>
              <motion.button
                whileHover={{ x: 10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('/admin/manage-candidate')}
                className="flex items-center p-4 mx-2 rounded-lg mb-1 transition-all duration-200 bg-gradient-to-r from-[#03624c] to-[#030f0f]"
              >
                <FiUsers className="mr-3 text-lg" /> Manage Candidates
              </motion.button>
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header with Download Button */}
              <div className="flex justify-between items-center">
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('frontend/src/App.jsx')} className="bg-[#0d4d3d] text-white px-6 py-3 rounded-xl hover:bg-[#1a6b54] focus:ring-2 focus:ring-[#5dd4a8]/50 transition duration-200">
                  ← Back to Candidates
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadPDF}
                  className="bg-[#00df82] text-[#030f0f] px-6 py-3 rounded-xl font-bold hover:bg-white transition duration-200 shadow-lg flex items-center"
                >
                  <FiDownload className="mr-2" /> Download PDF
                </motion.button>
              </div>

              {/* Summary Statistics */}
             <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.2 }}
                             className="grid grid-cols-1 md:grid-cols-4 gap-6"
                           >
                             {[
                               { title: "Total Candidates", value: candidates.length, color: "#03624c", icon: "👥" },
                               { title: "Interviewed", value: candidates.filter(c => c.status === 'interviewed').length, color: "#030f0f", icon: "📅" },
                               { title: "Hired", value: candidates.filter(c => c.status === 'hired').length, color: "#00df82", icon: "✅" },
                               { title: "Rejected", value: candidates.filter(c => c.status === 'rejected').length, color: "red", icon: "❌" },
                                { title: "Scheduled", value: candidates.filter(c => c.status === 'scheduled').length, color: "#095555ff", icon: "📅" },
                                             { title: "New", value: candidates.filter(c => c.status === 'new').length, color: "#6e8511ff", icon: "👥" },
                             ].map((stat, index) => (
                               <motion.div
                                 key={stat.title}
                                 initial={{ opacity: 0, y: 50 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ delay: index * 0.1 + 0.3 }}
                                 whileHover={{
                                   scale: 1.05,
                                   y: -5,
                                   transition: { type: "spring", stiffness: 300 }
                                 }}
                                 className={`bg-gradient-to-br from-[${stat.color}] to-[${stat.color}] text-white p-6 rounded-2xl shadow-lg cursor-pointer`}
                               >
                                 <div className="flex items-center justify-between">
                                   <div>
                                     <p className="text-sm font-medium opacity-90">{stat.title}</p>
                                     <motion.p
                                       key={stat.value}
                                       initial={{ scale: 0.5 }}
                                       animate={{ scale: 1 }}
                                       className="text-3xl font-bold"
                                     >
                                       {stat.value}
                                     </motion.p>
                                   </div>
                                   <motion.div
                                     whileHover={{ scale: 1.2, rotate: 5 }}
                                     className="text-4xl"
                                   >
                                     {stat.icon}
                                   </motion.div>
                                 </div>
                               </motion.div>
                             ))}
                           </motion.div>

              {/* Candidates Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                {candidates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-500 text-lg">No candidates to display in report.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateTo('/admin/manage-candidate')}
                      className="mt-4 bg-[#03624c] text-white px-6 py-3 rounded-xl hover:bg-[#00df82] shadow-lg"
                    >
                      Go to Manage Candidates
                    </motion.button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-[#03624c] to-[#030f0f]">
                        <tr>
                          <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                            No
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Phone Number
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Source
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {candidates.map((candidate, index) => (
                          <motion.tr
                            key={candidate._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {candidate.firstName} {candidate.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {candidate.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {candidate.phone || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {candidate.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                candidate.status === 'new' ? 'bg-gray-100 text-gray-800' :
                                candidate.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                candidate.status === 'interviewed' ? 'bg-yellow-100 text-yellow-800' :
                                candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
                                candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                candidate.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {candidate.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                              {candidate.source || 'N/A'}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateReportAdmin;
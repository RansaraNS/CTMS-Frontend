/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LogOut, User, Briefcase, Search, FileText, Edit, Trash2, X, Mail, Lock, Shield } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

const ManageHR = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [hrs, setHrs] = useState([]);
  const [selectedHr, setSelectedHr] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHrs();
  }, []);

  const fetchHrs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/hrs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const result = await response.json();
      if (response.ok) setHrs(result);
      else alert(result.message || 'Failed to fetch HRs');
    } catch (error) {
      alert('An error occurred while fetching HRs');
    }
  };

  const handleGenerateReport = () => {
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Get current date and time
      const now = new Date();
      const date = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
      const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      });
      const year = now.getFullYear();

      // Add logo if available
      try {
        const logoImg = new Image();
        logoImg.src = '/GR.jpg';
        doc.addImage(logoImg, 'JPEG', 14, 10, 20, 20);
      } catch (error) {
        console.log('Logo not loaded, continuing without logo');
      }

      // Add company name
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Gamage Recruiters (PVT) Ltd.', 37, 18);

      // Add company details
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('612A, Galle Road, Panadura, Sri Lanka. | gamagerecruiters@gmail.com', 38, 24);
      
      // Add report title
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('Human Resources Management Report', 38, 30);

      // Add summary box on the right
      const summaryX = pageWidth - 50;
      
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Report Summary', summaryX, 12);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Generated: ${date}`, summaryX, 18);
      doc.text(`Time: ${time}`, summaryX, 23);
      doc.text(`Total HR Staff: ${hrs.length}`, summaryX, 28);

      // Add decorative header lines
      doc.setDrawColor(5, 12, 156); // #050C9C
      doc.setLineWidth(1);
      doc.line(14, 36, pageWidth - 14, 36);
      
      doc.setDrawColor(58, 190, 249); // #3ABEF9
      doc.setLineWidth(0.5);
      doc.line(14, 37, pageWidth - 14, 37);

      // Calculate role distribution
      const roleCounts = hrs.reduce((acc, hr) => {
        acc[hr.role] = (acc[hr.role] || 0) + 1;
        return acc;
      }, {});

      // Add role statistics
      let statsY = 40;

      // Prepare table data with row numbers
      const tableData = hrs.map((hr, index) => [
        index + 1,
        hr.name,
        hr.email,
        hr.role
      ]);

      // Add table with enhanced styling
      autoTable(doc, {
        startY: statsY + 8,
        head: [['No', 'Full Name', 'Email Address', 'Role']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 10,
          cellPadding: 3,
          lineColor: [53, 114, 239], // #3572EF
          lineWidth: 0.5
        },
        bodyStyles: {
          textColor: [31, 41, 55],
          fontSize: 9,
          cellPadding: 4,
          lineColor: [150, 150, 150],
          lineWidth: 0.5
        },
        alternateRowStyles: {
          fillColor: [247, 250, 252]
        },
        columnStyles: {
          0: { 
            cellWidth: 15, 
            halign: 'center',
            fillColor: [167, 230, 255], // #A7E6FF
            textColor: [5, 12, 156], // #050C9C
            fontStyle: 'bold'
          },
          1: { 
            cellWidth: 55, 
            halign: 'left', 
            fontStyle: 'bold',
            textColor: [0, 0, 0]
          },
          2: { 
            cellWidth: 75, 
            halign: 'left' 
          },
          3: { 
            cellWidth: 35, 
            halign: 'center',
            fontStyle: 'bold',
            textColor: [53, 114, 239] // #3572EF
          }
        },
        margin: { left: 14, right: 14 },
      });

      // Footer decorative line
      doc.setDrawColor(58, 190, 249); // #3ABEF9
      doc.setLineWidth(0.5);
      doc.line(14, pageHeight - 25, pageWidth - 14, pageHeight - 25);

      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(
        'Generated by Candidate Tracking Management System',
        pageWidth / 2,
        pageHeight - 15,
        { align: 'center' }
      );

      // Company tagline
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `© ${year} GR IT Solutions. All rights reserved.`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Save the PDF with formatted filename
      const fileName = `HR-Report-${date.replace(/\//g, '-')}_${time.replace(/:/g, '-')}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF report. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this HR?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/hrs/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          fetchHrs();
        } else alert(result.message || 'Failed to delete HR');
      } catch (error) {
        alert('An error occurred while deleting HR');
      }
    }
  };

  const handleUpdate = (hr) => {
    setSelectedHr(hr);
    setIsModalOpen(true);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/hrs/${selectedHr._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
          name: selectedHr.name, 
          email: selectedHr.email, 
          password: selectedHr.password, 
          role: selectedHr.role 
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setIsModalOpen(false);
        fetchHrs();
      } else alert(result.message || 'Failed to update HR');
    } catch (error) {
      alert('An error occurred while updating HR');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredHrs = hrs.filter(hr =>
    hr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hr.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Manage HR Personnel</h1>
              <p className="text-sm text-gray-600">View, edit, and manage HR staff members</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-[#050C9C]">Welcome, Admin</span>
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search and Actions Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search HR by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                />
              </div>
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <FileText className="w-5 h-5" />
                Generate Report
              </button>
            </div>

            {/* HR Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#050C9C] to-[#3572EF] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Full Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredHrs.length > 0 ? (
                      filteredHrs.map((hr) => (
                        <tr key={hr._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 text-sm font-medium text-[#050C9C]">{hr.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{hr.email}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#A7E6FF] text-[#050C9C] text-xs font-medium">
                              {hr.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdate(hr)}
                                className="p-2 text-[#3572EF] hover:bg-[#3572EF]/10 rounded-lg transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(hr._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          No HR personnel found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedHr && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-[#050C9C] to-[#3572EF] px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Update HR Personnel</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#050C9C] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={selectedHr.name}
                    onChange={(e) => setSelectedHr({ ...selectedHr, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#050C9C] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={selectedHr.email}
                    onChange={(e) => setSelectedHr({ ...selectedHr, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#050C9C] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={selectedHr.password || ''}
                    onChange={(e) => setSelectedHr({ ...selectedHr, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#050C9C] mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={selectedHr.role}
                    onChange={(e) => setSelectedHr({ ...selectedHr, role: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUpdate}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHR;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, User, Briefcase, Search, Filter, FileText, RefreshCw, 
  Eye, Edit, Trash2, X, Mail, Phone, FileUser, Tag, Users, 
  Calendar, CheckCircle, XCircle, Clock, Upload 
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ManageCandidates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [logoBase64, setLogoBase64] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    source: '',
    notes: '',
    skills: ''
  });

  useEffect(() => {
    fetchCandidates();
    // Load logo for PDF
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
  }, []);
  
  const fetchCandidates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch('http://localhost:5000/api/candidates', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
     
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
     
      const data = await response.json();
      setCandidates(data.candidates || data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    filterCandidates();
  }, [searchTerm, statusFilter, candidates]);
  
  const filterCandidates = () => {
    let filtered = candidates;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate =>
        (candidate.firstName?.toLowerCase().includes(term) ||
        candidate.lastName?.toLowerCase().includes(term) ||
        candidate.email?.toLowerCase().includes(term) ||
        candidate.position?.toLowerCase().includes(term))
      );
    }
    setFilteredCandidates(filtered);
  };

  const handleUpdateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData({
      firstName: candidate.firstName || '',
      lastName: candidate.lastName || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      position: candidate.position || '',
      source: candidate.source || '',
      notes: candidate.notes || '',
      skills: candidate.skills?.join(', ') || ''
    });
    setCvFile(null);
    setUpdateError('');
    setShowUpdateModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setUpdateError('Only PDF files are allowed');
        e.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUpdateError('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      setCvFile(file);
      setUpdateError('');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (cvFile) {
        formDataToSend.append('cv', cvFile);
      }

      const response = await fetch(`http://localhost:5000/api/candidates/${selectedCandidate._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update candidate');
      }

      const data = await response.json();
      
      setCandidates(prevCandidates => 
        prevCandidates.map(c => 
          c._id === selectedCandidate._id ? data.candidate : c
        )
      );

      setShowUpdateModal(false);
      setSelectedCandidate(null);
      alert('Candidate updated successfully!');
    } catch (error) {
      console.error('Error updating candidate:', error);
      setUpdateError(error.message || 'Failed to update candidate');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-gray-100 text-gray-800', label: 'New', icon: Clock },
      contacted: { color: 'bg-blue-100 text-blue-800', label: 'Contacted', icon: Phone },
      interviewed: { color: 'bg-yellow-100 text-yellow-800', label: 'Interviewed', icon: Calendar },
      hired: { color: 'bg-green-100 text-green-800', label: 'Hired', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected', icon: XCircle },
      terminated: { color: 'bg-orange-100 text-orange-800', label: 'Terminated', icon: XCircle },
      scheduled: { color: 'bg-purple-100 text-purple-800', label: 'Scheduled', icon: Calendar }
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status, icon: Clock };
    const Icon = config.icon;
   
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
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

  const handleDownloadPDF = (candidatesData) => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const { date, time } = getCurrentDateTime();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add logo if available
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 18, 12, 20, 20);
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    // Add company name with gradient effect simulation
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // #000000
    doc.text('Gamage Recruiters (PVT) Ltd.', 44, 20);

    // Add subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // #000000
    doc.text('612A, Galle Road, Panadura, Sri Lanka. | gamagerecruiters@gmail.com', 45, 26);
    
    // Add subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // #000000
    doc.text('Candidate Management Report', 45, 32);

    // Add summary box on the right
    const summaryX = pageWidth - 50;
    
    // Summary content
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0); // #050C9C
    doc.setFont('helvetica', 'bold');
    doc.text('Report Summary', summaryX, 14);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Generated: ${date}`, summaryX, 20);
    doc.text(`Time: ${time}`, summaryX, 25);
    doc.text(`Total Records: ${candidatesData.length}`, summaryX, 30);

    // Add decorative header line with gradient effect
    doc.setDrawColor(5, 12, 156); // #050C9C
    doc.setLineWidth(1);
    doc.line(15, 38, pageWidth - 15, 38);
    
    doc.setDrawColor(58, 190, 249); // #3ABEF9
    doc.setLineWidth(0.5);
    doc.line(15, 39, pageWidth - 15, 39);

    // Add status summary statistics
    const statusCounts = candidatesData.reduce((acc, candidate) => {
      acc[candidate.status] = (acc[candidate.status] || 0) + 1;
      return acc;
    }, {});

    let statsY = 40;
    
    // Prepare table data with row numbers
    const tableData = candidatesData.map((candidate, index) => [
      index + 1,
      `${candidate.firstName} ${candidate.lastName}`,
      candidate.email,
      candidate.phone || 'N/A',
      candidate.position,
      candidate.status,
      candidate.source || 'N/A'
    ]);

    // Add table with enhanced styling
    autoTable(doc, {
      startY: statsY + 8,
      head: [['No', 'Name', 'Email', 'Phone Number', 'Position', 'Status', 'Source']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255], // #ffffff
        textColor: [0, 0, 0], // #000000
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
        1: { cellWidth: 38, halign: 'left', fontStyle: 'bold' },
        2: { cellWidth: 58, halign: 'left' },
        3: { cellWidth: 35, halign: 'left' },
        4: { 
          cellWidth: 50, 
          halign: 'left',
          textColor: [53, 114, 239] // #3572EF
        },
        5: { 
          cellWidth: 28, 
          halign: 'center',
          fontStyle: 'bold'
        },
        6: { cellWidth: 28, halign: 'center' }
      },
      margin: { left: 15, right: 15 },
    });

    // Add footer with page number and generation info
    const finalY = doc.lastAutoTable.finalY || 100;
    
    // Footer decorative line
    doc.setDrawColor(58, 190, 249); // #3ABEF9
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(
      'Generated by Candidate Tracking Management System',
      pageWidth / 2,
      pageHeight - 12,
      { align: 'center' }
    );
    const year = new Date().getFullYear();

    // Company tagline
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `© ${year} GR IT Solutions. All rights reserved.`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );

    // Save the PDF with formatted filename
    const fileName = `Candidate-Report-${date.replace(/\//g, '-')}_${time.replace(/:/g, '-')}.pdf`;
    doc.save(fileName);
  };

  const handleGenerateReport = () => {
    handleDownloadPDF(filteredCandidates);
  };
  
  const handleViewCandidate = (candidateId) => {
    navigate(`/admin/candidates/${candidateId}`);
  };
  
  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (window.confirm(`Are you sure you want to delete ${candidateName}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          setCandidates(candidates.filter(c => c._id !== candidateId));
          alert('Candidate deleted successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete candidate');
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert(error.message || 'Failed to delete candidate');
      }
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = [
    { title: "Total Candidates", value: candidates.length, icon: Users, color: "from-[#050C9C] to-[#3572EF]" },
    { title: "Interviewed", value: candidates.filter(c => c.status === 'interviewed').length, icon: Calendar, color: "from-[#3572EF] to-[#3ABEF9]" },
    { title: "Hired", value: candidates.filter(c => c.status === 'hired').length, icon: CheckCircle, color: "from-green-500 to-green-600" },
    { title: "Rejected", value: candidates.filter(c => c.status === 'rejected').length, icon: XCircle, color: "from-red-500 to-red-600" },
  ];
  
  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3572EF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#050C9C] font-medium">Loading candidates...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#050C9C] to-[#3572EF] rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Manage Candidates</h1>
              <p className="text-sm text-gray-600">View, edit, and track all candidates</p>
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
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-[#050C9C]">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search candidates by name, email, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                  />
                </div>
               
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200 appearance-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                 
                  <button
                    onClick={handleGenerateReport}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <FileText className="w-5 h-5" />
                    Generate Report
                  </button>
                  
                  <button
                    onClick={fetchCandidates}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {candidates.length === 0 ? 'No candidates found.' : 'No candidates match your search criteria.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#050C9C] to-[#3572EF] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Candidate</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Source</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Last Updated</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCandidates.map((candidate) => (
                        <tr key={candidate._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <span className="text-white font-semibold text-sm">
                                  {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-[#050C9C]">
                                  {candidate.firstName} {candidate.lastName}
                                </div>
                                <div className="text-xs text-gray-600 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {candidate.email}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {candidate.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#A7E6FF] text-[#050C9C] text-xs font-medium">
                              {candidate.position}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(candidate.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {candidate.source || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(candidate.updatedAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewCandidate(candidate._id)}
                                className="p-2 text-[#3572EF] hover:bg-[#3572EF]/10 rounded-lg transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateClick(candidate)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Update"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCandidate(candidate._id, `${candidate.firstName} ${candidate.lastName}`)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowUpdateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#050C9C] to-[#3572EF] px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-white">Update Candidate</h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {updateError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-sm text-red-800">{updateError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Source
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#050C9C] mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#050C9C] mb-2">
                  Upload New CV (PDF only)
                </label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                  />
                </div>
                {selectedCandidate?.cv && (
                  <p className="text-sm text-gray-500 mt-2">
                    Current CV: {selectedCandidate.cv.split('/').pop()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#050C9C] mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={updateLoading}
                  className="px-6 py-3 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateLoading ? 'Updating...' : 'Save Changes'}
                </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default ManageCandidates;
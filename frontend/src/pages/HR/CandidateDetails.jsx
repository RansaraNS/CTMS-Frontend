import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateDetails = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidates();
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-gray-100 text-gray-800', label: 'New' },
      contacted: { color: 'bg-blue-100 text-blue-800', label: 'Contacted' },
      interviewed: { color: 'bg-yellow-100 text-yellow-800', label: 'Interviewed' },
      hired: { color: 'bg-green-100 text-green-800', label: 'Hired' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      terminated: { color: 'bg-orange-100 text-orange-800', label: 'Terminated' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleGenerateReport = () => {
    const headers = ['Name', 'Email', 'Position', 'Status', 'Source', 'Last Updated'];
    const csvData = filteredCandidates.map(candidate => [
      `${candidate.firstName} ${candidate.lastName}`,
      candidate.email,
      candidate.position,
      candidate.status,
      candidate.source || 'N/A',
      formatDate(candidate.updatedAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewCandidate = (candidateId) => {
  navigate(`/candidates/${candidateId}`);
};

  const handleEditCandidate = (candidateId) => {
    navigate(`/hr/edit-candidate/${candidateId}`);
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

  // const handleStatusChange = async (candidateId, newStatus) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}/status`, {
  //       method: 'PUT',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ status: newStatus })
  //     });

  //     if (response.ok) {
  //       const updatedCandidate = await response.json();
  //       setCandidates(candidates.map(candidate => 
  //         candidate._id === candidateId 
  //           ? { ...candidate, ...updatedCandidate.candidate }
  //           : candidate
  //       ));
  //       alert('Status updated successfully');
  //     } else {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to update status');
  //     }
  //   } catch (error) {
  //     console.error('Error updating status:', error);
  //     alert(error.message || 'Failed to update candidate status');
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col">
          <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
            <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded">Logout</button>
          </nav>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading candidates...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <nav className="bg-teal-600 text-white p-4 flex justify-between items-center w-full">
          <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, HR</span>
          </div>
          <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded">Logout</button>
        </nav>

        <div className="flex flex-1">
          <div className="w-64 bg-gray-800 text-white h-full">
            <nav className="flex flex-col h-full">
              <button onClick={() => navigateTo('/hr/dashboard')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">🏠</span> HR Dashboard
              </button>
              <button onClick={() => navigateTo('/hr/add-candidate')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">👤</span> Add Candidate
              </button>
              <button onClick={() => navigateTo('/hr/schedule-interview')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">🗓️</span> Schedule Interview
              </button>
              <button onClick={() => navigateTo('/interviews')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">📊</span> Manage Interviews
              </button>
              <button onClick={() => navigateTo('/candidates')} className="flex items-center p-4 bg-blue-600 hover:bg-blue-600">
                <span className="mr-2">🔍</span> View Candidates
              </button>
            </nav>
          </div>

          <div className="flex-1 p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">Manage Candidates</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search candidates by name, email, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                  </div>
                  
                  <div className="flex space-x-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                      <option value="terminated">Terminated</option>
                    </select>
                    
                    <button
                      onClick={handleGenerateReport}
                      className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition duration-200"
                    >
                      Generate Report
                    </button>

                    <button
                      onClick={fetchCandidates}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition duration-200"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredCandidates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {candidates.length === 0 ? 'No candidates found.' : 'No candidates match your search criteria.'}
                    </p>
                    {candidates.length === 0 && (
                      <button 
                        onClick={() => navigateTo('/hr/add-candidate')}
                        className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                      >
                        Add Your First Candidate
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Candidate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Updated
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCandidates.map((candidate) => (
                          <tr key={candidate._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                                  <span className="text-teal-600 font-medium">
                                    {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {candidate.firstName} {candidate.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{candidate.email}</div>
                                  <div className="text-sm text-gray-400">{candidate.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{candidate.position}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(candidate.status)}
                            
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {candidate.source || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(candidate.updatedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewCandidate(candidate._id)}
                                  className="text-teal-600 hover:text-teal-900 px-2 py-1 rounded"
                                  title="View Candidate"
                                >
                                  👁️ View
                                </button>
                                <button
                                  onClick={() => handleEditCandidate(candidate._id)}
                                  className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded"
                                  title="Edit Candidate"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteCandidate(candidate._id, `${candidate.firstName} ${candidate.lastName}`)}
                                  className="text-red-600 hover:text-red-900 px-2 py-1 rounded"
                                  title="Delete Candidate"
                                >
                                  🗑️ Delete
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <div className="text-2xl font-bold text-teal-600">{candidates.length}</div>
                  <div className="text-sm text-gray-500">Total Candidates</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {candidates.filter(c => c.status === 'interviewed').length}
                  </div>
                  <div className="text-sm text-gray-500">Interviewed</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {candidates.filter(c => c.status === 'hired').length}
                  </div>
                  <div className="text-sm text-gray-500">Hired</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {candidates.filter(c => c.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-gray-500">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
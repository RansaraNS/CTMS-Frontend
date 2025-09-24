import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CandidateDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidateDetails();
  }, [id]);

  const fetchCandidateDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/candidates/${id}`, {
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
        if (response.status === 404) {
          throw new Error('Candidate not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCandidate(data.candidate);
      setInterviews(data.interviews || []);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      setError(error.message || 'Failed to load candidate details');
    } finally {
      setLoading(false);
    }
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to render feedback properly
  const renderFeedback = (feedback) => {
    if (!feedback) return null;
    
    // If feedback is a string, just display it
    if (typeof feedback === 'string') {
      return <p className="text-sm text-gray-600"><strong>Feedback:</strong> {feedback}</p>;
    }
    
    // If feedback is an object, display its properties
    if (typeof feedback === 'object') {
      return (
        <div className="mt-2">
          <p className="text-sm font-semibold text-gray-700">Interview Feedback:</p>
          {feedback.technicalSkills && (
            <p className="text-sm text-gray-600"><strong>Technical Skills:</strong> {feedback.technicalSkills}</p>
          )}
          {feedback.communication && (
            <p className="text-sm text-gray-600"><strong>Communication:</strong> {feedback.communication}</p>
          )}
          {feedback.problemSolving && (
            <p className="text-sm text-gray-600"><strong>Problem Solving:</strong> {feedback.problemSolving}</p>
          )}
          {feedback.culturalFit && (
            <p className="text-sm text-gray-600"><strong>Cultural Fit:</strong> {feedback.culturalFit}</p>
          )}
          {feedback.overallRating && (
            <p className="text-sm text-gray-600"><strong>Overall Rating:</strong> {feedback.overallRating}</p>
          )}
          {feedback.notes && (
            <p className="text-sm text-gray-600"><strong>Notes:</strong> {feedback.notes}</p>
          )}
          {feedback.outcome && (
            <p className="text-sm text-gray-600"><strong>Outcome:</strong> {feedback.outcome}</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  const handleBack = () => {
    navigate('/candidates');
  };

  const handleEdit = () => {
    navigate(`/hr/edit-candidate/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
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
              <p className="mt-4 text-gray-600">Loading candidate details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col">
          <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
            <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded">Logout</button>
          </nav>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                <button 
                  onClick={handleBack}
                  className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  Back to Candidates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col">
          <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
            <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded">Logout</button>
          </nav>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Candidate not found</p>
              <button 
                onClick={handleBack}
                className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                Back to Candidates
              </button>
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
              <div className="flex justify-between items-center">
                <button 
                  onClick={handleBack}
                  className="flex items-center text-teal-600 hover:text-teal-800"
                >
                  ← Back to Candidates
                </button>
                <button 
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit Candidate
                </button>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 font-medium text-2xl">
                          {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </h2>
                        <p className="text-gray-600">{candidate.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(candidate.status)}
                      <p className="text-sm text-gray-500 mt-1">Added on {formatDate(candidate.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{candidate.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{candidate.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Source</label>
                          <p className="text-gray-900">{candidate.source || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Experience</label>
                          <p className="text-gray-900">{candidate.experience ? `${candidate.experience} years` : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Current Company</label>
                          <p className="text-gray-900">{candidate.currentCompany || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Expected Salary</label>
                          <p className="text-gray-900">{candidate.expectedSalary || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Notice Period</label>
                          <p className="text-gray-900">{candidate.noticePeriod || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.notes && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">{candidate.notes}</p>
                    </div>
                  )}

                  {(candidate.rejectionReason || candidate.terminationReason) && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {candidate.rejectionReason ? 'Rejection Reason' : 'Termination Reason'}
                      </h3>
                      <p className="text-gray-700 bg-red-50 p-3 rounded">
                        {candidate.rejectionReason || candidate.terminationReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Interview History */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Interview History ({interviews.length})</h3>
                </div>
                <div className="px-6 py-4">
                  {interviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No interviews scheduled yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {interviews.map((interview) => (
                        <div key={interview._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{interview.interviewType}</h4>
                              <p className="text-gray-600">With {interview.interviewerName}</p>
                              <p className="text-sm text-gray-500">{formatDate(interview.interviewDate)}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                              interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {interview.status}
                            </span>
                          </div>
                          {renderFeedback(interview.feedback)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsView;
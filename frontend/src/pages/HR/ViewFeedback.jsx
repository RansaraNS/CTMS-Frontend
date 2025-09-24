/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ViewFeedback = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setInterview(data.interview);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getOutcomeBadge = (outcome) => {
    const outcomeConfig = {
      passed: { color: 'bg-green-100 text-green-800', label: 'Passed' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'recommended-next-round': { color: 'bg-purple-100 text-purple-800', label: 'Recommended for Next Round' }
    };

    const config = outcomeConfig[outcome] || { color: 'bg-gray-100 text-gray-800', label: outcome };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
            <div className="flex items-center">
              <span className="mr-4">Welcome, HR</span>
              <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded hover:bg-teal-700">
                Logout
              </button>
            </div>
          </nav>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading feedback details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview || !interview.feedback) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
            <div className="flex items-center">
              <span className="mr-4">Welcome, HR</span>
              <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded hover:bg-teal-700">
                Logout
              </button>
            </div>
          </nav>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">No feedback found for this interview.</p>
              <button 
                onClick={() => navigate('/interviews')}
                className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                Back to Interviews
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { candidate, interviewDate, interviewType, interviewers, feedback } = interview;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, HR</span>
            <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded hover:bg-teal-700">
              Logout
            </button>
          </div>
        </nav>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 text-white h-full">
            <nav className="flex flex-col h-full">
              <button 
                onClick={() => navigateTo('/hr/dashboard')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">🏠</span> HR Dashboard
              </button>
              <button 
                onClick={() => navigateTo('/hr/add-candidate')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">👤</span> Add Candidate
              </button>
              <button 
                onClick={() => navigateTo('/hr/schedule-interview')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">🗓️</span> Schedule Interview
              </button>
              <button 
                onClick={() => navigateTo('/interviews')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">📊</span> Manage Interviews
              </button>
              <button 
                onClick={() => navigateTo('/candidates')} 
                className="flex items-center p-4 hover:bg-gray-700"
              >
                <span className="mr-2">🔍</span> View Candidates
              </button>
         
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Interview Feedback - {candidate?.firstName} {candidate?.lastName}
                  </h2>
                  <button 
                    onClick={() => navigate('/interviews')}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Back to Interviews
                  </button>
                </div>

                {/* Interview Details */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">Interview Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Candidate:</strong> {candidate?.firstName} {candidate?.lastName}</p>
                      <p><strong>Position:</strong> {candidate?.position}</p>
                      <p><strong>Email:</strong> {candidate?.email}</p>
                    </div>
                    <div>
                      <p><strong>Interview Date:</strong> {new Date(interviewDate).toLocaleString()}</p>
                      <p><strong>Type:</strong> {interviewType}</p>
                      <p><strong>Interviewers:</strong> {interviewers?.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Feedback Summary */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">Feedback Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        { label: 'Technical Skills', value: feedback.technicalSkills },
                        { label: 'Communication', value: feedback.communication },
                        { label: 'Problem Solving', value: feedback.problemSolving },
                        { label: 'Cultural Fit', value: feedback.culturalFit }
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="font-medium">{item.label}:</span>
                          <div className="flex items-center">
                            <span className="mr-2">{item.value}/5</span>
                            <span className="text-yellow-400">{getRatingStars(item.value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Overall Rating:</span>
                          <span className="text-xl font-bold">{feedback.overallRating}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full" 
                            style={{ width: `${(feedback.overallRating / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium">Outcome:</span>
                        <div className="mt-2">{getOutcomeBadge(feedback.outcome)}</div>
                      </div>
                      
                      <div>
                        <span className="font-medium">Submitted By:</span>
                        <p className="mt-1">{feedback.submittedBy}</p>
                      </div>
                      
                      {feedback.submittedAt && (
                        <div>
                          <span className="font-medium">Submitted On:</span>
                          <p className="mt-1">{new Date(feedback.submittedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {feedback.notes && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-4">Additional Notes</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{feedback.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6 border-t">
                  <button
                    onClick={() => navigate(`/interviews/${interviewId}/feedback`)}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    Edit Feedback
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Print Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFeedback;
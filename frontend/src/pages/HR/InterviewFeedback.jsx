import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState('');

  // Initialize with proper default values
  const [feedback, setFeedback] = useState({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    culturalFit: 0,
    overallRating: 0,
    notes: '',
    submittedBy: '',
    outcome: 'pending'
  });

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
      
      if (data.interview?.feedback) {
        // Ensure all required fields are present
        const existingFeedback = data.interview.feedback;
        setFeedback({
          technicalSkills: existingFeedback.technicalSkills || 0,
          communication: existingFeedback.communication || 0,
          problemSolving: existingFeedback.problemSolving || 0,
          culturalFit: existingFeedback.culturalFit || 0,
          overallRating: existingFeedback.overallRating || 0,
          notes: existingFeedback.notes || '',
          submittedBy: existingFeedback.submittedBy || '',
          outcome: existingFeedback.outcome || 'pending'
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setError('Failed to load interview details');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (category, value) => {
    const ratingValue = parseInt(value) || 0;
    const newFeedback = {
      ...feedback,
      [category]: ratingValue
    };
    
    // Calculate overall rating safely
    const { technicalSkills, communication, problemSolving, culturalFit } = newFeedback;
    const total = (technicalSkills || 0) + (communication || 0) + (problemSolving || 0) + (culturalFit || 0);
    const average = total > 0 ? total / 4 : 0;
    
    setFeedback({
      ...newFeedback,
      overallRating: Math.round(average * 2) / 2 // Round to nearest 0.5
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}/feedback`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feedback: feedback,
          outcome: feedback.outcome
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      alert('Feedback submitted successfully!');
      navigate('/interviews');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
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

  // Safe function to format overall rating
  const getOverallRating = () => {
    const rating = feedback.overallRating || 0;
    return rating.toFixed(1);
  };

  // Safe function to get rating percentage for progress bar
  const getRatingPercentage = () => {
    const rating = feedback.overallRating || 0;
    return (rating / 5) * 100;
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
              <p className="mt-4 text-gray-600">Loading interview details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Interview Feedback - {interview?.candidate?.firstName} {interview?.candidate?.lastName}
                </h2>
                
                {interview && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Interview Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Position:</strong> {interview.candidate?.position}</p>
                        <p><strong>Date:</strong> {new Date(interview.interviewDate).toLocaleString()}</p>
                      </div>
                      <div>
                        <p><strong>Type:</strong> {interview.interviewType}</p>
                        <p><strong>Interviewers:</strong> {interview.interviewers?.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Candidate Assessment</h3>
                    
                    {[
                      { key: 'technicalSkills', label: 'Technical Skills' },
                      { key: 'communication', label: 'Communication' },
                      { key: 'problemSolving', label: 'Problem Solving' },
                      { key: 'culturalFit', label: 'Cultural Fit' }
                    ].map(({ key, label }) => (
                      <div key={key} className="border rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {label}:
                        </label>
                        <div className="flex items-center space-x-4">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <label key={rating} className="flex items-center">
                              <input
                                type="radio"
                                name={key}
                                value={rating}
                                checked={(feedback[key] || 0) === rating}
                                onChange={(e) => handleRatingChange(key, e.target.value)}
                                className="mr-2"
                              />
                              <span>{rating}</span>
                            </label>
                          ))}
                          <span className="ml-4 text-sm text-gray-500">
                            {(feedback[key] || 0) === 0 ? 'Not rated' : `${feedback[key] || 0}/5`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold">
                      Overall Rating: {getOverallRating()}/5
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${getRatingPercentage()}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Outcome:
                    </label>
                    <select
                      name="outcome"
                      value={feedback.outcome || 'pending'}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="pending">Pending Decision</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="recommended-next-round">Recommended for Next Round</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submitted By:
                    </label>
                    <input
                      type="text"
                      name="submittedBy"
                      value={feedback.submittedBy || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes:
                    </label>
                    <textarea
                      name="notes"
                      value={feedback.notes || ''}
                      onChange={handleInputChange}
                      placeholder="Enter detailed feedback, strengths, areas for improvement, etc."
                      rows="6"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/interviews')}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
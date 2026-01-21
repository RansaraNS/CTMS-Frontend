/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  LogOut, User, Briefcase, ArrowLeft, Star, AlertCircle,
  CheckCircle, Clock, MapPin, DollarSign, Calendar, Home
} from 'lucide-react';

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  const [feedback, setFeedback] = useState({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    culturalFit: 0,
    overallRating: 0,
    ableToJoinImmediately: '',
    noticePeriod: '',
    okayWithOnsite: '',
    salaryExpectation: '',
    relocationRequired: '',
    notes: '',
    submittedBy: user?.name || '',
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
        const existingFeedback = data.interview.feedback;
        setFeedback({
          technicalSkills: existingFeedback.technicalSkills || 0,
          communication: existingFeedback.communication || 0,
          problemSolving: existingFeedback.problemSolving || 0,
          culturalFit: existingFeedback.culturalFit || 0,
          overallRating: existingFeedback.overallRating || 0,
          ableToJoinImmediately: existingFeedback.ableToJoinImmediately || '',
          noticePeriod: existingFeedback.noticePeriod || '',
          okayWithOnsite: existingFeedback.okayWithOnsite || '',
          salaryExpectation: existingFeedback.salaryExpectation || '',
          relocationRequired: existingFeedback.relocationRequired || '',
          notes: existingFeedback.notes || '',
          submittedBy: existingFeedback.submittedBy || user?.name || '',
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
    
    const { technicalSkills, communication, problemSolving, culturalFit } = newFeedback;
    const total = (technicalSkills || 0) + (communication || 0) + (problemSolving || 0) + (culturalFit || 0);
    const average = total > 0 ? total / 4 : 0;
    
    setFeedback({
      ...newFeedback,
      overallRating: Math.round(average * 2) / 2
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

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getOverallRating = () => {
    const rating = feedback.overallRating || 0;
    return rating.toFixed(1);
  };

  const getRatingPercentage = () => {
    const rating = feedback.overallRating || 0;
    return (rating / 5) * 100;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#A7E6FF]">
        <Sidebar />
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
              Loading Interview Details
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
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#050C9C] to-[#3572EF] rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Interview Feedback</h1>
              <p className="text-sm text-gray-600">Provide detailed feedback for the interview</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#3572EF] to-[#3ABEF9] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-[#050C9C]">Welcome, {user?.name || "HR"}</span>
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
          <div className="max-w-4xl mx-auto">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => navigate('/interviews')}
              className="mb-6 flex items-center gap-2 text-[#3572EF] hover:text-[#050C9C] font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Interviews
            </button>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-8">
              {/* Interview Details */}
              {interview && (
                <div className="bg-gradient-to-r from-[#050C9C] to-[#3572EF] rounded-2xl p-6 text-white">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Interview Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm"><span className="text-[#A7E6FF]">Candidate:</span> <span className="font-semibold">{interview.candidate?.firstName} {interview.candidate?.lastName}</span></p>
                      <p className="text-sm"><span className="text-[#A7E6FF]">Position:</span> <span className="font-semibold">{interview.candidate?.position}</span></p>
                      <p className="text-sm"><span className="text-[#A7E6FF]">Email:</span> <span className="font-semibold">{interview.candidate?.email}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="text-[#A7E6FF]">Date:</span> <span className="font-semibold">{new Date(interview.interviewDate).toLocaleString()}</span></p>
                      <p className="text-sm"><span className="text-[#A7E6FF]">Type:</span> <span className="font-semibold capitalize">{interview.interviewType}</span></p>
                      <p className="text-sm"><span className="text-[#A7E6FF]">Interviewers:</span> <span className="font-semibold">{interview.interviewers?.join(', ')}</span></p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Assessment Ratings */}
                <div>
                  <h3 className="font-semibold text-xl text-[#050C9C] mb-4">Candidate Assessment</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { key: 'technicalSkills', label: 'Technical Skills' },
                      { key: 'communication', label: 'Communication' },
                      { key: 'problemSolving', label: 'Problem Solving' },
                      { key: 'culturalFit', label: 'Cultural Fit' }
                    ].map(({ key, label }) => (
                      <div key={key} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <label className="block text-sm font-medium text-[#050C9C] mb-3">
                          {label}
                        </label>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <label key={rating} className="cursor-pointer">
                                <input
                                  type="radio"
                                  name={key}
                                  value={rating}
                                  checked={(feedback[key] || 0) === rating}
                                  onChange={(e) => handleRatingChange(key, e.target.value)}
                                  className="sr-only"
                                />
                                <Star
                                  className={`w-8 h-8 transition-colors duration-200 ${
                                    rating <= (feedback[key] || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 hover:text-gray-400'
                                  }`}
                                />
                              </label>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Rating:</span>
                            <span className="font-bold text-lg text-[#050C9C]">{feedback[key] || 0}/5</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] p-6 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Overall Rating</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-3xl font-bold">{getOverallRating()}</span>
                        <span className="text-sm">/5.0</span>
                      </div>
                    </div>
                    <div className="w-48">
                      <div className="w-full bg-white/30 rounded-full h-2 mb-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${getRatingPercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Questions */}
                <div>
                  <h3 className="font-semibold text-xl text-[#050C9C] mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Able to Join */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="block text-sm font-medium text-[#050C9C] mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Able to Join Immediately?
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' },
                          { value: 'with-notice', label: 'With Notice Period' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="ableToJoinImmediately"
                              value={option.value}
                              checked={feedback.ableToJoinImmediately === option.value}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-[#3572EF] focus:ring-[#3572EF]"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {feedback.ableToJoinImmediately === 'with-notice' && (
                        <div className="mt-3">
                          <input
                            type="text"
                            name="noticePeriod"
                            value={feedback.noticePeriod || ''}
                            onChange={handleInputChange}
                            placeholder="e.g., 2 weeks, 1 month"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                          />
                        </div>
                      )}
                    </div>

                    {/* Onsite Work */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="block text-sm font-medium text-[#050C9C] mb-3 flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Okay with Onsite Work?
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' },
                          { value: 'hybrid', label: 'Hybrid Preferred' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="okayWithOnsite"
                              value={option.value}
                              checked={feedback.okayWithOnsite === option.value}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-[#3572EF] focus:ring-[#3572EF]"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Relocation */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="block text-sm font-medium text-[#050C9C] mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Relocation Required?
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="relocationRequired"
                              value={option.value}
                              checked={feedback.relocationRequired === option.value}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-[#3572EF] focus:ring-[#3572EF]"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outcome */}
                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Interview Outcome <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="outcome"
                    value={feedback.outcome || 'pending'}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                  >
                    <option value="pending">Pending Decision</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="recommended-next-round">Recommended for Next Round</option>
                  </select>
                </div>

                {/* Submitted By */}
                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Submitted By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="submittedBy"
                    value={feedback.submittedBy || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={feedback.notes || ''}
                    onChange={handleInputChange}
                    placeholder="Enter detailed feedback, strengths, areas for improvement, etc."
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 resize-vertical"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/interviews')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewFeedback;
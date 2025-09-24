/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateId: '',
    interviewDate: '',
    interviewTime: '',
    interviewType: 'technical',
    interviewers: '',
    meetingLink: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  // Fetch candidates for dropdown
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/candidates?page=1&limit=100', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }
        
        const data = await response.json();
        setCandidates(Array.isArray(data) ? data : data.candidates || []);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setErrors({ fetch: 'Failed to load candidates. Please try again.' });
      }
    };

    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Fix: Proper date-time combination
  const combineDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return null;
    
    // Create a date object from the date string
    const date = new Date(dateString);
    
    // Extract hours and minutes from time string
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Set the time on the date object (this uses local time)
    date.setHours(hours, minutes, 0, 0);
    
    // Convert to ISO string for backend
    return date.toISOString();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.candidateId) {
      newErrors.candidateId = 'Please select a candidate.';
    }

    if (!formData.interviewDate) {
      newErrors.interviewDate = 'Date is required.';
    } else {
      const selectedDate = new Date(formData.interviewDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.interviewDate = 'Date must be today or in the future.';
      }
    }

    if (!formData.interviewTime) {
      newErrors.interviewTime = 'Time is required.';
    } else {
      // Validate time is not in the past if date is today
      if (formData.interviewDate === new Date().toISOString().split('T')[0]) {
        const now = new Date();
        const selectedTime = new Date();
        const [hours, minutes] = formData.interviewTime.split(':').map(Number);
        selectedTime.setHours(hours, minutes, 0, 0);
        
        if (selectedTime <= now) {
          newErrors.interviewTime = 'Time must be in the future.';
        }
      }
    }

    if (!formData.interviewType) {
      newErrors.interviewType = 'Interview type is required.';
    }

    if (!formData.interviewers) {
      newErrors.interviewers = 'Interviewers are required.';
    }

    if (!formData.meetingLink) {
      newErrors.meetingLink = 'Meeting link is required.';
    } else if (!isValidUrl(formData.meetingLink)) {
      newErrors.meetingLink = 'Please enter a valid URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Fix: Use the proper date-time combination function
      const interviewDateTime = combineDateTime(formData.interviewDate, formData.interviewTime);
      
      if (!interviewDateTime) {
        throw new Error('Invalid date or time format');
      }

      const requestBody = {
        candidateId: formData.candidateId,
        interviewDate: interviewDateTime,
        interviewType: formData.interviewType,
        interviewers: formData.interviewers.split(',').map(i => i.trim()),
        meetingLink: formData.meetingLink
      };

      console.log('Scheduling interview with data:', requestBody);
      console.log('Local time representation:', new Date(interviewDateTime).toString());

      const response = await fetch('http://localhost:5000/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to schedule interview: ${response.status}`);
      }

      setSuccessMessage('Interview scheduled successfully!');
      
      // Reset form
      setFormData({
        candidateId: '',
        interviewDate: '',
        interviewTime: '',
        interviewType: 'technical',
        interviewers: '',
        meetingLink: ''
      });
      
      setErrors({});

    } catch (error) {
      console.error('Error scheduling interview:', error);
      setErrors({ 
        submit: error.message || 'An error occurred while scheduling the interview. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today) and time for validation
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinTime = () => {
    if (formData.interviewDate === new Date().toISOString().split('T')[0]) {
      const now = new Date();
      // Add 15 minutes to current time
      now.setMinutes(now.getMinutes() + 15);
      return now.toTimeString().slice(0, 5);
    }
    return '00:00';
  };

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
              <button onClick={() => navigateTo('/hr/schedule-interview')} className="flex items-center p-4 bg-blue-600 hover:bg-blue-600">
                <span className="mr-2">🗓️</span> Schedule Interview
              </button>
              <button onClick={() => navigateTo('/interviews')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">📊</span> Manage Interviews
              </button>
              <button onClick={() => navigateTo('/candidates')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">🔍</span> View Candidates
              </button>
            </nav>
          </div>

          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Schedule Interview</h2>
              
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {successMessage}
                </div>
              )}
              
              {errors.fetch && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.fetch}
                </div>
              )}
              
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.submit}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="candidateId">
                    Select Candidate *
                  </label>
                  <select
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                      errors.candidateId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                    }`}
                    id="candidateId"
                    value={formData.candidateId}
                    onChange={handleChange}
                    disabled={candidates.length === 0}
                  >
                    <option value="">{candidates.length === 0 ? 'Loading candidates...' : 'Select a candidate'}</option>
                    {candidates.map((candidate) => (
                      <option key={candidate._id} value={candidate._id}>
                        {candidate.firstName} {candidate.lastName} - {candidate.position} ({candidate.email})
                      </option>
                    ))}
                  </select>
                  {errors.candidateId && <p className="mt-1 text-sm text-red-600">{errors.candidateId}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="interviewDate">
                      Interview Date *
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.interviewDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="interviewDate"
                      type="date"
                      value={formData.interviewDate}
                      onChange={handleChange}
                      min={getMinDate()}
                    />
                    {errors.interviewDate && <p className="mt-1 text-sm text-red-600">{errors.interviewDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="interviewTime">
                      Interview Time *
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.interviewTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="interviewTime"
                      type="time"
                      value={formData.interviewTime}
                      onChange={handleChange}
                      min={formData.interviewDate === getMinDate() ? getMinTime() : undefined}
                    />
                    {errors.interviewTime && <p className="mt-1 text-sm text-red-600">{errors.interviewTime}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="interviewType">
                      Interview Type *
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.interviewType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="interviewType"
                      value={formData.interviewType}
                      onChange={handleChange}
                    >
                      <option value="technical">Technical</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="hr">HR</option>
                      <option value="cultural">Cultural Fit</option>
                    </select>
                    {errors.interviewType && <p className="mt-1 text-sm text-red-600">{errors.interviewType}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="interviewers">
                      Interviewers (comma separated) *
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                        errors.interviewers ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                      }`}
                      id="interviewers"
                      type="text"
                      placeholder="e.g., john@company.com, jane@company.com"
                      value={formData.interviewers}
                      onChange={handleChange}
                    />
                    {errors.interviewers && <p className="mt-1 text-sm text-red-600">{errors.interviewers}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="meetingLink">
                    Meeting Link *
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${
                      errors.meetingLink ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'
                    }`}
                    id="meetingLink"
                    type="url"
                    placeholder="https://meet.google.com/abc-def-ghi"
                    value={formData.meetingLink}
                    onChange={handleChange}
                  />
                  {errors.meetingLink && <p className="mt-1 text-sm text-red-600">{errors.meetingLink}</p>}
                </div>

                <button
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting || candidates.length === 0}
                >
                  {isSubmitting ? 'Scheduling Interview...' : 'Schedule Interview'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;
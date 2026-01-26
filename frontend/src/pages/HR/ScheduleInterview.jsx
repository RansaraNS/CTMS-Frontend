/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  LogOut, User, Briefcase, Calendar, Clock, Users, 
  Video, Mail, AlertCircle, CheckCircle, UserPlus, Link2
} from 'lucide-react';

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
  const [warnings, setWarnings] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/candidates?page=1&limit=100&status=new', {
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

    if (id === 'meetingLink' && value.trim() !== '') {
      if (isValidUrl(value)) {
        const url = new URL(value);
        const meetingDomains = [
          'meet.google.com',
          'zoom.us',
          'teams.microsoft.com',
          'webex.com',
          'gotomeet.me',
          'gotomeeting.com'
        ];
        
        const isKnownMeetingPlatform = meetingDomains.some(domain => 
          url.hostname.includes(domain)
        );
        
        if (!isKnownMeetingPlatform) {
          setWarnings(prev => ({
            ...prev,
            meetingLink: 'This may not be a standard meeting platform. Please double-check the URL.'
          }));
        } else {
          setWarnings(prev => ({
            ...prev,
            meetingLink: ''
          }));
        }
      }
    }
  };

  const combineDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return null;

    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    return date.toISOString();
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return !!(url.protocol && url.host);
    } catch (_) {
      return false;
    }
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

    if (!formData.meetingLink || formData.meetingLink.trim() === '') {
      newErrors.meetingLink = 'Meeting link is required for scheduling interviews.';
    } else if (!isValidUrl(formData.meetingLink)) {
      newErrors.meetingLink = 'Please enter a valid meeting URL (e.g., https://meet.google.com/abc-def-ghi)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const interviewDateTime = combineDateTime(formData.interviewDate, formData.interviewTime);

      if (!interviewDateTime) {
        throw new Error('Invalid date or time format');
      }

      if (!formData.meetingLink || formData.meetingLink.trim() === '') {
        setErrors(prev => ({
          ...prev,
          meetingLink: 'Meeting link is required for scheduling interviews.'
        }));
        setIsSubmitting(false);
        return;
      }

      if (!isValidUrl(formData.meetingLink)) {
        setErrors(prev => ({
          ...prev,
          meetingLink: 'Please enter a valid meeting URL (e.g., https://meet.google.com/abc-def-ghi)'
        }));
        setIsSubmitting(false);
        return;
      }

      const requestBody = {
        candidateId: formData.candidateId,
        interviewDate: interviewDateTime,
        interviewType: formData.interviewType,
        interviewers: formData.interviewers.split(',').map(i => i.trim()),
        meetingLink: formData.meetingLink
      };

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

      setSuccessMessage('Interview scheduled successfully! Emails sent to candidate and interviewers.');

      setFormData({
        candidateId: '',
        interviewDate: '',
        interviewTime: '',
        interviewType: 'technical',
        interviewers: '',
        meetingLink: ''
      });

      setErrors({});
      setWarnings({});

    } catch (error) {
      console.error('Error scheduling interview:', error);
      setErrors({
        submit: error.message || 'An error occurred while scheduling the interview. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinTime = () => {
    if (formData.interviewDate === new Date().toISOString().split('T')[0]) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 15);
      return now.toTimeString().slice(0, 5);
    }
    return '00:00';
  };

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Schedule Interview</h1>
              <p className="text-sm text-gray-600">Schedule a new interview session</p>
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
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-green-800 font-medium">{successMessage}</p>
                </div>
              )}

              {/* Error Messages */}
              {errors.fetch && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 font-medium">{errors.fetch}</p>
                </div>
              )}

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 font-medium">{errors.submit}</p>
                </div>
              )}

              {/* No Candidates Info */}
              {candidates.length === 0 && !errors.fetch && (
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">No new candidates available for scheduling.</p>
                    <button
                      onClick={() => navigate("/hr/add-candidate")}
                      className="text-[#3572EF] hover:text-[#050C9C] font-medium underline mt-1 text-sm"
                    >
                      Add a new candidate first.
                    </button>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Candidate Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Select Candidate <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <select
                      id="candidateId"
                      value={formData.candidateId}
                      onChange={handleChange}
                      disabled={candidates.length === 0}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 appearance-none ${
                        errors.candidateId
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                      }`}
                    >
                      <option value="">
                        {candidates.length === 0 ? 'No new candidates available' : 'Select a candidate'}
                      </option>
                      {candidates.map((candidate) => (
                        <option key={candidate._id} value={candidate._id}>
                          {candidate.firstName} {candidate.lastName} - {candidate.position} ({candidate.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.candidateId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.candidateId}
                    </p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Interview Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <input
                        id="interviewDate"
                        type="date"
                        value={formData.interviewDate}
                        onChange={handleChange}
                        min={getMinDate()}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          errors.interviewDate
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      />
                    </div>
                    {errors.interviewDate && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.interviewDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Interview Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <input
                        id="interviewTime"
                        type="time"
                        value={formData.interviewTime}
                        onChange={handleChange}
                        min={formData.interviewDate === getMinDate() ? getMinTime() : "09:30"}
                        max="17:30"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          errors.interviewTime
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      />
                    </div>
                    {errors.interviewTime && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.interviewTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* Interview Type and Interviewers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Interview Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <select
                        id="interviewType"
                        value={formData.interviewType}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 appearance-none ${
                          errors.interviewType
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      >
                        <option value="First Round">First Round</option>
                        <option value="Second Round">Second Round</option>
                        <option value="technical">Technical</option>
                      </select>
                    </div>
                    {errors.interviewType && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.interviewType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Interviewers (comma separated) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="interviewers"
                        type="text"
                        placeholder="john@company.com, jane@company.com"
                        value={formData.interviewers}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          errors.interviewers
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      />
                    </div>
                    {errors.interviewers && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.interviewers}
                      </p>
                    )}
                  </div>
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Meeting Link <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="meetingLink"
                      type="url"
                      placeholder="https://meet.google.com/abc-def-ghi"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.meetingLink
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                      }`}
                    />
                  </div>
                  {errors.meetingLink && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.meetingLink}
                    </p>
                  )}
                  {warnings.meetingLink && (
                    <p className="mt-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {warnings.meetingLink}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || candidates.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      Schedule Interview
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduleInterview;
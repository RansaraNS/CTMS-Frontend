/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { 
  LogOut, User, Briefcase, Mail, Phone, FileText, Tag, 
  Upload, AlertCircle, CheckCircle, Search, UserPlus, MessageSquare
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const AddCandidate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [existingCandidate, setExistingCandidate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: 'onBlur',
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const emailValue = watch('email');
  const phoneValue = watch('phone');

  const validateName = (value) => {
    if (!value) return true;
    
    const hasNumbers = /\d/.test(value);
    if (hasNumbers) {
      return 'Names cannot contain numbers';
    }
    
    const isValidFormat = /^[a-zA-Z\s\-']+$/.test(value);
    if (!isValidFormat) {
      return 'Names can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    return true;
  };

  const validateCV = (files) => {
    if (!files || files.length === 0) {
      return 'CV is required';
    }
    
    const file = files[0];
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed';
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    return true;
  };

  const handleQuickScan = async () => {
    if ((!emailValue || !emailValue.includes('@')) && (!phoneValue || phoneValue.length < 7)) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid email or phone number for scanning' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await API.get(`/candidates/scan`, {
        params: {
          email: emailValue || undefined,
          phone: phoneValue || undefined
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.data.exists) {
        setExistingCandidate(response.data.candidate);
        setSubmitMessage({
          type: 'warning',
          text: `Candidate already exists: ${response.data.candidate.name} (${response.data.candidate.status})`
        });
      } else {
        setExistingCandidate(null);
        setSubmitMessage({ type: 'success', text: 'No existing candidate found. You can proceed.' });
      }
    } catch (error) {
      console.error('Scan error:', error);
      setSubmitMessage({ type: 'error', text: 'Error scanning for candidate' });
    }
  };

  const onSubmit = async (data) => {
    if (existingCandidate) {
      setSubmitMessage({ type: 'error', text: 'Cannot add candidate - already exists in system' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(data).forEach((key) => {
        if (key === 'cv' && data[key][0]) {
          formData.append("cv", data.cv[0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await API.post("/candidates", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setSubmitMessage({ type: 'success', text: 'Candidate added successfully!' });
        reset();
        setExistingCandidate(null);
        setTimeout(() => setSubmitMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
      setSubmitMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add candidate.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const clearExistingCandidate = () => {
    setExistingCandidate(null);
    setSubmitMessage({ type: '', text: '' });
    setValue('email', '');
    setValue('phone', '');
  };

  return (
    <div className="flex h-screen bg-[#A7E6FF]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#050C9C]">Add New Candidate</h1>
              <p className="text-sm text-gray-600">Register a new candidate in the system</p>
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
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
              {/* Success/Error Messages */}
              {submitMessage.text && (
                <div className={`mb-6 p-4 rounded-xl border-l-4 flex items-start gap-3 ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 border-green-500'
                    : submitMessage.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-red-50 border-red-500'
                }`}>
                  {submitMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                  {submitMessage.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />}
                  {submitMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      submitMessage.type === 'success' ? 'text-green-800' :
                      submitMessage.type === 'warning' ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      {submitMessage.text}
                    </p>
                    {existingCandidate && (
                      <button
                        onClick={clearExistingCandidate}
                        className="text-[#3572EF] hover:text-[#050C9C] font-medium text-sm mt-2 underline"
                      >
                        Use different email/phone
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Existing Candidate Warning */}
              {existingCandidate && (
                <div className="mb-6 p-5 bg-orange-50 border-l-4 border-orange-500 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-orange-800 mb-2">Candidate Already Exists</h3>
                      <div className="text-orange-700 space-y-1 text-sm">
                        <p><strong>Name:</strong> {existingCandidate.name}</p>
                        <p><strong>Status:</strong> <span className="capitalize">{existingCandidate.status}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter first name"
                        {...register('firstName', {
                          required: 'First name is required',
                          minLength: { value: 2, message: 'First name must be at least 2 characters' },
                          validate: validateName
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter last name"
                        {...register('lastName', {
                          required: 'Last name is required',
                          minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                          validate: validateName
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="candidate@example.com"
                        {...register('email', {
                          required: 'Candidate email is required',
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email address',
                          },
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          {...register('phone', {
                            required: 'Phone number is required',
                            minLength: { value: 7, message: 'Phone number must be at least 7 digits' },
                          })}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                            errors.phone
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                              : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleQuickScan}
                        className="px-4 py-3 bg-gradient-to-r from-[#050C9C] to-[#3572EF] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Scan
                      </button>
                    </div>
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Position, CV, Source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <select
                        {...register('position', { required: 'Position is required' })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 appearance-none ${
                          errors.position
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      >
                        <option value="">Select Position</option>
                        <option value="Software Engineer Intern">Software Engineer Intern</option>
                        <option value="Frontend Developer Intern">Frontend Developer Intern</option>
                        <option value="Backend Developer Intern">Backend Developer Intern</option>
                        <option value="Full Stack Developer Intern">Full Stack Developer Intern</option>
                        <option value="Business Analyst Intern">Business Analyst Intern</option>
                        <option value="Project Manager Intern">Project Manager Intern</option>
                        <option value="UI/UX Designer Intern">UI/UX Designer Intern</option>
                        <option value="DevOps Engineer Intern">DevOps Engineer Intern</option>
                        <option value="Data Science Intern">Data Science Intern</option>
                        <option value="Quality Assurance Intern">Quality Assurance Intern</option>
                      </select>
                    </div>
                    {errors.position && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.position.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#050C9C] mb-2">
                      Source <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                      <select
                        {...register('source', { required: 'Source is required' })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 appearance-none ${
                          errors.source
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                        }`}
                      >
                        <option value="">Select Source</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Indeed">Indeed</option>
                        <option value="Company Website">Company Website</option>
                        <option value="Employee Referral">Employee Referral</option>
                        <option value="Job Fair">Job Fair</option>
                        <option value="Recruitment Agency">Recruitment Agency</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.source && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.source.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* CV Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Upload CV (PDF only) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="file"
                      accept="application/pdf"
                      {...register("cv", {
                        required: 'CV is required',
                        validate: validateCV
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.cv
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20'
                      }`}
                    />
                  </div>
                  {errors.cv && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cv.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Only PDF files are accepted. Maximum file size: 5MB
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-[#050C9C] mb-2">
                    Additional Notes
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      rows="4"
                      placeholder="Add any additional notes about the candidate (skills, experience, etc.)..."
                      {...register('notes')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3572EF] focus:ring-2 focus:ring-[#3ABEF9]/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || existingCandidate}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3572EF] to-[#3ABEF9] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding Candidate...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Add Candidate to System
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

export default AddCandidate;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  // Watch email field for quick scan
  const emailValue = watch('email');

  // Quick scan for existing candidate
  const handleQuickScan = async () => {
    if (!emailValue || !emailValue.includes('@')) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid email address for scanning' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/candidates/scan?email=${encodeURIComponent(emailValue)}`, {
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
      setSubmitMessage({ 
        type: 'error', 
        text: 'Cannot add candidate - already exists in system' 
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/candidates', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setSubmitMessage({ 
          type: 'success', 
          text: 'Candidate added successfully!' 
        });
        reset();
        setExistingCandidate(null);
        
        setTimeout(() => {
          setSubmitMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      if (error.response?.status === 400 && error.response.data.existingCandidate) {
        setExistingCandidate(error.response.data.existingCandidate);
        setSubmitMessage({ 
          type: 'error', 
          text: `Candidate already exists: ${error.response.data.existingCandidate.name}` 
        });
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to add candidate. Please try again.' 
        });
      }
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

  const navigateTo = (path) => {
    navigate(path);
  };

  const clearExistingCandidate = () => {
    setExistingCandidate(null);
    setSubmitMessage({ type: '', text: '' });
    setValue('email', '');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-teal-600 text-white p-4 flex justify-between items-center w-full">
          <h1 className="text-xl font-bold">Candidate Tracking Management System</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, HR</span>
          </div>
          <button onClick={handleLogout} className="bg-teal-800 px-4 py-2 rounded">Logout</button>
        </nav>

        {/* Sidebar and Main Content */}
        <div className="flex flex-1">
          <div className="w-64 bg-gray-800 text-white h-full">
            <nav className="flex flex-col h-full">
              <button onClick={() => navigateTo('/hr/dashboard')} className="flex items-center p-4 hover:bg-gray-700">
                <span className="mr-2">🏠</span> HR Dashboard
              </button>
              <button onClick={() => navigateTo('/hr/add-candidate')} className="flex items-center p-4 bg-blue-600 hover:bg-blue-600">
                <span className="mr-2">👤</span> Add Candidate
              </button>
              <button onClick={() => navigateTo('/hr/schedule-interview')} className="flex items-center p-4 hover:bg-gray-700">
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

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center">Add New Candidate</h2>
              
              {/* Success/Error Message */}
              {submitMessage.text && (
                <div className={`mb-4 p-3 rounded-lg text-center ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : submitMessage.type === 'warning'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {submitMessage.text}
                  {existingCandidate && (
                    <div className="mt-2">
                      <button 
                        onClick={clearExistingCandidate}
                        className="text-sm underline hover:no-underline"
                      >
                        Use different email
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Existing Candidate Info */}
              {existingCandidate && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">Candidate Already Exists</h3>
                  <p className="text-yellow-700">
                    <strong>Name:</strong> {existingCandidate.name}<br />
                    <strong>Status:</strong> {existingCandidate.status}<br />
                    <strong>Position:</strong> {existingCandidate.lastPosition}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.firstName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="firstName"
                      type="text"
                      placeholder="Enter first name"
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'First name must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.lastName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="lastName"
                      type="text"
                      placeholder="Enter last name"
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Last name must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                      Email
                    </label>
                    <div className="flex space-x-2">
                      <input
                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                          errors.email
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                        }`}
                        id="email"
                        type="email"
                        placeholder="Enter candidate email"
                        {...register('email', {
                          required: 'Candidate email is required',
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email address',
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={handleQuickScan}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                      >
                        Scan
                      </button>
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^\d{10}$/,
                          message: 'Phone number must be 10 digits',
                        },
                      })}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="position">
                      Position
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.position
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="position"
                      {...register('position', {
                        required: 'Position is required',
                      })}
                    >
                      <option value="">Select Position</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                    </select>
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="source">
                      Source
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.source
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="source"
                      {...register('source', {
                        required: 'Source is required',
                      })}
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
                    {errors.source && (
                      <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="notes">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    id="notes"
                    rows="3"
                    placeholder="Add any additional notes about the candidate..."
                    {...register('notes')}
                  />
                </div>

                <button
                  className={`w-full py-3 rounded-lg focus:ring-4 transition duration-200 font-semibold ${
                    isSubmitting || existingCandidate
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-300 text-white'
                  }`}
                  type="submit"
                  disabled={isSubmitting || existingCandidate}
                >
                  {isSubmitting ? 'Adding Candidate...' : 'Add Candidate'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;
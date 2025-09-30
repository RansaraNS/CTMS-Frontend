/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import Sidebar from '../../components/Sidebar';

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

  // Watch fields
  const emailValue = watch('email');
  const phoneValue = watch('phone');

  // Quick scan for existing candidate by email or phone
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

  // const onSubmit = async (data) => {
  //   if (existingCandidate) {
  //     setSubmitMessage({ 
  //       type: 'error', 
  //       text: 'Cannot add candidate - already exists in system' 
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setSubmitMessage({ type: '', text: '' });

  //   try {
  //     const token = localStorage.getItem('token');

  //     const response = await API.post('/candidates', data, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (response.status === 201) {
  //       setSubmitMessage({ 
  //         type: 'success', 
  //         text: 'Candidate added successfully!' 
  //       });
  //       reset();
  //       setExistingCandidate(null);

  //       setTimeout(() => {
  //         setSubmitMessage({ type: '', text: '' });
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.error('Error adding candidate:', error);
  //     if (error.response?.status === 400 && error.response.data.existingCandidate) {
  //       setExistingCandidate(error.response.data.existingCandidate);
  //       setSubmitMessage({ 
  //         type: 'error', 
  //         text: `Candidate already exists: ${error.response.data.existingCandidate.name}` 
  //       });
  //     } else {
  //       setSubmitMessage({ 
  //         type: 'error', 
  //         text: error.response?.data?.message || 'Failed to add candidate. Please try again.' 
  //       });
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const onSubmit = async (data) => {
    if (existingCandidate) {
      setSubmitMessage({ type: 'error', text: 'Cannot add candidate - already exists in system' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');

      // Use FormData for file upload
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      if (data.cv && data.cv[0]) {
        formData.append("cv", data.cv[0]); // attach file
      }

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

  const navigateTo = (path) => {
    navigate(path);
  };

  const clearExistingCandidate = () => {
    setExistingCandidate(null);
    setSubmitMessage({ type: '', text: '' });
    setValue('email', '');
    setValue('phone', '');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen bg-gradient-to-br from-[#03624c] to-[#030f0f]"
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white p-4 flex justify-between items-center w-full shadow-lg"
        >
          <div className="flex items-center">
            <motion.img
              src="/GR.jpg"
              alt="Company Logo"
              transition={{ duration: 0.5 }}
              className="w-10 h-10 mr-3 object-contain"
            />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00df82]">
              Candidate Tracking Management System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#03624c] px-4 py-2 rounded-full shadow-lg"
            >
              <span className="font-medium">Welcome, {user?.name || "HR"}</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 shadow-lg font-medium"
            >
              Logout
            </motion.button>
          </div>
        </motion.nav>

        {/* Sidebar + Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
       
          <Sidebar/>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-start min-h-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#03624c] to-[#030f0f] bg-clip-text text-transparent"
                >
                  Add New Candidate
                </motion.h2>

                {/* Success/Error Message */}
                <AnimatePresence>
                  {submitMessage.text && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-6 p-4 rounded-xl text-center border-2 ${submitMessage.type === 'success'
                          ? 'bg-green-50 text-green-800 border-green-200'
                          : submitMessage.type === 'warning'
                            ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                    >
                      <div className="font-semibold">
                        {submitMessage.type === 'success' && '✅ '}
                        {submitMessage.type === 'warning' && '⚠️ '}
                        {submitMessage.type === 'error' && '❌ '}
                        {submitMessage.text}
                      </div>
                      {existingCandidate && (
                        <div className="mt-3">
                          <button
                            onClick={clearExistingCandidate}
                            className="text-[#00df82] hover:text-[#03624c] font-medium underline transition duration-200"
                          >
                            Use different email/phone
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Existing Candidate Info */}
                <AnimatePresence>
                  {existingCandidate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl"
                    >
                      <h3 className="font-bold text-orange-800 text-lg mb-2">⚠️ Candidate Already Exists</h3>
                      <div className="text-orange-700 space-y-1">
                        <p><strong>Name:</strong> {existingCandidate.name}</p>
                        <p><strong>Status:</strong> <span className="capitalize">{existingCandidate.status}</span></p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Name Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="firstName">
                        First Name *
                      </label>
                      <input
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition duration-200 ${errors.firstName
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#00df82] focus:border-[#03624c]'
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
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 font-medium"
                        >
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="lastName">
                        Last Name *
                      </label>
                      <input
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition duration-200 ${errors.lastName
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#00df82] focus:border-[#03624c]'
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
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 font-medium"
                        >
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Contact Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="email">
                        Email Address *
                      </label>
                      <input
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition duration-200 ${errors.email
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#00df82] focus:border-[#03624c]'
                          }`}
                        id="email"
                        type="email"
                        placeholder="candidate@example.com"
                        {...register('email', {
                          required: 'Candidate email is required',
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email address',
                          },
                        })}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 font-medium"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="phone">
                        Phone Number *
                      </label>
                      <div className="flex space-x-3">
                        <input
                          className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition duration-200 ${errors.phone
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:ring-[#00df82] focus:border-[#03624c]'
                            }`}
                          id="phone"
                          type="tel"
                          placeholder="Enter 10-digit phone number"
                          {...register('phone', {
                            required: 'Phone number is required',
                            minLength: {
                              value: 7,
                              message: 'Phone number must be at least 7 digits',
                            },
                          })}
                        />
                        <motion.button
                          type="button"
                          onClick={handleQuickScan}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-[#03624c] text-white font-semibold rounded-xl hover:bg-[#030f0f] transition duration-200 shadow-md"
                        >
                          Scan
                        </motion.button>
                      </div>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 font-medium"
                        >
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Position and Source Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="position">
                        Position *
                      </label>
                      <select
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition duration-200 ${errors.position
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#00df82] focus:border-[#03624c]'
                          }`}
                        id="position"
                        {...register('position', {
                          required: 'Position is required',
                        })}
                      >
                        <option value="">Select Position</option>
                        <option value="Software Engineer Intern">Software Engineer Intern</option>
                        <option value="Frontend Developer Intern">Frontend Developer Intern</option>
                        <option value="Backend Developer Intern">Backend Developer Intern</option>
                        <option value="Full Stack Developer Intern">Full Stack Developer Intern</option>
                        <option value="Data Analyst Intern">Data Analyst Intern</option>
                        <option value="Project Manager Intern">Project Manager Intern</option>
                        <option value="UI/UX Designer Intern">UI/UX Designer Intern</option>
                        <option value="DevOps Engineer Intern">DevOps Engineer Intern</option>
                        <option value="Data Science Intern">Data Science Intern</option>
                        <option value="Quality Assurance Intern">Quality Assurance Intern</option>



                      </select>
                      {errors.position && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 font-medium"
                        >
                          {errors.position.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="cv">
                        Upload CV (PDF only)
                      </label>
                      <input
                        type="file"
                        id="cv"
                        accept="application/pdf"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                        {...register("cv")}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="source">
                        Source *
                      </label>
                      <select
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition duration-200 ${errors.source
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:ring-[#00df82] focus:border-[#03624c]'
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
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 font-medium"
                        >
                          {errors.source.message}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Notes Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="notes">
                      Additional Notes
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00df82] focus:border-[#03624c] transition duration-200"
                      id="notes"
                      rows="4"
                      placeholder="Add any additional notes about the candidate (skills, experience, etc.)..."
                      {...register('notes')}
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#03624c] to-[#030f0f] text-white py-4 rounded-xl hover:from-[#00df82] hover:to-[#03624c] focus:ring-4 focus:ring-[#00df82] transition duration-200 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting || existingCandidate}
                  >
                    {isSubmitting ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                    ) : (
                      '👤 Add Candidate to System'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddCandidate;

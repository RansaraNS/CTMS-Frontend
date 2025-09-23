import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const AddCandidate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = (data) => {
    
    console.log('Form data:', data);
    
    
    reset();
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  const navigateTo = (path) => {
    navigate(path);
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="name"
                      type="text"
                      placeholder="Enter candidate name"
                      {...register('name', {
                        required: 'Candidate name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
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
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="candidateId">
                      Candidate ID
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.candidateId
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="candidateId"
                      type="text"
                      placeholder="Enter candidate ID"
                      {...register('candidateId', {
                        required: 'Candidate ID is required',
                      })}
                    />
                    {errors.candidateId && (
                      <p className="mt-1 text-sm text-red-600">{errors.candidateId.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="dob">
                      Date of Birth
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.dob
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="dob"
                      type="date"
                      {...register('dob', {
                        required: 'Date of birth is required',
                        validate: (value) => new Date(value) < new Date() || 'Date of birth must be in the past',
                      })}
                    />
                    {errors.dob && (
                      <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="gender">
                      Gender
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.gender
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="gender"
                      {...register('gender', {
                        required: 'Gender is required',
                      })}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="department">
                      Department
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.department
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="department"
                      {...register('department', {
                        required: 'Department is required',
                      })}
                    >
                      <option value="">Select Department</option>
                      <option value="hr">Software Engineering</option>
                      <option value="it">Information Technology</option>
                      <option value="finance">Bussiness Management</option>
                      <option value="marketing">Marketing</option>
                    </select>
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="designation">
                      Designation
                    </label>
                    <select
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.designation
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="designation"
                      {...register('designation', {
                        required: 'Designation is required',
                      })}
                    >
                      <option value="">Select Designation</option>
                      <option value="manager">Project Manager</option>
                      <option value="senior">Web Developer</option>
                      <option value="junior">Data Analyst</option>
                      <option value="intern">Intern</option>
                    </select>
                    {errors.designation && (
                      <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="contactNumber">
                      Contact Number
                    </label>
                    <input
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        errors.contactNumber
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-teal-500 focus:border-transparent'
                      }`}
                      id="contactNumber"
                      type="tel"
                      placeholder="Enter contact number"
                      {...register('contactNumber', {
                        required: 'Contact number is required',
                        pattern: {
                          value: /^\d{10}$/,
                          message: 'Contact number must be 10 digits',
                        },
                      })}
                    />
                    {errors.contactNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>
                    )}
                  </div>
                </div>
                <button
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 transition duration-200 font-semibold"
                  type="submit"
                >
                  Add Candidate
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
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/Admin/AdminDashboard';
import HRDashboard from './pages/HR/HRDashboard';
import CreateHR from './pages/Admin/CreateHR';
import AddCandidate from './pages/HR/AddCandidate';
import CandidateDetails from './pages/HR/CandidateDetails';
import ScheduleInterview from './pages/HR/ScheduleInterview';
import InterviewList from './pages/HR/InterviewList';
import ManageHR from './pages/Admin/ManageHR';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './context/auth';
import InterviewFeedback from './pages/HR/InterviewFeedback';
import ViewFeedback from './pages/HR/ViewFeedback';
import CandidateDetailsView from './pages/HR/CandidateDetailsView';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
            <Navigate to={localStorage.getItem('role') === 'admin' ? '/admin/dashboard' : '/hr/dashboard'} replace /> : 
            <Login />
          } 
        />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/create-hr" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateHR />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/manage-hr" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageHR />
            </ProtectedRoute>
          } 
        />
        
        {/* HR Routes */}
        <Route 
          path="/hr/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <HRDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hr/add-candidate" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <AddCandidate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hr/schedule-interview" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <ScheduleInterview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidates" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <CandidateDetails />
            </ProtectedRoute>
          } 
        />
             

               <Route 
          path="/candidates/:id" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <CandidateDetailsView />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/interviews" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <InterviewList />
            </ProtectedRoute>
          } 
        />

          <Route 
          path="/interviews/:interviewId/feedback" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <InterviewFeedback />
            </ProtectedRoute>
          } 
        />

          <Route 
          path="/interviews/:interviewId/view-feedback" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <ViewFeedback />
            </ProtectedRoute>
          } 
        />

        
        

        

        {/* <Route path="/interviews/:interviewId/feedback"
         element={<InterviewFeedback />} /> */}

        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
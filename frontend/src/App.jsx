import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/Admin/AdminDashboard';
import HRDashboard from './pages/HR/HRDashboard';
import CreateHR from './pages/Admin/CreateHR';
import AddCandidate from './pages/HR/AddCandidate';
import CandidateDetails from './pages/HR/CandidateDetails';
import ScheduleInterview from './pages/HR/ScheduleInterview';
import InterviewList from './pages/HR/InterviewList';
import ManageHR from './pages/Admin/ManageHR';
import Login from './components/Login';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Login />} />
        <Route path="/admin/dashboard" element={< AdminDashboard />} />
        <Route path="/hr/dashboard" element={< HRDashboard />} />
        <Route path="/admin/create-hr" element={< CreateHR />} />
        <Route path="/admin/manage-hr" element={< ManageHR />} />
        <Route path="/hr/add-candidate" element={< AddCandidate />} />
        <Route path="/hr/schedule-interview" element={< ScheduleInterview />} />
        <Route path="/candidates" element={< CandidateDetails />} />
        <Route path="/interviews" element={< InterviewList />} />
      </Routes>
    </Router>
  );
}

export default App;
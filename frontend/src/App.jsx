import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfessorDashboard from './pages/ProfessorDashboard';
import CreateActivity from './pages/CreateActivity';
import ActivityDetails from './pages/ActivityDetails';
import StudentJoin from './pages/StudentJoin';
import StudentFeedback from './pages/StudentFeedback';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ProfessorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/create-activity" element={
          <ProtectedRoute>
            <CreateActivity />
          </ProtectedRoute>
        } />
        <Route path="/activity/:id" element={
          <ProtectedRoute>
            <ActivityDetails />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="/join" element={<StudentJoin />} />
        <Route path="/feedback" element={<StudentFeedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfessorDashboard from './pages/ProfessorDashboard';
import CreateActivity from './pages/CreateActivity';
import ActivityDetails from './pages/ActivityDetails';
import StudentJoin from './pages/StudentJoin';
import StudentFeedback from './pages/StudentFeedback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<ProfessorDashboard />} />
        <Route path="/create-activity" element={<CreateActivity />} />
        <Route path="/activity/:id" element={<ActivityDetails />} />
        
        <Route path="/join" element={<StudentJoin />} />
        <Route path="/feedback" element={<StudentFeedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
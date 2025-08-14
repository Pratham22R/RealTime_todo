import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GroupProvider } from './contexts/GroupContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import JoinGroup from './components/Auth/JoinGroup';
import Dashboard from './components/Dashboard/Dashboard';
import KanbanBoard from './components/Board/KanbanBoard';
import ActivityLog from './components/Board/ActivityLog';
import GroupSelector from './components/Board/GroupSelector';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from "./components/Footer";
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main Board Component
const BoardPage = () => {
  const { user } = useAuth();

  return (
    <div className="board-page">
      <Navbar user={user} />
      <div className="main-content">
        <div className="board-container">
          <KanbanBoard />
        </div>
        <div className="sidebar">
          <GroupSelector />
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <Navbar user={user} />
      <Dashboard />
    </div>
  );
};

// App Component
const App = () => {
  const location = useLocation();
  const isBoardPage = location.pathname === '/board' || location.pathname === '/dashboard';

  return (
    <AuthProvider>
      <GroupProvider>
        <div className="app">
          {!isBoardPage && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route 
              path="/join/:token" 
              element={
                <ProtectedRoute>
                  <JoinGroup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/board" 
              element={
                <ProtectedRoute>
                  <BoardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          {!isBoardPage && <Footer />}
        </div>
      </GroupProvider>
    </AuthProvider>
  );
};

export default App;
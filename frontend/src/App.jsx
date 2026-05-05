import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CaseDetails from './pages/CaseDetails';
import AdminCaseManagement from './pages/AdminCaseManagement';
import NewCase from './pages/NewCase';
import './App.css';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const DefaultRoute = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  return <Navigate to="/dashboard" />;
};

function AppRoutes() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className={isLandingPage ? "" : "app-container"}>
      {!isLandingPage && (
        <header className="header">
          <h1>CCID Case Management Portal</h1>
          {user && (
            <div className="header-user">
              <span>{user.name} ({user.role})</span>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </header>
      )}

      <main className={isLandingPage ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/new-case" element={
            <ProtectedRoute allowedRole="user">
              <NewCase />
            </ProtectedRoute>
          } />
          
          <Route path="/case/:id" element={
            <ProtectedRoute allowedRole="user">
              <CaseDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/case/:id" element={
            <ProtectedRoute allowedRole="admin">
              <AdminCaseManagement />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<DefaultRoute />} />
        </Routes>
      </main>
    </div>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

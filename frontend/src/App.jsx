import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/Dashboard/Admin'
import StaffDashboard from './components/Dashboard/Staff'

function AppContent() {
  const { token, role } = useAuth()

  return (
    <div className="App">
      <h1>Facility Booking System</h1>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {role === 'admin' ? <AdminDashboard /> : <StaffDashboard />}
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
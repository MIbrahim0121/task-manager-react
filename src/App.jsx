import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import TaskBoard from './pages/TaskBoard'

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/board"
              element={
                <ProtectedRoute>
                  <TaskBoard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/board" replace />} />
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  )
}

export default App

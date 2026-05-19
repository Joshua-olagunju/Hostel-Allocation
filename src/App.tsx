 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { LoginPage } from './pages/LoginPage'
import { StudentDashboard } from './pages/StudentDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { NotFoundPage } from './pages/NotFoundPage'
import { RequireAuth } from './components/RequireAuth'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/student"
            element={
              <RequireAuth allowedRole="student">
                <StudentDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth allowedRole="admin">
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App

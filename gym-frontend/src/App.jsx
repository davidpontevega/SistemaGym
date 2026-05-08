import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Classes from './pages/Classes'
import Booking from './pages/Booking'
import Members from './pages/Members'
import Plans from './pages/Plans'
import Navbar from './components/Navbar'
import Instructors from './pages/Instructors'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Navbar />
            <Classes />
          </PrivateRoute>
        } />
        <Route path="/classes" element={
          <PrivateRoute>
            <Navbar />
            <Classes />
          </PrivateRoute>
        } />
        <Route path="/booking" element={
          <PrivateRoute>
            <Navbar />
            <Booking />
          </PrivateRoute>
        } />
        <Route path="/members" element={
          <PrivateRoute>
            <Navbar />
            <Members />
          </PrivateRoute>
        } />
        <Route path="/plans" element={
          <PrivateRoute>
            <Navbar />
            <Plans />
          </PrivateRoute>
        } />
        <Route path="/instructors" element={
  <PrivateRoute>
    <Navbar />
    <Instructors />
  </PrivateRoute>
} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
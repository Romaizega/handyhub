import { Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Home from './components/Home'
import MyJobs from './components/MyJobs'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import MyOffers from './components/MyOffers'
import Jobs from './components/Jobs'
import JobDetails from './components/JobDetails'
import JobOffer from './components/JobOffer'

function App() {
 

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
          path="/my-jobs"
          element={
            <ProtectedRoute>
              <MyJobs/>
            </ProtectedRoute>
          }
          />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route
            path="/my-jobs"
            element={
              <RoleRoute allowed={['client']}>
                <MyJobs />
              </RoleRoute>
            }
          />
          <Route
            path="/jobs/:id/offers"
            element={
              <RoleRoute allowed={['client']}>
                <JobOffer />
              </RoleRoute>
            }
          />
          <Route
            path="/my-offers"
            element={
              <RoleRoute allowed={['worker']}>
                <MyOffers />
              </RoleRoute>
            }
          />
        </Routes>
      </div>
    </>
  )
}

export default App

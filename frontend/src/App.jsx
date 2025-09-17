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
import ProfileEdit from './components/ProfileEditPage'
import ProfilePage from './components/ProfilePage'
import ProfileCreate from './components/ProfileCreate'
import JobCreate from './components/JobCreate'
import JobEdit from './components/JobEdit'
import PublicProfileView from './components/PublicProfileView'
import OfferCreate from './components/OfferCreate'
import OfferDetails from './components/OfferDetails'
import WorkersList from './components/WorkersList'
import MessagesInbox from './components/MessagesInbox'
import Settings from './components/Settings'
import Blog from './components/Blog'
import Footer from './components/Footer'
import HowToChooseWorker from './components/HowToChooseWorker'
import HeroWelcome from './components/Welcome'
import WorkerCommentsPage from './components/WorkerCommentsPage'
import CreateCommentPage from './components/CreateCommentPage'
import AdminUsers from './components/AdminUsers'


function App() { 
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
      <Routes>
        <Route path="/" element={<HeroWelcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/chooseworker" element={<HowToChooseWorker />} />
        <Route path="/public-profiles/:id" element={<PublicProfileView />} />
        <Route path="/public-profiles/:id/comments" element={<WorkerCommentsPage />} />
        <Route path="/comments/new" element={<CreateCommentPage/>}/>
        <Route path="/workers" element={<WorkersList />} />
        {/* <Route path="/messages/profile/:id" element={<MessageProfileView />} /> */}
        <Route path="/messages" element={<MessagesInbox />} />
        <Route path="/messages/:id" element={<MessagesInbox />} />
        <Route path="/messages/profile/:id" element={<MessagesInbox />} />

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
        <Route
          path="/offers/:id"
          element={
            <RoleRoute allowed={['worker']}>
              <OfferDetails />
            </RoleRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/create"
          element={
            <ProtectedRoute>
              <ProfileCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowed={['admin']}>
              <AdminUsers />
            </RoleRoute>
          }
        />

        <Route
          path="/jobs/create"
          element={
            <RoleRoute allowed={['client']}>
              <JobCreate />
            </RoleRoute>
          }
        />
        <Route
          path="/jobs/:id/edit"
          element={
            <RoleRoute allowed={['client']}>
              <JobEdit />
            </RoleRoute>
          }
        />
        <Route path="/offers/create" element={<OfferCreate />} />
        {/* <Route path="/jobs/:id/offers" element={<JobOffer />} /> */}
      </Routes>
      </div>
      <Footer/>
    </>
  )
}

export default App

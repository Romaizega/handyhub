// import { useParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import api from '../app/axios'
// import Chat from '../components/Chat'

// const MessageProfileView = () => {
//   const { id } = useParams()
//   const [profile, setProfile] = useState(null)
//   const [userData, setUserData] = useState(null)
//   const [error, setError] = useState("")
//   const [showChat, setShowChat] = useState(true)

//   const { user } = useSelector((state) => state.auth)
//   const currentProfileId = user?.profile?.id

//   useEffect(() => {
//     api.get(`/profiles/by-user/${id}`)
//       .then(({ data }) => {
//         setProfile(data.profile)
//         setUserData(data.user)
//       })
//       .catch(err => {
//         console.error("API error:", err.response || err)
//         setError("Failed to load profile")
//       })
//   }, [id])

//   if (error) return <div className="text-red-500">{error}</div>
//   if (!profile || !userData) return <div>Loading…</div>

//   const isOwnProfile = currentProfileId === profile.id

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white rounded shadow flex flex-col gap-4">
//       <h1 className="text-2xl font-bold mb-2">{profile.display_name}</h1>

//       {profile.avatar_url && (
//         <img
//           src={profile.avatar_url}
//           alt="Avatar"
//           className="w-32 h-32 rounded-full mt-4 object-cover"
//         />
//       )}

//       <p className="text-gray-600"><strong>Role:</strong> {userData.role}</p>
//       {profile.about && <p className="text-gray-600"><strong>About:</strong> {profile.about}</p>}
//       {profile.city && <p className="text-gray-600"><strong>City:</strong> {profile.city}</p>}
//       {profile.skills && <p className="text-gray-600"><strong>Skills:</strong> {profile.skills}</p>}
//       {profile.hourly_rate && (
//         <p className="text-gray-600"><strong>Hourly Rate:</strong> ${profile.hourly_rate}</p>
//       )}

//       {!isOwnProfile && (
//         <button
//           className="btn btn-outline w-fit"
//           onClick={() => setShowChat(prev => !prev)}
//         >
//           {showChat ? "Hide Chat" : "Send Message"}
//         </button>
//       )}

//       {showChat && !isOwnProfile && (
//         <Chat
//           currentProfileId={currentProfileId}
//           otherProfileId={profile.id}
//         />
//       )}
//     </div>
//   )
// }

// export default MessageProfileView

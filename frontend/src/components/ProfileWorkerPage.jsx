// import { Link } from 'react-router-dom'

// const ProfileWorkerPage = ({ profile, userData, jobId }) => {
//   if (!profile || !userData) return null

//   return (
//     <div className="card bg-base-100 shadow p-4">
//       <div className="flex items-center gap-4">
//         {profile.avatar_url && (
//           <img
//             src={profile.avatar_url}
//             alt={profile.display_name}
//             className="w-20 h-20 rounded-full object-cover"
//           />
//         )}
//         <div>
//           <h2 className="text-xl font-bold">{profile.display_name}</h2>
//           <p className="text-gray-600"><strong>Skills:</strong> {profile.skills}</p>
//           <p className="text-gray-600"><strong>Rate:</strong> ${profile.hourly_rate}</p>
//         </div>
//       </div>

//       <div className="mt-4 flex gap-2">
//         {jobId && (
//           <Link to={`/offers/create?job=${jobId}`} className="btn btn-primary btn-sm">
//             Make Offer
//           </Link>
//         )}
//         <button className="btn btn-outline btn-sm" onClick={() => alert("Chat coming soon…")}>
//           Message
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ProfileWorkerPage

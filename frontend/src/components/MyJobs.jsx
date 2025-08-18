import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getMyJobs } from "../features/jobs/jobThunk"
import { AUTH_STATUS } from "../features/auth/authConstants"

const MyJobs = () => {
  const dispatch = useDispatch()
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const { myjobs, status, error } = useSelector((s) => s.jobs)

  useEffect(() => {
    if (status === AUTH_STATUS.IDLE) {
      dispatch(getMyJobs())
    }
  }, [status, dispatch])

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My jobs</h1>
        <div className="alert alert-error">
          <span>{typeof error === "string" ? error : error.message || "Error"}</span>
        </div>
      </div>
    )
  }

  const isEmpty = !Array.isArray(myjobs) || myjobs.length === 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My jobs</h1>
        <Link to="/jobs/create" className="btn btn-neutral">
          Create a new job
        </Link>
      </div>

      {isEmpty ? (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body items-center text-center">
            <h2 className="card-title">You do not have any offers</h2>
            <p className="text-base-content/70">
              Create your first job to receive a first offer  
            </p>
            <div className="card-actions mt-3">
              <Link to="/jobs/create" className="btn btn-neutral">
                Create job
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {myjobs.map((job) => {
            const title = job.title || "Without name"
            const desc =
              (job.description || "").length > 140
                ? job.description.slice(0, 140) + "…"
                : job.description || "—"
            const budget =
              job.budget != null && job.budget !== ""
                ? `$${Number(job.budget).toLocaleString()}`
                : "—"
            const due = job.due_date ? new Date(job.due_date).toLocaleDateString() : "—"

            return (
              <div
                key={job.id}
                className="card bg-base-100 shadow-sm border border-base-200"
              >
                <div className="card-body gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="card-title text-lg">{title}</h3>
                    <span className="badge badge-outline capitalize">{job.status}</span>
                  </div>
                  <p className="text-base-content/70">{desc}</p>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="opacity-60">Budget:</span>
                      <span className="font-medium">{budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="opacity-60">Deadline:</span>
                      <span className="font-medium">{due}</span>
                    </div>
                  </div>

                  {/* Photos */}
                  {Array.isArray(job.photos) && job.photos.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-base-content/70 mb-2">
                        Attached photos:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {job.photos.slice(0, 4).map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            loading="lazy"
                            alt={`job photo ${idx + 1}`}
                            className="w-full h-90 object-cover rounded cursor-pointer hover:opacity-90 transition"
                            onClick={() => setSelectedPhoto(photo)}
                          />
                        ))}
                      </div>
                      {job.photos.length > 4 && (
                        <p className="text-sm mt-1 text-blue-500">
                          +{job.photos.length - 4} more
                        </p>
                      )}
                    </div>
                  )}

                  <div className="card-actions justify-end mt-2">
                    <Link to={`/jobs/${job.id}`} className="btn btn-ghost btn-sm">
                      Look
                    </Link>
                    <Link
                      to={`/jobs/${job.id}/offers`}
                      className="btn btn-neutral btn-sm"
                    >
                      Offers
                    </Link>
                    <Link to={`/jobs/${job.id}/edit`} className="btn btn-outline btn-sm">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal preview */}
      {selectedPhoto && (
        <dialog open className="modal">
          <div className="modal-box max-w-3xl">
            <img
              src={selectedPhoto}
              alt="Selected photo"
              className="w-full h-[70vh] object-contain rounded"
            />
            <div className="modal-action">
              <button onClick={() => setSelectedPhoto(null)} className="btn">
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default MyJobs
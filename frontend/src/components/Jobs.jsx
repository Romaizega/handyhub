import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllJobs } from '../features/jobs/jobThunk';
import { Link } from 'react-router-dom'


const AllJobs = () => {
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading jobs…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
      {jobs.map(job => (
      <div key={job.id} className="border rounded p-4 shadow-sm hover:shadow transition mb-4">
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1">{job.title}</h2>
            <p className="text-sm text-gray-700 mb-2">{job.description}</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Status:</strong> {job.status}</p>
              {job.budget && <p><strong>Budget:</strong> ${job.budget}</p>}
              {job.due_date && <p><strong>Due:</strong> {new Date(job.due_date).toLocaleDateString()}</p>}
            </div>
            <Link
          to={`/jobs/${job.id}`}
          className="btn btn-sm btn-outline mt-2"
        >
          View details
        </Link>
          </div>
          {job.photos?.length > 0 && (
            <img
              src={job.photos[0]}
              alt="Job preview"
              className="w-28 h-28 object-cover rounded"
            />
          )}
        </div>
    </div>
))}
    </div>
  );

}


export default AllJobs
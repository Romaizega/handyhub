import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllJobs } from '../features/jobs/jobThunk';
import { Link } from 'react-router-dom';

const AllJobs = () => {
  const dispatch = useDispatch();
  const { jobs, status, error } = useSelector((state) => state.jobs);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [cityFilter, setCityFilter] = useState('');
  const cities = useMemo(() => {
    const allCities = jobs?.map(job => job.city).filter(Boolean);
    return [...new Set(allCities)];
  }, [jobs]);

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];

    return jobs
      .filter(job => statusFilter === 'all' || job.status === statusFilter)
      .filter(job => job.title?.toLowerCase().includes(search.toLowerCase()))
      .filter(job => !cityFilter || job.city === cityFilter)
      .sort((a, b) => {
        if (sortBy === 'budget') return b.budget - a.budget;
        if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
        return new Date(b.created_at) - new Date(a.created_at); 
      });
  }, [jobs, statusFilter, search, sortBy, cityFilter]);

  if (status === 'loading') return <p>Loading jobs…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">All Jobs</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'open', 'in_progress', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`btn btn-sm ${statusFilter === status ? 'btn-neutral' : 'btn-outline'}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* ✅ Добавлено: фильтр по городам */}
        <div className="flex gap-2 items-center">
          <select
            className="select select-bordered select-sm"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            className="select select-bordered select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="budget">Highest Budget</option>
          </select>

          <input
            type="text"
            placeholder="Search jobs…"
            className="input input-bordered input-sm w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Jobs grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className="card bg-base-100 shadow hover:shadow-lg transition"
          >
            <div className="card-body">
              <h2 className="card-title text-xl ">{job.title}</h2>
              <p className="text-sm mt-2 space-y-2"><strong>City: </strong>{job.city}</p>

              <div className="text-sm mt-2 space-y-1">
                <p><strong>Status:</strong> {job.status}</p>
                {job.budget && <p><strong>Budget:</strong> ${job.budget}</p>}
                {job.due_date && (
                  <p>
                    <strong>Due:</strong>{' '}
                    {new Date(job.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              {job.photos?.length > 0 && (
                <img
                  src={job.photos[0]}
                  alt="Job preview"
                  className="mt-3 rounded-lg h-32 object-cover"
                />
              )}

              <div className="mt-4">
                <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline w-full">
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No jobs found for your filters.</p>
      )}
    </div>
  );
};

export default AllJobs;

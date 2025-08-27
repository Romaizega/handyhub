import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import api from '../app/axios'

import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  BoltIcon,
  TruckIcon,
  SparklesIcon,
  MapPinIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'

export default function Home() {
  const navigate = useNavigate()
  const { user, accessToken } = useSelector((s) => s.auth)
  const isAuthed = Boolean(user && accessToken)
  const role = user?.role

  const [q, setQ] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const { data } = await api.get('/jobs', { params: { limit: 6, order: 'desc' } })
        const items = Array.isArray(data?.jobs)
          ? data.jobs
          : Array.isArray(data)
          ? data
          : Array.isArray(data?.rows)
          ? data.rows
          : []
        if (alive) setJobs(items.slice(0, 6))
      } catch {
        if (alive) setErr('Could not load recent jobs')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const onSearch = (e) => {
    e.preventDefault()
    const query = q.trim()
    navigate(query ? `/jobs?q=${encodeURIComponent(query)}` : '/jobs')
  }

  const categories = [
    { name: 'Plumbing', icon: WrenchScrewdriverIcon, key: 'plumbing' },
    { name: 'Electrical', icon: BoltIcon, key: 'electrical' },
    { name: 'Painting', icon: PaintBrushIcon, key: 'painting' },
    { name: 'Cleaning', icon: SparklesIcon, key: 'cleaning' },
    { name: 'Moving', icon: TruckIcon, key: 'moving' },
    { name: 'General Help', icon: BriefcaseIcon, key: 'general' },
  ]

  return (
    <div className="space-y-14 animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="w-full bg-base-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold leading-tight">
            Find reliable help for any home project
          </h1>
          <p className="opacity-70 mt-2">
            Post a job in minutes or browse hundreds of tasks near you.
          </p>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8">
          {/* LEFT: Video */}
          <div className="w-full md:w-1/2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
              <video
                src="/src/assets/demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT: Text + Search + Buttons */}
          <div className="w-full md:w-1/2 space-y-6">

            <form onSubmit={onSearch}>
              <label className="input input-bordered flex items-center gap-2 shadow-md bg-white w-full">
                <MagnifyingGlassIcon className="w-5 h-5 opacity-60" />
                <input
                  className="grow"
                  placeholder="Try: paint walls, install shelves, move sofa…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <button className="btn btn-neutral btn-sm" type="submit">
                  Search
                </button>
              </label>
            </form>

            <div className="flex flex-wrap gap-3">
              {!isAuthed ? (
                <>
                  <Link to="/register" className="btn btn-neutral-content-outline">
                    Create account
                  </Link>
                  <Link to="/jobs" className="btn btn-outline">
                    Browse jobs
                  </Link><br /><br />
            <div className="p-4 bg-base-200 rounded-md">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                AI creates your job post for you
              </h2>
              <p className="text-base opacity-70">
                Just describe the issue or upload a photo — HandyHub will help you write the perfect task for professionals.
              </p>
            </div>
                </>
              ) : role === 'client' ? (
                <>
                  <Link to="/my-jobs" className="btn btn-neutral">
                    My Jobs
                  </Link>
                  <Link to="/workers" className="btn btn-outline">
                    Find workers
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/jobs" className="btn btn-neutral">
                    Find jobs
                  </Link>
                  <Link to="/my-offers" className="btn btn-outline">
                    My offers
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: UserGroupIcon, title: '1. Post or Search', desc: 'Clients post tasks, workers search jobs.' },
            { icon: ClockIcon, title: '2. Get offers fast', desc: 'Get proposals and chat instantly.' },
            { icon: ShieldCheckIcon, title: '3. Hire & done', desc: 'Hire confidently. Leave feedback.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card bg-base-100 shadow-md hover:shadow-lg transition">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-1">
                  <Icon className="w-6 h-6" />
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="opacity-70 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Popular categories</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(({ name, icon: Icon, key }) => (
            <Link
              key={key}
              to={`/jobs?category=${encodeURIComponent(key)}`}
              className="card bg-base-100 shadow-sm hover:shadow-lg transition transform hover:scale-[1.02]"
            >
              <div className="card-body flex-row items-center gap-3">
                <div className="p-2 rounded-lg bg-base-200">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium">{name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* RECENT JOBS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent jobs</h2>
          <Link to="/jobs" className="btn btn-sm btn-ghost">View all</Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-sm p-4 animate-pulse space-y-2">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : err ? (
          <div className="alert alert-warning">{err}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="card bg-base-100 hover:shadow-lg transition hover:scale-[1.01]"
              >
                {job.photos?.length > 0 && (
                  <img
                    src={job.photos[0]}
                    alt="Job"
                    className="h-40 w-full object-cover rounded-t"
                  />
                )}
                <div className="card-body">
                  <h3 className="card-title text-base">{job.title || `Job #${job.id}`}</h3>
                  <p className="opacity-80 line-clamp-2">{job.description || 'No description'}</p>
                  <div className="mt-2 text-sm opacity-70 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {job.city || 'Remote'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BanknotesIcon className="w-4 h-4" />
                      {job.budget ? `$${job.budget}` : 'Budget: —'}
                    </span>
                  </div>
                  <div className="card-actions justify-end mt-3">
                    <span className="badge badge-outline">{job.category || 'General'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="card bg-gradient-to-r from-neutral to-base-200 text-neutral-content shadow-lg">
          <div className="card-body items-center text-center">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <SparklesIcon className="w-6 h-6" />
              Ready to get something done?
            </h3>
            <p className="opacity-90">Join thousands of happy clients and pros on HandyHub</p>
            <div className="card-actions mt-3">
              {!isAuthed ? (
                <Link to="/register" className="btn btn-neutral-content">Get started</Link>
              ) : role === 'client' ? (
                <Link to="/my-jobs" className="btn btn-neutral">Post a job</Link>
              ) : (
                <Link to="/jobs" className="btn btn-neutral">Find jobs</Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom';

export default function HowToChooseWorker() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900">
        How to Choose the Right Worker
      </h1>

      <p className="text-gray-700 text-lg">
        Hiring a worker can feel like dating—swipe right for skill, not just charm. Here's how to make sure you don’t get ghosted by your drywall guy:
      </p>

      <ul className="space-y-4 text-gray-800">
        <li>
          <strong>Credentials & Past Projects</strong> – Check licenses, insurance, and portfolios.{' '}
          <span className="text-gray-600">Proof is more important than promises.</span>
        </li>
        <li>
          <strong>Multiple Quotes</strong> – Get at least three.{' '}
          <span className="text-gray-600">Don’t just chase the cheapest — clarity is king.</span>
        </li>
        <li>
          <strong>Communication</strong> – If they explain things clearly and respond fast, it’s a good sign.
        </li>
        <li>
          <strong>Client Feedback</strong> – Dive into the reviews like you're on Yelp with a mission.{' '}
          <span className="text-gray-600">Watch for patterns, not just stars.</span>
        </li>
        <li>
          <strong>Written Agreement</strong> – Scope, cost, and timeline in writing.{' '}
          <span className="text-gray-600">Surprises belong in parties, not in projects.</span>
        </li>
      </ul>

      <p className="text-gray-700">
        Choose smart now, save yourself the headaches (and wallet burn) later. You've got this.
      </p>

      <div className="pt-6">
        <Link
          to="/blog/common-renovation-mistakes"
          className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-5 rounded-md transition shadow-sm"

        >
          Avoid Renovation Mistakes Next
        </Link>
      </div>
    </div>
  );
}

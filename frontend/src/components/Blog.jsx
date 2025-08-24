import { Link } from 'react-router-dom';

export default function Blog() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">HandyHub Blog</h1>
        <p className="opacity-80 text-lg">
          This is where we’ll share helpful tips, articles, and insights for clients and professionals
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/chooseworker"
          className="card bg-base-100 shadow-md hover:shadow-lg transition hover:scale-[1.01]"
        >
          <div className="card-body">
            <h3 className="card-title">How to Choose the Right Worker</h3>
            <p className="opacity-80 text-sm">
              Key factors to consider when selecting a professional for your project.
            </p>
          </div>
        </Link>

        <Link
          to="/blog/hiring-tips"
          className="card bg-base-100 shadow-md hover:shadow-lg transition hover:scale-[1.01]"
        >
          <div className="card-body">
            <h3 className="card-title">What to Consider Before Hiring</h3>
            <p className="opacity-80 text-sm">
              A quick checklist to avoid common issues and misunderstandings.
            </p>
          </div>
        </Link>

        <Link
          to="/blog/common-renovation-mistakes"
          className="card bg-base-100 shadow-md hover:shadow-lg transition hover:scale-[1.01]"
        >
          <div className="card-body">
            <h3 className="card-title">Common Home Renovation Mistakes</h3>
            <p className="opacity-80 text-sm">
              Frequent pitfalls during home improvement projects—and how to avoid them.
            </p>
          </div>
        </Link>

        <Link
          to="/blog/diy-vs-pro"
          className="card bg-base-100 shadow-md hover:shadow-lg transition hover:scale-[1.01]"
        >
          <div className="card-body">
            <h3 className="card-title">DIY or Hire a Pro?</h3>
            <p className="opacity-80 text-sm">
              When it makes sense to do it yourself—and when it absolutely doesn’t.
            </p>
          </div>
        </Link>

        <Link
          to="/blog/questions-before-contract"
          className="card bg-base-100 shadow-md hover:shadow-lg transition hover:scale-[1.01]"
        >
          <div className="card-body">
            <h3 className="card-title">Top Questions to Ask Before Signing a Contract</h3>
            <p className="opacity-80 text-sm">
              Protect yourself with these essential questions every homeowner should ask.
            </p>
          </div>
        </Link>
      </div>

      <div className="pt-10 space-y-3 text-center">
        <h2 className="text-xl font-semibold">Meanwhile on every home project…</h2>
        <div className="flex justify-center">
          <img
            src="https://media.istockphoto.com/id/934043578/video/the-guy-with-the-glasses-contorts-funny-faces.jpg?s=640x640&k=20&c=emaU2Wjuts9WfOhHRJw-wfXzqSF-_I1a8hP707SOunc="
            alt="Renovation meme"
            className="rounded-lg shadow-lg max-w-full md:max-w-xl"
          />
        </div>
        <p className="text-sm opacity-60 italic">
          "I'll just fix this real quick..." — 7 hours later 💀
        </p>
      </div>
    </div>
  );
}

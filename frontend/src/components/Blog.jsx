import { Link } from 'react-router-dom'

export default function Blog() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">HandyHub Blog</h1>
      <p className="opacity-80 text-lg">
        This is where we’ll share helpful tips, articles, and insights for clients and professionals
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: 'How to Choose the Right Worker',
            desc: 'Key factors to consider when selecting a professional for your project.',
            to: '/blog/how-to-choose-worker',
          },
          {
            title: 'What to Consider Before Hiring',
            desc: 'A quick checklist to avoid common issues and misunderstandings.',
            to: '/blog/hiring-tips',
          },
          {
            title: 'Common Home Renovation Mistakes',
            desc: 'Frequent pitfalls during home improvement projects—and how to avoid them.',
            to: '/blog/common-renovation-mistakes',
          },
        ].map(({ title, desc, to }) => (
          <Link
            to={to}
            key={title}
            className="card bg-base-100 shadow-md hover:shadow-lg transition hover:scale-[1.01]"
          >
            <div className="card-body">
              <h3 className="card-title">{title}</h3>
              <p className="opacity-80 text-sm">{desc}</p>
            </div>
          </Link>
        ))}
        <div className="pt-10">
      </div>
    </div>
  <h2 className="text-xl font-semibold mb-3 text-center">Meanwhile on every home project…</h2>
  <div className="flex justify-center">
    <img
      src="https://media.istockphoto.com/id/934043578/video/the-guy-with-the-glasses-contorts-funny-faces.jpg?s=640x640&k=20&c=emaU2Wjuts9WfOhHRJw-wfXzqSF-_I1a8hP707SOunc="
      alt="Renovation meme"
      className="rounded-lg shadow-lg max-w-full md:max-w-xl"
    />
  </div>
  <p className="text-center mt-3 text-sm opacity-60 italic">"I'll just fix this real quick..." — 7 hours later 💀</p>
</div>
  )
}

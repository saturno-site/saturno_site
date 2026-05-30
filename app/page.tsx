export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),transparent_40%),linear-gradient(180deg,#ffffff_0%,#eff4fb_100%)] text-slate-950">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-12">
        <header className="flex items-center justify-between gap-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-600">Saturno</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Landing page demo for fast client review.
            </h1>
          </div>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Contact us
          </a>
        </header>

        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              Demo ready in minutes
            </span>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Beautiful, modern landing page designed for your product launch.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                This lightweight Next.js demo is built to showcase your brand, explain your offer, and capture client feedback quickly.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
              >
                View features
              </a>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-950 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Schedule a review
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Launch-ready sections</p>
            <div className="mt-6 space-y-6 text-slate-700">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Hero section</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Clear messaging, a strong call to action, and a polished first impression.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Responsive design</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Built with Tailwind CSS for fast client review across desktop and mobile.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Easy to customize</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Swap messaging, colors, and visuals to match your brand instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20 grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Fast review",
              description:
                "A clean demo page that is ready to show your client without extra setup.",
            },
            {
              title: "Clear storytelling",
              description:
                "Highlight your product value, benefits, and next steps in a single page.",
            },
            {
              title: "Modern styling",
              description:
                "Soft gradients, crisp typography, and accessible spacing for polished delivery.",
            },
          ].map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-20 rounded-[2rem] bg-slate-950 px-8 py-12 text-white shadow-2xl shadow-slate-900/20">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Ready to preview</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Use this page to gather early client feedback before launch.
            </h2>
            <p className="text-base leading-7 text-slate-300">
              The demo is fully functional, easy to update, and ready for a quick presentation or remote review.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Request changes
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open site preview
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

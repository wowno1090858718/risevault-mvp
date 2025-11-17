import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top Navigation */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              RiseVault
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:px-8 sm:pt-24">
        {/* Hero Section */}
        <section className="mb-24 space-y-6 sm:mb-32">
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Trust layer for real student work
            </h1>
            <h2 className="text-xl font-normal text-gray-600 sm:text-2xl lg:text-3xl">
              Turn daily work into a trusted, verifiable résumé.
            </h2>
            <p className="text-lg font-normal text-gray-600 sm:text-xl">
              In the AI résumé era, trust has to come from real work.
            </p>
          </div>

          <p className="mt-4 mb-8 max-w-3xl text-base sm:text-lg text-gray-600">
            RiseVault turns daily work into a continuous, structured record — ensuring
            résumés, portfolios, and AI tools reflect what actually happened. Used first
            by students, with a pathway to professionals. Students feel this pain first — recruiters and professionals benefit as verification becomes more standard.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/mvp"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Try the Demo
            </Link>
            <a
              href="https://www.youtube.com/watch?v=KsLqbxnvGIw"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Open live demo
            </a>
          </div>
        </section>

        {/* What we're validating now Section */}
        <section className="mb-24 space-y-6 sm:mb-32">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            What we&apos;re validating now
          </h2>
          <div className="space-y-4 max-w-3xl">
            <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
              <em>This early demo exists to validate behavior, not to ship a full product.</em>
            </p>
            <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
              In this phase, we&apos;re focused on validating three core questions:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>Will students actually record and lightly verify their work if the workflow is simple enough?</li>
              <li>Does having more credible, grounded proof of work meaningfully affect internship and job outcomes?</li>
              <li>Do verified, time-stamped logs increase trust for recruiters and admissions officers compared to a standard résumé?</li>
            </ul>
          </div>
        </section>

        {/* Problem Section */}
        <section className="mb-24 space-y-6 sm:mb-32">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Problem
          </h2>
          <div className="space-y-4 max-w-3xl">
            <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
              Students produce meaningful work every day — projects, research, iterations,
              late-night fixes — but most of it disappears into chats, docs, or private
              repos. When it&apos;s time to apply, résumés are rebuilt from memory, and
              there&apos;s no reliable way for others (or AI tools) to trust what&apos;s written.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>Real work gets lost across tools — nothing is tracked end-to-end</li>
              <li>Résumés are rebuilt from memory instead of backed by evidence</li>
              <li>AI makes exaggeration easier, and real trust harder to earn</li>
            </ul>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="mb-24 space-y-6 sm:mb-32">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Our approach
          </h2>
          <div className="space-y-4 max-w-3xl">
            <p className="text-base font-medium text-gray-900 sm:text-lg">
              A trust layer built from the smallest unit: daily contributions.
            </p>
            <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
              We treat each contribution as a small, timestamped unit of truth. Verified
              logs roll up into an AI-ready résumé view and timeline — giving students a
              continuous history of work and giving others a reason to trust it.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>Log real work in short, lightweight snippets</li>
              <li>Lightweight verification from peers, teammates, mentors</li>
              <li>Generate résumé bullets directly from verified history</li>
            </ul>
          </div>
        </section>

        {/* How the Demo Works Section */}
        <section className="mb-24 space-y-8 sm:mb-32">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            How the demo works
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-gray-700 sm:text-lg">
            This demo tests one thing: will anyone use Record → Verify → Résumé?
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700">
                  1
                </div>
                <div className="text-base font-semibold text-gray-900">Record</div>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                Capture today&apos;s contribution in a sentence or two, with
                project context and a timestamp.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700">
                  2
                </div>
                <div className="text-base font-semibold text-gray-900">Verify &amp; timeline</div>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                Mark entries as verified and see them roll into a clean, chronological timeline.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700">
                  3
                </div>
                <div className="text-base font-semibold text-gray-900">Résumé view</div>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                Generate summary bullets and expand to see the underlying verified logs.
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Verification Section */}
        <section id="trust-model" className="mb-24 space-y-8 sm:mb-32">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Trust & verification
          </h2>
          <div className="space-y-6">
            <p className="max-w-3xl text-base leading-relaxed text-gray-700 sm:text-lg">
              This version illustrates the essential loop of recording real work, lightly
              verifying it, and turning it into a trustworthy résumé output. The verification
              step is intentionally simplified, but reflects the real-world flow where
              teammates, mentors, or managers acknowledge a contribution&apos;s accuracy.
            </p>
            <p className="max-w-3xl text-base leading-relaxed text-gray-700 sm:text-lg">
              Verification isn&apos;t about policing—it&apos;s about giving others a concrete reason to trust your work.
            </p>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:bg-gray-50">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700">
                    1
                  </div>
                  <div className="text-base font-semibold text-gray-900">Self-attested logs</div>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  Timestamped records created by the student — forming the foundational layer of trust.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:bg-gray-50">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700">
                    2
                  </div>
                  <div className="text-base font-semibold text-gray-900">Peer confirmation</div>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  A lightweight &quot;verify&quot; action representing acknowledgement from teammates,
                  mentors, or managers.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:bg-gray-50">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700">
                    3
                  </div>
                  <div className="text-base font-semibold text-gray-900">Future extensions</div>
                </div>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  Stronger verification via manager approvals, linked artifacts, and an auditable
                  time-based history (roadmap).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20 space-y-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-1 text-base sm:text-lg font-semibold text-gray-900">Xavier Chen</div>
              <div className="mb-2 text-sm text-gray-500">Founder / Product</div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Building trustworthy ways for students to prove real work — without exposing sensitive data.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-1 text-base sm:text-lg font-semibold text-gray-900">Sujay Sundar</div>
              <div className="mb-2 text-sm text-gray-500">Full-stack / Data / Infra</div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Engineering scalable systems that turn raw daily activity into structured, verifiable records.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-1 text-base sm:text-lg font-semibold text-gray-900">Amanda Zhang</div>
              <div className="mb-2 text-sm text-gray-500">Product Design / UX</div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Designing frictionless, student-first interfaces that fit naturally into real workflows.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:px-8">
          <div className="flex flex-col gap-1">
            <span>Built at NYU and iterated with early student feedback from project-based majors.</span>
            <span>© {new Date().getFullYear()} RiseVault.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:a.x.chen@outlook.com"
              className="transition-colors hover:text-gray-700"
            >
              Contact
            </a>
            <span className="text-gray-300">•</span>
            <Link href="/mvp" className="transition-colors hover:text-gray-700">
              Open Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}



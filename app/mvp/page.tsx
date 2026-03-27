'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Role = 'decisions' | 'builder' | 'manager'

const ROLE_CONTENT: Record<Role, { heading: string; body: string; sub: string }> = {
  decisions: {
    heading: 'For Recruiter',
    body: 'Make faster, lower-risk hiring decisions.',
    sub: 'See real capability through signals — not claims.',
  },
  builder: {
    heading: 'For Builder',
    body: 'Turn your work into signals of capability — instantly.',
    sub: 'Signals compound into a track record over time.',
  },
  manager: {
    heading: 'For Manager',
    body: 'Validate work in seconds — and build trust.',
    sub: 'Your feedback becomes a signal of both capability and support.',
  },
}

const ROLE_OPTIONS: Array<{ id: Role; label: string }> = [
  { id: 'decisions', label: 'Make decisions' },
  { id: 'builder', label: 'Build signals' },
  { id: 'manager', label: 'Support signals' },
]

type RecruiterPhase = 'value' | 'scan' | 'comparison' | 'profile'

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function CandidateProfilePanel() {
  const rows: [string, string][] = [
    ['Consistency', 'High'],
    ['Problem Solving', 'Strong'],
    ['Verification', 'Verified by manager (15)'],
    ['Feedback loops', '5'],
    ['Signal strength', 'High'],
    ['AI Use', 'Thoughtful'],
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm sm:p-8">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Candidate Profile</div>
      <div className="mt-2 text-xl font-semibold tracking-tight text-gray-900">Alex</div>
      <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Signals</div>
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700">Confidence</span>
          <span className="font-semibold text-gray-900">High</span>
        </div>
      </div>
    </div>
  )
}

export default function MVPPage() {
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [recruiterPhase, setRecruiterPhase] = useState<RecruiterPhase | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowRoleSelection(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  const selectRole = (id: Role) => {
    setSelectedRole(id)
    if (id === 'decisions') {
      setRecruiterPhase('value')
    } else {
      setRecruiterPhase(null)
    }
  }

  const showRecruiterFlow = selectedRole === 'decisions' && recruiterPhase !== null
  const recruiterDeep =
    selectedRole === 'decisions' &&
    recruiterPhase !== null &&
    recruiterPhase !== 'value'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-gray-900">
            RiseVault
          </Link>
          <span className="text-xs uppercase tracking-[0.16em] text-gray-400">MVP</span>
        </div>
      </header>

      <main
        className={cx(
          'mx-auto w-full max-w-3xl px-6',
          recruiterDeep ? 'py-10' : 'flex min-h-[calc(100vh-65px)] items-center py-16'
        )}
      >
        <div className="w-full space-y-12 text-center">
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 1</p>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              We are entering a signal economy
            </h1>
          </section>

          <section
            className={cx(
              'space-y-6 transition-[opacity,transform] duration-500 ease-out',
              showRoleSelection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            )}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 2</p>
              <h2 className="text-xl font-medium tracking-tight text-gray-900 sm:text-2xl">
                How do you use signals?
              </h2>
            </div>

            <div className="mx-auto grid w-full max-w-2xl gap-3 sm:grid-cols-3">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => selectRole(role.id)}
                  className={cx(
                    'rounded-xl border px-4 py-4 text-sm font-medium transition-[border-color,background-color,color,transform] duration-200',
                    'hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    selectedRole === role.id
                      ? 'border-indigo-200 bg-indigo-50 text-gray-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  )}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </section>

          {/* Default Step 3: Builder / Manager */}
          {selectedRole && selectedRole !== 'decisions' && (
            <section className="mx-auto w-full max-w-2xl transition-[opacity,transform] duration-500 ease-out">
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 px-6 py-7 text-left sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 3</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                  {ROLE_CONTENT[selectedRole].heading}
                </h3>
                <p className="mt-3 text-base text-gray-800">{ROLE_CONTENT[selectedRole].body}</p>
                <p className="mt-3 text-sm text-gray-500">{ROLE_CONTENT[selectedRole].sub}</p>
              </div>
            </section>
          )}

          {selectedRole === 'decisions' && recruiterPhase === 'value' && (
            <section className="mx-auto w-full max-w-2xl transition-[opacity,transform] duration-500 ease-out">
              <button
                type="button"
                onClick={() => setRecruiterPhase('scan')}
                className={cx(
                  'w-full cursor-pointer rounded-2xl border border-gray-200 bg-gray-50/70 px-6 py-7 text-left transition-all duration-200',
                  'hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  'active:scale-[0.995] sm:px-8'
                )}
                aria-label="Continue to recruiter pipeline"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 3</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                  {ROLE_CONTENT.decisions.heading}
                </h3>
                <p className="mt-3 text-base text-gray-800">{ROLE_CONTENT.decisions.body}</p>
                <p className="mt-3 text-sm text-gray-500">{ROLE_CONTENT.decisions.sub}</p>
              </button>
            </section>
          )}

          {selectedRole === 'decisions' && recruiterPhase === 'scan' && (
            <section className="mx-auto w-full max-w-2xl space-y-8 text-left transition-[opacity,transform] duration-500 ease-out">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Recruiter</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                  Scan hundreds of candidates in one view
                </h2>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-800">backend</span>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-800">verified</span>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-800">
                    high consistency
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="flex items-baseline justify-between rounded-xl border border-gray-100 px-4 py-3">
                    <span className="text-sm text-gray-600">Candidates</span>
                    <span className="text-2xl font-semibold tabular-nums text-gray-900">120</span>
                  </div>
                  <div className="flex items-baseline justify-between rounded-xl border border-gray-100 px-4 py-3">
                    <span className="text-sm text-gray-600">Shortlisted</span>
                    <span className="text-2xl font-semibold tabular-nums text-gray-900">12</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRecruiterPhase('comparison')}
                    className="flex w-full items-baseline justify-between rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-left transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="text-sm font-medium text-gray-800">Recommended</span>
                    <span className="text-2xl font-semibold tabular-nums text-indigo-900">3</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRecruiterPhase('value')}
                className="text-sm text-gray-500 underline-offset-4 hover:text-gray-800 hover:underline"
              >
                Back
              </button>
            </section>
          )}

          {selectedRole === 'decisions' && recruiterPhase === 'comparison' && (
            <section className="mx-auto w-full max-w-2xl space-y-8 text-left transition-[opacity,transform] duration-500 ease-out">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Comparison</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                  Candidate comparison
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRecruiterPhase('profile')}
                  className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-[border-color,transform] hover:-translate-y-0.5 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="text-sm font-semibold text-gray-900">Candidate A</div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>— strong résumé</li>
                    <li>— no verification</li>
                  </ul>
                  <p className="mt-4 text-xs text-gray-400">Click to view profile</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRecruiterPhase('profile')}
                  className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 text-left shadow-sm transition-[border-color,transform] hover:-translate-y-0.5 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="text-sm font-semibold text-gray-900">Candidate B</div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li>— consistent work logs</li>
                    <li>— verified contributions</li>
                    <li>— increasing problem complexity</li>
                  </ul>
                  <p className="mt-4 text-xs text-indigo-600">Click to view profile</p>
                </button>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-gray-900">Recommendation: B</span>
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-800">Risk: Low</span>
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-800">
                      Confidence: High
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700">This is not more information. This is a decision.</p>
              </div>

              <button
                type="button"
                onClick={() => setRecruiterPhase('scan')}
                className="text-sm text-gray-500 underline-offset-4 hover:text-gray-800 hover:underline"
              >
                Back
              </button>
            </section>
          )}

          {selectedRole === 'decisions' && recruiterPhase === 'profile' && (
            <section className="mx-auto w-full max-w-2xl space-y-6 text-left transition-[opacity,transform] duration-500 ease-out">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Profile</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                  Candidate Profile
                </h2>
              </div>
              <CandidateProfilePanel />
              <button
                type="button"
                onClick={() => setRecruiterPhase('comparison')}
                className="text-sm text-gray-500 underline-offset-4 hover:text-gray-800 hover:underline"
              >
                Back to comparison
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

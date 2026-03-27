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

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export default function MVPPage() {
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowRoleSelection(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

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

      <main className="mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-3xl items-center px-6 py-16">
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
                  onClick={() => setSelectedRole(role.id)}
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

          <section
            className={cx(
              'mx-auto w-full max-w-2xl transition-[opacity,transform] duration-500 ease-out',
              selectedRole ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            )}
          >
            {selectedRole && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 px-6 py-7 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 3</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                  {ROLE_CONTENT[selectedRole].heading}
                </h3>
                <p className="mt-3 text-base text-gray-800">{ROLE_CONTENT[selectedRole].body}</p>
                <p className="mt-3 text-sm text-gray-500">{ROLE_CONTENT[selectedRole].sub}</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

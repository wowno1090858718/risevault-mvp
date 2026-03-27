'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Role = 'decisions' | 'builder' | 'manager'

const RECRUITER_CONTENT = {
  heading: 'For Recruiter',
  body: 'Make faster, lower-risk hiring decisions.',
  sub: 'See real capability through signals - not claims.',
}

const MANAGER_CONTENT = {
  heading: 'For Manager',
  body: 'Validate work in seconds - and build trust.',
  sub: 'Your feedback becomes a signal of both capability and support.',
}

const ROLE_OPTIONS: Array<{ id: Role; label: string }> = [
  { id: 'decisions', label: 'Make decisions' },
  { id: 'builder', label: 'Build signals' },
  { id: 'manager', label: 'Support signals' },
]

type RecruiterPhase = 'value' | 'scan' | 'comparison' | 'profile'
type BuilderFlowStage = 'actions' | 'framing' | 'decision' | 'signal'
type BuilderWorkflow =
  | 'Fixing a bug'
  | 'Building a feature'
  | 'Analyzing data'
  | 'User research'
  | 'Improving performance'

const BUILDER_WORKFLOWS: BuilderWorkflow[] = [
  'Fixing a bug',
  'Building a feature',
  'Analyzing data',
  'User research',
  'Improving performance',
]

const BUILDER_WORKFLOW_ACTIONS: Record<BuilderWorkflow, string[]> = {
  'Fixing a bug': ['Investigated root cause', 'Reproduced the issue', 'Tested edge cases', 'Implemented a fix'],
  'Building a feature': ['Defined the feature scope', 'Built the core functionality', 'Handled edge scenarios', 'Validated the user flow'],
  'Analyzing data': ['Prepared the dataset', 'Explored key patterns', 'Validated assumptions', 'Summarized insights'],
  'User research': ['Framed research questions', 'Reviewed user feedback', 'Identified recurring friction', 'Synthesized findings'],
  'Improving performance': ['Profiled bottlenecks', 'Optimized heavy operations', 'Reduced unnecessary work', 'Validated performance gains'],
}

const BUILDER_SIGNAL_UPDATES: Record<BuilderWorkflow, string[]> = {
  'Fixing a bug': ['Debugging Discipline ↑', 'Execution ↑', 'Decision Quality ↑'],
  'Building a feature': ['Product Thinking ↑', 'Execution ↑', 'Decision Quality ↑'],
  'Analyzing data': ['Analytical Judgment ↑', 'Execution ↑', 'Decision Quality ↑'],
  'User research': ['User Understanding ↑', 'Product Thinking ↑', 'Decision Quality ↑'],
  'Improving performance': ['System Thinking ↑', 'Execution ↑', 'Decision Quality ↑'],
}

const BUILDER_WORKFLOW_DECISIONS: Record<BuilderWorkflow, string[]> = {
  'Fixing a bug': ['Stabilize the root issue first, then optimize', 'Patch quickly to recover users, then harden the fix'],
  'Building a feature': ['Clarify the core user flow before building', 'Build quickly and refine through iteration'],
  'Analyzing data': ['Validate signal quality before expanding analysis', 'Move fast on trends, then verify deeper'],
  'User research': ['Prioritize recurring patterns before edge feedback', 'Capture broad signals first, then deepen key interviews'],
  'Improving performance': ['Optimize the highest-impact bottlenecks first', 'Ship targeted improvements quickly, then iterate'],
}

const BUILDER_STAGE_TRANSITION_MS = 700

/** Idle timeout: advance recruiter demo during the first tour (clicks advance immediately; timers keep running per step until tour completes). */
const RECRUITER_AUTO_ADVANCE: Partial<
  Record<RecruiterPhase, { next: RecruiterPhase; ms: number }>
> = {
  /** Longer so hover / focus on the card is noticeable before the next step. */
  value: { next: 'scan', ms: 6500 },
  scan: { next: 'comparison', ms: 2400 },
  comparison: { next: 'profile', ms: 2600 },
}

/** First tour: show Profile briefly (click or idle) then return to For Recruiter; then idle tour stops. */
const PROFILE_AUTO_RETURN_MS = 2300

/** Fake import flow on Candidate Profile before returning to For Recruiter. */
const IMPORT_ANALYZE_MS = 1700

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function inferBuilderWorkflow(value: string): BuilderWorkflow {
  const text = value.toLowerCase().trim()
  if (!text) return 'Building a feature'
  if (/(bug|fix|error|issue|crash|broken|login)/.test(text)) return 'Fixing a bug'
  if (/(analy|data|metric|query|report|dashboard)/.test(text)) return 'Analyzing data'
  if (/(research|interview|survey|usability|feedback)/.test(text)) return 'User research'
  if (/(perf|performance|latency|slow|optimi|speed)/.test(text)) return 'Improving performance'
  return 'Building a feature'
}

function CandidateProfilePanel({
  analyzing,
  onImportClick,
}: {
  analyzing: boolean
  onImportClick: () => void
}) {
  const rows: [string, string][] = [
    ['Consistency', 'High'],
    ['Problem Solving', 'Strong'],
    ['Verification', 'Verified by manager (15)'],
    ['Feedback loops', '5'],
    ['Signal strength', 'High'],
    ['AI Use', 'Thoughtful'],
  ]

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm sm:p-8">
      {analyzing && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
        >
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600 motion-reduce:animate-none motion-reduce:border-indigo-400"
            aria-hidden
          />
          <p className="mt-3 text-sm font-medium text-gray-800">Analyzing...</p>
        </div>
      )}

      <div className={cx(analyzing && 'pointer-events-none select-none opacity-[0.35]')}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Candidate Profile</div>
            <div className="mt-2 text-xl font-semibold tracking-tight text-gray-900">Alex</div>
          </div>
          <div className="shrink-0 text-left sm:max-w-[min(100%,14rem)] sm:text-right">
            <p className="text-sm leading-snug text-gray-600">Want to try with your own candidates instead?</p>
            <button
              type="button"
              onClick={onImportClick}
              className="mt-2 text-sm font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-sm"
            >
              Import data →
            </button>
          </div>
        </div>

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
    </div>
  )
}

export default function MVPPage() {
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [recruiterPhase, setRecruiterPhase] = useState<RecruiterPhase | null>(null)
  const [showBuilderFlow, setShowBuilderFlow] = useState(false)
  const [builderInput, setBuilderInput] = useState('')
  const [builderWorkflow, setBuilderWorkflow] = useState<BuilderWorkflow | null>(null)
  const [builderSelectedActions, setBuilderSelectedActions] = useState<string[]>([])
  const [builderSelectedDecision, setBuilderSelectedDecision] = useState<string | null>(null)
  const [builderFlowStage, setBuilderFlowStage] = useState<BuilderFlowStage>('actions')
  const [builderFramingVisible, setBuilderFramingVisible] = useState(false)
  const [builderVerificationSent, setBuilderVerificationSent] = useState(false)
  /** After first tour returns from Profile to For Recruiter, no more idle auto-advance. */
  const [recruiterIdleTourDone, setRecruiterIdleTourDone] = useState(false)
  const [profileImportAnalyzing, setProfileImportAnalyzing] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowRoleSelection(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (recruiterIdleTourDone) return
    if (selectedRole !== 'decisions' || !recruiterPhase) return
    const cfg = RECRUITER_AUTO_ADVANCE[recruiterPhase]
    if (!cfg) return

    let ms = cfg.ms
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ms *= 2
    }

    const timer = window.setTimeout(() => {
      setRecruiterPhase(cfg.next)
    }, ms)
    return () => window.clearTimeout(timer)
  }, [selectedRole, recruiterPhase, recruiterIdleTourDone])

  /** First tour only: any path to Profile (click or idle) then returns to For Recruiter and ends the guided loop. */
  useEffect(() => {
    if (recruiterIdleTourDone) return
    if (selectedRole !== 'decisions' || recruiterPhase !== 'profile') return
    if (profileImportAnalyzing) return

    let ms = PROFILE_AUTO_RETURN_MS
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ms *= 2
    }

    const timer = window.setTimeout(() => {
      setRecruiterIdleTourDone(true)
      setRecruiterPhase('value')
    }, ms)
    return () => window.clearTimeout(timer)
  }, [selectedRole, recruiterPhase, recruiterIdleTourDone, profileImportAnalyzing])

  useEffect(() => {
    if (recruiterPhase !== 'profile') {
      setProfileImportAnalyzing(false)
    }
  }, [recruiterPhase])

  useEffect(() => {
    if (!profileImportAnalyzing) return

    let ms = IMPORT_ANALYZE_MS
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ms = Math.round(ms * 1.35)
    }

    const timer = window.setTimeout(() => {
      setProfileImportAnalyzing(false)
      setRecruiterIdleTourDone(true)
      setRecruiterPhase('value')
    }, ms)
    return () => window.clearTimeout(timer)
  }, [profileImportAnalyzing])

  useEffect(() => {
    setBuilderSelectedActions([])
    setBuilderSelectedDecision(null)
    setBuilderFlowStage('actions')
    setBuilderVerificationSent(false)
  }, [builderWorkflow])

  useEffect(() => {
    if (builderSelectedActions.length > 0) {
      setBuilderFlowStage('framing')
      return
    }
    setBuilderSelectedDecision(null)
    setBuilderFlowStage('actions')
    setBuilderVerificationSent(false)
  }, [builderSelectedActions])

  useEffect(() => {
    if (builderFlowStage !== 'framing') return
    const timer = window.setTimeout(() => setBuilderFlowStage('decision'), BUILDER_STAGE_TRANSITION_MS)
    return () => window.clearTimeout(timer)
  }, [builderFlowStage])

  useEffect(() => {
    if (builderFlowStage !== 'framing') {
      setBuilderFramingVisible(false)
      return
    }
    setBuilderFramingVisible(false)
    const frame = window.requestAnimationFrame(() => setBuilderFramingVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [builderFlowStage])

  useEffect(() => {
    if (!builderSelectedDecision) return
    setBuilderVerificationSent(false)
    setBuilderFlowStage('signal')
  }, [builderSelectedDecision])

  useEffect(() => {
    if (selectedRole !== 'builder') return
    const text = builderInput.trim()
    if (!text) return

    const timer = window.setTimeout(() => {
      const inferred = inferBuilderWorkflow(text)
      setBuilderWorkflow((prev) => (prev === inferred ? prev : inferred))
    }, 420)

    return () => window.clearTimeout(timer)
  }, [selectedRole, builderInput])

  const selectRole = (id: Role) => {
    setSelectedRole(id)
    setShowBuilderFlow(false)
    setBuilderInput('')
    setBuilderWorkflow(null)
    setBuilderSelectedActions([])
    setBuilderSelectedDecision(null)
    setBuilderFlowStage('actions')
    setBuilderFramingVisible(false)
    setBuilderVerificationSent(false)
    if (id === 'decisions') {
      setRecruiterPhase('value')
    } else {
      setRecruiterPhase(null)
    }
  }

  const handleBuilderConfirm = (rawValue: string) => {
    const normalized = rawValue.trim()
    if (!normalized) return
    setBuilderWorkflow(inferBuilderWorkflow(normalized))
  }

  const handleBuilderChipSelect = (workflow: BuilderWorkflow) => {
    setBuilderInput(workflow)
    setBuilderWorkflow(workflow)
  }

  const toggleBuilderAction = (action: string) => {
    setBuilderSelectedActions((prev) => (prev.includes(action) ? prev.filter((item) => item !== action) : [...prev, action]))
  }

  const selectBuilderDecision = (decision: string) => {
    setBuilderSelectedDecision(decision)
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

          {selectedRole === 'builder' && !showBuilderFlow && (
            <section className="mx-auto w-full max-w-2xl transition-[opacity,transform] duration-500 ease-out">
              <button
                type="button"
                onClick={() => setShowBuilderFlow(true)}
                className={cx(
                  'w-full cursor-pointer rounded-2xl border border-gray-200 bg-gray-50/70 px-6 py-7 text-left transition-all duration-200',
                  'hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  'active:scale-[0.995] sm:px-8'
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 3</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">For Candidate/Employee</h3>
                <p className="mt-3 text-base text-gray-800">Turn your work into signals of capability - instantly.</p>
                <p className="mt-3 text-sm text-gray-500">Signals compound into a track record over time.</p>
              </button>
            </section>
          )}

          {selectedRole === 'builder' && showBuilderFlow && (
            <section className="mx-auto w-full max-w-2xl space-y-6 text-left transition-[opacity,transform] duration-500 ease-out">
              {!builderWorkflow ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 px-6 py-7 sm:px-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 4</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">What are you working on?</h3>
                  <input
                    type="text"
                    value={builderInput}
                    onChange={(e) => setBuilderInput(e.target.value)}
                    onBlur={() => handleBuilderConfirm(builderInput)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleBuilderConfirm(builderInput)
                      }
                    }}
                    placeholder="e.g. login bug, building a feature, analyzing data"
                    className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  />
                  <p className="mt-5 text-sm text-gray-500">or select a common workflow</p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {BUILDER_WORKFLOWS.map((workflow) => (
                      <button
                        key={workflow}
                        type="button"
                        onClick={() => handleBuilderChipSelect(workflow)}
                        className={cx(
                          'rounded-full border px-3 py-1.5 text-sm transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                          'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        )}
                      >
                        {workflow}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-7 transition-[opacity,transform] duration-500 ease-out sm:px-8">
                  {builderFlowStage === 'actions' && (
                    <>
                      <p className="text-sm text-gray-600">
                        Based on similar workflows in <span className="font-semibold text-gray-900">{builderWorkflow}</span>,
                        {' '}you might have:
                      </p>
                      <p className="mt-4 text-sm font-medium text-gray-700">Select what you worked on today</p>
                      <div className="mt-4 grid gap-3">
                        {BUILDER_WORKFLOW_ACTIONS[builderWorkflow].map((action) => {
                          const active = builderSelectedActions.includes(action)
                          return (
                            <button
                              key={action}
                              type="button"
                              onClick={() => toggleBuilderAction(action)}
                              className={cx(
                                'w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                                active
                                  ? 'border-indigo-200 bg-indigo-50 text-gray-900'
                                  : 'border-gray-200 bg-gray-50/40 text-gray-700 hover:border-gray-300'
                              )}
                            >
                              {action}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}

                  {builderFlowStage === 'framing' && (
                    <p
                      className={cx(
                        'text-base font-semibold tracking-tight text-gray-700 transition-[opacity,transform] duration-500 ease-out',
                        builderFramingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                      )}
                    >
                      signal comes from user interaction
                    </p>
                  )}

                  {(builderFlowStage === 'decision' || builderFlowStage === 'signal') && (
                    <>
                      <p className="text-base font-semibold tracking-tight text-gray-700">
                        signal comes from user interaction
                      </p>
                      <h4 className="mt-2 text-base font-semibold tracking-tight text-gray-900">
                        A choice that shaped this work
                      </h4>
                      <div className="mt-3 grid gap-2.5">
                        {BUILDER_WORKFLOW_DECISIONS[builderWorkflow].map((decision) => {
                          const active = builderSelectedDecision === decision
                          return (
                            <button
                              key={decision}
                              type="button"
                              onClick={() => selectBuilderDecision(decision)}
                              className={cx(
                                'w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                                active
                                  ? 'border-indigo-200 bg-indigo-50 text-gray-900'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              )}
                            >
                              {decision}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}

                  {builderFlowStage === 'signal' && (
                    <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50/60 px-5 py-4 transition-[opacity,transform] duration-500 ease-out">
                      <p className="text-sm font-semibold text-gray-900">Added to your signal profile</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {BUILDER_SIGNAL_UPDATES[builderWorkflow].map((signal) => (
                          <span
                            key={signal}
                            className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-800"
                          >
                            {signal}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4">
                        {!builderVerificationSent ? (
                          <button
                            type="button"
                            onClick={() => setBuilderVerificationSent(true)}
                            className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Get this verified
                          </button>
                        ) : (
                          <p className="text-sm font-semibold text-indigo-800">✅ Sent for manager confirmation</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {selectedRole === 'manager' && (
            <section className="mx-auto w-full max-w-2xl transition-[opacity,transform] duration-500 ease-out">
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 px-6 py-7 text-left sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 3</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">{MANAGER_CONTENT.heading}</h3>
                <p className="mt-3 text-base text-gray-800">{MANAGER_CONTENT.body}</p>
                <p className="mt-3 text-sm text-gray-500">{MANAGER_CONTENT.sub}</p>
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
                  {RECRUITER_CONTENT.heading}
                </h3>
                <p className="mt-3 text-base text-gray-800">{RECRUITER_CONTENT.body}</p>
                <p className="mt-3 text-sm text-gray-500">{RECRUITER_CONTENT.sub}</p>
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
                    className="flex w-full items-start justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-left transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-800">Recommended</span>
                      <p className="mt-1 text-xs text-indigo-600">Click to view</p>
                    </div>
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
              <CandidateProfilePanel
                analyzing={profileImportAnalyzing}
                onImportClick={() => setProfileImportAnalyzing(true)}
              />
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

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

const DEMO_ADVANCE_MS = 2400
const STEPS = ['intro', 'capture', 'reasoning', 'decision', 'comparison', 'recruiter'] as const
type StepIndex = 0 | 1 | 2 | 3 | 4 | 5

type FlowMode = 'idle' | 'demo' | 'manual'
type CaptureMode = 'manual' | 'detected'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

function CountUp({
  end,
  durationMs = 800,
  className,
}: {
  end: number
  durationMs?: number
  className?: string
}) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const ranRef = useRef(false)

  useEffect(() => {
    ranRef.current = false
    setN(0)
  }, [end])

  useEffect(() => {
    if (reduced) {
      setN(end)
      return
    }
    const el = ref.current
    if (!el) return
    let raf = 0
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || ranRef.current) return
        ranRef.current = true
        const start = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / durationMs)
          const eased = 1 - (1 - p) ** 3
          setN(Math.round(eased * end))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [durationMs, end, reduced])

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString()}
    </span>
  )
}

export default function MVPPrototypePage() {
  const reduced = usePrefersReducedMotion()
  const [step, setStep] = useState<StepIndex>(0)
  const [flowMode, setFlowMode] = useState<FlowMode>('idle')
  const [captureMode, setCaptureMode] = useState<CaptureMode>('manual')
  const [comparisonRevealed, setComparisonRevealed] = useState(false)
  const demoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearDemoTimer = useCallback(() => {
    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current)
      demoTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    clearDemoTimer()
    if (flowMode !== 'demo') return
    if (step < 1 || step > 4) return
    demoTimerRef.current = setTimeout(() => {
      setStep((s) => (s < 5 ? ((s + 1) as StepIndex) : s))
    }, DEMO_ADVANCE_MS)
    return clearDemoTimer
  }, [clearDemoTimer, flowMode, step])

  useEffect(() => {
    if (step !== 4) {
      setComparisonRevealed(false)
      return
    }
    if (reduced) {
      setComparisonRevealed(true)
      return
    }
    const t = setTimeout(() => setComparisonRevealed(true), 400)
    return () => clearTimeout(t)
  }, [reduced, step])

  const startPlayDemo = () => {
    setFlowMode('demo')
    setStep(1)
    setCaptureMode('manual')
  }

  const startManual = () => {
    setFlowMode('manual')
    setStep(1)
    setCaptureMode('manual')
  }

  const goNext = () => setStep((s) => (s < 5 ? ((s + 1) as StepIndex) : s))
  const goBack = () => setStep((s) => (s > 0 ? ((s - 1) as StepIndex) : s))

  const stepLabel = STEPS[step] ?? 'intro'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight text-gray-900">
            RiseVault
          </Link>
          <div className="flex items-center gap-3">
            {flowMode !== 'idle' && (
              <span className="hidden text-xs font-medium uppercase tracking-wider text-gray-400 sm:inline">
                {flowMode === 'demo' ? 'Demo' : 'Interactive'}
              </span>
            )}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={cx(
                    'h-1.5 w-6 rounded-full transition-colors duration-300',
                    step >= n ? 'bg-indigo-600' : 'bg-gray-200'
                  )}
                  title={`Step ${n}`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-32 pt-10 sm:px-6 sm:pt-14">
        <div key={stepLabel} className={reduced ? '' : 'animate-mvp-fade'}>
          {step === 0 && (
            <IntroScreen onPlayDemo={startPlayDemo} onTryManual={startManual} />
          )}
          {step === 1 && (
            <CaptureStep captureMode={captureMode} onModeChange={setCaptureMode} />
          )}
          {step === 2 && <ReasoningStep />}
          {step === 3 && <DecisionStep />}
          {step === 4 && <ComparisonStep revealed={comparisonRevealed} />}
          {step === 5 && <RecruiterStep />}
        </div>
      </main>

      {step > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={goBack}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back
            </button>
            <div className="flex flex-1 items-center justify-end gap-3">
              {flowMode === 'demo' && step >= 1 && step < 5 && (
                <span className="text-xs text-gray-500">Auto-advancing</span>
              )}
              {flowMode === 'manual' && step < 5 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              )}
              {step === 5 && (
                <Link
                  href="/"
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  Done
                </Link>
              )}
            </div>
          </div>
        </footer>
      )}

    </div>
  )
}

function IntroScreen({
  onPlayDemo,
  onTryManual,
}: {
  onPlayDemo: () => void
  onTryManual: () => void
}) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Prototype</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          From work to decision-ready signals
        </h1>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-6 sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Candidate</div>
        <div className="mt-2 text-lg font-semibold text-gray-900">Alex</div>
        <ul className="mt-6 space-y-3 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-gray-400">—</span>
            <span>Built a full-stack app</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-400">—</span>
            <span>Improved performance</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-400">—</span>
            <span>Worked in a team</span>
          </li>
        </ul>
        <p className="mt-8 border-t border-gray-200 pt-6 text-base font-medium text-gray-900">
          Looks fine.
          <br />
          <span className="text-gray-600">But can you actually rely on it?</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onPlayDemo}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Play Demo
        </button>
        <button
          type="button"
          onClick={onTryManual}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Try It Yourself
        </button>
      </div>
    </div>
  )
}

function CaptureStep({
  captureMode,
  onModeChange,
}: {
  captureMode: CaptureMode
  onModeChange: (m: CaptureMode) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 1 — Capture</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">Capture work as signal</h2>
      </div>

      <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
        <button
          type="button"
          onClick={() => onModeChange('manual')}
          className={cx(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            captureMode === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          )}
        >
          AI-assisted input
        </button>
        <button
          type="button"
          onClick={() => onModeChange('detected')}
          className={cx(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            captureMode === 'detected' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
          )}
        >
          Detected activity
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {captureMode === 'manual' ? (
          <>
            <label className="text-sm font-medium text-gray-800" htmlFor="mvp-capture-q">
              What did you work on?
            </label>
            <input
              id="mvp-capture-q"
              readOnly
              value="login bug"
              className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900"
            />
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">AI expands</div>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-800">
                <li className="flex gap-2">
                  <span className="text-gray-400">—</span>
                  <span>investigated timeout issue</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400">—</span>
                  <span>updated retry logic</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                Confirm
              </button>
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
              >
                Edit
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm font-medium text-gray-800">Today we detected:</div>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-800">
              <li className="flex gap-2">
                <span className="text-gray-400">—</span>
                <span>3 commits on login system</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">—</span>
                <span>edited API logic</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">—</span>
                <span>commented on team discussion</span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2">
              <span className="text-indigo-600">✔</span>
              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Add context</div>
              <p className="mt-2 text-sm leading-relaxed text-gray-800">
                I fixed a timeout bug by adding retry logic.
              </p>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-gray-500 sm:text-sm">
        Manual or automatic — both feed the same signal layer.
      </p>
    </div>
  )
}

function ReasoningStep() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 2 — Reasoning</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">Reasoning, not just activity</h2>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-sm font-semibold text-gray-900">Day 5: Fixed login bug</div>

        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Context</div>
          <ul className="mt-2 space-y-1.5 text-sm text-gray-800">
            <li className="flex gap-2">
              <span className="text-gray-400">—</span>
              <span>identified timeout issue</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400">—</span>
              <span>used retry queue</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400">—</span>
              <span>tested edge cases</span>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">AI follow-up</div>
          <ul className="mt-2 space-y-1.5 text-sm text-gray-800">
            <li className="flex gap-2">
              <span className="text-gray-400">—</span>
              <span>How did you find the root cause?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400">—</span>
              <span>What alternatives did you consider?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400">—</span>
              <span>Did you use AI? How?</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-indigo-600">✔</span>
            <span className="text-sm font-medium text-gray-900">Verified by manager</span>
          </div>
          <blockquote className="mt-3 border-l-2 border-indigo-200 pl-3 text-sm italic text-gray-700">
            &ldquo;Strong ownership in debugging.&rdquo;
          </blockquote>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-gray-50/60 px-3 py-3">
          <div className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Manager signal</div>
          <div className="mt-1 text-xs font-semibold text-gray-900">Manager A</div>
          <div className="mt-1.5 space-y-0.5 text-[11px] leading-snug text-gray-600">
            <div>12 feedback notes</div>
            <div>High responsiveness</div>
            <div>Strong support signal</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DecisionStep() {
  const rows: [string, string][] = [
    ['Consistency', 'High'],
    ['Problem Solving', 'Strong'],
    ['Verification', 'Verified by manager (15)'],
    ['Feedback loops', '5'],
    ['Signal strength', 'High'],
    ['AI Use', 'Thoughtful'],
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 3 — Decision</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">Decision-ready profile</h2>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
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
    </div>
  )
}

function ComparisonStep({ revealed }: { revealed: boolean }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 4 — Compare</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">Same pipeline, different trust</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Candidate A</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>— strong résumé</li>
            <li>— no verification</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Candidate B</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>— consistent work logs</li>
            <li>— verified contributions</li>
            <li>— increasing problem complexity</li>
          </ul>
        </div>
      </div>

      <div
        className={cx(
          'rounded-2xl border p-5 transition-[opacity,transform] duration-500 ease-out sm:p-6',
          revealed || reduced
            ? 'border-indigo-200 bg-indigo-50 opacity-100'
            : 'border-gray-200 bg-white opacity-0 translate-y-2'
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-gray-900">Recommendation: B</div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-800">
              Risk: Low
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-800">
              Confidence: High
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">This is not more information. This is a decision.</p>
      </div>
    </div>
  )
}

function RecruiterStep() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 5 — Recruiter view</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">One view, ranked outcomes</h2>
      </div>

      <div className="space-y-3">
        <MetricRow label="Candidates" value={<CountUp end={120} />} />
        <MetricRow label="Shortlisted" value={<CountUp end={12} />} />
        <MetricRow label="Top recommended" value={<CountUp end={3} />} />
      </div>

      <p className="text-sm text-gray-600">
        Filters and signals collapse noise — you move from volume to a short list you can defend.
      </p>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-2xl font-semibold tabular-nums tracking-tight text-gray-900">{value}</span>
    </div>
  )
}

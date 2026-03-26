'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(Boolean(media.matches))
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return reduced
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true)
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
}

function Reveal({
  children,
  delayMs = 0,
  className,
}: {
  children: React.ReactNode
  delayMs?: number
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cx(
        'transition-[opacity,transform] duration-700 ease-out will-change-transform',
        reduced ? 'opacity-100 translate-y-0' : inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
      style={reduced ? undefined : { transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}

function CountUp({
  value,
  durationMs = 650,
  className,
  suffix,
}: {
  value: number
  durationMs?: number
  className?: string
  suffix?: string
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLSpanElement>()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const from = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, inView, reduced, value])

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix ?? ''}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{children}</div>
  )
}

function PrimaryButton({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
    >
      {children}
    </Link>
  )
}

function SecondaryButton({
  children,
  href,
  external,
}: {
  children: React.ReactNode
  href: string
  external?: boolean
}) {
  const className =
    'inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white'

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function ModelAnimated() {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setStep(3)
      return
    }
    setStep(1)
    const t1 = window.setTimeout(() => setStep(2), 900)
    const t2 = window.setTimeout(() => setStep(3), 1850)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [inView, reduced])

  const chipBase =
    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-tight'

  return (
    <div ref={ref} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 text-gray-700">
          <span
            className={cx(
              chipBase,
              step >= 1 ? 'border-gray-300 bg-gray-50 opacity-100' : 'border-gray-200 bg-white opacity-0 translate-y-1',
              'transition-all duration-700 ease-out'
            )}
          >
            capability
          </span>
          <span className={cx('text-gray-300 transition-opacity duration-700', step >= 1 ? 'opacity-100' : 'opacity-0')}>
            →
          </span>
          <span
            className={cx(
              chipBase,
              step >= 1 ? 'border-gray-300 bg-gray-50 opacity-100' : 'border-gray-200 bg-white opacity-0 translate-y-1',
              'transition-all duration-700 ease-out delay-75'
            )}
          >
            output
          </span>
          <span className={cx('text-gray-300 transition-opacity duration-700', step >= 1 ? 'opacity-100' : 'opacity-0')}>
            →
          </span>
          <span
            className={cx(
              chipBase,
              step >= 1 ? 'border-gray-300 bg-gray-50 opacity-100' : 'border-gray-200 bg-white opacity-0 translate-y-1',
              'transition-all duration-700 ease-out delay-150'
            )}
          >
            signal
          </span>
        </div>

        <div
          className={cx(
            'rounded-xl border border-gray-200 bg-white p-4 transition-[opacity,transform] duration-700 ease-out',
            step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className={cx(chipBase, 'border-gray-300 bg-gray-50 text-gray-700')}>output is cheap</span>
            <span className="text-gray-300">→</span>
            <span className={cx(chipBase, 'border-gray-300 bg-gray-50 text-gray-700')}>signals break</span>
          </div>
        </div>

        <div
          className={cx(
            'rounded-xl border p-4 transition-[opacity,transform,border-color,background-color] duration-700 ease-out',
            step >= 3
              ? 'opacity-100 translate-y-0 border-indigo-200 bg-indigo-50'
              : 'opacity-0 translate-y-2 border-gray-200 bg-white'
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className={cx(chipBase, step >= 3 ? 'border-indigo-200 bg-white text-gray-900' : 'border-gray-300 bg-gray-50 text-gray-700')}>
              capability
            </span>
            <span className={cx(step >= 3 ? 'text-indigo-300' : 'text-gray-300')}>→</span>
            <span className={cx(chipBase, step >= 3 ? 'border-indigo-200 bg-white text-gray-900' : 'border-gray-300 bg-gray-50 text-gray-700')}>
              process
            </span>
            <span className={cx(step >= 3 ? 'text-indigo-300' : 'text-gray-300')}>→</span>
            <span className={cx(chipBase, step >= 3 ? 'border-indigo-200 bg-white text-gray-900' : 'border-gray-300 bg-gray-50 text-gray-700')}>
              trusted signals
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DecisionCardAnimated() {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 })
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setPhase(5)
      return
    }
    setPhase(1)
    const ids = [
      window.setTimeout(() => setPhase(2), 450),
      window.setTimeout(() => setPhase(3), 850),
      window.setTimeout(() => setPhase(4), 1250),
      window.setTimeout(() => setPhase(5), 1650),
    ]
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [inView, reduced])

  const row = (label: string, value: string, show: boolean) => (
    <div
      className={cx(
        'flex items-center justify-between text-sm transition-[opacity,transform] duration-700 ease-out',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <div className="text-gray-600">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  )

  return (
    <div ref={ref} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Candidate Profile</div>
          <div className="mt-2 text-xl font-semibold tracking-tight text-gray-900">Alex</div>
        </div>
        <div className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          Decision-ready
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {row('Consistency', 'High', phase >= 2)}
        {row('Problem Solving', 'Strong', phase >= 3)}
        {row('Verification', '3 teammates', phase >= 4)}
        {row('AI Use', 'Thoughtful', phase >= 5)}
      </div>

      <div
        className={cx(
          'mt-6 rounded-xl border p-4 transition-[opacity,transform,border-color,background-color] duration-700 ease-out',
          phase >= 5 ? 'opacity-100 translate-y-0 border-indigo-200 bg-indigo-50' : 'opacity-0 translate-y-2 border-gray-200 bg-white'
        )}
      >
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-700">Confidence</div>
          <div className="font-semibold text-gray-900">High</div>
        </div>
      </div>
    </div>
  )
}

function CandidateComparison() {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })
  const [showDecision, setShowDecision] = useState(false)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setShowDecision(true)
      return
    }
    const t = window.setTimeout(() => setShowDecision(true), 900)
    return () => window.clearTimeout(t)
  }, [inView, reduced])

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="text-sm font-semibold text-gray-900">Candidate A</div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div>— strong résumé</div>
          <div>— no verification</div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="text-sm font-semibold text-gray-900">Candidate B</div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div>— consistent work logs</div>
          <div>— verified contributions</div>
          <div>— increasing complexity</div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div
          className={cx(
            'rounded-2xl border p-6 transition-[opacity,transform,border-color,background-color] duration-700 ease-out',
            showDecision ? 'opacity-100 translate-y-0 border-indigo-200 bg-indigo-50' : 'opacity-0 translate-y-2 border-gray-200 bg-white'
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-gray-900">→ Recommendation: B</div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-800">Risk: Low</span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-800">Confidence: High</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-700">This is not more information. This is a decision.</div>
        </div>
      </div>
    </div>
  )
}

function RecruiterFunnel() {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 })
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setPhase(3)
      return
    }
    setPhase(1)
    const t1 = window.setTimeout(() => setPhase(2), 800)
    const t2 = window.setTimeout(() => setPhase(3), 1500)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [inView, reduced])

  const metric = (label: string, show: boolean, node: React.ReactNode) => (
    <div
      className={cx(
        'flex items-baseline justify-between rounded-xl border border-gray-200 bg-white p-4 transition-[opacity,transform] duration-700 ease-out',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-semibold tracking-tight text-gray-900">{node}</div>
    </div>
  )

  return (
    <div ref={ref} className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-800">backend</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-800">verified</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-800">high consistency</span>
        </div>
      </div>

      {metric('Candidates', phase >= 1, <CountUp value={120} />)}
      {metric('Shortlisted', phase >= 2, <CountUp value={12} />)}
      {metric('Recommended', phase >= 3, <CountUp value={3} />)}
    </div>
  )
}

export default function LandingPage() {
  const demoUrl = useMemo(() => 'https://www.youtube.com/watch?v=KsLqbxnvGIw', [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" className="text-sm font-semibold tracking-tight text-gray-900">
            RiseVault
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <SecondaryButton href={demoUrl} external>
              Watch Demo
            </SecondaryButton>
            <PrimaryButton href="/mvp">Try Demo</PrimaryButton>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-20">
        {/* 2. HERO */}
        <section className="pb-16 sm:pb-24">
          <Reveal>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              In the AI era, output is cheap. Capability isn’t.
            </h1>
          </Reveal>
          <Reveal delayMs={120} className="mt-6">
            <div className="max-w-3xl text-lg text-gray-600 sm:text-xl">
              <div>Hiring is no longer selecting for real capability —</div>
              <div>it is selecting for who can perform capability.</div>
            </div>
          </Reveal>
          <Reveal delayMs={220} className="mt-6">
            <div className="text-base font-medium text-gray-800">We’re rebuilding how capability is evaluated.</div>
          </Reveal>
          <Reveal delayMs={320} className="mt-10 flex flex-wrap gap-3">
            <SecondaryButton href={demoUrl} external>
              Watch Demo
            </SecondaryButton>
            <PrimaryButton href="/mvp">Try Demo</PrimaryButton>
          </Reveal>
        </section>

        {/* 3. HIRING IS BREAKING */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>3 — Problem</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Hiring is breaking</h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-8">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <ul className="space-y-3 text-sm text-gray-600 sm:text-base">
                  <li>— Interviews can be memorized or AI-assisted</li>
                  <li>— Outputs are easy to generate but hard to trust</li>
                  <li>— New roles lack clear evaluation standards</li>
                  <li>— Recruiters rely on outdated signals</li>
                </ul>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-800 sm:text-base">
                  Signals no longer reflect real capability.
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 4. WHY THIS HAPPENS */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>4 — Cause</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Why this happens</h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-8">
            <div className="max-w-3xl space-y-3 text-sm text-gray-700 sm:text-base">
              <div>Hiring has never measured capability directly.</div>
              <div>It relies on signals — education, experience, interviews.</div>
              <div className="pt-2 text-gray-600">This worked when signals were hard to fake.</div>
              <div className="text-gray-600">Now they are not.</div>
            </div>
          </Reveal>
          <Reveal delayMs={260} className="mt-10">
            <div className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 text-sm font-medium text-gray-900 sm:text-base">
              If signals break, hiring breaks.
            </div>
          </Reveal>
        </section>

        {/* 5. MODEL (ANIMATED) */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>5 — Model</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">A new signal path</h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-10">
            <ModelAnimated />
          </Reveal>
        </section>

        {/* 6. WHAT WE’RE BUILDING */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>6 — Build</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">What we’re building</h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-8">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="space-y-3 text-sm text-gray-700 sm:text-base">
                  <div className="font-medium text-gray-900">We are building a new signal layer for hiring.</div>
                  <div className="text-gray-600">Hiring has always evaluated outputs.</div>
                  <div className="text-gray-600">We evaluate process.</div>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-800">decisions</div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-800">problem solving</div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-800">iteration</div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-800">AI usage</div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
                  <div className="text-sm font-semibold text-gray-900">Signals become</div>
                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <div>— continuous</div>
                    <div>— verifiable</div>
                    <div>— decision-ready</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 7. PRODUCT → DECISION FLOW */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>7 — Flow</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Product → decision</h2>
          </Reveal>
          <Reveal delayMs={110} className="mt-8">
            <div className="text-sm font-medium text-gray-900 sm:text-base">
              This is not more information. This is a decision.
            </div>
          </Reveal>

          <Reveal delayMs={180} className="mt-10 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 1</div>
              <div className="mt-3 text-sm font-semibold text-gray-900">Capture</div>
              <div className="mt-2 text-sm text-gray-600">Work is captured with minimal input.</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 2</div>
              <div className="mt-3 text-sm font-semibold text-gray-900">Process</div>
              <div className="mt-2 text-sm text-gray-600">Not just what happened — but how.</div>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step 3</div>
              <div className="mt-3 text-sm font-semibold text-gray-900">Decision</div>
              <div className="mt-2 text-sm text-gray-700">Signals resolve into a recommendation.</div>
            </div>
          </Reveal>

          <Reveal delayMs={260} className="mt-10">
            <DecisionCardAnimated />
          </Reveal>
        </section>

        {/* 8. CANDIDATE COMPARISON */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>8 — Comparison</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Candidate comparison
            </h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-10">
            <CandidateComparison />
          </Reveal>
        </section>

        {/* 9. RECRUITER VALUE */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>9 — Recruiter view</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Scan hundreds of candidates in one view
            </h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <RecruiterFunnel />
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="space-y-2 text-sm text-gray-700">
                  <div>Recruiters don’t want more data.</div>
                  <div>They want faster, lower-risk decisions.</div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 10. WHY NOW */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>10 — Why now</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Why now</h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">AI makes outputs cheap</div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">Work is digital and traceable</div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">Hiring uses outdated signals</div>
          </Reveal>
          <Reveal delayMs={240} className="mt-10">
            <div className="max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-800 sm:text-base">
              For the first time, we can capture how work actually happens — at scale.
            </div>
          </Reveal>
        </section>

        {/* 11. VISION */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>11 — Vision</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Vision</h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">candidates build real capability</div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">recruiters make better decisions</div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">managers develop talent</div>
          </Reveal>
          <Reveal delayMs={240} className="mt-10">
            <div className="max-w-3xl rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-sm font-medium text-gray-900 sm:text-base">
              This becomes the default way capability is evaluated.
            </div>
          </Reveal>
        </section>

        {/* 12. FINAL CTA */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <SectionLabel>12 — CTA</SectionLabel>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Stop guessing. Start deciding.
            </h2>
          </Reveal>
          <Reveal delayMs={160} className="mt-10 flex flex-wrap gap-3">
            <PrimaryButton href="/mvp">Try Demo</PrimaryButton>
            <SecondaryButton href={demoUrl} external>
              Watch Demo
            </SecondaryButton>
          </Reveal>
        </section>
      </main>

      {/* 13. FOOTER */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>© 2026 RiseVault</div>
          <div className="flex items-center gap-4">
            <a href="mailto:a.x.chen@outlook.com" className="transition-colors hover:text-gray-700">
              Contact
            </a>
            <span className="text-gray-300">•</span>
            <Link href="/mvp" className="transition-colors hover:text-gray-700">
              Try Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


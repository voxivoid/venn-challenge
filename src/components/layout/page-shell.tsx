import type { ReactNode } from 'react'

type PageShellProps = {
  step: number
  totalSteps: number
  children: ReactNode
}

export function PageShell({ step, totalSteps, children }: PageShellProps) {
  return (
    <main className="flex min-h-svh flex-col items-center gap-12 bg-muted/50 px-4 py-8">
      <p className="text-lg">
        Step {step} of {totalSteps}
      </p>
      {children}
    </main>
  )
}

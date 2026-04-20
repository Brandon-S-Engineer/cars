'use client'

import { cn } from '@/lib/utils'

export function Switch({
  checked,
  onChange,
  className = '',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  className?: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-muted border border-border',
        className,
      )}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-background shadow-sm transition-transform"
        style={{ transform: `translateX(${checked ? '18px' : '2px'})` }}
      />
    </button>
  )
}

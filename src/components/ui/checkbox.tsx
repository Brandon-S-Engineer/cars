'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export function Checkbox({
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
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'h-4 w-4 rounded border border-input flex items-center justify-center shrink-0 transition-colors',
        checked ? 'bg-primary border-primary text-primary-foreground' : 'bg-background hover:bg-muted/60',
        className,
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  )
}

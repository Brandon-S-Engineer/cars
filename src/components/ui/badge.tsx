import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'muted' | 'success' | 'warning' | 'destructive'

export function Badge({
  variant = 'default',
  className = '',
  children,
}: {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border text-foreground',
    muted: 'bg-muted text-muted-foreground',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    destructive: 'bg-red-500/10 text-red-600 dark:text-red-400',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

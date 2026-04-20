import { cn } from '@/lib/utils'

export function Avatar({
  name = '',
  size = 32,
  className = '',
}: {
  name?: string
  size?: number
  className?: string
}) {
  const initials =
    name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || '·'

  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
  const hue = Math.abs(h) % 360

  return (
    <div
      className={cn('inline-flex items-center justify-center rounded-full font-medium shrink-0', className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `oklch(0.92 0.02 ${hue})`,
        color: `oklch(0.35 0.04 ${hue})`,
      }}
    >
      {initials}
    </div>
  )
}

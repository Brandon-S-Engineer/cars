import { cn } from '@/lib/utils'

type Props = {
  src: string | null
  alt: string
  className?: string
  phLabel?: string
}

export default function ModelImage({ src, alt, className, phLabel }: Props) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn('w-full h-full object-cover', className)} />
    )
  }
  return (
    <div className={cn('ph w-full h-full flex items-center justify-center', className)}>
      <span className="ph-tag">{phLabel ?? alt}</span>
    </div>
  )
}

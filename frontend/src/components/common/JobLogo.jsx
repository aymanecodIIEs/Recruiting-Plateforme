const GRADIENTS = [
  'from-sky-500 via-sky-400 to-cyan-300',
  'from-indigo-500 via-indigo-400 to-sky-300',
  'from-emerald-500 via-teal-400 to-lime-300',
  'from-rose-500 via-pink-500 to-orange-300',
  'from-amber-500 via-orange-500 to-rose-400',
]

const SIZE_MAP = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-20 w-20 text-2xl',
}

export default function JobLogo({ text = '', size = 'lg', className = '' }) {
  const initials = String(text || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 3) || 'SP'

  const gradientIndex = Math.abs(initials.charCodeAt(0) || 0) % GRADIENTS.length
  const dimensionClasses = SIZE_MAP[size] || SIZE_MAP.lg

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-3xl font-semibold uppercase tracking-wide text-white shadow-lg shadow-slate-900/10 ${dimensionClasses} ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-3xl bg-linear-to-br ${GRADIENTS[gradientIndex]} opacity-95`}
      />
      <span className="relative drop-shadow-sm">{initials}</span>
    </span>
  )
}

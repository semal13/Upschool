export function Mascot3D({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: '120px' }}
      aria-hidden
    >
      <div
        className="relative h-28 w-28 sm:h-32 sm:w-32"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-12deg) rotateX(8deg)' }}
      >
        <div
          className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-talya-blush via-talya-lavender to-talya-mint opacity-95 shadow-orb"
          style={{ transform: 'translateZ(12px)' }}
        />
        <div
          className="absolute inset-[10%] rounded-[22px] bg-white/25 backdrop-blur-sm"
          style={{ transform: 'translateZ(24px)' }}
        />
        <div
          className="absolute left-[22%] top-[32%] h-2.5 w-2.5 rounded-full bg-[#2d2640]/80"
          style={{ transform: 'translateZ(32px)' }}
        />
        <div
          className="absolute right-[22%] top-[32%] h-2.5 w-2.5 rounded-full bg-[#2d2640]/80"
          style={{ transform: 'translateZ(32px)' }}
        />
        <div
          className="absolute bottom-[28%] left-1/2 h-2 w-10 rounded-full bg-[#2d2640]/25"
          style={{ transform: 'translateX(-50%) translateZ(28px)' }}
        />
      </div>
    </div>
  )
}

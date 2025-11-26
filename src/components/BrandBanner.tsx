export function BrandBanner() {
  return (
    <div className="w-full bg-[#FAFAFA] relative overflow-hidden h-40 md:h-60 lg:h-80">
      <div
        className="absolute top-1/2 left-1/2 text-black font-black uppercase whitespace-nowrap select-none"
        style={{
          fontFamily: 'var(--font-cygre), sans-serif',
          fontSize: 'clamp(3rem, 15vw, 20rem)',
          letterSpacing: '-0.05em',
          transform: 'translate(-50%, -50%)',
          lineHeight: 1,
        }}
      >
        hzcompany
      </div>
    </div>
  )
}

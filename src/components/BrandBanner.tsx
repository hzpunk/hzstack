export function BrandBanner() {
  return (
    <div className="w-full bg-white relative overflow-hidden h-56">
      <div
        className="absolute left-0 bottom-[-52px] md:bottom-[-70px] text-brand-black font-cygre font-normal whitespace-nowrap select-none"
        style={{
          fontSize: 'clamp(6rem, 26vw, 28rem)',
          letterSpacing: '-0.05em',
          lineHeight: 1,
        }}
      >
        hzcompany
      </div>
    </div>
  )
}

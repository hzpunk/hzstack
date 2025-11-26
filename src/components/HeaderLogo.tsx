export function HeaderLogo() {
  return (
    <div className="flex gap-[2px] h-6 items-stretch">
      {/* Левая часть - 2 вертикальные полоски */}
      <div className="flex gap-[2px]">
        <div className="w-2.5 bg-black" />
        <div className="w-2.5 bg-black" />
      </div>
      {/* Правая часть - 2 горизонтальные полоски */}
      <div className="flex flex-col gap-[2px] w-8">
        <div className="h-full bg-black" />
        <div className="h-full bg-black" />
      </div>
    </div>
  )
}

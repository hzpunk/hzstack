import { Hero } from '@/components/Hero'
import { StackTicker } from '@/components/StackTicker'
import { Integrations } from '@/components/Integrations'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow flex flex-col gap-[302px] mb-[302px]">
        <Hero />
        <StackTicker />
        <Integrations />
      </main>
    </div>
  )
}

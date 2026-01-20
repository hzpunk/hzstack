import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { Faq } from '@/components/Faq'
import { Steps } from '@/components/Steps'

export default function Home() {
  return (
    <main className="bg-white">
      <section className="min-h-[calc(100vh-56px)] flex items-center justify-center px-8">
        <Hero />
      </section>

      <Steps />
      <Pricing />
      <Faq />
    </main>
  )
}

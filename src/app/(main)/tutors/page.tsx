import { CatalogTopBar } from '@/components/CatalogTopBar'
import { LotCard } from '@/components/LotCard'

export default function TutorsPage() {
  return (
    <main className="bg-white">
      <CatalogTopBar />

      <div className="px-8 pb-20">
        <LotCard
          imageSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80"
          name="Седова Н. Н."
          city="москва"
          experienceYears={10}
          priceText="от 1900/ч"
        />
      </div>
    </main>
  )
}

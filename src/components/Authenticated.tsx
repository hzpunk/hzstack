import { getCurrentUser } from '@/lib/serverAuth'
import { redirect } from 'next/navigation'

export default async function Authenticated({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return <>{children}</>
}

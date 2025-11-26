import { getCurrentUser } from '@/lib/serverAuth'
import { ReactNode } from 'react'

export default async function PublicOrAuth({
  publicContent,
  authContent,
}: {
  publicContent: ReactNode
  authContent: ReactNode
}) {
  const user = await getCurrentUser()
  return <>{user ? authContent : publicContent}</>
}

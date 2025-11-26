import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 })
  }

  // Check if current user is admin
  const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } })
  // if (!currentUser?.isAdmin) {
  //   return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  // }

  const users = await prisma.user.findMany({
    select: {
      // @ts-ignore
      roles: true,
      isAdmin: true,
      // @ts-ignore
      lastActive: true,
    },
  })

  const totalUsers = users.length
  // @ts-ignore
  const adminCount = users.filter((u) => u.isAdmin || u.roles.includes('admin')).length
  // @ts-ignore
  const managerCount = users.filter((u) => u.roles.includes('manager')).length

  // Distribution for Pie Chart
  const userRoleCount = totalUsers - adminCount - managerCount // simplified logic for unique roles if exclusive, else overlap
  // Adjusting logic: if a user is admin, they count as admin. If not admin but manager, count as manager. Else user.
  // This is for the donut chart visual representation.
  
  let admins = 0
  let managers = 0
  let regularUsers = 0

  users.forEach(u => {
    // @ts-ignore
    if (u.isAdmin || u.roles.includes('admin')) {
      admins++
    // @ts-ignore
    } else if (u.roles.includes('manager')) {
      managers++
    } else {
      regularUsers++
    }
  })

  const distribution = [
    { name: 'админ', value: admins, fill: '#000000' }, // Black
    { name: 'менеджер', value: managers, fill: '#666666' }, // Grey
    { name: 'пользователь', value: regularUsers, fill: '#FFFFFF', stroke: '#000000' }, // White with border
  ]

  // Fake online activity history for the line chart (mock data for now as we don't have historical sessions)
  const now = new Date()
  const onlineHistory = Array.from({ length: 6 }).map((_, i) => {
    const time = new Date(now.getTime() - (5 - i) * 60 * 60 * 1000) // every hour back
    return {
      time: time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      users: Math.floor(Math.random() * (totalUsers + 1)), // Random data bounded by total users
    }
  })

  // Real-time online count (active in last 5 mins)
  const onlineCount = users.filter(u => {
      // @ts-ignore
      return new Date().getTime() - new Date(u.lastActive).getTime() < 5 * 60 * 1000
  }).length

  // Inject current real online count as the last point
  onlineHistory[onlineHistory.length - 1].users = onlineCount

  return NextResponse.json({
    ok: true,
    stats: {
      totalUsers,
      adminCount,
      managerCount,
      distribution,
      onlineHistory,
    }
  })
}

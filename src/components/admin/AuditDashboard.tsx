'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
// @ts-ignore
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Send, Instagram, Youtube, Twitter } from 'lucide-react'
import Link from 'next/link'

// Custom icons for the social block
const VKIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 22 6.93 20.67 6.93 15.07V8.93C22 3.33 20.67 2 15.07 2zM15.2 16.5c-.8 0-1.5-.6-1.5-1.5 0-.8.6-1.5 1.5-1.5.8 0 1.5.6 1.5 1.5 0 .9-.7 1.5-1.5 1.5zm2.3-5.5h-4.6c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h4.6c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5z" />
  </svg>
)

// Animated Counter Component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const displayValue = useTransform(springValue, (latest) => Math.round(latest))

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  return <motion.span>{displayValue}</motion.span>
}

interface AuditStats {
  totalUsers: number
  adminCount: number
  managerCount: number
  distribution: { name: string; value: number; fill: string; stroke?: string }[]
  onlineHistory: { time: string; users: number }[]
}

export default function AuditDashboard() {
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/audit')
      const data = await res.json()
      if (data.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch audit stats', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="typography-h1 mb-8">аудит</h2>

      {/* Charts Grid */}
      <div className="border-2 border-black p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {/* Column 1: Text Stats */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              кол-во пользователей всего:
            </div>
            <div className="text-5xl font-light">
              <AnimatedCounter value={stats.totalUsers} duration={4} />
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              кол-во пользователей админов:
            </div>
            <div className="text-5xl font-light">
              <AnimatedCounter value={stats.adminCount} duration={3.5} />
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              кол-во пользователей менеджеров:
            </div>
            <div className="text-5xl font-light">
              <AnimatedCounter value={stats.managerCount} duration={3} />
            </div>
          </div>
        </div>

        {/* Column 2: Donut Chart */}
        <div className="flex flex-col relative">
          <div className="text-sm text-gray-500 mb-4 text-center w-full">
            статистика пользователей:
          </div>

          {/* Legend Top Right (moved lower) */}
          <div className="absolute top-8 right-0 text-xs space-y-1">
            <div className="flex items-center justify-start space-x-2">
              <div className="w-2 h-2 rounded-full bg-black"></div>
              <span>админ</span>
            </div>
            <div className="flex items-center justify-start space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <span>менеджер</span>
            </div>
            <div className="flex items-center justify-start space-x-2">
              <div className="w-2 h-2 rounded-full border border-black bg-white"></div>
              <span>пользователь</span>
            </div>
          </div>

          <div className="relative w-full h-64 flex justify-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={0}
                    dataKey="value"
                    strokeWidth={1}
                    nameKey="name"
                  >
                    {stats.distribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke={entry.stroke || 'none'}
                        style={{
                          filter: 'brightness(1)',
                          transition: 'filter 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e: any) => {
                          e.target.style.filter = 'brightness(0.8)'
                        }}
                        onMouseLeave={(e: any) => {
                          e.target.style.filter = 'brightness(1)'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value} чел.`, name]}
                    contentStyle={{
                      border: '1px solid #000',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 3: Line Chart */}
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 mb-4">
            статистика пользователей онлайн:
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.onlineHistory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={true}
                  horizontal={false}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10 }}
                  axisLine={true}
                  tickLine={true}
                />
                <YAxis hide={true} domain={[0, 'dataMax + 5']} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#000000"
                  strokeWidth={1}
                  dot={{ r: 3, fill: 'black' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Layout */}
      <div className="flex flex-col lg:flex-row justify-between items-end">
        {/* Left: Contact Info */}
        <div className="space-y-4 mb-8 lg:mb-0">
          <div className="text-sm text-gray-500">hzcompanyteam@gmail.com</div>
          <div className="text-sm text-gray-500">+79685462359</div>
          <div className="space-y-2 mt-4">
            <Link href="/" className="block text-sm hover:underline">
              главная
            </Link>
            <Link href="/" className="block text-sm hover:underline">
              наш стек
            </Link>
            <Link href="/profile" className="block text-sm hover:underline">
              профиль
            </Link>
          </div>
        </div>

        {/* Right: Social Grid */}
        <div className="grid grid-cols-2 gap-4">
          <SocialBox icon={<Send size={24} />} href="#" />
          <SocialBox
            icon={<span className="font-bold text-xl">K</span>}
            href="#"
          />{' '}
          {/* VK placeholder */}
          <SocialBox icon={<Youtube size={24} />} href="#" />
          <SocialBox
            icon={<span className="font-bold text-xl">X</span>}
            href="#"
          />
          <SocialBox icon={<Instagram size={24} />} href="#" />
          <SocialBox icon={<span className="text-xl">♪</span>} href="#" />{' '}
          {/* TikTok placeholder */}
        </div>
      </div>

      <div className="flex justify-between items-center mt-20 text-xs text-gray-400">
        <div>powered by Hzcompany</div>
        <div>@hzcompany 2025</div>
        <div>все права защищены</div>
      </div>
    </div>
  )
}

function SocialBox({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="w-24 h-24 border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-sm"
    >
      {icon}
    </Link>
  )
}

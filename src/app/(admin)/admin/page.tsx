'use client'

import { useEffect, useState } from 'react'
import UserRow from '@/components/admin/UserRow'
import AuditDashboard from '@/components/admin/AuditDashboard'

interface User {
  id: string
  email: string
  roles: string[]
  profile?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
  createdAt: string
  lastActive?: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    const interval = setInterval(fetchUsers, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleUpdateRoles = async (userId: string, newRoles: string[]) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: newRoles }),
      })
      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, roles: newRoles } : u))
        )
      }
    } catch (error) {
      console.error('Failed to update roles', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId))
      }
    } catch (error) {
      console.error('Failed to delete user', error)
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section 1: User Management */}
        <h1 className="typography-h1 mb-8 lg:mb-12 mt-[120px] lg:mt-[200px]">админ-панель</h1>

        <div className="bg-white rounded-lg mb-32">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="flex flex-col">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onUpdateRoles={handleUpdateRoles}
                  onDelete={handleDeleteUser}
                />
              ))}

              {users.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  Нет пользователей
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Audit Dashboard & Footer */}
        <AuditDashboard />
      </div>
    </div>
  )
}

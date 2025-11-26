'use client'

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import RoleEditor from './RoleEditor'
import { useAuthStore } from '@/store/useAuthStore'

interface User {
  id: string
  email: string
  roles: string[]
  profile?: {
    firstName?: string
    lastName?: string
    avatar?: string
    role?: string // The Job Title / Position
  }
  createdAt: string
  lastActive?: string
}

interface UserRowProps {
  user: User
  onUpdateRoles: (userId: string, newRoles: string[]) => void
  onDelete: (userId: string) => void
}

export default function UserRow({
  user,
  onUpdateRoles,
  onDelete,
}: UserRowProps) {
  const [isEditingRoles, setIsEditingRoles] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const roleEditorRef = useRef<HTMLDivElement>(null)
  const currentUser = useAuthStore((state) => state.user)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        roleEditorRef.current &&
        !roleEditorRef.current.contains(event.target as Node)
      ) {
        setIsEditingRoles(false)
        setError(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayName = user.profile?.firstName
    ? `${user.profile.lastName || ''} ${user.profile.firstName?.[0] || ''}.`
    : user.email

  // Format date as dd.mm.yyyy
  const dateObj = new Date(user.createdAt)
  const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getFullYear()}`

  const isOnline = user.lastActive
    ? new Date().getTime() - new Date(user.lastActive).getTime() < 5 * 60 * 1000
    : false

  // Check if current user can edit roles
  const canEditRoles = () => {
    if (!currentUser) return false
    
    const userRoles = currentUser.roles || []
    const isCEO = userRoles.includes('ceo')
    const isAdmin = userRoles.includes('admin')
    const isManager = userRoles.includes('manager')

    // Manager cannot change roles
    if (isManager && !isCEO && !isAdmin) return false
    
    // Admin and CEO can change roles (with restrictions on backend)
    if (isAdmin || isCEO) return true
    
    return false
  }

  const handleUpdateRoles = async (userId: string, newRoles: string[]) => {
    try {
      setError(null)
      await onUpdateRoles(userId, newRoles)
      setIsEditingRoles(false)
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении ролей')
    }
  }

  const handleDeleteClick = () => {
    if (!currentUser) return
    
    const userRoles = currentUser.roles || []
    const isCEO = userRoles.includes('ceo')
    
    // Only CEO can delete users
    if (!isCEO) {
      setError('Только CEO может удалять пользователей')
      return
    }
    
    onDelete(user.id)
  }

  return (
    <div className="grid grid-cols-[300px_1fr_1fr_100px_40px] gap-8 items-center py-4 border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors px-0">
      {/* Col 1: Identity (Avatar + Name) */}
      <div className="flex items-center gap-[11px]">
        <div className="w-10 h-10 bg-gray-200 overflow-hidden flex-shrink-0">
          {user.profile?.avatar ? (
            <img
              src={user.profile.avatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
              {displayName[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="font-medium text-[#070D0D] truncate">{displayName}</div>
      </div>

      {/* Col 2: Roles */}
      <div className="relative" ref={roleEditorRef}>
        <div className="flex items-center text-sm flex-wrap">
          <span className="text-gray-400 mr-1">роли:</span>

          <div className="flex items-center gap-1 flex-wrap">
            {/* System Roles */}
            {user.roles && user.roles.length > 0 ? (
              <span className="text-[#070D0D]">{user.roles.join(', ')}</span>
            ) : null}

            {/* Position from Profile (Job Title) */}
            {user.profile?.role && (
              <span className="text-gray-500 ml-1">{user.profile.role}</span>
            )}
          </div>

          {canEditRoles() && (
            <button
              onClick={() => setIsEditingRoles(!isEditingRoles)}
              className="text-gray-400 hover:text-black ml-1 text-sm underline decoration-gray-300 underline-offset-2"
            >
              изменить
            </button>
          )}
        </div>

        {error && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-500 bg-red-50 px-2 py-1 rounded border border-red-200">
            {error}
          </div>
        )}

        {isEditingRoles && canEditRoles() && (
          <RoleEditor
            currentRoles={user.roles || []}
            onSave={(newRoles) => handleUpdateRoles(user.id, newRoles)}
            onClose={() => {
              setIsEditingRoles(false)
              setError(null)
            }}
          />
        )}
      </div>

      {/* Col 3: Date */}
      <div className="text-sm text-gray-400 whitespace-nowrap">
        дата регистрации:{' '}
        <span className="text-[#070D0D]">{formattedDate}</span>
      </div>

      {/* Col 4: Online Status */}
      <div className="flex items-center justify-end">
        {isOnline ? (
          <span className="text-sm text-green-600">онлайн</span>
        ) : (
          <span className="text-sm text-gray-400">оффлайн</span>
        )}
      </div>

      {/* Col 5: Delete */}
      <div className="flex justify-end">
        <button
          onClick={handleDeleteClick}
          className="text-gray-300 hover:text-red-600 transition-colors"
          title={currentUser?.roles?.includes('ceo') ? 'Удалить пользователя' : 'Только CEO может удалять пользователей'}
        >
          <X size={20} strokeWidth={1} />
        </button>
      </div>
    </div>
  )
}

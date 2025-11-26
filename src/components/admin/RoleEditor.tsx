'use client'

import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

interface RoleEditorProps {
  currentRoles: string[]
  onSave: (newRoles: string[]) => void
  onClose: () => void
}

// All available roles
const ALL_ROLES = ['admin', 'manager', 'ceo']

export default function RoleEditor({
  currentRoles,
  onSave,
  onClose,
}: RoleEditorProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles)
  const [isAdding, setIsAdding] = useState(false)
  const [customRole, setCustomRole] = useState('')
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const [canAddCustom, setCanAddCustom] = useState(false)
  
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!user) return

    const userRoles = user.roles || []
    const isCEO = userRoles.includes('ceo')
    const isAdmin = userRoles.includes('admin')
    const isManager = userRoles.includes('manager')

    // Manager cannot change roles
    if (isManager && !isCEO && !isAdmin) {
      setAvailableRoles([])
      setCanAddCustom(false)
      return
    }

    // Admin can only assign manager roles
    if (isAdmin && !isCEO) {
      setAvailableRoles(['manager'])
      setCanAddCustom(false)
      return
    }

    // CEO has full permissions
    if (isCEO) {
      setAvailableRoles(ALL_ROLES)
      setCanAddCustom(true)
      return
    }

    // Default: no permissions
    setAvailableRoles([])
    setCanAddCustom(false)
  }, [user])

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const handleSave = () => {
    onSave(selectedRoles)
    onClose()
  }

  const handleAddCustomRole = () => {
    if (customRole && !selectedRoles.includes(customRole)) {
      setSelectedRoles([...selectedRoles, customRole])
      setCustomRole('')
      setIsAdding(false)
    }
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'admin': 'админ',
      'manager': 'менеджер',
      'ceo': 'ceo'
    }
    return roleNames[role] || role
  }

  return (
    <div className="absolute top-full left-0 mt-1 w-48 bg-white border-2 border-black shadow-xl z-50 p-4">
      {availableRoles.length === 0 && !canAddCustom ? (
        <div className="text-sm text-gray-500 text-center py-2">
          Нет прав для изменения ролей
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {availableRoles.map((role) => (
              <label
                key={role}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 border flex items-center justify-center ${selectedRoles.includes(role) ? 'bg-black border-black' : 'border-gray-300'}`}
                >
                  {selectedRoles.includes(role) && (
                    <div className="w-2 h-2 bg-white" />
                  )}
                </div>
                <span className="text-sm group-hover:text-gray-600">
                  {getRoleDisplayName(role)}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
              </label>
            ))}
          </div>

          {canAddCustom && (
            <>
              {isAdding ? (
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="flex-1 border-b border-gray-300 text-sm focus:outline-none focus:border-black"
                    placeholder="Новая роль"
                    autoFocus
                  />
                  <button onClick={handleAddCustomRole} className="text-black">
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-sm text-gray-400 hover:text-black flex items-center space-x-2"
                >
                  <span>+добавить</span>
                </button>
              )}
            </>
          )}

          <div className="flex justify-end pt-2 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="text-sm bg-black text-white px-3 py-1 hover:bg-gray-800"
            >
              сохранить
            </button>
          </div>
        </>
      )}
    </div>
  )
}

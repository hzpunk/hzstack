'use client'

import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Notification {
  id: string
  text: string
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем уведомления с сервера
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setNotifications(data.notifications || [])
        }
      })
      .catch(() => {
        // Ошибка загрузки, оставляем пустым
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const removeNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch {
      // Ошибка удаления, но всё равно убираем из UI
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-8 pt-40 pb-20">
        <h1 className="typography-h1 lowercase mb-12">уведомления</h1>
        <div className="text-gray-500">загрузка...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-8 pt-40 pb-20">
      <h1 className="typography-h1 lowercase mb-12">уведомления</h1>

      {notifications.length === 0 ? (
        <div />
      ) : (
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center gap-4 group">
              <span className="text-xl lowercase font-light">
                {notification.text}
              </span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="opacity-40 group-hover:opacity-100 transition-opacity"
              >
                <X size={24} strokeWidth={1} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

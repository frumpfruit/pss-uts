import React, { useState, useEffect } from 'react'
import { Bell, CheckCheck, ExternalLink } from 'lucide-react'
import { notificationApi } from '../../services/apiService'
import { NotificationItem } from '../molecules/NotificationItem'
import { useAuth } from '../../store/AuthContext'
import { Button } from '../atoms/Button'
import { toast } from '../../utils/toast'

export function NotificationPanel({ isOpen, onClose }) {
  const { role } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchNotifs = async () => {
    setLoading(true)
    try {
      const data = await notificationApi.getNotifications(role)
      setNotifications(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifs()
    }
  }, [isOpen, role])

  const handleMarkRead = async (id) => {
    await notificationApi.markAsRead(id)
    setNotifications(prev =>
      (Array.isArray(prev) ? prev : []).map(n => n.id === id ? { ...n, is_read: true } : n)
    )
  }

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead(role)
    setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => ({ ...n, is_read: true })))
    toast.success('Semua Notifikasi Ditandai', 'Seluruh pesan telah ditandai sudah dibaca.')
  }

  if (!isOpen) return null

  const notifList = Array.isArray(notifications) ? notifications : []
  const unreadCount = notifList.filter(n => !n.is_read).length

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#133E87]" />
          <h4 className="text-xs font-bold text-slate-800">Notifikasi Kampus</h4>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#133E87]">
              {unreadCount} baru
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-[11px] font-semibold text-[#133E87] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tandai semua dibaca
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y divide-slate-50">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Memuat notifikasi...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Tidak ada notifikasi saat ini
          </div>
        ) : (
          (Array.isArray(notifications) ? notifications : []).map(n => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </div>
    </div>
  )
}

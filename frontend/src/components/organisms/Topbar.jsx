import React, { useState, useEffect, useRef } from 'react'
import { Menu, Bell } from 'lucide-react'
import { SearchBar } from '../molecules/SearchBar'
import { UserMenu } from '../molecules/UserMenu'
import { NotificationPanel } from './NotificationPanel'
import { notificationApi } from '../../services/apiService'
import { useAuth } from '../../store/AuthContext'

export function Topbar({ onToggleSidebar, title = 'Dashboard' }) {
  const { role } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const notifRef = useRef(null)

  useEffect(() => {
    async function checkUnread() {
      try {
        const notifs = await notificationApi.getNotifications(role)
        const list = Array.isArray(notifs) ? notifs : []
        const unread = list.filter(n => !n.is_read).length
        setUnreadCount(unread)
      } catch {
        setUnreadCount(2)
      }
    }
    checkUnread()
  }, [role, isNotifOpen])

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right Side: Search, Notification Bell, User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block w-48 md:w-64 lg:w-72">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Cari mata kuliah, jadwal..."
            />
          </div>

          {/* Notification Bell Button */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifikasi Kampus"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[#133E87] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <NotificationPanel
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
            />
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

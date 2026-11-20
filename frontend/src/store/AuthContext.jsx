import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/apiService'
import { mockServer } from '../services/mockServer'
import { toast } from '../utils/toast'
import { ROLE_LABELS } from '../constants/roles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return mockServer.getCurrentUser()
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadInitialUser() {
      try {
        const currentUser = await authApi.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (err) {
        console.error('Failed to load user', err)
      }
    }
    loadInitialUser()
  }, [])

  const login = async (username, password) => {
    try {
      const res = await authApi.login(username, password)
      setUser(res.data.user)
      toast.success('Autentikasi Berhasil', `Selamat datang di SIAKAD, ${res.data.user.full_name}!`)
      return res
    } catch (err) {
      toast.error('Autentikasi Gagal', err.message || 'Periksa kembali kredensial Anda.')
      throw err
    }
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    toast.info('Sesi Ditutup', 'Anda telah berhasil keluar dari sistem.')
  }

  const switchRole = async (targetRole) => {
    const newUser = await authApi.switchRole(targetRole)
    setUser(newUser)
    toast.info(
      `Mode Demo: ${ROLE_LABELS[targetRole] || targetRole}`,
      `Beralih ke antarmuka ${newUser.full_name}`
    )
  }

  const value = {
    user,
    role: user?.role || 'MAHASISWA',
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
    switchRole,
    isStudent: user?.role === 'MAHASISWA',
    isLecturer: user?.role === 'DOSEN',
    isAdmin: user?.role === 'ADMIN',
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

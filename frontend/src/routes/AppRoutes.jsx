import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { MainLayout } from '../layouts/MainLayout'
import { LoginPage } from '../features/auth/LoginPage'
import { StudentDashboard } from '../features/dashboard/StudentDashboard'
import { LecturerDashboard } from '../features/dashboard/LecturerDashboard'
import { AdminDashboard } from '../features/dashboard/AdminDashboard'
import { KRSPage } from '../features/krs/KRSPage'
import { CourseCatalogPage } from '../features/courses/CourseCatalogPage'
import { GradesPage } from '../features/grades/GradesPage'
import { AttendancePage } from '../features/attendance/AttendancePage'
import { SchedulePage } from '../features/schedules/SchedulePage'
import { StudentProfilePage } from '../features/students/StudentProfilePage'
import { UserManagementPage } from '../features/students/UserManagementPage'
import { NoticeListPage } from '../features/notifications/NoticeListPage'

function ProtectedDashboard() {
  const { role } = useAuth()
  if (role === 'ADMIN') return <AdminDashboard />
  if (role === 'DOSEN') return <LecturerDashboard />
  return <StudentDashboard />
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Protected Routes */}
      <Route
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/krs" element={<KRSPage defaultTab="ORDINARY" />} />
        <Route path="/krs/input" element={<KRSPage defaultTab="INPUT" />} />
        <Route path="/courses" element={<KRSPage defaultTab="ORDINARY" />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/calendar" element={<SchedulePage />} />
        <Route path="/notices" element={<NoticeListPage />} />
        <Route path="/profile" element={<StudentProfilePage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

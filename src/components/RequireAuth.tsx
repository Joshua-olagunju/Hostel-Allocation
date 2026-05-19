import { Navigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

import type { ReactNode } from 'react'

interface RequireAuthProps {
  allowedRole: 'student' | 'admin'
  children: ReactNode
}

export const RequireAuth = ({ allowedRole, children }: RequireAuthProps) => {
  const { user } = useAppContext()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (user.type !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

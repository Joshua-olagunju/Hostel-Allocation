import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import type { ReactNode } from 'react'

interface DashboardLayoutProps {
  title: string
  subtitle: string
  actions?: ReactNode
  children: ReactNode
}

export const DashboardLayout = ({ title, subtitle, actions, children }: DashboardLayoutProps) => {
  const { logout, user } = useAppContext()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">{subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {user ? (
                <span className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  Signed in as {user.type === 'admin' ? 'Admin' : 'Student'}
                </span>
              ) : null}
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Logout
              </button>
              <Link to="/" className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700">
                Return home
              </Link>
            </div>
          </div>
          {actions ? <div className="mt-3">{actions}</div> : null}
        </div>
        <main>{children}</main>
      </div>
    </div>
  )
}

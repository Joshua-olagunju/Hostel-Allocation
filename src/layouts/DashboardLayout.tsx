import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { ReactNode } from "react";
import { CiLogout } from "react-icons/ci";

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({
  title,
  subtitle,
  actions,
  children,
}: DashboardLayoutProps) => {
  const { logout, user } = useAppContext();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-sm border-b  border-slate-200 bg-white py-6   sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Dashboard
              </p>
              <h1 className="mt-2 text-2xl font-[500] text-emerald-500">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                {subtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {user ? (
                <span className="rounded-sm bg-slate-50 px-4 py-2 !text-xs text-slate-700">
                  You're signed in as{" "}
                  {user.type === "admin" ? "Admin" : "Student"}
                </span>
              ) : null}
             
              <Link
                to="/"
                className="rounded-sm bg-slate-50 px-4 py-2 !text-xs text-slate-700 transition hover:bg-slate-100"
              >
                Return home
              </Link>
            
             <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-sm bg-red-500 !font-[600] px-4 py-2 !text-xs text-white"
              >
                <CiLogout size={16} className="!font-[600]" />
                Logout
              </button>
          </div>
          </div>
          {actions ? <div className="mt-3">{actions}</div> : null}
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

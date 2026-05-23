import type { ReactNode } from "react";
import { FaLock } from "react-icons/fa";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  adminIconClick?: () => void;
}

export const AuthLayout = ({
  title,
  description,
  children,
  adminIconClick,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full justify-center  max-w-2xl flex-col gap-10    bg-white  ">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase  tracking-[0.3em] text-slate-500">
            Hostel allocation
          </p>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-semibold  text-slate-950 sm:text-4xl">
              {title}
            </h1>
            {adminIconClick && (
              <button
                type="button"
                onClick={adminIconClick}
                className="opacity-0 hover:opacity-20 transition-opacity"
                title="Admin unlock"
              >
                <FaLock className="text-slate-400 text-sm" />
              </button>
            )}
          </div>
          <p className="mx-auto max-w-2xl text-sm   text-slate-600">
            {description}
          </p>
        </header>
        <div className="  gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

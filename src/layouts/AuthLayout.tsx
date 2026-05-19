import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const AuthLayout = ({
  title,
  description,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full justify-center  max-w-2xl flex-col gap-10 rounded-[2rem]   bg-white  ">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase  tracking-[0.3em] text-slate-500">
            Hostel allocation
          </p>
          <h1 className="text-3xl font-semibold  text-slate-950 sm:text-4xl">
            {title}
          </h1>
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

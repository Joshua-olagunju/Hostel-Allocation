import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          404 error
        </p>
        <h1 className="mt-6 text-4xl font-semibold text-white">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          The page you are looking for doesn’t exist or may have been moved.
          Head back to the login screen to continue.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
};

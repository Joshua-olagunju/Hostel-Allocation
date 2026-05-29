import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          404 error
        </p>
        <h1 className="mt-6 text-4xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          The page you are looking for doesn’t exist or may have been moved.
          Head back to the login screen to continue.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-3xl bg-blue-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-400/90"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
};

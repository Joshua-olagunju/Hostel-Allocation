import { useState } from "react";

import { Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { AuthLayout } from "../layouts/AuthLayout";
import { IoMdLogIn } from "react-icons/io";

// ======================
// Login Page Component
// ======================
export const LoginPage = () => {
  const [mode] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { loginStudent, loginAdmin, user } = useAppContext();
  const navigate = useNavigate();

  if (user) {
    return (
      <Navigate to={user.type === "admin" ? "/admin" : "/student"} replace />
    );
  }

  const submitText = mode === "student" ? "Login as Student" : "Login as Admin";

  // ==================================================================
  // Handle form submission for both student and admin login
  // ==================================================================
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result =
      mode === "student"
        ? loginStudent(email, password)
        : loginAdmin(email, password);
    if (result) {
      setError(result);
      return;
    }
    setError(null);
    navigate(mode === "student" ? "/student" : "/admin");
  };

  // ==================================================================
  //Rendered Components
  // ==================================================================
  return (
    <AuthLayout
      title="Hostel Allocation Login"
      description="Welcome back! Please log in to access your dashboard and manage your hostel accommodations."
    >
      <div className="rounded-[2rem] bg-white p-4 shadow-2xl shadow-slate-200/40 sm:p-10">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-700">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          <label className="block text-sm text-slate-700">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          {error ? (
            <p className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="!text-sm inline-flex w-full items-center justify-center gap-2 rounded-3xl  bg-gray-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400  !text-[#000000] !hover:text-[#ffffff]"
          >
            <IoMdLogIn size={20} /> {submitText}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

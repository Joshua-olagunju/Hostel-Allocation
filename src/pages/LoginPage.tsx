import { useState } from "react";
import axios from "axios";

import { Navigate, useNavigate } from "react-router-dom";
// import { useAppContext } from "../context/AppContext";
import { AuthLayout } from "../layouts/AuthLayout";
import { IoMdLogIn } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
// import { FaUserShield } from "react-icons/fa";
import { loginStudent } from "../api/auth";

// ======================
// Login Page Component
// ======================
export const LoginPage = () => {
  const [mode] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  // const [adminClicks, setAdminClicks] = useState(0);
  // const [showAdminModal, setShowAdminModal] = useState(false);
  // const [adminEmail, setAdminEmail] = useState("");
  // const [adminPassword, setAdminPassword] = useState("");
  // const [adminError, setAdminError] = useState<string | null>(null);
  // const { loginStudent, loginAdmin, user } = useAppContext();
  const navigate = useNavigate();

  const submitText = mode === "student" ? "Login as Student" : "Login as Admin";

  // Handle hidden admin icon clicks
  // const handleAdminIconClick = () => {
  //   const newCount = adminClicks + 1;
  //   setAdminClicks(newCount);
  //   if (newCount === 5) {
  //     setShowAdminModal(true);
  //     setAdminClicks(0);
  //   }
  // };

  // ==================================================================
  // Handle form submission for student login
  // ==================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginStudent({
        email,
        password,
      });

      const student = res.data.student;

      // optional: store user locally
      localStorage.setItem("student", JSON.stringify(student));

      navigate("/student");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    }
  };

  // ==================================================================
  // Handle admin login submission
  // ==================================================================
  // const handleAdminSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const result = loginAdmin(adminEmail, adminPassword);
  //   if (result) {
  //     setAdminError(result);
  //     return;
  //   }
  //   setAdminError(null);
  //   setShowAdminModal(false);
  //   navigate("/admin");
  // };

  // ==================================================================
  //Rendered Components
  // ==================================================================
  return (
    <>
      <AuthLayout
        title="Hostel Allocation Login"
        description="Welcome back! Please log in to access your dashboard and manage your hostel accommodations."
        // adminIconClick={handleAdminIconClick}
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
              <p className=" flex items-center text-sm text-rose-700">
                <MdErrorOutline size={20} className="inline-block mr-2" />
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

      {/* {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl sm:p-10">
            <div className="mb-6 text-center">
              <FaUserShield className="mx-auto mb-3 text-2xl text-emerald-500" />
              <h2 className="text-2xl font-semibold text-slate-900">
                Admin Login
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Access the admin dashboard
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleAdminSubmit}>
              <label className="block text-sm text-slate-700">
                Admin Email
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(event) => setAdminEmail(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="admin@hostel.com"
                />
              </label>

              <label className="block text-sm text-slate-700">
                Admin Password
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Enter password"
                />
              </label>

              {adminError ? (
                <p className="flex items-center text-sm text-rose-700">
                  <MdErrorOutline size={20} className="mr-2" />
                  {adminError}
                </p>
              ) : null}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminEmail("");
                    setAdminPassword("");
                    setAdminError(null);
                  }}
                  className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  <FaUserShield /> Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </>
  );
};

import { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
// import { useAppContext } from "../context/AppContext";
import { AuthLayout } from "../layouts/AuthLayout";
import { IoMdLogIn } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
// import { FaUserShield } from "react-icons/fa";
import { loginStudent, signupStudent } from "../api/auth";

// ======================
// Login Page Component
// ======================
export const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalType, setSuccessModalType] = useState<"signup" | "login" | null>(null);
  // const [adminClicks, setAdminClicks] = useState(0);
  // const [showAdminModal, setShowAdminModal] = useState(false);
  // const [adminEmail, setAdminEmail] = useState("");
  // const [adminPassword, setAdminPassword] = useState("");
  // const [adminError, setAdminError] = useState<string | null>(null);
  // const { loginStudent, loginAdmin, user } = useAppContext();
  const navigate = useNavigate();

  const submitText = isSignup ? "Sign up" : "Login";

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        if (successModalType === "signup") {
          setIsSignup(false);
          setName("");
          setEmail("");
          setSignupPassword("");
          setConfirmPassword("");
          setMatricNo("");
        }
        if (successModalType === "login") {
          setLoginPassword("");
        }
        setError(null);
        setSuccessMessage(null);
        setSuccessModalType(null);

        if (successModalType === "login") {
          navigate("/student");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, successModalType, navigate]);

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
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignup) {
        if (signupPassword.length < 8) {
          setError("Password must be at least 8 characters.");
          return;
        }

        if (signupPassword !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const res = await signupStudent({
          name,
          email,
          password: signupPassword,
          matricNo,
        });

        setSuccessMessage(res.data.message || "Account created successfully!");
        setSuccessModalType("signup");
        setShowSuccessModal(true);
        return;
      }

      const res = await loginStudent({
        email,
        password: loginPassword,
      });

      const student = res.data.student;

      // optional: store user locally
      localStorage.setItem("student", JSON.stringify(student));

      setSuccessMessage("Login successful! Please wait...");
      setSuccessModalType("login");
      setShowSuccessModal(true);
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
  //  Rendered Components
  // ==================================================================
  return (
    <div className="      ">
      <div className="flex w-full bg-white   flex-col gap-8 lg:flex-row  ">
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl sm:p-10">
              <div className="mb-6 flex flex-col items-center text-center">
                <FaCheckCircle className="mb-4 text-5xl text-emerald-500" />
                <h2 className="text-2xl font-semibold text-slate-900">
                  {successModalType === "login" ? "Login successful!" : "Account Created!"}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {successMessage}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
                <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"></div>
                <span>Please wait...</span>
                <div className="animation-delay-200 h-2 w-2 animate-bounce rounded-full bg-emerald-500"></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1    hidden lg:block">
          <img
            src="/loginpageimage.png"
            alt="Hostel login illustration"
            className="h-auto  w-full object-cover"
          />
        </div>

        <div className="flex-1 ">
          <AuthLayout
            title={isSignup ? "Create your hostel account" : "Hostel Allocation Login"}
            description={
              isSignup
                ? "Fill in your details to create a student account and get started."
                : "Welcome back! Please log in to access your dashboard and manage your hostel accommodations."
            }
            // adminIconClick={handleAdminIconClick}
          >
            <div className="flex-1 bg-white">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {isSignup && (
                  <label className="block text-sm text-slate-700">
                    Full name
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </label>
                )}

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

                {isSignup ? (
                  <>
                    <label className="block text-sm text-slate-700">
                      Password
                      <div className="relative mt-3">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={8}
                          value={signupPassword}
                          onChange={(event) => setSignupPassword(event.target.value)}
                          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                      </div>
                    </label>

                    <label className="block text-sm text-slate-700">
                      Confirm password
                      <div className="relative mt-3">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                      </div>
                    </label>
                  </>
                ) : (
                  <label className="block text-sm text-slate-700">
                    Password
                    <div className="relative mt-3">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                      </button>
                    </div>
                  </label>
                )}

                {isSignup && (
                  <label className="block text-sm text-slate-700">
                    Matric number
                    <input
                      type="text"
                      required
                      value={matricNo}
                      onChange={(event) => setMatricNo(event.target.value)}
                      className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-100 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </label>
                )}

                {error ? (
                  <p className="flex items-center text-sm text-rose-700">
                    <MdErrorOutline size={20} className="inline-block mr-1" />
                    {error}
                  </p>
                ) : null}

                {successMessage ? (
                  <p className="text-sm text-emerald-700">{successMessage}</p>
                ) : null}

                <button
                  type="submit"
                  className="!text-sm inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gray-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 !text-[#000000] !hover:text-[#ffffff]"
                >
                  <IoMdLogIn size={20} /> {submitText}
                </button>

                <div className="text-center text-sm text-slate-600">
                  {isSignup ? (
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignup(false);
                          setError(null);
                          setSuccessMessage(null);
                          setSignupPassword("");
                          setConfirmPassword("");
                          setMatricNo("");
                        }}
                        className="font-semibold text-emerald-600 hover:text-emerald-500"
                      >
                        Login
                      </button>
                    </p>
                  ) : (
                    <p>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignup(true);
                          setError(null);
                          setSuccessMessage(null);
                          setLoginPassword("");
                        }}
                        className="font-semibold text-emerald-600 hover:text-emerald-500"
                      >
                        Sign up
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </AuthLayout>
        </div>
      </div>

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
    </div>
  );
};

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
ShieldCheck,
User,
Mail,
Lock,
ArrowRight,
Sparkles,
UserPlus,
} from "lucide-react";

export default function Register() {
const navigate = useNavigate();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

// ==========================================
// REGISTER USER
// ==========================================

const handleSubmit = async (event) => {
event.preventDefault();

if (loading) {
  return;
}

setMessage("");

const cleanName = name.trim();
const cleanEmail = email.trim().toLowerCase();

// ==========================================
// VALIDATION
// ==========================================

if (!cleanName) {
  setMessage("Please enter your full name.");
  return;
}

if (!cleanEmail) {
  setMessage("Please enter your email address.");
  return;
}

if (!password) {
  setMessage("Please enter your password.");
  return;
}

if (!confirmPassword) {
  setMessage("Please confirm your password.");
  return;
}

if (password.length < 6) {
  setMessage(
    "Password must be at least 6 characters."
  );
  return;
}

if (password !== confirmPassword) {
  setMessage("Passwords do not match.");
  return;
}

try {
  setLoading(true);

  console.log(
    "Registering user:",
    cleanEmail
  );

  // ==========================================
  // BACKEND REQUEST
  // ==========================================

  const response = await fetch(
    "http://localhost:5001/api/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        password: password,
      }),
    }
  );

  // ==========================================
  // READ RESPONSE SAFELY
  // ==========================================

  const contentType =
    response.headers.get("content-type") || "";

  let data = {};

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();

    data = {
      error: text || "Registration failed.",
    };
  }

  console.log(
    "Register API status:",
    response.status
  );

  console.log(
    "Register API response:",
    data
  );

  // ==========================================
  // BACKEND ERROR
  // ==========================================

  if (!response.ok) {
    setMessage(
      data.error ||
        data.message ||
        `Registration failed (${response.status}).`
    );

    return;
  }

  // ==========================================
  // SAVE TOKEN
  // ==========================================

  if (data.token) {
    localStorage.setItem(
      "newsShieldToken",
      data.token
    );
  }

  // ==========================================
  // SAVE USER
  // ==========================================

  if (data.user) {
    localStorage.setItem(
      "newsShieldUser",
      JSON.stringify(data.user)
    );
  }

  // ==========================================
  // SUCCESS
  // ==========================================

  console.log(
    "Registration successful."
  );

  navigate("/dashboard", {
    replace: true,
  });
} catch (error) {
  console.error(
    "Registration error:",
    error
  );

  setMessage(
    "Unable to connect to NewsShield backend. Please make sure the backend server is running on port 5001."
  );
} finally {
  setLoading(false);
}


};

return ( <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-white sm:py-16">

  {/* Background Effects */}

  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_35%)]" />

  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_35%)]" />

  <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

  <div className="relative mx-auto max-w-md">

    {/* Brand */}

    <div className="mb-8 text-center">

      <Link
        to="/"
        className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:border-cyan-500/40 hover:bg-cyan-500/15"
      >
        <ShieldCheck size={17} />

        NewsShield
      </Link>

      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 shadow-lg shadow-cyan-500/5">
        <ShieldCheck
          size={34}
          className="text-cyan-400"
        />
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        <Sparkles size={14} />

        Create Your Account
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Join NewsShield
      </h1>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400 sm:text-base">
        Create an account to verify news, review
        evidence, and keep your verification history
        organized.
      </p>
    </div>

    {/* Register Card */}

    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl sm:p-8">

      {/* Error */}

      {message && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm leading-6 text-red-400">
          <div className="flex items-start gap-3">

            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-xs font-bold">
              !
            </span>

            <p>{message}</p>

          </div>
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* FULL NAME */}

        <div>
          <label
            htmlFor="register-name"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 z-20 -translate-y-1/2 text-slate-500"
            />

            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
              className="relative z-10 w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

          </div>
        </div>

        {/* EMAIL */}

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Email Address
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 z-20 -translate-y-1/2 text-slate-500"
            />

            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              className="relative z-10 w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

          </div>
        </div>

        {/* PASSWORD */}

        <div>
          <label
            htmlFor="register-password"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 z-20 -translate-y-1/2 text-slate-500"
            />

            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              disabled={loading}
              className="relative z-10 w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

          </div>

          <p className="mt-2 text-xs text-slate-600">
            Use at least 6 characters for your password.
          </p>
        </div>

        {/* CONFIRM PASSWORD */}

        <div>
          <label
            htmlFor="register-confirm-password"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Confirm Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 z-20 -translate-y-1/2 text-slate-500"
            />

            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={loading}
              className="relative z-10 w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

          </div>
        </div>

        {/* CREATE ACCOUNT BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

              Creating Account...
            </>
          ) : (
            <>
              <UserPlus size={18} />

              Create NewsShield Account

              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </>
          )}

        </button>

      </form>

      {/* DIVIDER */}

      <div className="my-6 flex items-center gap-4">

        <div className="h-px flex-1 bg-slate-800" />

        <span className="text-xs font-medium text-slate-600">
          ALREADY A MEMBER?
        </span>

        <div className="h-px flex-1 bg-slate-800" />

      </div>

      {/* LOGIN */}

      <Link
        to="/login"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-500/30 hover:bg-slate-800 hover:text-white"
      >
        Login to Your Account

        <ArrowRight size={17} />
      </Link>

    </div>

    {/* TRUST MESSAGE */}

    <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-600">

      <ShieldCheck
        size={14}
        className="text-cyan-500/70"
      />

      Securely create your NewsShield account.

    </div>

    {/* BACK HOME */}

    <div className="mt-5 text-center">

      <Link
        to="/"
        className="text-sm font-medium text-slate-500 transition hover:text-cyan-400"
      >
        ← Back to Home
      </Link>

    </div>

  </div>
</main>

);
}

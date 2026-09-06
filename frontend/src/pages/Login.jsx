import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";

export default function Login() {
const navigate = useNavigate();

const [form, setForm] = useState({
email: "",
password: "",
});

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};
const handleSubmit = async (e) => {
e.preventDefault();

setError("");

if (!form.email || !form.password) {
  setError("Please enter email and password.");
  return;
}

try {
  setLoading(true);

  const response = await fetch(
    "http://localhost:5001/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed.");
  }

  localStorage.setItem(
    "newsShieldToken",
    data.token
  );

  localStorage.setItem(
    "newsShieldUser",
    JSON.stringify(data.user)
  );

  navigate("/dashboard");
} catch (err) {
  setError(
    err.message ||
      "Unable to connect to NewsShield backend."
  );
} finally {
  setLoading(false);
}
};
return ( <div className="min-h-screen bg-slate-950 px-4 py-12 text-white"> <div className="mx-auto max-w-md"> <div className="mb-8 text-center"> <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600"> <ShieldCheck size={34} /> </div>

      <h1 className="text-3xl font-bold">
        Welcome Back
      </h1>

      <p className="mt-2 text-slate-400">
        Login to continue using NewsShield.
      </p>
    </div>

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white outline-none transition focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-white outline-none transition focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="relative z-10 font-semibold text-blue-400 hover:text-blue-300"
        >
          Create Account
        </Link>
      </div>
    </div>
  </div>
</div>
);
}


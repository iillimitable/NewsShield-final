import { Link } from "react-router-dom";
import {
ShieldAlert,
Home,
Search,
ArrowLeft,
} from "lucide-react";

function NotFound() {
return ( <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-white sm:px-6 sm:py-16">

```
  {/* Background Glow */}

  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.10),transparent_35%)]" />

  <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />

  <div className="relative mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">

    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-7 text-center shadow-2xl backdrop-blur-xl sm:p-12">

      {/* Icon */}

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 shadow-lg shadow-red-500/5">
        <ShieldAlert
          size={42}
          className="text-red-400"
        />
      </div>

      {/* Branding */}

      <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        NewsShield
      </div>

      {/* 404 */}

      <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-white to-slate-400 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-9xl">
        404
      </h1>

      <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
        Page Not Found
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
        The page you are looking for does not exist
        or may have been moved. Let's get you back
        to NewsShield and continue verifying the news.
      </p>

      {/* Buttons */}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

        <Link
          to="/"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition duration-200 hover:bg-cyan-400 hover:shadow-cyan-500/20"
        >
          <Home size={19} />

          Back to Home
        </Link>

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-6 py-3 font-semibold text-slate-300 transition duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
        >
          <Search size={19} />

          Verify News
        </Link>

      </div>

      {/* Small Navigation Hint */}

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
        <ArrowLeft size={14} />

        Use the navigation above to explore NewsShield.
      </div>

    </div>
  </div>
</main>


);
}

export default NotFound;

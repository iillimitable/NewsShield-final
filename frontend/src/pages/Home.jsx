import { Link } from "react-router-dom";
import {
ArrowRight,
CheckCircle,
Globe,
Search,
ShieldCheck,
Sparkles,
Zap,
} from "lucide-react";

function Home() {
return ( <main className="min-h-screen bg-slate-950 text-white">
{/* Hero Section */} <section className="relative overflow-hidden"> <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_35%)]" /> <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />

```
    <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          <Sparkles size={16} />
          AI-Powered News Verification
        </div>

        {/* Heading */}
        <h1 className="mt-7 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
          Verify News.
          <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Know the Truth.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg lg:text-xl">
          NewsShield verifies news claims using real-time web evidence
          and intelligent AI analysis, helping you understand what
          information you can trust before you share it.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/dashboard"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition duration-200 hover:bg-cyan-400 hover:shadow-cyan-500/20"
          >
            <Search size={20} />

            Verify News

            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/history"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3.5 font-semibold text-slate-200 transition duration-200 hover:border-cyan-500/30 hover:bg-slate-800 hover:text-white"
          >
            View History
          </Link>
        </div>

        {/* Trust Points */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <CheckCircle size={16} className="text-cyan-400" />
            Evidence-based analysis
          </span>

          <span className="flex items-center gap-2">
            <Globe size={16} className="text-cyan-400" />
            Web source verification
          </span>

          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-cyan-400" />
            Real / Fake / Unverified
          </span>
        </div>
      </div>

      {/* Hero Info Card */}
      <div className="mx-auto mt-16 max-w-4xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-2 shadow-2xl shadow-cyan-500/5 backdrop-blur">
          <div className="rounded-[22px] border border-slate-800/80 bg-slate-950 p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center sm:border-r sm:border-slate-800">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Search size={21} />
                </div>

                <p className="mt-3 font-semibold text-white">
                  Search
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Find relevant web evidence
                </p>
              </div>

              <div className="text-center sm:border-r sm:border-slate-800">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Zap size={21} />
                </div>

                <p className="mt-3 font-semibold text-white">
                  Analyze
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Compare supporting evidence
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <ShieldCheck size={21} />
                </div>

                <p className="mt-3 font-semibold text-white">
                  Verify
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Get a clear final verdict
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* How It Works */}
  <section className="border-t border-slate-900 bg-slate-950">
    <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
          How NewsShield Works
        </p>

        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Verify before you believe.
        </h2>

        <p className="mt-4 leading-7 text-slate-400">
          NewsShield checks your news claim against available web
          evidence and uses intelligent analysis to help determine
          whether the information appears reliable.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-200 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Search size={23} />
            </div>

            <span className="text-4xl font-black text-slate-800 transition group-hover:text-slate-700">
              01
            </span>
          </div>

          <h3 className="mt-6 text-xl font-bold">
            Enter the News
          </h3>

          <p className="mt-3 leading-7 text-slate-400">
            Paste a headline, claim, or news statement that you
            want to verify.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-200 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Globe size={23} />
            </div>

            <span className="text-4xl font-black text-slate-800 transition group-hover:text-slate-700">
              02
            </span>
          </div>

          <h3 className="mt-6 text-xl font-bold">
            Check Evidence
          </h3>

          <p className="mt-3 leading-7 text-slate-400">
            NewsShield searches available web sources and
            analyzes supporting or contradicting evidence.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-200 hover:-translate-y-1 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <ShieldCheck size={23} />
            </div>

            <span className="text-4xl font-black text-slate-800 transition group-hover:text-slate-700">
              03
            </span>
          </div>

          <h3 className="mt-6 text-xl font-bold">
            Get Your Verdict
          </h3>

          <p className="mt-3 leading-7 text-slate-400">
            Receive a clear Real, Fake, or Unverified result with
            confidence and evidence details.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/* Bottom CTA */}
  <section className="border-t border-slate-900">
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_55%)]" />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
            <ShieldCheck
              size={34}
              className="text-cyan-400"
            />
          </div>

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Don't Trust Every Headline.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Verify the information first. Make informed decisions
            with NewsShield.
          </p>

          <Link
            to="/dashboard"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Start Verification

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  </section>
</main>


);
}

export default Home;

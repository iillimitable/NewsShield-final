import {
CheckCircle,
XCircle,
CircleHelp,
ShieldCheck,
ExternalLink,
BrainCircuit,
TrendingUp,
TrendingDown,
BarChart3,
} from "lucide-react";

export default function ResultCard({
verdict = "Unverified",
reason = "",
confidence = 0,
evidenceScore = 0,
supportingScore = 0,
contradictingScore = 0,
supportingPercentage,
contradictingPercentage,
analysisEngine = "Tavily Web Search + Gemini LLM",
sources = [],
}) {
const normalizedVerdict = String(
verdict || "Unverified"
).toLowerCase();

let config;

if (normalizedVerdict === "real") {
config = {
label: "Real News",
description:
"The available evidence supports this claim.",
icon: CheckCircle,
iconClass: "text-green-400",
badgeClass:
"border-green-500/30 bg-green-500/10 text-green-400",
glowClass:
"shadow-[0_0_50px_rgba(34,197,94,0.08)]",
};
} else if (normalizedVerdict === "fake") {
config = {
label: "Fake News",
description:
"The available evidence contradicts this claim.",
icon: XCircle,
iconClass: "text-red-400",
badgeClass:
"border-red-500/30 bg-red-500/10 text-red-400",
glowClass:
"shadow-[0_0_50px_rgba(239,68,68,0.08)]",
};
} else {
config = {
label: "Unverified",
description:
"There is not enough reliable evidence to confirm this claim.",
icon: CircleHelp,
iconClass: "text-yellow-400",
badgeClass:
"border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
glowClass:
"shadow-[0_0_50px_rgba(234,179,8,0.08)]",
};
}

const VerdictIcon = config.icon;

const toNumber = (value) => {
const number = Number(value);

if (
  Number.isNaN(number) ||
  !Number.isFinite(number)
) {
  return 0;
}

return number;

};

const clampPercentage = (value) => {
const number = toNumber(value);

return Math.max(
  0,
  Math.min(100, number)
);


};

const scoreToPercentage = (value) => {
const number = toNumber(value);

if (number <= 1) {
  return number * 100;
}

return number;


};

const formatPercentage = (value) => {
return `${clampPercentage(value).toFixed(0)}%`;
};

const confidenceValue = clampPercentage(
scoreToPercentage(confidence)
);

const evidenceValue = clampPercentage(
scoreToPercentage(evidenceScore)
);

const supportingValue =
supportingPercentage !== undefined &&
supportingPercentage !== null
? clampPercentage(supportingPercentage)
: clampPercentage(
scoreToPercentage(supportingScore)
);

const contradictingValue =
contradictingPercentage !== undefined &&
contradictingPercentage !== null
? clampPercentage(
contradictingPercentage
)
: clampPercentage(
scoreToPercentage(
contradictingScore
)
);

const safeSources = Array.isArray(sources)
? sources
.map((source) => {
if (typeof source === "string") {
const cleanUrl = source.trim();

        if (!cleanUrl) {
          return null;
        }

        return {
          title: cleanUrl,
          url: cleanUrl,
        };
      }

      if (
        source &&
        typeof source === "object"
      ) {
        const cleanUrl =
          typeof source.url === "string"
            ? source.url.trim()
            : "";

        if (!cleanUrl) {
          return null;
        }

        return {
          title:
            typeof source.title === "string" &&
            source.title.trim()
              ? source.title.trim()
              : "News Source",
          url: cleanUrl,
        };
      }

      return null;
    })
    .filter(Boolean)
: [];


return (
<div
className={`mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 ${config.glowClass}`}
>
{/* RESULT HEADER */} <div className="border-b border-slate-800 bg-slate-900/90 p-6 sm:p-8"> <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"> <div className="flex items-center gap-4">
<div
className={`shrink-0 rounded-2xl border p-4 ${config.badgeClass}`}
> <VerdictIcon className="h-9 w-9" /> </div>

```
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Verification Result
          </p>

          <h2
            className={`text-3xl font-bold sm:text-4xl ${config.iconClass}`}
          >
            {config.label}
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
            {config.description}
          </p>
        </div>
      </div>

      {/* CONFIDENCE */}
      <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-5 lg:w-[240px]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">
            Confidence
          </span>

          <span className="text-xl font-bold text-white">
            {formatPercentage(confidenceValue)}
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{
              width: `${confidenceValue}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-600">
          Confidence in the verification result
        </p>
      </div>
    </div>
  </div>

  {/* MAIN CONTENT */}
  <div className="p-6 sm:p-8">
    {/* AI ANALYSIS */}
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-2.5">
          <ShieldCheck className="h-5 w-5 text-blue-400" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            AI Verification Analysis
          </p>

          <h3 className="mt-1 font-semibold text-white">
            Why this result?
          </h3>
        </div>
      </div>

      <p className="leading-7 text-slate-300">
        {reason ||
          "No detailed verification reason was provided."}
      </p>
    </div>

    {/* SCORES */}
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* EVIDENCE SCORE */}
      <div className="rounded-2xl border border-blue-500/20 bg-slate-950/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />

            <span className="text-sm font-medium text-slate-400">
              Evidence Score
            </span>
          </div>

          <span className="text-xl font-bold text-blue-400">
            {formatPercentage(evidenceValue)}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{
              width: `${evidenceValue}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Overall strength of the evidence found on the web.
        </p>
      </div>

      {/* SUPPORTING */}
      <div className="rounded-2xl border border-green-500/20 bg-slate-950/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />

            <span className="text-sm font-medium text-slate-400">
              Supporting Evidence
            </span>
          </div>

          <span className="text-xl font-bold text-green-400">
            {formatPercentage(supportingValue)}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-700"
            style={{
              width: `${supportingValue}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Evidence that supports the submitted news claim.
        </p>
      </div>

      {/* CONTRADICTING */}
      <div className="rounded-2xl border border-red-500/20 bg-slate-950/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-400" />

            <span className="text-sm font-medium text-slate-400">
              Contradicting Evidence
            </span>
          </div>

          <span className="text-xl font-bold text-red-400">
            {formatPercentage(
              contradictingValue
            )}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-700"
            style={{
              width: `${contradictingValue}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Evidence that contradicts the submitted news claim.
        </p>
      </div>
    </div>

    {/* ANALYSIS ENGINE */}
    <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-purple-500/10 p-2.5">
          <BrainCircuit className="h-5 w-5 text-purple-400" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Analysis Engine
          </p>

          <p className="mt-1 break-words font-medium text-white">
            {analysisEngine ||
              "Tavily Web Search + Gemini LLM"}
          </p>
        </div>
      </div>
    </div>

    {/* SOURCES */}
    <div className="mt-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-2.5">
            <ExternalLink className="h-5 w-5 text-cyan-400" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Evidence Sources
            </h3>

            <p className="text-sm text-slate-500">
              Web sources used for verification
            </p>
          </div>
        </div>

        {safeSources.length > 0 && (
          <span className="w-fit rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
            {safeSources.length}{" "}
            {safeSources.length === 1
              ? "source"
              : "sources"}
          </span>
        )}
      </div>

      {safeSources.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {safeSources.map(
            (source, index) => (
              <a
                key={`${source.url}-${index}`}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition duration-200 hover:border-cyan-500/40 hover:bg-slate-800/70"
              >
                <div className="mt-0.5 shrink-0 rounded-xl bg-cyan-500/10 p-2.5">
                  <ExternalLink className="h-4 w-4 text-cyan-400 transition group-hover:text-cyan-300" />
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-2 break-words text-sm font-medium leading-6 text-slate-200 transition group-hover:text-cyan-300">
                    {source.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {source.url}
                  </p>

                  <p className="mt-2 text-xs font-medium text-cyan-500 opacity-0 transition group-hover:opacity-100">
                    Open source →
                  </p>
                </div>
              </a>
            )
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
          <ExternalLink className="mx-auto mb-3 h-8 w-8 text-slate-700" />

          <p className="font-medium text-slate-400">
            No source links available
          </p>

          <p className="mt-1 text-sm text-slate-600">
            No web sources were returned for this verification.
          </p>
        </div>
      )}
    </div>
  </div>
</div>

);
}

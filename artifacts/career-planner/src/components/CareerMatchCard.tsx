import type { CareerMatch } from "../types";

const READINESS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  Developing: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  Intermediate: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  Advanced: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  Ready: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
};

const SCORE_COLOR = (score: number) => {
  if (score >= 75) return "#16A34A";
  if (score >= 50) return "#2563EB";
  if (score >= 30) return "#D97706";
  return "#DC2626";
};

function CircularProgress({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;
  const color = SCORE_COLOR(score);

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring circle"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}

export default function CareerMatchCard({ data }: { data: CareerMatch }) {
  const readiness = READINESS_COLORS[data.readinessLevel] ?? { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 fade-in fade-in-delay-2">
      <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </span>
        Career Match
      </h2>

      <div className="flex flex-col items-center gap-5">
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${readiness.bg} ${readiness.text} ${readiness.border} mb-2`}>
            {data.readinessLevel}
          </span>
          <h3 className="text-lg font-bold text-gray-900">{data.targetRole}</h3>
        </div>

        <CircularProgress score={data.matchScore} />

        <p className="text-sm text-gray-600 text-center leading-relaxed border-t border-gray-100 pt-4 w-full">
          {data.summary}
        </p>
      </div>
    </div>
  );
}

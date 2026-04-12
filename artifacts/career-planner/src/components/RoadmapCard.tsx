import type { RoadmapStep } from "../types";

const STEP_COLORS = [
  { dot: "bg-indigo-600", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  { dot: "bg-blue-600", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { dot: "bg-cyan-600", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  { dot: "bg-violet-600", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  { dot: "bg-purple-600", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
];

export default function RoadmapCard({ steps }: { steps: RoadmapStep[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 fade-in fade-in-delay-5">
      <h2 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </span>
        Upskilling Roadmap
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {steps.map((step, idx) => {
            const colors = STEP_COLORS[idx % STEP_COLORS.length];
            return (
              <div key={step.step} className="flex gap-4 relative">
                {/* Dot */}
                <div className={`w-9 h-9 rounded-full ${colors.dot} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10 shadow-sm`}>
                  {step.step}
                </div>
                {/* Content */}
                <div className={`flex-1 ${colors.bg} border ${colors.border} rounded-xl p-4`}>
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <h3 className={`text-sm font-bold ${colors.text}`}>{step.focusArea}</h3>
                    <span className={`text-xs font-medium ${colors.text} bg-white/60 border ${colors.border} px-2 py-0.5 rounded-full flex-shrink-0`}>
                      {step.timeline}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.action}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

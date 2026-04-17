import { memo } from "react";
import type { RoadmapStep } from "../types";

const STEP_COLORS = [
  { dot: "bg-indigo-600", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", link: "bg-indigo-600 hover:bg-indigo-700" },
  { dot: "bg-blue-600", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", link: "bg-blue-600 hover:bg-blue-700" },
  { dot: "bg-cyan-600", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", link: "bg-cyan-600 hover:bg-cyan-700" },
  { dot: "bg-violet-600", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", link: "bg-violet-600 hover:bg-violet-700" },
  { dot: "bg-purple-600", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", link: "bg-purple-600 hover:bg-purple-700" },
];

const GOOGLE_SEARCH_HOST = "www.google.com";

function isGoogleSearch(url: string): boolean {
  try {
    return new URL(url).hostname === GOOGLE_SEARCH_HOST;
  } catch {
    return false;
  }
}

function getLinkLabel(url: string): string {
  if (isGoogleSearch(url)) return "Search Google";
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (host.includes("coursera")) return "Open on Coursera";
    if (host.includes("edx")) return "Open on edX";
    if (host.includes("udemy")) return "Open on Udemy";
    if (host.includes("learn.microsoft")) return "Open on Microsoft Learn";
    if (host.includes("aws.amazon")) return "Open on AWS Training";
    if (host.includes("cloud.google") || host.includes("cloudskillsboost")) return "Open on Google Cloud";
    if (host.includes("pmi.org")) return "Open on PMI";
    if (host.includes("scrum.org") || host.includes("scrumalliance")) return "Open on Scrum Alliance";
    if (host.includes("pluralsight")) return "Open on Pluralsight";
    if (host.includes("khanacademy")) return "Open on Khan Academy";
    if (host.includes("skillshop")) return "Open on Google Skillshop";
    if (host.includes("isc2")) return "Open on ISC²";
    return "Start Learning";
  } catch {
    return "Start Learning";
  }
}

function RoadmapCard({ steps }: { steps: RoadmapStep[] }) {
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
        <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {steps.map((step, idx) => {
            const colors = STEP_COLORS[idx % STEP_COLORS.length];
            const label = step.courseLink ? getLinkLabel(step.courseLink) : null;
            const isSearch = step.courseLink ? isGoogleSearch(step.courseLink) : false;

            return (
              <div key={step.step} className="flex gap-4 relative">
                <div className={`w-9 h-9 rounded-full ${colors.dot} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10 shadow-sm`}>
                  {step.step}
                </div>
                <div className={`flex-1 ${colors.bg} border ${colors.border} rounded-xl p-4`}>
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <h3 className={`text-sm font-bold ${colors.text}`}>{step.focusArea}</h3>
                    <span className={`text-xs font-medium ${colors.text} bg-white/60 border ${colors.border} px-2 py-0.5 rounded-full flex-shrink-0`}>
                      {step.timeline}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.action}</p>

                  {step.courseLink && label && (
                    <div className="mt-3">
                      <a
                        href={step.courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors no-underline ${colors.link}`}
                      >
                        {isSearch ? (
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        )}
                        {label}
                        <svg className="w-3 h-3 flex-shrink-0 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(RoadmapCard);

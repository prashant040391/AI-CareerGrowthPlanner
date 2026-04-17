import { memo } from "react";
import type { SkillGaps } from "../types";

function SkillGapsCard({ data }: { data: SkillGaps }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 fade-in fade-in-delay-4">
      <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <span className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </span>
        Skill Gaps
      </h2>

      <div className="space-y-5">
        {data.missingSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2.5">Missing Skills</p>
            <div className="flex flex-wrap gap-2">
              {data.missingSkills.map((skill) => (
                <span key={skill} className="inline-flex items-center bg-red-50 text-red-700 text-xs font-medium px-3 py-1.5 rounded-full border border-red-200">
                  <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.weakAreas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2.5">Areas to Strengthen</p>
            <div className="flex flex-wrap gap-2">
              {data.weakAreas.map((area) => (
                <span key={area} className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200">
                  <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                  </svg>
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SkillGapsCard);

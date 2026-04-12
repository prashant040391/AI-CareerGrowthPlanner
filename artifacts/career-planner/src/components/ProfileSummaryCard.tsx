import type { ProfileSummary } from "../types";

export default function ProfileSummaryCard({ data }: { data: ProfileSummary }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 fade-in fade-in-delay-1">
      <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <span className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        Profile Summary
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Current Role</p>
            <p className="text-sm font-semibold text-gray-800">{data.currentRole}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Experience</p>
            <p className="text-sm font-semibold text-gray-800">{data.yearsOfExperience}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Industry</p>
            <p className="text-sm font-semibold text-gray-800">{data.industry}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Education</p>
            <p className="text-sm font-semibold text-gray-800">{data.education}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Top Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full border border-indigo-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Tools & Platforms</p>
          <div className="flex flex-wrap gap-1.5">
            {data.tools.map((tool) => (
              <span key={tool} className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

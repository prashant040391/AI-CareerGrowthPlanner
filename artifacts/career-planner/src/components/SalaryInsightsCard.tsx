import { memo } from "react";
import type { SalaryInsights } from "../types";

function SalaryInsightsCard({ data }: { data: SalaryInsights }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 fade-in fade-in-delay-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        Salary Insights
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Current Estimated Range</p>
            <p className="text-base font-bold text-gray-800">{data.currentRange}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs text-indigo-400 uppercase tracking-wide font-medium mb-1">Target Role Range</p>
            <p className="text-base font-bold text-indigo-900">{data.targetRange}</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-500 uppercase tracking-wide font-medium mb-1">Expected Salary Uplift</p>
          <p className="text-base font-bold text-green-700 break-words">+{data.upliftPercent}</p>
          <p className="text-xs text-green-600 mt-0.5">Potential increase by reaching your target role</p>
        </div>
      </div>
    </div>
  );
}

export default memo(SalaryInsightsCard);

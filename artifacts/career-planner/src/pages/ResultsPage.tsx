import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useCareer } from "../context/CareerContext";
import ProfileSummaryCard from "../components/ProfileSummaryCard";
import CareerMatchCard from "../components/CareerMatchCard";
import StrengthsCard from "../components/StrengthsCard";
import SkillGapsCard from "../components/SkillGapsCard";
import RoadmapCard from "../components/RoadmapCard";
import SalaryInsightsCard from "../components/SalaryInsightsCard";

export default function ResultsPage() {
  const [, navigate] = useLocation();
  const { analysisResult } = useCareer();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!analysisResult) {
      navigate("/analyze");
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null;

  const { profileSummary, careerMatch, strengths, skillGaps, roadmap, salaryInsights } = analysisResult;

  const buildSummaryText = () => {
    const lines: string[] = [
      `== PROFILE SUMMARY ==`,
      ...(profileSummary.candidateName ? [`Candidate: ${profileSummary.candidateName}`] : []),
      `Current Role: ${profileSummary.currentRole}`,
      `Experience: ${profileSummary.yearsOfExperience}`,
      `Industry: ${profileSummary.industry}`,
      `Education: ${profileSummary.education}`,
      `Skills: ${profileSummary.skills.join(", ")}`,
      `Tools: ${profileSummary.tools.join(", ")}`,
      ``,
      `== CAREER MATCH ==`,
      `Target Role: ${careerMatch.targetRole}`,
      `Readiness Level: ${careerMatch.readinessLevel}`,
      `Match Score: ${careerMatch.matchScore}/100`,
      `${careerMatch.summary}`,
      ``,
      `== KEY STRENGTHS ==`,
      ...strengths.map((s, i) => `${i + 1}. ${s}`),
      ``,
      `== SKILL GAPS ==`,
      `Missing Skills: ${skillGaps.missingSkills.join(", ")}`,
      `Weak Areas: ${skillGaps.weakAreas.join(", ")}`,
      ``,
      `== UPSKILLING ROADMAP ==`,
      ...roadmap.map((step) => `Step ${step.step} (${step.timeline}): ${step.focusArea}\n   ${step.action}`),
      ``,
      `== SALARY INSIGHTS ==`,
      `Current Range: ${salaryInsights.currentRange}`,
      `Target Range: ${salaryInsights.targetRange}`,
      `Expected Uplift: ${salaryInsights.upliftPercent}`,
      ``,
      `Note: This is an AI-generated career planning output. Use it as a decision support guide, not as the sole basis for career decisions.`,
    ];
    return lines.join("\n");
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      alert("Career summary copied to clipboard!");
    } catch {
      alert("Unable to copy. Please select and copy the text manually.");
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f9fafb",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let yOffset = 0;
      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, "PNG", 0, -yOffset, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        yOffset += pageHeight;
        if (remainingHeight > 0) pdf.addPage();
      }

      const fileName = profileSummary.candidateName
        ? `${profileSummary.candidateName.replace(/\s+/g, "_")}_Career_Report.pdf`
        : "Career_Analysis_Report.pdf";

      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Home
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-lg font-bold text-indigo-600">AI Career Growth Planner</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Summary
            </button>
            <button
              onClick={() => navigate("/analyze")}
              className="flex items-center gap-1.5 text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Page Title */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Career Analysis Report</h1>
            <p className="text-gray-500 text-sm">
              AI-generated results for <span className="font-semibold text-indigo-600">{careerMatch.targetRole}</span>
              {profileSummary.candidateName && (
                <> &mdash; <span className="font-semibold text-gray-700">{profileSummary.candidateName}</span></>
              )}
            </p>
          </div>
          {/* Download PDF button — positioned next to the Profile Summary section */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <span className="block w-4 h-4 rounded-full border-2 border-red-300 border-t-red-600 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>

        {/* Report content captured for PDF */}
        <div ref={reportRef}>
          {/* Top row: Profile + Career Match */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ProfileSummaryCard data={profileSummary} />
            <CareerMatchCard data={careerMatch} />
          </div>

          {/* Second row: Strengths + Skill Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <StrengthsCard strengths={strengths} />
            <SkillGapsCard data={skillGaps} />
          </div>

          {/* Full-width Roadmap */}
          <div className="mb-6">
            <RoadmapCard steps={roadmap} />
          </div>

          {/* Full-width Salary */}
          <div className="mb-6">
            <SalaryInsightsCard data={salaryInsights} />
          </div>

          {/* Disclaimer inside PDF */}
          <div className="text-center text-xs text-gray-400 italic border-t border-gray-200 pt-6 pb-4">
            This is an AI-generated career planning output. Use it as a decision support guide, not as the sole basis for career decisions.
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 text-sm font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <span className="block w-4 h-4 rounded-full border-2 border-red-300 border-t-red-600 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-2 text-sm font-semibold border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy Summary
          </button>
          <button
            onClick={() => navigate("/analyze")}
            className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

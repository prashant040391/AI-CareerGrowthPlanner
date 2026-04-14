import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useCareer } from "../context/CareerContext";
import type { CareerAnalysis } from "../types";

const LOADING_STEPS = [
  "Parsing your resume...",
  "Understanding target role requirements...",
  "Identifying skill gaps...",
  "Building your personalized roadmap...",
  "Estimating salary growth potential...",
];

const TARGET_ROLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Lead Software Engineer",
  "Principal Engineer",
  "Engineering Manager",
  "Product Manager",
  "Senior Product Manager",
  "Director of Product",
  "Data Analyst",
  "Data Scientist",
  "Senior Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Business Analyst",
  "Senior Business Analyst",
  "Project Manager",
  "Senior Project Manager",
  "Program Manager",
  "Scrum Master",
  "Agile Coach",
  "UX Designer",
  "UI Designer",
  "UX Researcher",
  "Product Designer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Solution Architect",
  "Enterprise Architect",
  "Sales Manager",
  "Account Executive",
  "Business Development Manager",
  "Marketing Manager",
  "Digital Marketing Manager",
  "Content Strategist",
  "Operations Manager",
  "Strategy Consultant",
  "Management Consultant",
  "Financial Analyst",
  "Finance Manager",
  "Human Resources Manager",
  "HR Business Partner",
  "Talent Acquisition Specialist",
  "Supply Chain Manager",
  "Other",
];

const TARGET_INDUSTRIES = [
  "Information Technology",
  "Banking & Finance",
  "Healthcare",
  "Consulting",
  "Manufacturing",
  "E-commerce",
  "Education",
  "Telecommunications",
  "Media & Entertainment",
  "Government & Public Sector",
  "Startups",
  "Retail",
  "Automotive",
  "Pharmaceuticals & Biotech",
  "Real Estate",
  "Energy & Utilities",
  "Logistics & Supply Chain",
  "FMCG",
  "Legal",
  "Non-Profit",
  "Agriculture",
  "Other",
];

const GEOGRAPHIES = [
  "India",
  "Africa",
  "Antarctica",
  "Asia",
  "Australia / Oceania",
  "Europe",
  "North America",
  "South America",
];

const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export default function AnalyzePage() {
  const [, navigate] = useLocation();
  const { setAnalysisResult } = useCareer();

  const [resume, setResume] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [geography, setGeography] = useState("India");

  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [apiError, setApiError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const isValidMime = ACCEPTED_MIME.includes(file.type);
    const isValidExt = ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isValidMime && !isValidExt) {
      setErrors((e) => ({ ...e, resume: "Only PDF or Word (DOC/DOCX) files are accepted" }));
      return;
    }
    setResume(file);
    setErrors((e) => ({ ...e, resume: "" }));
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file ?? null);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const getEffectiveRole = () => (targetRole === "Other" ? customRole.trim() : targetRole);
  const getEffectiveIndustry = () => (targetIndustry === "Other" ? customIndustry.trim() : targetIndustry);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!resume) newErrors.resume = "Please upload a PDF or Word resume";
    if (!targetRole) newErrors.targetRole = "Please select a target job role";
    if (targetRole === "Other" && !customRole.trim()) newErrors.customRole = "Please specify your target role";
    if (!targetIndustry) newErrors.targetIndustry = "Please select a target industry";
    if (targetIndustry === "Other" && !customIndustry.trim()) newErrors.customIndustry = "Please specify your target industry";
    if (!geography) newErrors.geography = "Please select a geography";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setResume(null);
    setTargetRole("");
    setCustomRole("");
    setTargetIndustry("");
    setCustomIndustry("");
    setGeography("India");
    setErrors({});
    setApiError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startLoadingAnimation = () => {
    setLoadingStep(0);
    let step = 0;
    loadingIntervalRef.current = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length) {
        setLoadingStep(step);
      } else {
        if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      }
    }, 2500);
  };

  const stopLoadingAnimation = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError("");
    startLoadingAnimation();

    try {
      const formData = new FormData();
      formData.append("resume", resume!);
      formData.append("targetRole", getEffectiveRole());
      formData.append("targetIndustry", getEffectiveIndustry());
      formData.append("geography", geography === "Other" ? "Other" : geography);

      const response = await fetch(`${import.meta.env.BASE_URL}api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as CareerAnalysis | { error: string };

      if (!response.ok) {
        const errMsg = (data as { error: string }).error ?? "Analysis failed. Please try again.";
        setApiError(errMsg);
        return;
      }

      setAnalysisResult(data as CareerAnalysis);
      navigate("/results");
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      stopLoadingAnimation();
      setIsLoading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.name.toLowerCase().endsWith(".pdf")) return "📄";
    return "📝";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-lg font-bold text-indigo-600">AI Career Growth Planner</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Analysis</h1>
          <p className="text-gray-500">Fill in the details below to get your personalized career roadmap</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                <span className="block w-8 h-8 rounded-full border-[3px] border-indigo-200 border-t-indigo-600 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your career profile...</h2>
              <p className="text-gray-400 text-sm mb-8">This may take 20–40 seconds</p>
              <div className="w-full space-y-3">
                {LOADING_STEPS.map((step, idx) => (
                  <div
                    key={step}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-500 ${
                      idx < loadingStep
                        ? "bg-green-50 text-green-700"
                        : idx === loadingStep
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {idx < loadingStep ? (
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : idx === loadingStep ? (
                      <span className="block w-4 h-4 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                    )}
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-7">

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-gray-400">PDF or Word (DOC/DOCX)</span>
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50"
                      : resume
                      ? "border-green-400 bg-green-50"
                      : errors.resume
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                  {resume ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-green-700 font-medium text-sm">
                        {getFileIcon(resume)} {resume.name}
                      </span>
                      <span className="text-green-500 text-xs">Click to change file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-indigo-600 font-semibold text-sm">Click to upload</span>
                        <span className="text-gray-500 text-sm"> or drag and drop</span>
                      </div>
                      <span className="text-gray-400 text-xs">PDF, DOC, or DOCX — max 10MB</span>
                    </div>
                  )}
                </div>
                {errors.resume && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.resume}
                  </p>
                )}
              </div>

              {/* Target Role Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Job Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={targetRole}
                    onChange={(e) => {
                      setTargetRole(e.target.value);
                      setErrors((er) => ({ ...er, targetRole: "", customRole: "" }));
                    }}
                    className={`w-full px-4 py-3 pr-10 rounded-lg border text-sm text-gray-900 outline-none appearance-none bg-white transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.targetRole ? "border-red-400 bg-red-50" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a target role...</option>
                    {TARGET_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.targetRole && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.targetRole}
                  </p>
                )}
                {/* Custom role input when "Other" is selected */}
                {targetRole === "Other" && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => {
                        setCustomRole(e.target.value);
                        setErrors((er) => ({ ...er, customRole: "" }));
                      }}
                      placeholder="Enter your target role..."
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                        errors.customRole ? "border-red-400 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.customRole && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.customRole}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Target Industry Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Industry <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={targetIndustry}
                    onChange={(e) => {
                      setTargetIndustry(e.target.value);
                      setErrors((er) => ({ ...er, targetIndustry: "", customIndustry: "" }));
                    }}
                    className={`w-full px-4 py-3 pr-10 rounded-lg border text-sm text-gray-900 outline-none appearance-none bg-white transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.targetIndustry ? "border-red-400 bg-red-50" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a target industry...</option>
                    {TARGET_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.targetIndustry && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.targetIndustry}
                  </p>
                )}
                {targetIndustry === "Other" && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customIndustry}
                      onChange={(e) => {
                        setCustomIndustry(e.target.value);
                        setErrors((er) => ({ ...er, customIndustry: "" }));
                      }}
                      placeholder="Enter your target industry..."
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                        errors.customIndustry ? "border-red-400 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.customIndustry && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.customIndustry}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Geography Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Geography / Country
                </label>
                <div className="relative">
                  <select
                    value={geography}
                    onChange={(e) => setGeography(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 text-sm text-gray-900 outline-none appearance-none bg-white transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {GEOGRAPHIES.map((geo) => (
                      <option key={geo} value={geo}>{geo}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {apiError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3.5 rounded-lg">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {apiError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 rounded-lg text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  Analyze My Career Path
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="px-6 py-3.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

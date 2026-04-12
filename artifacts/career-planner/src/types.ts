export interface ProfileSummary {
  currentRole: string;
  yearsOfExperience: string;
  industry: string;
  skills: string[];
  tools: string[];
  education: string;
}

export interface CareerMatch {
  targetRole: string;
  readinessLevel: string;
  matchScore: number;
  summary: string;
}

export interface RoadmapStep {
  step: number;
  focusArea: string;
  timeline: string;
  action: string;
}

export interface SalaryInsights {
  currentRange: string;
  targetRange: string;
  upliftPercent: string;
}

export interface SkillGaps {
  missingSkills: string[];
  weakAreas: string[];
}

export interface CareerAnalysis {
  profileSummary: ProfileSummary;
  careerMatch: CareerMatch;
  strengths: string[];
  skillGaps: SkillGaps;
  roadmap: RoadmapStep[];
  salaryInsights: SalaryInsights;
}

export interface AnalysisFormData {
  resume: File | null;
  targetRole: string;
  targetIndustry: string;
  geography: string;
  currentSalary: string;
  desiredSalary: string;
}

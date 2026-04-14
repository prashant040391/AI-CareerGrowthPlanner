import { Router, type IRouter } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const ACCEPTED_MIMETYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or Word (DOC/DOCX) files are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const MOCK_DATA = {
  profileSummary: {
    candidateName: "Rahul Sharma",
    currentRole: "Project Coordinator",
    yearsOfExperience: "4 years",
    industry: "Operations / Energy",
    skills: ["Vendor Coordination", "Procurement Support", "Reporting", "Communication", "MS Excel"],
    tools: ["Excel", "SAP", "PowerPoint", "Outlook"],
    education: "B.E. Mechanical Engineering",
  },
  careerMatch: {
    targetRole: "Senior Project Manager",
    readinessLevel: "Intermediate",
    matchScore: 62,
    summary:
      "You have a strong operational foundation with hands-on project coordination experience. While you demonstrate relevant domain knowledge and stakeholder communication skills, you lack formal project management certifications, risk management experience, and leadership at a senior level. With focused upskilling, you can bridge these gaps within 12 months.",
  },
  strengths: [
    "Strong vendor and stakeholder coordination",
    "Domain knowledge in Operations and Energy",
    "Hands-on procurement and reporting experience",
    "Proficiency with enterprise tools (SAP, Excel)",
    "4 years of project lifecycle exposure",
  ],
  skillGaps: {
    missingSkills: ["PMP Certification", "Risk Management", "Agile / Scrum", "Budget Management", "Strategic Planning"],
    weakAreas: ["Leadership and Team Management", "Executive-level Communication", "Resource Forecasting"],
  },
  roadmap: [
    {
      step: 1,
      focusArea: "Project Management Fundamentals",
      timeline: "Month 1-2",
      action: "Enroll in PMP or CAPM certification prep. Complete PMI's Project Management Basics on Coursera.",
    },
    {
      step: 2,
      focusArea: "Risk & Budget Management",
      timeline: "Month 3-4",
      action: "Take a Risk Management course on Udemy. Practice cost estimation and budget tracking in a real or simulated project.",
    },
    {
      step: 3,
      focusArea: "Agile & Scrum Methodology",
      timeline: "Month 5-6",
      action: "Complete Scrum Master certification (CSM or PSM I). Apply agile principles to current work where possible.",
    },
    {
      step: 4,
      focusArea: "Leadership & Team Management",
      timeline: "Month 7-9",
      action: "Lead a cross-functional initiative at work. Take a leadership course focusing on delegation, conflict resolution, and motivation.",
    },
    {
      step: 5,
      focusArea: "Senior Role Preparation",
      timeline: "Month 10-12",
      action: "Apply for Senior PM roles. Update LinkedIn and resume to reflect new certifications, leadership experience, and expanded scope.",
    },
  ],
  salaryInsights: {
    currentRange: "₹7L – ₹10L per annum",
    targetRange: "₹18L – ₹26L per annum",
    upliftPercent: "80-120%",
  },
};

function getCurrencyGuide(geography: string): string {
  const geo = geography.toLowerCase();

  // India & Remote
  if (geo === "india" || geo === "remote") return "Indian Rupees (₹), e.g. ₹12L – ₹18L per annum";
  if (geo === "sri lanka") return "Sri Lankan Rupees (LKR), e.g. LKR 2M – 4M per year";
  if (geo === "pakistan" || geo === "bangladesh") return "USD equivalent, e.g. $12,000 – $25,000 per year";

  // Europe
  if (["united kingdom"].includes(geo)) return "British Pounds (£), e.g. £45,000 – £80,000 per year";
  if (["switzerland"].includes(geo)) return "Swiss Francs (CHF), e.g. CHF 80,000 – CHF 130,000 per year";
  if (["norway", "sweden", "denmark", "finland"].includes(geo)) return "Euros or local Scandinavian currency, e.g. €50,000 – €90,000 per year";
  if (["germany", "france", "netherlands", "spain", "italy", "belgium", "ireland",
       "poland", "portugal", "other europe"].includes(geo)) return "Euros (€), e.g. €40,000 – €80,000 per year";

  // North America
  if (geo === "usa") return "US Dollars (USD $), e.g. $80,000 – $140,000 per year";
  if (geo === "canada") return "Canadian Dollars (CAD $), e.g. CAD $70,000 – $110,000 per year";
  if (geo === "mexico" || geo === "other north america") return "USD equivalent, e.g. $20,000 – $45,000 per year";

  // Middle East
  if (["uae", "qatar", "bahrain", "kuwait", "saudi arabia", "oman"].includes(geo))
    return "USD equivalent (tax-free), e.g. $50,000 – $120,000 per year";
  if (geo === "israel") return "USD equivalent, e.g. $60,000 – $100,000 per year";
  if (geo === "jordan" || geo === "other middle east") return "USD equivalent, e.g. $20,000 – $50,000 per year";

  // Asia
  if (geo === "singapore") return "Singapore Dollars (SGD), e.g. SGD 60,000 – 120,000 per year";
  if (geo === "japan") return "Japanese Yen (¥), e.g. ¥5M – ¥10M per year";
  if (geo === "south korea") return "Korean Won (KRW), e.g. KRW 40M – 80M per year";
  if (geo === "china") return "Chinese Yuan (¥ CNY), e.g. ¥200,000 – ¥500,000 per year";
  if (["malaysia", "thailand", "indonesia", "philippines", "vietnam",
       "bangladesh", "other asia"].includes(geo)) return "USD equivalent, e.g. $15,000 – $40,000 per year";

  // Australia & Oceania
  if (geo === "australia") return "Australian Dollars (AUD A$), e.g. A$80,000 – A$130,000 per year";
  if (geo === "new zealand") return "New Zealand Dollars (NZD), e.g. NZD 70,000 – 110,000 per year";

  // South America
  if (geo === "brazil") return "Brazilian Reais (BRL), e.g. BRL 80,000 – 180,000 per year";
  if (["argentina", "colombia", "chile", "peru", "venezuela", "other south america"].includes(geo))
    return "USD equivalent, e.g. $15,000 – $40,000 per year";

  // Africa
  if (geo === "south africa") return "South African Rand (ZAR), e.g. ZAR 400,000 – 800,000 per year";
  if (["nigeria", "kenya", "egypt", "ghana", "ethiopia", "tanzania",
       "uganda", "morocco", "other africa"].includes(geo))
    return "USD equivalent, e.g. $15,000 – $40,000 per year";

  return "US Dollars (USD $), e.g. $50,000 – $80,000 per year";
}

async function extractTextFromFile(buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype === "application/pdf") {
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  }
  // DOC / DOCX
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function buildPrompt(
  resumeText: string,
  targetRole: string,
  targetIndustry: string,
  geography: string,
): string {
  const currencyGuide = getCurrencyGuide(geography);
  const geographyNote =
    geography === "Remote"
      ? "Remote (use Indian Rupee INR for salary since the candidate is India-based)"
      : geography;

  return `You are an expert career analyst and talent intelligence system.

A professional has uploaded their resume and wants a detailed career gap analysis.

RESUME CONTENT:
${resumeText}

USER INPUTS:
- Target Role: ${targetRole}
- Target Industry: ${targetIndustry}
- Geography: ${geographyNote}
- Salary Currency: Express all salary figures in ${currencyGuide}

YOUR TASK:
Analyze the resume against the target role and generate a structured JSON response. 
Do NOT include any explanation outside the JSON. Return ONLY valid JSON.

Return the following JSON structure:

{
  "profileSummary": {
    "candidateName": "full name extracted from resume, or empty string if not found",
    "currentRole": "inferred current job title",
    "yearsOfExperience": "estimated years",
    "industry": "current industry",
    "skills": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "education": "highest qualification"
  },
  "careerMatch": {
    "targetRole": "${targetRole}",
    "readinessLevel": "one of: Beginner / Developing / Intermediate / Advanced / Ready",
    "matchScore": 0,
    "summary": "2-3 sentence narrative assessment of readiness"
  },
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "skillGaps": {
    "missingSkills": ["skill1", "skill2"],
    "weakAreas": ["area1", "area2"]
  },
  "roadmap": [
    { "step": 1, "focusArea": "", "timeline": "Month 1-2", "action": "specific action" },
    { "step": 2, "focusArea": "", "timeline": "Month 3-4", "action": "specific action" },
    { "step": 3, "focusArea": "", "timeline": "Month 5-6", "action": "specific action" },
    { "step": 4, "focusArea": "", "timeline": "Month 7-9", "action": "specific action" },
    { "step": 5, "focusArea": "", "timeline": "Month 10-12", "action": "specific action" }
  ],
  "salaryInsights": {
    "currentRange": "e.g. ₹8L – ₹12L per annum",
    "targetRange": "e.g. ₹18L – ₹25L per annum",
    "upliftPercent": "e.g. 60-80%"
  }
}

Be specific, realistic, and personalized. Avoid generic advice. Base all outputs strictly on the resume content and the target role provided.`;
}

router.post("/analyze", upload.single("resume"), async (req, res): Promise<void> => {
  const { targetRole, targetIndustry, geography } = req.body as {
    targetRole?: string;
    targetIndustry?: string;
    geography?: string;
  };

  if (!req.file) {
    res.status(400).json({ error: "Please upload a PDF or Word resume" });
    return;
  }

  if (!targetRole || typeof targetRole !== "string" || targetRole.trim() === "") {
    res.status(400).json({ error: "Target job role is required" });
    return;
  }

  let resumeText = "";
  try {
    resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    if (!resumeText || resumeText.trim().length < 50) {
      res.status(400).json({ error: "Could not extract text from the file. Please ensure it is a readable document." });
      return;
    }
  } catch (err) {
    req.log.error({ err }, "File parse error");
    res.status(400).json({ error: "Failed to parse the uploaded file. Please upload a valid PDF or Word document." });
    return;
  }

  const prompt = buildPrompt(
    resumeText,
    targetRole.trim(),
    (targetIndustry ?? "").trim() || "Not specified",
    (geography ?? "India").trim() || "India",
  );

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (!block || block.type !== "text") {
      req.log.error({ message }, "Unexpected response from Claude");
      res.status(500).json({ error: "Unexpected response from AI. Please try again." });
      return;
    }

    let rawText = block.text.trim();

    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      rawText = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(rawText) as unknown;
    res.json(parsed);
  } catch (err) {
    if (err instanceof SyntaxError) {
      req.log.error({ err }, "JSON parse error from Claude response");
      res.status(500).json({ error: "AI returned an invalid response. Please try again." });
      return;
    }
    req.log.error({ err }, "Claude API error");
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
});

router.get("/analyze/mock", async (_req, res): Promise<void> => {
  logger.info("Serving mock career analysis data");
  res.json(MOCK_DATA);
});

export default router;

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
      courseLink: "https://www.pmi.org/certifications/project-management-pmp",
    },
    {
      step: 2,
      focusArea: "Risk & Budget Management",
      timeline: "Month 3-4",
      action: "Take a Risk Management course on Udemy. Practice cost estimation and budget tracking in a real or simulated project.",
      courseLink: "https://www.coursera.org/search?query=risk+management+project",
    },
    {
      step: 3,
      focusArea: "Agile & Scrum Methodology",
      timeline: "Month 5-6",
      action: "Complete Scrum Master certification (CSM or PSM I). Apply agile principles to current work where possible.",
      courseLink: "https://www.scrum.org/assessments/professional-scrum-master-i-certification",
    },
    {
      step: 4,
      focusArea: "Leadership & Team Management",
      timeline: "Month 7-9",
      action: "Lead a cross-functional initiative at work. Take a leadership course focusing on delegation, conflict resolution, and motivation.",
      courseLink: "https://www.coursera.org/search?query=leadership+team+management",
    },
    {
      step: 5,
      focusArea: "Senior Role Preparation",
      timeline: "Month 10-12",
      action: "Apply for Senior PM roles. Update LinkedIn and resume to reflect new certifications, leadership experience, and expanded scope.",
      courseLink: "https://www.google.com/search?q=Senior+Project+Manager+role+preparation+online+course+certification",
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
    { "step": 1, "focusArea": "", "timeline": "Month 1-2", "action": "specific action", "courseLink": "URL to a top-rated course or certification on a trusted platform — see rules below" },
    { "step": 2, "focusArea": "", "timeline": "Month 3-4", "action": "specific action", "courseLink": "URL" },
    { "step": 3, "focusArea": "", "timeline": "Month 5-6", "action": "specific action", "courseLink": "URL" },
    { "step": 4, "focusArea": "", "timeline": "Month 7-9", "action": "specific action", "courseLink": "URL" },
    { "step": 5, "focusArea": "", "timeline": "Month 10-12", "action": "specific action", "courseLink": "URL" }
  ],
  "salaryInsights": {
    "currentRange": "Estimate the candidate's CURRENT market value based on their actual skills, years of experience, education, tools, and industry — NOT a generic range. Use the currency specified above for ${geography}. Example format for India: ₹10L – ₹15L per annum",
    "targetRange": "Estimate the salary range for the TARGET role (${targetRole}) in ${geography} for someone who has bridged all skill gaps. Use the same currency. Example format for India: ₹22L – ₹30L per annum",
    "upliftPercent": "Calculate the realistic salary growth percentage from current to target, e.g. 60-80%"
  }
}

IMPORTANT COURSE LINK RULES:
For each roadmap step, set "courseLink" to the best available URL using these rules (in order of preference):
1. If the step involves a well-known certification with a stable official page, use the exact official URL:
   - PMP / CAPM: https://www.pmi.org/certifications/project-management-pmp
   - Scrum Master (CSM): https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster
   - PSM I (Professional Scrum Master): https://www.scrum.org/assessments/professional-scrum-master-i-certification
   - AWS certifications: https://aws.amazon.com/certification/
   - Google Cloud certifications: https://cloud.google.com/learn/certification
   - Microsoft Azure certifications: https://learn.microsoft.com/en-us/credentials/browse/
   - Google Data Analytics / Project Management on Coursera: https://www.coursera.org/professional-certificates/google-project-management
   - Google Digital Marketing: https://skillshop.withgoogle.com/
   - CISSP / Security+: https://www.isc2.org/certifications/cissp
2. If the step is about a topic well-covered on Coursera, use the Coursera search URL:
   https://www.coursera.org/search?query=TOPIC (replace TOPIC with URL-encoded focus area keywords)
3. If the step is about a Microsoft or Azure technology, prefer:
   https://learn.microsoft.com/en-us/training/browse/?terms=TOPIC
4. If the step is about an AWS technology, prefer:
   https://aws.amazon.com/training/course-descriptions/
5. For any other topic, use edX search:
   https://www.edx.org/search?q=TOPIC
- ONLY use URLs from these trusted domains: coursera.org, edx.org, udemy.com, learn.microsoft.com, aws.amazon.com, cloud.google.com, cloudskillsboost.google, pmi.org, scrum.org, scrumalliance.org, isc2.org, skillshop.withgoogle.com, khanacademy.org, pluralsight.com
- If no trusted platform is relevant, set courseLink to null.
- URL-encode all topic strings in search URLs (spaces become %20 or +).

IMPORTANT SALARY RULES:
- currentRange must reflect the candidate's REAL estimated worth based on what is in their resume (skills, tools, education, experience years, and current role). Do not use placeholder text.
- targetRange must reflect realistic compensation for the target role in the specified geography.
- All figures must use the currency appropriate for ${geography} as instructed above.
- Be specific and realistic. Avoid generic wide ranges unless the data is genuinely ambiguous.

Be specific, realistic, and personalized throughout. Avoid generic advice. Base all outputs strictly on the resume content and the inputs provided.`;
}

/* ── Course link helpers ─────────────────────────────────────────────────── */
const TRUSTED_COURSE_DOMAINS = [
  "coursera.org",
  "edx.org",
  "udemy.com",
  "learn.microsoft.com",
  "aws.amazon.com",
  "cloud.google.com",
  "cloudskillsboost.google",
  "pmi.org",
  "scrum.org",
  "scrumalliance.org",
  "isc2.org",
  "skillshop.withgoogle.com",
  "khanacademy.org",
  "pluralsight.com",
];

function isTrustedCourseLink(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return TRUSTED_COURSE_DOMAINS.some((d) => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

function googleSearchFallback(focusArea: string): string {
  const q = encodeURIComponent(`${focusArea} online course certification`);
  return `https://www.google.com/search?q=${q}`;
}

function ensureCourseLinkFallback(roadmap: Array<{ step: number; focusArea: string; timeline: string; action: string; courseLink?: string | null }>): Array<{ step: number; focusArea: string; timeline: string; action: string; courseLink: string }> {
  return roadmap.map((r) => ({
    ...r,
    courseLink: isTrustedCourseLink(r.courseLink) ? r.courseLink! : googleSearchFallback(r.focusArea),
  }));
}

/* ── Resume section validation endpoint ─────────────────────────────────── */
interface SectionResult {
  name: string;
  present: boolean;
  hint: string;
}

type DocumentType = "cv" | "invoice" | "essay" | "certificate" | "other";

interface ValidationResult {
  valid: boolean;
  rejected: boolean;
  rejectionReason?: string;
  documentType: DocumentType;
  sections: SectionResult[];
  wordCount: number;
  warnings: string[];
}

function detectDocumentType(text: string): { type: DocumentType; rejected: boolean; reason?: string } {
  // ── Invoice / billing document ──────────────────────────────────────────
  const invoicePatterns = [
    /invoice\s*(#|no\.?|number)/i,
    /bill\s*to\s*:/i,
    /amount\s*due/i,
    /tax\s*invoice/i,
    /payment\s*due\s*(date|by)/i,
    /purchase\s*order/i,
    /remit\s*payment/i,
    /subtotal|grand\s*total/i,
  ];
  if (invoicePatterns.filter((r) => r.test(text)).length >= 2) {
    return {
      type: "invoice",
      rejected: true,
      reason:
        "The uploaded document appears to be an invoice or billing statement. " +
        "Please upload your CV or resume (PDF or Word format) to continue.",
    };
  }

  // ── Certificate / award ─────────────────────────────────────────────────
  const certPatterns = [
    /this\s+is\s+to\s+certif/i,
    /certificate\s+of\s+(completion|achievement|participation|excellence|award)/i,
    /awarded\s+to/i,
    /in\s+recognition\s+of/i,
    /hereby\s+certif/i,
    /has\s+successfully\s+completed/i,
    /presented\s+to/i,
  ];
  if (certPatterns.filter((r) => r.test(text)).length >= 1) {
    return {
      type: "certificate",
      rejected: true,
      reason:
        "The uploaded document appears to be a certificate or award, not a CV or resume. " +
        "Please upload your CV or resume (PDF or Word format) to continue.",
    };
  }

  // ── Essay / research paper / report ────────────────────────────────────
  const essayPatterns = [
    /\babstract\b/i,
    /\bmethodology\b/i,
    /\bconclusion\b/i,
    /\breferences\b/i,
    /\bbibliography\b/i,
    /\bliterature\s*review\b/i,
    /\bhypothesis\b/i,
    /\bthesis\s*statement\b/i,
  ];
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (essayPatterns.filter((r) => r.test(text)).length >= 3 && wordCount > 300) {
    return {
      type: "essay",
      rejected: true,
      reason:
        "The uploaded document appears to be an essay, research paper, or report, not a CV or resume. " +
        "Please upload your CV or resume (PDF or Word format) to continue.",
    };
  }

  // ── Minimal / unrecognisable content ────────────────────────────────────
  const cvSignals = [
    /(work\s*experience|professional\s*experience|employment\s*history|career\s*history|experience)/i,
    /(education|academic|qualifications?|university|college|degree|school)/i,
    /(skills?|competenc|proficienc|expertise)/i,
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
    /(resume|curriculum\s*vitae|\bcv\b)/i,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+\d{4}/i,
  ];
  if (cvSignals.filter((r) => r.test(text)).length === 0 && wordCount < 60) {
    return {
      type: "other",
      rejected: true,
      reason:
        "The uploaded document does not appear to contain CV or resume content. " +
        "Please upload your CV or resume (PDF or Word format) to continue.",
    };
  }

  return { type: "cv", rejected: false };
}

function checkResumeSections(text: string): ValidationResult {
  const warnings: string[] = [];

  // First detect document type — reject non-CV documents immediately
  const { type, rejected, reason } = detectDocumentType(text);
  if (rejected) {
    return {
      valid: false,
      rejected: true,
      rejectionReason: reason,
      documentType: type,
      sections: [],
      wordCount: text.trim().split(/\s+/).filter(Boolean).length,
      warnings: [],
    };
  }

  const sections: SectionResult[] = [
    {
      name: "Contact Information",
      present:
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text) ||
        /(\+?\d[\d\s\-().]{7,}\d)/.test(text),
      hint: "Include your email address and phone number",
    },
    {
      name: "Work Experience",
      present:
        /(work\s*experience|professional\s*experience|employment|experience|worked\s*at|positions?\s*held|career\s*history|job\s*history)/i.test(text) ||
        /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+\d{4}/i.test(text),
      hint: "Add a Work Experience section with roles, companies, and dates",
    },
    {
      name: "Education",
      present:
        /(education|academic|qualification|university|college|degree|bachelor|master|b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?|b\.?sc|m\.?sc|mba|phd|diploma|school)/i.test(text),
      hint: "Include your educational qualifications",
    },
    {
      name: "Skills",
      present:
        /(skills?|technical\s*skills?|core\s*competenc|proficienc|expertise|technologies|tools\s*&|stack|languages?)/i.test(text),
      hint: "Add a Skills section listing your technical and professional skills",
    },
  ];

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 80) warnings.push("Resume appears very short — consider adding more detail");

  const presentCount = sections.filter((s) => s.present).length;
  const valid = presentCount >= 3;

  return { valid, rejected: false, documentType: "cv", sections, wordCount, warnings };
}

router.post("/validate-resume", upload.single("resume"), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  if (req.file.size === 0) {
    res.status(400).json({ error: "Uploaded file is empty" });
    return;
  }

  let text = "";
  try {
    text = await extractTextFromFile(req.file.buffer, req.file.mimetype);
  } catch {
    res.status(400).json({ error: "Could not read the file. Please upload a valid PDF or Word document." });
    return;
  }

  if (!text || text.trim().length < 20) {
    res.status(400).json({
      error: "No readable text found. The file may be a scanned image or password-protected.",
    });
    return;
  }

  res.json(checkResumeSections(text));
});

router.post("/analyze", upload.single("resume"), async (req, res): Promise<void> => {
  const { targetRole, targetIndustry, geography } = req.body as {
    targetRole?: string;
    targetIndustry?: string;
    geography?: string;
  };

  if (!req.file) {
    res.status(400).json({ error: "No file was uploaded. Please attach a PDF or Word (.doc / .docx) resume." });
    return;
  }

  // Empty file
  if (req.file.size === 0) {
    res.status(400).json({ error: "The uploaded file is empty. Please upload a resume with content." });
    return;
  }

  // Validate MIME type explicitly on the server
  const validMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const originalName = (req.file.originalname ?? "").toLowerCase();
  const validExt = [".pdf", ".doc", ".docx"].some((ext) => originalName.endsWith(ext));
  if (!validMimeTypes.includes(req.file.mimetype) && !validExt) {
    res.status(400).json({
      error: `Unsupported file type "${req.file.mimetype}". Only PDF (.pdf) and Word (.doc, .docx) files are accepted.`,
    });
    return;
  }

  if (!targetRole || typeof targetRole !== "string" || targetRole.trim() === "") {
    res.status(400).json({ error: "Target job role is required" });
    return;
  }

  if (!targetIndustry || typeof targetIndustry !== "string" || targetIndustry.trim() === "") {
    res.status(400).json({ error: "Target industry is required" });
    return;
  }

  let resumeText = "";
  try {
    resumeText = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    if (!resumeText || resumeText.trim().length < 30) {
      res.status(400).json({
        error:
          "The uploaded file appears to have no readable text. Please ensure the file is not scanned/image-only and is not password protected.",
      });
      return;
    }
  } catch (err) {
    req.log.error({ err }, "File parse error");
    res.status(400).json({ error: "Failed to read the uploaded file. Please upload a valid, unprotected PDF or Word document." });
    return;
  }

  // Reject non-CV documents before sending to AI
  const { rejected: docRejected, reason: docReason } = detectDocumentType(resumeText);
  if (docRejected) {
    res.status(422).json({ error: docReason });
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

    const parsed = JSON.parse(rawText) as Record<string, unknown>;

    // Ensure every roadmap step has a valid, trusted course link (or Google search fallback)
    if (Array.isArray(parsed.roadmap)) {
      parsed.roadmap = ensureCourseLinkFallback(
        parsed.roadmap as Array<{ step: number; focusArea: string; timeline: string; action: string; courseLink?: string | null }>
      );
    }

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

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "AI_Career_Growth_Planner_Prompt.pdf");
const doc = new PDFDocument({ margin: 50, size: "A4" });
doc.pipe(fs.createWriteStream(OUT));

const W = doc.page.width - 100; // usable width

// ── Colour palette ──────────────────────────────────────────────────────────
const INDIGO  = "#4F46E5";
const DARK    = "#111827";
const MEDIUM  = "#374151";
const LIGHT   = "#6B7280";
const BORDER  = "#E5E7EB";
const BG_CARD = "#F9FAFB";

// ── Helpers ──────────────────────────────────────────────────────────────────
function h1(text) {
  doc.moveDown(0.6)
     .fontSize(18).fillColor(INDIGO).font("Helvetica-Bold")
     .text(text, { width: W })
     .moveDown(0.3);
}

function h2(text) {
  doc.moveDown(0.6)
     .fontSize(13).fillColor(DARK).font("Helvetica-Bold")
     .text(text, { width: W })
     .moveDown(0.2);
}

function h3(text) {
  doc.moveDown(0.4)
     .fontSize(11).fillColor(INDIGO).font("Helvetica-Bold")
     .text(text, { width: W })
     .moveDown(0.15);
}

function body(text, opts = {}) {
  doc.fontSize(9.5).fillColor(MEDIUM).font("Helvetica")
     .text(text, { width: W, lineGap: 2, ...opts })
     .moveDown(0.25);
}

function bullet(text, indent = 14) {
  const x = doc.x;
  doc.fontSize(9.5).fillColor(MEDIUM).font("Helvetica")
     .text("•  " + text, x + indent, doc.y, { width: W - indent, lineGap: 2 })
     .moveDown(0.15);
}

function subbullet(text, indent = 28) {
  const x = doc.x;
  doc.fontSize(9).fillColor(LIGHT).font("Helvetica")
     .text("–  " + text, x + indent, doc.y, { width: W - indent, lineGap: 2 })
     .moveDown(0.1);
}

function divider() {
  doc.moveDown(0.4)
     .moveTo(50, doc.y).lineTo(50 + W, doc.y)
     .lineWidth(0.5).strokeColor(BORDER).stroke()
     .moveDown(0.4);
}

function tag(label, color = INDIGO) {
  const textW = doc.widthOfString(label, { fontSize: 8.5 }) + 12;
  const y = doc.y;
  doc.rect(doc.x, y, textW, 14).fillColor("#EEF2FF").fill();
  doc.fontSize(8.5).fillColor(color).font("Helvetica-Bold")
     .text(label, doc.x + 6, y + 3, { lineBreak: false });
  doc.x += textW + 6;
  doc.y = y;
}

function inlineCode(text) {
  const textW = doc.widthOfString(text, { fontSize: 8.5 }) + 8;
  const y = doc.y;
  doc.rect(doc.x, y, textW, 14).fillColor("#F3F4F6").fill();
  doc.fontSize(8.5).fillColor("#DC2626").font("Courier")
     .text(text, doc.x + 4, y + 2, { lineBreak: false });
  doc.font("Helvetica");
}

// ════════════════════════════════════════════════════════════════════════════
// COVER
// ════════════════════════════════════════════════════════════════════════════
doc.rect(0, 0, doc.page.width, 160).fillColor(INDIGO).fill();
doc.fontSize(26).fillColor("#FFFFFF").font("Helvetica-Bold")
   .text("AI Career Growth Planner", 50, 55, { width: W, align: "center" });
doc.fontSize(12).fillColor("#C7D2FE").font("Helvetica")
   .text("Full Project Prompt — Build Specification", 50, 95, { width: W, align: "center" });
doc.fontSize(9).fillColor("#A5B4FC")
   .text("Exported " + new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), 50, 118, { width: W, align: "center" });

doc.y = 185;

// ════════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ════════════════════════════════════════════════════════════════════════════
h1("Project Overview");
body("Build a full-stack web application called AI Career Growth Planner. Users upload a resume (PDF or Word DOC/DOCX), select a target role, industry, and geography, and receive a detailed AI-generated career analysis powered by Anthropic Claude. The entire report — skill gaps, 5-step roadmap with course links, strengths, salary insights — is shown on-screen and can be downloaded as a PDF or copied as plain text.");

divider();

// ════════════════════════════════════════════════════════════════════════════
// TECH STACK
// ════════════════════════════════════════════════════════════════════════════
h1("Tech Stack");

h3("Frontend");
bullet("React 18 + TypeScript");
bullet("Vite (bundler & dev server)");
bullet("Tailwind CSS v4");
bullet("Wouter — lightweight client-side routing");
bullet("TanStack Query (React Query) — server-state management");
bullet("Inter font");

h3("Backend");
bullet("Node.js + Express, written in TypeScript");
bullet("Multer — multipart file upload handling (memory storage)");
bullet("pdf-parse — extract text from PDFs");
bullet("mammoth — extract text from DOC / DOCX files");
bullet("Anthropic Claude (claude-sonnet-4-6) via Replit AI Integrations proxy (@workspace/integrations-anthropic-ai)");
bullet("Pino — structured JSON logging");

h3("Architecture");
bullet("pnpm monorepo — frontend in artifacts/career-planner/, backend in artifacts/api-server/");
bullet("No database — analysis results live in React Context for the session only");
bullet("Results are not persisted; each browser session starts fresh");

divider();

// ════════════════════════════════════════════════════════════════════════════
// PAGES
// ════════════════════════════════════════════════════════════════════════════
h1("Pages & UI");

// ── Landing Page ──
h2("1. Landing Page  /");
body("Sticky navbar — brand name left, 'Get Started' CTA button right (navigates to /analyze).");

h3("Hero Section");
body("Indigo-to-blue gradient background with a subtle SVG crosshatch overlay. Pulsing green dot labelled 'AI-Powered Career Intelligence'. Large heading, subheading, and a white CTA button with an arrow icon.");

h3("How It Works Section");
body("Gray-50 background. Three cards in a horizontal grid (single column on mobile):");
bullet("Step 01 — Upload Your Resume");
bullet("Step 02 — Define Your Target Role");
bullet("Step 03 — Get Results");
body("Each card: step number + divider line, icon in an indigo-50 rounded square, title, description.");

h3("What You Get Section");
body("White background. 2×2 grid of colour-coded highlight cards:");
bullet("Profile Analysis (indigo)");
bullet("Skill Gaps (amber)");
bullet("Personalized Roadmap (green)");
bullet("Salary Insights (blue)");

h3("Why It Matters Section");
body("Indigo-to-blue gradient, centered copy, second CTA button.");

h3("Footer");
body('Dark gray. Brand name left. Disclaimer right: \u201cThis is an AI-powered tool for career planning guidance. Results are indicative and should be used alongside professional career advice.\u201d');

// ── Analyze Page ──
doc.addPage();
h2("2. Analyze Page  /analyze");
body("Sticky header with back arrow to / and brand name. Centered 'Career Analysis' heading with subtitle. The form is replaced by a loading overlay while analysis is running.");

h3("Loading Overlay");
body("White card. Centered spinner. Heading 'Analyzing your career profile…'. Subtitle 'This may take 20–40 seconds'. Five steps listed vertically, advancing every 2.5 s via setInterval:");
bullet("Parsing your resume…");
bullet("Understanding target role requirements…");
bullet("Identifying skill gaps…");
bullet("Building your personalized roadmap…");
bullet("Estimating salary growth potential…");
body("Each step shows: green checkmark (completed), spinning ring (active), empty circle (pending).");

h3("Resume Upload Field (required)");
body("Drag-and-drop zone. Accepts .pdf, .doc, .docx (max 10 MB). Client-side validation: empty files and oversized files rejected with specific messages, invalid MIME/extension rejected. On valid selection, immediately POSTs to /api/validate-resume and shows a loading spinner ('Checking resume sections…'). On response, shows a 2×2 grid checklist:");
bullet("Contact Information — email or phone regex");
bullet("Work Experience — section-heading keywords or month+year dates");
bullet("Education — degree / university keywords");
bullet("Skills — skills / tools / technologies keywords");
body("Each section: green tick (present) or amber warning + hint text (missing). Short-resume warning if word count < 80. Drop zone changes colour: gray dashed → indigo on drag-over → green on valid file → red on error.");

h3("Target Job Role Dropdown (required, 47 options)");
body("Software Engineer, Senior Software Engineer, Lead Software Engineer, Principal Engineer, Engineering Manager, Product Manager, Senior Product Manager, Director of Product, Data Analyst, Data Scientist, Senior Data Scientist, Machine Learning Engineer, AI Engineer, Business Analyst, Senior Business Analyst, Project Manager, Senior Project Manager, Program Manager, Scrum Master, Agile Coach, UX Designer, UI Designer, UX Researcher, Product Designer, Full Stack Developer, Frontend Developer, Backend Developer, DevOps Engineer, Cloud Engineer, Solution Architect, Enterprise Architect, Sales Manager, Account Executive, Business Development Manager, Marketing Manager, Digital Marketing Manager, Content Strategist, Operations Manager, Strategy Consultant, Management Consultant, Financial Analyst, Finance Manager, Human Resources Manager, HR Business Partner, Talent Acquisition Specialist, Supply Chain Manager, Other.");
body("Selecting 'Other' reveals a text input (3–100 chars, required).");

h3("Target Industry Dropdown (required, 22 options)");
body("Information Technology, Banking & Finance, Healthcare, Consulting, Manufacturing, E-commerce, Education, Telecommunications, Media & Entertainment, Government & Public Sector, Startups, Retail, Automotive, Pharmaceuticals & Biotech, Real Estate, Energy & Utilities, Logistics & Supply Chain, FMCG, Legal, Non-Profit, Agriculture, Other.");
body("Selecting 'Other' reveals a text input (3–100 chars, required).");

h3("Geography / Country Dropdown (required, defaults to 'India')");
body("Grouped <optgroup> structure — Popular (India, Remote), Africa (10 countries), Asia (13 countries), Australia & Oceania (3), Europe (16 countries), Middle East (9 countries), North America (4), South America (7 countries).");

h3("Form Behaviour");
bullet("Validation on submit: all dropdowns required, custom text fields required when 'Other' selected, resume required");
bullet("Red error messages shown inline below each field");
bullet("API error displayed in a red banner above the buttons");
bullet("Reset button clears all fields, errors, and resume validation state back to defaults");
bullet("Submit: multipart/form-data POST to /api/analyze → store CareerAnalysis in Context → navigate to /results");

// ── Results Page ──
doc.addPage();
h2("3. Results Page  /results");
body("Redirects to /analyze if no analysisResult in Context. Otherwise renders the full report.");

h3("Sticky Header (hidden when printing)");
body("Home button | Brand name | Copy Summary (outline) | New Analysis (indigo).");

h3("Page Title Row");
body("'Your Career Analysis Report' + subtitle showing target role and candidate name (if extracted). Right: 'Download PDF' button (red-outlined).");

h3("Report Layout");
bullet("Row 1 (2-column grid): Profile Summary Card + Career Match Card");
bullet("Row 2 (2-column grid): Strengths Card + Skill Gaps Card");
bullet("Row 3 (full width): Roadmap Card");
bullet("Row 4 (full width): Salary Insights Card");
bullet("Footer: AI disclaimer italic text");

h3("Bottom CTAs (hidden when printing)");
body("Download PDF | Copy Summary | Start New Analysis (indigo).");

h3("Actions");
bullet("Copy Summary — builds a plain-text multi-section summary of all result data and writes it to the clipboard");
bullet("Download PDF — calls window.print(). Print CSS hides .no-print elements, forces white background, A4 portrait (10mm/12mm margins), keeps 2-column grid, prevents cards splitting across pages, disables animations");

body("All result cards fade in on mount using staggered CSS animation classes (.fade-in, .fade-in-delay-1 through .fade-in-delay-6) — opacity 0 + translateY(12px) → 1 + 0, 0.4 s ease-out, delays from 0.05 s to 0.30 s.");

divider();

// ════════════════════════════════════════════════════════════════════════════
// RESULT CARDS
// ════════════════════════════════════════════════════════════════════════════
h1("Result Cards (Components)");

h3("ProfileSummaryCard");
body("Indigo icon header 'Profile Summary'. Candidate name in large indigo bold (if present), above a divider. 2×2 grid: Current Role, Experience, Industry, Education. Below: Top Skills as indigo pill badges. Tools & Platforms as gray pill badges.");

h3("CareerMatchCard");
body("Blue icon header 'Career Match'. Centered layout: readiness level badge (colour-coded) + target role title. Circular SVG progress ring showing matchScore/100 — animates via CSS stroke-dashoffset transition over 0.8 s. Score shown in ring centre. Summary paragraph below.");
body("Readiness level colours — Beginner: red | Developing: orange | Intermediate: amber | Advanced: blue | Ready: green.");

h3("StrengthsCard");
body("Green lightning-bolt icon header 'Key Strengths'. Numbered list (1–5), each item with a green circle number badge.");

h3("SkillGapsCard");
body("Red warning icon header 'Skill Gaps'. Two sub-sections:");
bullet("Missing Skills — red pill badges, each with an × icon");
bullet("Areas to Strengthen — amber pill badges, each with a warning icon");

h3("RoadmapCard");
body("Header '5-Step Upskilling Roadmap'. Vertical timeline of 5 steps. Each step:");
bullet("Coloured circle with step number (steps connected by a vertical line)");
bullet("Coloured card: focus area title + timeline badge (top-right) + action description");
bullet("Context-aware 'Start Learning' / 'Open on Coursera' / 'Search Google' button linking to the course URL");
body("Step colour themes cycle: indigo, teal, violet, amber, rose. Button label logic:");
subbullet("URL contains google.com/search → 'Search Google' with search icon");
subbullet("Matches a known platform (Coursera, edX…) → 'Open on Coursera' etc. with book icon");
subbullet("Default → 'Start Learning' with book icon");

h3("SalaryInsightsCard");
body("Green coin icon header 'Salary Insights'. Three boxes in a row:");
bullet("Current Range (gray-50 border): label → value (large bold) → 'Current Salary Range' subtitle");
bullet("Salary Uplift (green-50 border, highlighted): label → value → 'Expected Growth' subtitle. Value uses break-words to handle long strings");
bullet("Target Range (indigo-50 border): label → value → 'Target Salary Range' subtitle");

divider();

// ════════════════════════════════════════════════════════════════════════════
// BACKEND API
// ════════════════════════════════════════════════════════════════════════════
doc.addPage();
h1("Backend API  (Express + TypeScript)");

h2("POST /api/validate-resume");
body("Accepts multipart/form-data with a 'resume' file field. Extracts text via pdf-parse (PDF) or mammoth (DOC/DOCX). Checks minimum length ≥ 20 chars. Runs section detection:");
bullet("Contact Information — email regex or phone regex");
bullet("Work Experience — section heading keywords OR month+year date pattern");
bullet("Education — degree / university keywords");
bullet("Skills — skills / tools / technologies keywords");
body("Returns: { valid: boolean, sections: [{ name, present, hint }], wordCount: number, warnings: string[] }. valid = true when ≥ 3 of 4 sections detected. Warning added if word count < 80.");

h2("POST /api/analyze");
body("Accepts multipart/form-data: resume file + targetRole + targetIndustry + geography. Server-side validates all inputs. Extracts resume text. Calls getCurrencyGuide(geography) to select the correct currency format. Builds the Claude prompt. Sends to claude-sonnet-4-6 with max_tokens: 8192. Strips markdown code fences if present. Runs ensureCourseLinkFallback() on the roadmap. Returns the parsed CareerAnalysis JSON.");

h3("getCurrencyGuide() — geography → currency mapping");
bullet("India / Remote → ₹ Indian Rupees, e.g. ₹12L – ₹18L per annum");
bullet("United Kingdom → £ British Pounds, e.g. £45,000 – £80,000 per year");
bullet("USA → USD $, e.g. $80,000 – $140,000 per year");
bullet("Canada → CAD $, e.g. CAD $70,000 – $110,000 per year");
bullet("UAE / Qatar / Bahrain / Kuwait / Saudi / Oman → USD equivalent (tax-free)");
bullet("Germany / France / Netherlands / Spain / Italy / Belgium / Ireland / Poland / Portugal → € Euros");
bullet("Norway / Sweden / Denmark / Finland → Euros or local Scandinavian currency");
bullet("Switzerland → CHF Swiss Francs");
bullet("Singapore → SGD Singapore Dollars");
bullet("Japan → ¥ Japanese Yen (e.g. ¥5M – ¥10M per year)");
bullet("South Korea → KRW Korean Won (e.g. KRW 40M – 80M per year)");
bullet("China → ¥ CNY Chinese Yuan");
bullet("Australia → AUD A$");
bullet("New Zealand → NZD");
bullet("Brazil → BRL Brazilian Reais");
bullet("South Africa → ZAR South African Rand");
bullet("All other countries → USD equivalent");

h3("ensureCourseLinkFallback()");
body("Validates every roadmap step's courseLink against 14 trusted domains. Any URL not matching is replaced with: https://www.google.com/search?q={focusArea}+online+course+certification");

h3("Trusted Course Domains (14)");
body("coursera.org  •  edx.org  •  udemy.com  •  learn.microsoft.com  •  aws.amazon.com  •  cloud.google.com  •  cloudskillsboost.google  •  pmi.org  •  scrum.org  •  scrumalliance.org  •  isc2.org  •  skillshop.withgoogle.com  •  khanacademy.org  •  pluralsight.com");

h2("GET /api/analyze/mock");
body("Returns hardcoded mock data (sample profile for a Project Coordinator targeting Senior PM). Used for testing without consuming AI credits.");

divider();

// ════════════════════════════════════════════════════════════════════════════
// DATA TYPES
// ════════════════════════════════════════════════════════════════════════════
h1("TypeScript Data Types");

doc.fontSize(8.5).fillColor(MEDIUM).font("Courier")
   .text(
`interface CareerAnalysis {
  profileSummary: {
    candidateName: string;          // empty string if not found
    currentRole: string;
    yearsOfExperience: string;
    industry: string;
    skills: string[];
    tools: string[];
    education: string;
  };
  careerMatch: {
    targetRole: string;
    readinessLevel:                 // one of:
      "Beginner" | "Developing" | "Intermediate" | "Advanced" | "Ready";
    matchScore: number;             // 0–100
    summary: string;                // 2-3 sentence narrative
  };
  strengths: string[];              // 5 items
  skillGaps: {
    missingSkills: string[];
    weakAreas: string[];
  };
  roadmap: Array<{
    step: number;                   // 1–5
    focusArea: string;
    timeline: string;               // e.g. "Month 1-2"
    action: string;
    courseLink: string;             // trusted URL or Google search fallback
  }>;
  salaryInsights: {
    currentRange: string;
    targetRange: string;
    upliftPercent: string;
  };
}`, { width: W, lineGap: 2 })
   .moveDown(0.5);

divider();

// ════════════════════════════════════════════════════════════════════════════
// CLAUDE PROMPT STRATEGY
// ════════════════════════════════════════════════════════════════════════════
doc.addPage();
h1("Claude Prompt Strategy");

body("System persona: 'You are an expert career analyst and talent intelligence system.'");
body("The prompt embeds: full resume text, target role, target industry, geography note (Remote is treated as India-based for salary), and explicit currency format examples derived from getCurrencyGuide().");
body("The entire expected JSON schema is written inline in the prompt so Claude returns structured output directly. The prompt instructs 'Do NOT include any explanation outside the JSON. Return ONLY valid JSON.' The backend strips markdown code fences (```json … ```) if Claude wraps its response.");

h3("Course Link Rules (in order of priority)");
bullet("1. Official certification pages — PMP/CAPM (pmi.org), CSM (scrumalliance.org), PSM I (scrum.org), AWS certs (aws.amazon.com/certification/), Google Cloud (cloud.google.com/learn/certification), Microsoft Azure (learn.microsoft.com), CISSP (isc2.org), Google Digital Marketing (skillshop.withgoogle.com)");
bullet("2. Coursera search URL: https://www.coursera.org/search?query=TOPIC");
bullet("3. Microsoft Learn search: https://learn.microsoft.com/en-us/training/browse/?terms=TOPIC");
bullet("4. AWS training: https://aws.amazon.com/training/course-descriptions/");
bullet("5. edX search: https://www.edx.org/search?q=TOPIC");
bullet("Only URLs from the 14 trusted domains are accepted; otherwise null → Google search fallback applied server-side");

h3("Salary Rules");
bullet("currentRange must reflect the candidate's REAL estimated worth based on the resume (not a generic range)");
bullet("targetRange must reflect realistic compensation for the target role in the specified geography");
bullet("All figures use the currency for the selected geography");
bullet("Be specific and realistic; avoid generic wide ranges");

divider();

// ════════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════
h1("State Management");
body("React Context (CareerContext) wraps the entire app. Stores analysisResult: CareerAnalysis | null in useState. Analyze page writes to it on successful API response and navigates to /results. Results page reads from it; if null, immediately redirects to /analyze. No persistence — refreshing the page clears the result.");

divider();

// ════════════════════════════════════════════════════════════════════════════
// STYLING
// ════════════════════════════════════════════════════════════════════════════
h1("Styling Details");
bullet("Primary colour: indigo-600 (#4F46E5)");
bullet("Font: Inter, loaded via CSS variable --app-font-sans");
bullet("Border radius base: 0.75rem — cards use rounded-xl");
bullet("Fade-in animation: fadeIn keyframe (opacity 0 + translateY(12px) → 1 + 0), 0.4 s ease-out, six delay classes: 0.05 / 0.10 / 0.15 / 0.20 / 0.25 / 0.30 s");
bullet("Circular progress ring: SVG circle with stroke-dashoffset animated via CSS transition over 0.8 s");
bullet("Print CSS: hides .no-print, white background, A4 portrait 10mm/12mm margins, 2-column grid preserved, cards never split, shadows removed, animations disabled");

divider();

// ════════════════════════════════════════════════════════════════════════════
// FILE STRUCTURE
// ════════════════════════════════════════════════════════════════════════════
h1("Key File Structure");
doc.fontSize(8.5).fillColor(MEDIUM).font("Courier")
   .text(
`artifacts/
  api-server/src/
    routes/analyze.ts          ← all API routes + Claude integration
    lib/logger.ts
    app.ts / index.ts

  career-planner/src/
    pages/
      LandingPage.tsx
      AnalyzePage.tsx          ← form, upload, validation, submit
      ResultsPage.tsx          ← report display, PDF print, copy
    components/
      ProfileSummaryCard.tsx
      CareerMatchCard.tsx      ← SVG circular progress ring
      StrengthsCard.tsx
      SkillGapsCard.tsx
      RoadmapCard.tsx          ← course link buttons
      SalaryInsightsCard.tsx
    context/CareerContext.tsx  ← global analysisResult state
    types.ts                   ← all TypeScript interfaces
    App.tsx                    ← router + providers
    index.css                  ← Tailwind + animations + print CSS`, { width: W, lineGap: 2 })
   .moveDown(0.5);

// ════════════════════════════════════════════════════════════════════════════
// FOOTER ON LAST PAGE
// ════════════════════════════════════════════════════════════════════════════
doc.moveDown(1)
   .fontSize(8).fillColor(LIGHT).font("Helvetica")
   .text("AI Career Growth Planner — Build Specification — Confidential", { width: W, align: "center" });

doc.end();
console.log("PDF written to:", OUT);

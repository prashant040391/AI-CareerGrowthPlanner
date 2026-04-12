# REPLIT AI PROMPT — AI CAREER GROWTH PLANNER
## Copy this entire prompt and paste it into Replit's AI assistant to scaffold the full application.

---

## PROJECT OVERVIEW

Build a full-stack, AI-powered web application called **AI Career Growth Planner**.

This is a career intelligence platform that allows a user to upload their resume (PDF), enter a desired job role, and receive a structured AI-generated analysis that includes: a profile summary, skill gaps, personalized upskilling roadmap, and salary growth estimates.

---

## TECH STACK

Use the following stack:

- **Frontend**: React (with functional components and hooks)
- **Styling**: Tailwind CSS (utility-first, responsive)
- **Backend**: Node.js + Express (REST API)
- **AI Integration**: Anthropic Claude API (`claude-sonnet-4-20250514` model)
- **PDF Parsing**: `pdf-parse` npm package to extract text from uploaded PDF resumes
- **File Upload**: `multer` middleware for handling multipart form data
- **State Management**: React `useState` and `useContext` (no Redux needed)
- **HTTP Client**: `axios` for API calls from frontend

Project structure:
```
/client          → React frontend
/server          → Express backend
/server/routes   → API route handlers
/server/utils    → PDF parser, AI prompt builder
```

---

## PAGE STRUCTURE

Build the following 3 pages with React Router:

### Page 1: Landing Page (`/`)
- Full-width hero section with:
  - App name: **AI Career Growth Planner**
  - Tagline: *"Upload your resume. Define your target role. Discover the skills, roadmap, and salary path to get there."*
  - CTA button: **"Start Career Analysis"** → navigates to `/analyze`
- "How It Works" section with 3 steps (Upload → Analyze → Get Results)
- "What You Get" section highlighting: Profile Analysis, Skill Gaps, Roadmap, Salary Insights
- "Why It Matters" section (2–3 lines about career clarity and AI-driven planning)
- Clean footer with project name and a disclaimer note

### Page 2: Analysis Input Page (`/analyze`)
Build a centered, card-based form with the following fields:

| Field | Type | Required |
|---|---|---|
| Resume Upload | PDF file input | Yes |
| Target Job Role | Text input | Yes |
| Target Industry | Text input | No |
| Geography / Country | Text input | No, default: India |
| Current Salary (₹ or $) | Number input | No |
| Desired Salary (₹ or $) | Number input | No |

- Show a file upload dropzone with drag-and-drop support and a "PDF only" label
- Show a success state (green checkmark + filename) after file is selected
- Primary button: **"Analyze My Career Path"**
- Secondary button: **"Reset"** (clears form)
- During analysis, show a sequential progress loader with these messages:
  1. *"Parsing your resume..."*
  2. *"Understanding target role requirements..."*
  3. *"Identifying skill gaps..."*
  4. *"Building your personalized roadmap..."*
  5. *"Estimating salary growth potential..."*
- Handle and display validation errors inline (e.g., "Please upload a PDF resume")
- Handle and display API errors gracefully (e.g., "Analysis failed. Please try again.")

### Page 3: Results Dashboard (`/results`)
Display the AI-generated output in structured cards with clear headings. Do NOT display raw JSON. All sections must be rendered as readable, polished UI components.

---

## RESULTS DASHBOARD — REQUIRED SECTIONS

Build each section as a separate React component inside a grid/card layout:

### 1. `ProfileSummaryCard`
Display extracted resume data in a clean info card:
- Current Role
- Years of Experience
- Industry
- Top Skills (as pill/badge tags)
- Tools & Platforms (as pill/badge tags)
- Education

### 2. `CareerMatchCard`
- Target Role (as a prominent label)
- Readiness Level (e.g., "Intermediate", "Advanced", "Needs Work") — display as a colored badge
- Match Score — display as a circular progress ring or a bold percentage
- 2–3 sentence narrative summary of the user's readiness

### 3. `StrengthsCard`
- Bulleted list of the user's top 5–6 professional strengths derived from the resume

### 4. `SkillGapsCard`
Split into two sub-sections:
- **Missing Skills** — skills not present in the resume but required for the target role (show as red/warning badge tags)
- **Weak Areas** — skills that exist but need deeper development (show as amber/warning badge tags)

### 5. `RoadmapCard`
A vertical 5-step timeline showing the personalized upskilling roadmap:
- Step number (1–5)
- Focus Area (bold heading)
- Timeline (e.g., "Month 1–2")
- Action Recommendation (1–2 lines of specific, actionable advice)

Use a vertical stepper/timeline UI — not just a list.

### 6. `SalaryInsightsCard`
Show salary data in a clean visual layout:
- Current Estimated Salary Range
- Target Role Salary Range
- Expected Uplift % — display prominently as a green percentage badge

### 7. Disclaimer Footer (on Results page)
Add a subtle, italic note at the bottom:
*"This is an AI-generated career planning output. Use it as a decision support guide, not as the sole basis for career decisions."*

### 8. Action Buttons (on Results page)
- **"Copy Summary"** — copies the full text analysis to clipboard
- **"Start New Analysis"** — navigates back to `/analyze` and resets state

---

## BACKEND API

Create the following Express endpoint:

### `POST /api/analyze`

**Request**: `multipart/form-data` with fields:
- `resume` (PDF file)
- `targetRole` (string)
- `targetIndustry` (string, optional)
- `geography` (string, optional, default: "India")
- `currentSalary` (string, optional)
- `desiredSalary` (string, optional)

**Processing Steps**:
1. Receive uploaded PDF using `multer` (store in memory buffer)
2. Extract text from PDF using `pdf-parse`
3. Build a structured prompt for the Claude API (see prompt template below)
4. Call Claude API with the prompt
5. Parse Claude's response into structured JSON
6. Return the JSON to the frontend

**Response JSON shape**:
```json
{
  "profileSummary": {
    "currentRole": "",
    "yearsOfExperience": "",
    "industry": "",
    "skills": [],
    "tools": [],
    "education": ""
  },
  "careerMatch": {
    "targetRole": "",
    "readinessLevel": "",
    "matchScore": 0,
    "summary": ""
  },
  "strengths": [],
  "skillGaps": {
    "missingSkills": [],
    "weakAreas": []
  },
  "roadmap": [
    {
      "step": 1,
      "focusArea": "",
      "timeline": "",
      "action": ""
    }
  ],
  "salaryInsights": {
    "currentRange": "",
    "targetRange": "",
    "upliftPercent": ""
  }
}
```

**Error handling**:
- Return `400` for missing required fields
- Return `500` for API or parsing failures
- Always return `{ error: "message" }` on failure

---

## CLAUDE AI PROMPT TEMPLATE

Use this prompt template in the backend when calling the Claude API. Inject extracted resume text and user inputs dynamically:

```
You are an expert career analyst and talent intelligence system.

A professional has uploaded their resume and wants a detailed career gap analysis.

RESUME CONTENT:
{{RESUME_TEXT}}

USER INPUTS:
- Target Role: {{TARGET_ROLE}}
- Target Industry: {{TARGET_INDUSTRY}}
- Geography: {{GEOGRAPHY}}
- Current Salary: {{CURRENT_SALARY}}
- Desired Salary: {{DESIRED_SALARY}}

YOUR TASK:
Analyze the resume against the target role and generate a structured JSON response. 
Do NOT include any explanation outside the JSON. Return ONLY valid JSON.

Return the following JSON structure:

{
  "profileSummary": {
    "currentRole": "inferred current job title",
    "yearsOfExperience": "estimated years",
    "industry": "current industry",
    "skills": ["skill1", "skill2", ...],
    "tools": ["tool1", "tool2", ...],
    "education": "highest qualification"
  },
  "careerMatch": {
    "targetRole": "{{TARGET_ROLE}}",
    "readinessLevel": "one of: Beginner / Developing / Intermediate / Advanced / Ready",
    "matchScore": <integer 0-100>,
    "summary": "2-3 sentence narrative assessment of readiness"
  },
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "skillGaps": {
    "missingSkills": ["skill1", "skill2", ...],
    "weakAreas": ["area1", "area2", ...]
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

Be specific, realistic, and personalized. Avoid generic advice. Base all outputs strictly on the resume content and the target role provided.
```

---

## SAMPLE / DEMO DATA

If the Claude API is not yet connected, use the following mock data to demonstrate the full UI:

```json
{
  "profileSummary": {
    "currentRole": "Project Coordinator",
    "yearsOfExperience": "4 years",
    "industry": "Operations / Energy",
    "skills": ["Vendor Coordination", "Procurement Support", "Reporting", "Communication", "MS Excel"],
    "tools": ["Excel", "SAP", "PowerPoint", "Outlook"],
    "education": "B.E. Mechanical Engineering"
  },
  "careerMatch": {
    "targetRole": "Senior Project Manager",
    "readinessLevel": "Intermediate",
    "matchScore": 62,
    "summary": "You have a strong operational foundation with hands-on project coordination experience. While you demonstrate relevant domain knowledge and stakeholder communication skills, you lack formal project management certifications, risk management experience, and leadership at a senior level. With focused upskilling, you can bridge these gaps within 12 months."
  },
  "strengths": [
    "Strong vendor and stakeholder coordination",
    "Domain knowledge in Operations and Energy",
    "Hands-on procurement and reporting experience",
    "Proficiency with enterprise tools (SAP, Excel)",
    "4 years of project lifecycle exposure"
  ],
  "skillGaps": {
    "missingSkills": ["PMP Certification", "Risk Management", "Agile / Scrum", "Budget Management", "Strategic Planning"],
    "weakAreas": ["Leadership and Team Management", "Executive-level Communication", "Resource Forecasting"]
  },
  "roadmap": [
    { "step": 1, "focusArea": "Project Management Fundamentals", "timeline": "Month 1-2", "action": "Enroll in PMP or CAPM certification prep. Complete PMI's Project Management Basics on Coursera." },
    { "step": 2, "focusArea": "Risk & Budget Management", "timeline": "Month 3-4", "action": "Take a Risk Management course on Udemy. Practice cost estimation and budget tracking in a real or simulated project." },
    { "step": 3, "focusArea": "Agile & Scrum Methodology", "timeline": "Month 5-6", "action": "Complete Scrum Master certification (CSM or PSM I). Apply agile principles to current work where possible." },
    { "step": 4, "focusArea": "Leadership & Team Management", "timeline": "Month 7-9", "action": "Lead a cross-functional initiative at work. Take a leadership course focusing on delegation, conflict resolution, and motivation." },
    { "step": 5, "focusArea": "Senior Role Preparation", "timeline": "Month 10-12", "action": "Apply for Senior PM roles. Update LinkedIn and resume to reflect new certifications, leadership experience, and expanded scope." }
  ],
  "salaryInsights": {
    "currentRange": "₹7L – ₹10L per annum",
    "targetRange": "₹18L – ₹26L per annum",
    "upliftPercent": "80-120%"
  }
}
```

---

## DESIGN SYSTEM

Apply the following design guidelines throughout:

**Colors**:
- Primary accent: Indigo (`#4F46E5`) or Blue (`#2563EB`)
- Background: White (`#FFFFFF`) / Light gray (`#F9FAFB`)
- Card surface: White with subtle border (`border: 1px solid #E5E7EB`)
- Success: Green (`#16A34A`)
- Warning / Gaps: Amber (`#D97706`)
- Missing skills: Red (`#DC2626`)
- Text primary: `#111827`
- Text muted: `#6B7280`

**Typography**:
- Font: Inter (Google Fonts)
- Headings: `font-weight: 600`, sizes: 32px / 24px / 20px / 16px
- Body: `font-size: 15px`, `line-height: 1.6`

**Components**:
- Cards: `rounded-xl`, `shadow-sm`, `border`, padding `p-6`
- Badges/Pills: `rounded-full`, `text-xs`, `font-medium`, `px-3 py-1`
- Buttons: `rounded-lg`, `px-6 py-3`, `font-semibold`, hover states
- Inputs: `rounded-lg`, `border border-gray-300`, `focus:ring-2 focus:ring-indigo-500`

**Layout**:
- Max content width: `max-w-5xl mx-auto`
- Responsive grid for results: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Full-width sections: Profile Summary, Roadmap, Salary Insights

---

## ENVIRONMENT VARIABLES

Create a `.env` file in `/server` with:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=5000
```

Read the API key using `process.env.ANTHROPIC_API_KEY`.
Never expose this key to the frontend.

---

## UX REQUIREMENTS

- Show inline validation before form submission
- Show a sequential loading animation with rotating messages during analysis (not just a spinner)
- Show empty states with helpful copy if data is missing
- Make the "Copy Summary" button provide feedback (text changes to "Copied!" for 2 seconds)
- All sections of the results dashboard must be visible on a single scroll — no hidden tabs
- The app must work on mobile (responsive Tailwind classes throughout)
- Add smooth fade-in transitions when the results page loads

---

## FUTURE-READY STRUCTURE (do not build, but keep code modular for):
- User authentication (JWT / Supabase Auth)
- Saving analysis history per user
- Career chat assistant (follow-up Q&A)
- Downloadable PDF report
- LinkedIn profile URL input as alternative to PDF upload

---

## FINAL QUALITY STANDARD

The final output should be:
- Suitable for faculty demo and academic submission
- Polished enough for a portfolio or product concept presentation
- Clear information architecture with no raw JSON shown to users
- Professional, not flashy — elegant SaaS aesthetic
- Fully functional with the mock data even if the API key is not set

**Start by scaffolding the full project structure, then build the frontend pages, then the backend API, then wire them together.**

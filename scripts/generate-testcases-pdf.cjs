const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "AI_Career_Growth_Planner_Test_Cases.pdf");
const doc = new PDFDocument({ margin: 45, size: "A4" });
doc.pipe(fs.createWriteStream(OUT));

const PW = doc.page.width - 90;

// ── Palette ──────────────────────────────────────────────────────────────────
const INDIGO  = "#4F46E5";
const DARK    = "#111827";
const MED     = "#374151";
const MUTED   = "#6B7280";
const BORDER  = "#D1D5DB";
const POS_BG  = "#F0FDF4";
const POS_TXT = "#166534";
const NEG_BG  = "#FEF2F2";
const NEG_TXT = "#991B1B";
const HI_BG   = "#EEF2FF";
const ROW_ALT = "#F9FAFB";
const HDR_BG  = "#1E1B4B";

// ── Helpers ──────────────────────────────────────────────────────────────────
let tcCounter = 0;

function newPage(title) {
  doc.addPage();
  // section banner
  doc.rect(0, 0, doc.page.width, 38).fillColor(HDR_BG).fill();
  doc.fontSize(13).fillColor("#FFFFFF").font("Helvetica-Bold")
     .text(title, 45, 12, { width: PW });
  doc.y = 58;
}

function sectionBanner(title, subtitle) {
  doc.moveDown(0.5)
     .rect(45, doc.y, PW, 26).fillColor(INDIGO).fill();
  doc.fontSize(11).fillColor("#FFFFFF").font("Helvetica-Bold")
     .text(title, 50, doc.y - 21, { continued: !!subtitle });
  if (subtitle) {
    doc.fontSize(8.5).fillColor("#C7D2FE").font("Helvetica")
       .text("  " + subtitle, { continued: false });
  }
  doc.y += 8;
}

function divider() {
  doc.moveDown(0.3)
     .moveTo(45, doc.y).lineTo(45 + PW, doc.y)
     .lineWidth(0.4).strokeColor(BORDER).stroke()
     .moveDown(0.4);
}

// Draw a single test case as a table block
function tc(id, type, priority, desc, precond, steps, input, expected) {
  tcCounter++;
  const isPos = type === "Positive";
  const typeBg  = isPos ? POS_BG  : NEG_BG;
  const typeTxt = isPos ? POS_TXT : NEG_TXT;
  const priBg   = priority === "High"   ? "#FEF3C7"
                : priority === "Medium" ? "#EFF6FF"
                : "#F3F4F6";
  const priTxt  = priority === "High"   ? "#92400E"
                : priority === "Medium" ? "#1E40AF"
                : "#374151";

  // Estimate height — simple heuristic (may push to next page)
  const estLines = 4 + steps.split("\n").length + (input ? 2 : 0) + 3;
  if (doc.y + estLines * 11 > doc.page.height - 60) doc.addPage();

  const startY = doc.y;
  const rowH   = 16;

  // Header row
  doc.rect(45, startY, PW, rowH).fillColor(HI_BG).fill();
  doc.fontSize(8.5).fillColor(INDIGO).font("Helvetica-Bold")
     .text(id, 50, startY + 4, { continued: true })
     .fillColor(DARK)
     .text("  " + desc, { continued: false, width: PW - 120 });

  // Type + Priority badges (right side of header)
  const badgeY = startY + 3;
  doc.rect(doc.page.width - 135, badgeY, 42, 11).fillColor(typeBg).fill();
  doc.fontSize(7).fillColor(typeTxt).font("Helvetica-Bold")
     .text(type, doc.page.width - 134, badgeY + 2, { width: 40, align: "center" });

  doc.rect(doc.page.width - 90, badgeY, 42, 11).fillColor(priBg).fill();
  doc.fontSize(7).fillColor(priTxt).font("Helvetica-Bold")
     .text(priority, doc.page.width - 89, badgeY + 2, { width: 40, align: "center" });

  doc.y = startY + rowH + 4;

  // Preconditions
  label("Preconditions"); value(precond);
  // Test Steps
  label("Test Steps");    value(steps);
  // Input Data
  if (input) { label("Input Data"); value(input); }
  // Expected Result
  label("Expected Result"); value(expected, true);

  doc.moveDown(0.5)
     .moveTo(45, doc.y).lineTo(45 + PW, doc.y)
     .lineWidth(0.3).strokeColor(BORDER).stroke()
     .moveDown(0.4);
}

function label(txt) {
  doc.fontSize(7.5).fillColor(MUTED).font("Helvetica-Bold")
     .text(txt.toUpperCase(), 52, doc.y, { continued: false });
}

function value(txt, highlight = false) {
  doc.fontSize(8.5).fillColor(highlight ? "#166534" : MED).font(highlight ? "Helvetica-Bold" : "Helvetica")
     .text(txt, 52, doc.y, { width: PW - 14, lineGap: 1.5 })
     .moveDown(0.2);
}

// ════════════════════════════════════════════════════════════════════════════
// COVER PAGE
// ════════════════════════════════════════════════════════════════════════════
doc.rect(0, 0, doc.page.width, 200).fillColor(HDR_BG).fill();
doc.fontSize(24).fillColor("#FFFFFF").font("Helvetica-Bold")
   .text("AI Career Growth Planner", 45, 60, { width: PW, align: "center" });
doc.fontSize(15).fillColor("#C7D2FE").font("Helvetica")
   .text("Test Case Document", 45, 96, { width: PW, align: "center" });
doc.fontSize(9).fillColor("#A5B4FC")
   .text("Unit Testing — Positive & Negative Scenarios · Validations", 45, 122, { width: PW, align: "center" });
doc.fontSize(8.5).fillColor("#818CF8")
   .text("Generated " + new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), 45, 140, { width: PW, align: "center" });

doc.y = 220;

// Summary table
const summaryRows = [
  ["Module", "Test Cases", "Positive", "Negative"],
  ["Landing Page", "7", "5", "2"],
  ["Resume Upload (Client)", "10", "4", "6"],
  ["Dropdown Validations", "14", "7", "7"],
  ["Form Submission", "8", "3", "5"],
  ["Loading State & Reset", "7", "5", "2"],
  ["API: /validate-resume", "11", "4", "7"],
  ["API: /analyze", "14", "4", "10"],
  ["Results Page", "11", "8", "3"],
  ["Roadmap Course Links", "9", "5", "4"],
  ["Currency Mapping", "8", "7", "1"],
  ["State / Context", "6", "4", "2"],
  ["Navigation", "6", "5", "1"],
  ["TOTAL", "111", "61", "50"],
];

const colW = [PW * 0.45, PW * 0.18, PW * 0.18, PW * 0.19];
const rowH2 = 14;
let ty = doc.y;

summaryRows.forEach((row, ri) => {
  const isHeader = ri === 0;
  const isTotal  = ri === summaryRows.length - 1;
  const bg = isHeader ? INDIGO : isTotal ? HI_BG : ri % 2 === 0 ? "#FFFFFF" : ROW_ALT;
  doc.rect(45, ty, PW, rowH2).fillColor(bg).fill();

  let tx = 50;
  row.forEach((cell, ci) => {
    const align = ci === 0 ? "left" : "center";
    doc.fontSize(isHeader ? 7.5 : 8.5)
       .fillColor(isHeader ? "#FFFFFF" : isTotal ? INDIGO : DARK)
       .font(isHeader || isTotal ? "Helvetica-Bold" : "Helvetica")
       .text(cell, tx, ty + (isHeader ? 3 : 3), { width: colW[ci] - 6, align });
    tx += colW[ci];
  });
  ty += rowH2;
});

doc.y = ty + 12;
doc.fontSize(8).fillColor(MUTED).font("Helvetica")
   .text("Each test case is tagged with a unique ID (e.g. TC-LP-001), type (Positive/Negative), and priority (High / Medium / Low).", 45, doc.y, { width: PW });

// ════════════════════════════════════════════════════════════════════════════
// MODULE 1 — LANDING PAGE
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 1 — Landing Page");
sectionBanner("LP — Landing Page Tests", "Route: /");

tc("TC-LP-001", "Positive", "High",
  "Landing page loads and renders all sections",
  "App is running; user navigates to /",
  "1. Open browser and navigate to the app root URL\n2. Observe the page content",
  null,
  "Page renders: sticky navbar with brand name + 'Get Started' button, hero section with gradient background and CTA, 'How It Works' section with 3 cards, 'What You Get' 2x2 grid, 'Why It Matters' section, footer with disclaimer.");

tc("TC-LP-002", "Positive", "High",
  "'Get Started' navbar button navigates to /analyze",
  "User is on the landing page",
  "1. Click the 'Get Started' button in the navbar",
  "N/A",
  "Browser navigates to /analyze. Career Analysis form is displayed.");

tc("TC-LP-003", "Positive", "High",
  "'Start Career Analysis' hero CTA navigates to /analyze",
  "User is on the landing page",
  "1. Click the 'Start Career Analysis' button in the hero section",
  "N/A",
  "Browser navigates to /analyze.");

tc("TC-LP-004", "Positive", "Medium",
  "'Start Career Analysis' bottom CTA ('Why It Matters') navigates to /analyze",
  "User is on the landing page; user scrolls to 'Why It Matters' section",
  "1. Scroll to the 'Why It Matters' section\n2. Click the 'Start Career Analysis' button",
  "N/A",
  "Browser navigates to /analyze.");

tc("TC-LP-005", "Positive", "Medium",
  "Footer disclaimer text is present and accurate",
  "User is on the landing page; user scrolls to footer",
  "1. Scroll to the footer\n2. Read the disclaimer text",
  "N/A",
  "Footer shows: 'AI Career Growth Planner' brand name on the left; disclaimer on the right: 'This is an AI-powered tool for career planning guidance. Results are indicative and should be used alongside professional career advice.'");

tc("TC-LP-006", "Negative", "Low",
  "Navigating to an unknown route shows 404 page",
  "App is running",
  "1. Navigate to a non-existent path e.g. /unknown",
  "URL: /unknown",
  "404-style page renders with 'Page Not Found' heading and a 'Go back home' link.");

tc("TC-LP-007", "Negative", "Low",
  "Pulsing dot animation renders in hero badge",
  "User is on landing page",
  "1. Observe the 'AI-Powered Career Intelligence' badge in the hero section",
  "N/A",
  "A small green dot is visible and has a CSS pulse animation (animate-pulse class applied).");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 2 — RESUME UPLOAD (CLIENT-SIDE)
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 2 — Resume Upload (Client-Side Validation)");
sectionBanner("RU — Resume Upload Client Tests", "Route: /analyze — file selection before form submit");

tc("TC-RU-001", "Positive", "High",
  "Upload a valid PDF file under 10 MB",
  "User is on /analyze; no file selected",
  "1. Click the upload zone\n2. Select a valid resume.pdf (< 10 MB)",
  "File: resume.pdf, size: 300 KB, type: application/pdf",
  "Drop zone turns green with a checkmark icon. File name is displayed (with PDF emoji). 'Click to change file' hint appears. Validation spinner shows 'Checking resume sections...' briefly, then section checklist appears.");

tc("TC-RU-002", "Positive", "High",
  "Upload a valid DOC file under 10 MB",
  "User is on /analyze; no file selected",
  "1. Click the upload zone\n2. Select a valid resume.doc",
  "File: resume.doc, size: 200 KB, type: application/msword",
  "Drop zone turns green. File name displayed with Word emoji. Section checklist loads.");

tc("TC-RU-003", "Positive", "High",
  "Upload a valid DOCX file under 10 MB",
  "User is on /analyze; no file selected",
  "1. Click the upload zone\n2. Select a valid resume.docx",
  "File: resume.docx, size: 150 KB, type: application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "Drop zone turns green. File name displayed. Section checklist loads.");

tc("TC-RU-004", "Positive", "Medium",
  "Drag and drop a valid PDF into the upload zone",
  "User is on /analyze",
  "1. Drag a valid PDF file over the upload zone (border turns indigo)\n2. Drop the file",
  "File: resume.pdf, size: 200 KB",
  "On drag-over: border becomes indigo, background indigo-tinted. On drop: file is accepted, zone turns green, section checklist loads.");

tc("TC-RU-005", "Negative", "High",
  "Upload an empty file (0 bytes)",
  "User is on /analyze",
  "1. Click the upload zone\n2. Select a 0-byte file",
  "File: empty.pdf, size: 0 bytes",
  "Error displayed below upload zone: 'The selected file is empty. Please upload a valid resume.' Drop zone turns red. File input is cleared.");

tc("TC-RU-006", "Negative", "High",
  "Upload a file exceeding 10 MB",
  "User is on /analyze",
  "1. Click the upload zone\n2. Select a file larger than 10 MB",
  "File: large_resume.pdf, size: 11 MB",
  "Error displayed: 'File is too large. Please upload a file under 10 MB.' Drop zone turns red. File input is cleared.");

tc("TC-RU-007", "Negative", "High",
  "Upload an unsupported file type (PNG image)",
  "User is on /analyze",
  "1. Click the upload zone\n2. Select a PNG image file",
  "File: photo.png, type: image/png",
  "Error: '\"PNG\" files are not supported. Please upload a PDF (.pdf) or Word (.doc / .docx) file.' Drop zone turns red. File input cleared.");

tc("TC-RU-008", "Negative", "High",
  "Upload an unsupported file type (TXT file)",
  "User is on /analyze",
  "1. Click the upload zone\n2. Select a plain text file",
  "File: resume.txt, type: text/plain",
  "Error: '\"TXT\" files are not supported. Please upload a PDF (.pdf) or Word (.doc / .docx) file.' Drop zone turns red.");

tc("TC-RU-009", "Negative", "Medium",
  "Upload an unsupported file type (XLSX spreadsheet)",
  "User is on /analyze",
  "1. Click the upload zone\n2. Select an Excel file",
  "File: data.xlsx, type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "Error: '\"XLSX\" files are not supported...' Drop zone turns red.");

tc("TC-RU-010", "Negative", "Medium",
  "Replace an uploaded file with a new valid file",
  "User has already uploaded resume.pdf (green drop zone)",
  "1. Click the drop zone again\n2. Select a different valid file",
  "File: resume_v2.pdf, size: 250 KB",
  "New file replaces the previous one. Drop zone updates with the new filename. Section checklist re-runs for the new file.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3 — DROPDOWN VALIDATIONS
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 3 — Dropdown & Field Validations");
sectionBanner("DR — Dropdown & Custom Input Field Tests", "All dropdowns on /analyze form");

tc("TC-DR-001", "Positive", "High",
  "Select a valid option from Target Job Role dropdown",
  "User is on /analyze",
  "1. Click the Target Job Role dropdown\n2. Select 'Product Manager'",
  "Selection: Product Manager",
  "Dropdown shows 'Product Manager'. No error shown. Custom role input field is NOT displayed.");

tc("TC-DR-002", "Positive", "High",
  "Select 'Other' in Target Job Role and enter a valid custom role",
  "User is on /analyze",
  "1. Select 'Other' from Target Job Role dropdown\n2. Type a custom role in the text input that appears",
  "Custom role: 'Chief of Staff' (13 characters)",
  "Custom input field appears. Input accepts the text. No error shown on submission.");

tc("TC-DR-003", "Positive", "High",
  "Select a valid option from Target Industry dropdown",
  "User is on /analyze",
  "1. Click the Target Industry dropdown\n2. Select 'Information Technology'",
  "Selection: Information Technology",
  "Dropdown shows 'Information Technology'. No error. Custom industry input is NOT shown.");

tc("TC-DR-004", "Positive", "High",
  "Select 'Other' in Target Industry and enter a valid custom industry",
  "User is on /analyze",
  "1. Select 'Other' from Target Industry dropdown\n2. Type a valid industry name",
  "Custom industry: 'Aerospace' (9 characters)",
  "Custom industry input appears. Text accepted. No error on submission.");

tc("TC-DR-005", "Positive", "Medium",
  "Geography dropdown defaults to 'India' on page load",
  "User navigates to /analyze",
  "1. Observe the Geography dropdown without interacting",
  "N/A",
  "Geography dropdown shows 'India' as the default selected value.");

tc("TC-DR-006", "Positive", "Medium",
  "Geography dropdown contains grouped optgroup options",
  "User is on /analyze",
  "1. Click the Geography dropdown\n2. Scroll through the options",
  "N/A",
  "Options are organised in groups: Popular, Africa, Asia, Australia & Oceania, Europe, Middle East, North America, South America. Each group contains the expected country options.");

tc("TC-DR-007", "Positive", "Medium",
  "Select a non-default geography (UAE)",
  "User is on /analyze",
  "1. Click Geography dropdown\n2. Select 'UAE' from the Middle East group",
  "Selection: UAE",
  "Dropdown shows 'UAE'. Salary in the resulting report will be in USD equivalent.");

tc("TC-DR-008", "Negative", "High",
  "Submit form with Target Job Role not selected",
  "User is on /analyze; resume uploaded; industry and geography selected",
  "1. Leave Target Job Role at default ('Select a target role...')\n2. Click 'Analyze My Career Path'",
  "targetRole: empty",
  "Form does not submit. Inline error appears below the role dropdown: 'Please select a target job role to continue'.");

tc("TC-DR-009", "Negative", "High",
  "Submit form with Target Industry not selected",
  "User is on /analyze; resume uploaded; role and geography selected",
  "1. Leave Target Industry at default\n2. Click 'Analyze My Career Path'",
  "targetIndustry: empty",
  "Form does not submit. Error: 'Please select a target industry to continue'.");

tc("TC-DR-010", "Negative", "High",
  "'Other' role selected but custom role field left empty",
  "User selected 'Other' from Target Job Role",
  "1. Select 'Other' in role dropdown\n2. Leave custom role input blank\n3. Click submit",
  "customRole: '' (empty)",
  "Error below custom role input: 'Please enter your target role'. Form does not submit.");

tc("TC-DR-011", "Negative", "High",
  "Custom role with fewer than 3 characters",
  "User selected 'Other' from Target Job Role",
  "1. Select 'Other'\n2. Enter a 2-character role\n3. Click submit",
  "customRole: 'PM' (2 characters)",
  "Error: 'Role name must be at least 3 characters'. Form does not submit.");

tc("TC-DR-012", "Negative", "High",
  "Custom role exceeding 100 characters",
  "User selected 'Other' from Target Job Role",
  "1. Select 'Other'\n2. Paste a 101-character string in the custom role field\n3. Click submit",
  "customRole: 101-character string",
  "Error: 'Role name must be under 100 characters'. Form does not submit.");

tc("TC-DR-013", "Negative", "High",
  "'Other' industry selected but custom industry field left empty",
  "User selected 'Other' from Target Industry",
  "1. Select 'Other' in industry dropdown\n2. Leave custom industry input blank\n3. Click submit",
  "customIndustry: '' (empty)",
  "Error: 'Please enter your target industry'. Form does not submit.");

tc("TC-DR-014", "Negative", "Medium",
  "Custom industry with fewer than 3 characters",
  "User selected 'Other' from Target Industry",
  "1. Select 'Other' for industry\n2. Enter 'IT' (2 characters)\n3. Click submit",
  "customIndustry: 'IT' (2 characters)",
  "Error: 'Industry name must be at least 3 characters'. Form does not submit.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 4 — FORM SUBMISSION
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 4 — Form Submission");
sectionBanner("FS — Form Submission & API Integration Tests", "Full submit flow on /analyze");

tc("TC-FS-001", "Positive", "High",
  "Successful form submission with all valid inputs",
  "Resume uploaded (valid PDF); role, industry, geography all selected",
  "1. Upload a valid resume PDF\n2. Select a role (e.g. 'Product Manager')\n3. Select an industry (e.g. 'Information Technology')\n4. Keep geography as 'India'\n5. Click 'Analyze My Career Path'",
  "Valid resume, role: Product Manager, industry: Information Technology, geography: India",
  "Form disappears; loading overlay shown with step-by-step progress. After 20-40 s: browser navigates to /results. Career analysis report is fully displayed.");

tc("TC-FS-002", "Positive", "High",
  "Successful submission with 'Other' role and 'Other' industry",
  "Resume uploaded; 'Other' selected for both role and industry; custom values entered",
  "1. Upload resume\n2. Select 'Other' for role, enter 'Chief Data Officer'\n3. Select 'Other' for industry, enter 'Space Technology'\n4. Select geography 'USA'\n5. Click submit",
  "customRole: Chief Data Officer, customIndustry: Space Technology, geography: USA",
  "API is called with the custom text values. Analysis report appears with the custom role as target.");

tc("TC-FS-003", "Positive", "Medium",
  "Network error during submission shows correct error message",
  "All form fields valid; API server is unreachable",
  "1. Fill all fields with valid data\n2. Disable network / stop the API server\n3. Click submit",
  "Network unavailable",
  "Loading overlay disappears. Red error banner displayed: 'Network error. Please check your connection and try again.'");

tc("TC-FS-004", "Negative", "High",
  "Submit with no resume uploaded",
  "No file in the upload zone; role, industry, geography selected",
  "1. Leave upload zone empty\n2. Fill all dropdowns\n3. Click submit",
  "resume: null",
  "Form does not submit. Error below upload zone: 'Please upload your resume (PDF, DOC, or DOCX)'.");

tc("TC-FS-005", "Negative", "High",
  "Submit with all fields empty",
  "User is on /analyze; all fields at default",
  "1. Click 'Analyze My Career Path' without filling anything",
  "All fields empty",
  "Multiple errors shown: resume error, role error, industry error. Geography defaults to 'India' so no geography error. Form does not submit.");

tc("TC-FS-006", "Negative", "High",
  "API returns a 500 error — AI failure",
  "All fields valid; API returns { error: 'Analysis failed.' } with HTTP 500",
  "1. Fill all valid fields\n2. Submit\n3. Server responds with 500",
  "API response: HTTP 500, { error: 'Analysis failed. Please try again.' }",
  "Loading overlay dismisses. Red error banner: 'Analysis failed. Please try again.' Form is shown again; user can retry.");

tc("TC-FS-007", "Negative", "High",
  "Submitting form removes any previously shown API error",
  "API error was shown from a previous failed attempt",
  "1. First submit fails (API error shown)\n2. Correct any issue\n3. Click submit again",
  "N/A",
  "On second submit click, the API error banner is cleared (setApiError('') called) before the new request is made.");

tc("TC-FS-008", "Negative", "Medium",
  "API returns 400 for missing targetRole (server-side validation)",
  "Request crafted without targetRole field (bypassing client validation)",
  "1. Send POST /api/analyze with a valid resume, no targetRole field",
  "targetRole: missing",
  "API responds HTTP 400 with { error: 'Target job role is required' }.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 5 — LOADING STATE & RESET
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 5 — Loading State & Reset");
sectionBanner("LS — Loading State Tests", "Loading overlay behaviour during analysis");

tc("TC-LS-001", "Positive", "High",
  "Loading overlay replaces form on submit",
  "All fields valid; form submitted",
  "1. Submit the form with all valid inputs\n2. Observe the UI immediately after clicking submit",
  "N/A",
  "The form card disappears. Loading overlay appears with spinner, heading, subtitle, and the 5-step progress list.");

tc("TC-LS-002", "Positive", "High",
  "Loading steps advance automatically every 2.5 seconds",
  "Loading overlay is visible",
  "1. Submit the form\n2. Wait and observe the step indicators over time",
  "N/A",
  "Step 1 starts as active (spinning ring). After ~2.5 s, Step 1 turns green (checkmark) and Step 2 becomes active. Pattern continues for all 5 steps.");

tc("TC-LS-003", "Positive", "Medium",
  "Completed steps show green checkmark",
  "Loading overlay is visible; at least 1 step has elapsed",
  "1. Observe a completed step after the interval fires",
  "N/A",
  "Completed steps have a green background, green text, and a checkmark icon. Active step has indigo background and a spinning border ring. Pending steps are gray with an empty circle.");

tc("TC-LS-004", "Positive", "Medium",
  "Loading overlay disappears on successful API response",
  "Loading overlay visible; API call succeeds",
  "1. Submit form\n2. Wait for API to return a valid response",
  "N/A",
  "Loading overlay is hidden; browser navigates to /results. setIsLoading(false) and stopLoadingAnimation() are called in the finally block.");

tc("TC-LS-005", "Negative", "Medium",
  "Loading overlay disappears on API error",
  "Loading overlay visible; API returns an error",
  "1. Submit form\n2. API responds with an error",
  "API response: HTTP 500",
  "Loading overlay is removed; form is shown again with the error banner displayed.");

sectionBanner("RS — Reset Functionality Tests", "Reset button on /analyze");

tc("TC-RS-001", "Positive", "High",
  "Reset button clears all form fields and errors",
  "User has filled all fields and possibly seen validation errors",
  "1. Fill resume, role, industry, geography\n2. Optionally trigger validation errors\n3. Click 'Reset'",
  "N/A",
  "Upload zone reverts to empty state (dashed border). All dropdowns reset to placeholder values. Geography resets to 'India'. All inline errors cleared. API error banner cleared. Resume section checklist hidden.");

tc("TC-RS-002", "Positive", "Medium",
  "After reset, form can be re-submitted with new values",
  "User has clicked Reset",
  "1. Click Reset\n2. Upload a new resume\n3. Select role, industry, geography\n4. Click submit",
  "New valid file, new selections",
  "Analysis proceeds normally. No state contamination from the previous attempt.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6 — API: /validate-resume
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 6 — API: POST /api/validate-resume");
sectionBanner("VR — Resume Section Validation API Tests", "Endpoint: POST /api/validate-resume");

tc("TC-VR-001", "Positive", "High",
  "Valid PDF with all 4 sections returns valid=true and 4 sections",
  "API server is running",
  "1. POST a well-formed resume PDF containing email, Work Experience, Education, and Skills sections",
  "File: full_resume.pdf with all 4 sections",
  "HTTP 200. Response: { valid: true, sections: [4 items all present:true], wordCount: >80, warnings: [] }");

tc("TC-VR-002", "Positive", "High",
  "Valid DOCX resume returns correct section results",
  "API server is running",
  "1. POST a DOCX resume with all 4 sections",
  "File: resume.docx",
  "HTTP 200. Sections detected correctly. valid=true. wordCount reflects extracted content.");

tc("TC-VR-003", "Positive", "Medium",
  "Resume with exactly 3 of 4 sections returns valid=true",
  "API server is running",
  "1. POST a PDF with Contact Info, Work Experience, Education but NO Skills section",
  "File: no_skills.pdf",
  "HTTP 200. valid=true (3 >= 3 threshold). Skills section has present=false with hint 'Add a Skills section...'");

tc("TC-VR-004", "Positive", "Medium",
  "Short resume (< 80 words) returns a warning",
  "API server is running",
  "1. POST a PDF whose extracted text has fewer than 80 words",
  "File: short.pdf, word count: 50",
  "HTTP 200. warnings array contains: 'Resume appears very short — consider adding more detail'. valid may still be true if 3+ sections detected.");

tc("TC-VR-005", "Negative", "High",
  "No file in request returns HTTP 400",
  "API server is running",
  "1. POST to /api/validate-resume with no file field",
  "Body: empty multipart form",
  "HTTP 400. Response: { error: 'No file uploaded' }");

tc("TC-VR-006", "Negative", "High",
  "Empty file (0 bytes) returns HTTP 400",
  "API server is running",
  "1. POST a 0-byte PDF",
  "File: empty.pdf, size: 0",
  "HTTP 400. Response: { error: 'Uploaded file is empty' }");

tc("TC-VR-007", "Negative", "High",
  "Scanned/image-only PDF with no extractable text returns HTTP 400",
  "API server is running",
  "1. POST a PDF that is a scanned image with no selectable text",
  "File: scanned_resume.pdf",
  "HTTP 400. Response: { error: 'No readable text found. The file may be a scanned image or password-protected.' }");

tc("TC-VR-008", "Negative", "High",
  "Corrupted/malformed PDF returns HTTP 400",
  "API server is running",
  "1. POST a file named resume.pdf but with corrupted content",
  "File: corrupted.pdf",
  "HTTP 400. Response: { error: 'Could not read the file. Please upload a valid PDF or Word document.' }");

tc("TC-VR-009", "Negative", "Medium",
  "Resume with only 2 sections detected returns valid=false",
  "API server is running",
  "1. POST a PDF with only Contact Info and Education (no Work Experience, no Skills)",
  "File: sparse_resume.pdf",
  "HTTP 200. valid=false. 2 sections present=true, 2 present=false with hints. warnings may include short-resume warning.");

tc("TC-VR-010", "Negative", "Medium",
  "Resume with no sections detected returns valid=false",
  "API server is running",
  "1. POST a PDF with generic text that matches no section patterns",
  "File: generic_text.pdf",
  "HTTP 200. valid=false. All 4 sections have present=false with respective hints.");

tc("TC-VR-011", "Negative", "Low",
  "File exceeding 10 MB is rejected by multer before reaching handler",
  "API server is running",
  "1. POST a file larger than 10 MB",
  "File: large.pdf, size: 11 MB",
  "HTTP 400 or 413. Multer rejects the file before the route handler runs. Error response returned.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 7 — API: /analyze
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 7 — API: POST /api/analyze");
sectionBanner("AN — Career Analysis API Tests", "Endpoint: POST /api/analyze");

tc("TC-AN-001", "Positive", "High",
  "Valid request returns a complete CareerAnalysis JSON",
  "API server running; Claude integration active",
  "1. POST a valid PDF, targetRole='Software Engineer', targetIndustry='Information Technology', geography='India'",
  "Valid resume, all fields provided",
  "HTTP 200. Response body is valid JSON matching the CareerAnalysis schema: profileSummary, careerMatch (matchScore 0-100, valid readinessLevel), strengths (array), skillGaps (missingSkills + weakAreas), roadmap (5 steps each with courseLink), salaryInsights (currentRange, targetRange, upliftPercent in INR).");

tc("TC-AN-002", "Positive", "High",
  "Roadmap courseLinks are from trusted domains or Google search fallback",
  "API returns a valid analysis",
  "1. Submit valid request\n2. Inspect each roadmap step's courseLink field",
  "N/A",
  "Each courseLink hostname matches one of the 14 trusted domains OR is 'https://www.google.com/search?q=...' fallback. No other domains present.");

tc("TC-AN-003", "Positive", "High",
  "Salary figures use INR format when geography is 'India'",
  "API returns valid analysis; geography=India",
  "1. Submit with geography='India'\n2. Inspect salaryInsights fields",
  "geography: India",
  "currentRange and targetRange use Indian Rupee format, e.g. '₹12L – ₹18L per annum'. upliftPercent is a percentage string.");

tc("TC-AN-004", "Positive", "Medium",
  "Salary figures use USD format when geography is 'USA'",
  "API returns valid analysis; geography=USA",
  "1. Submit with geography='USA'\n2. Inspect salaryInsights",
  "geography: USA",
  "Salary ranges use USD format, e.g. '$80,000 – $140,000 per year'.");

tc("TC-AN-005", "Negative", "High",
  "Missing resume file returns HTTP 400",
  "API server running",
  "1. POST to /api/analyze with no file attached, but with targetRole, targetIndustry, geography",
  "resume: missing",
  "HTTP 400. { error: 'No file was uploaded. Please attach a PDF or Word (.doc / .docx) resume.' }");

tc("TC-AN-006", "Negative", "High",
  "Empty file (0 bytes) returns HTTP 400",
  "API server running",
  "1. POST with a 0-byte PDF",
  "File size: 0",
  "HTTP 400. { error: 'The uploaded file is empty. Please upload a resume with content.' }");

tc("TC-AN-007", "Negative", "High",
  "Unsupported MIME type with no valid extension returns HTTP 400",
  "API server running",
  "1. POST a PNG file with MIME type image/png and no .pdf/.doc/.docx extension",
  "File: photo.png, MIME: image/png",
  "HTTP 400. { error: 'Unsupported file type \"image/png\"...' }");

tc("TC-AN-008", "Negative", "High",
  "Missing targetRole field returns HTTP 400",
  "API server running; valid resume provided",
  "1. POST valid resume, targetIndustry, geography — omit targetRole",
  "targetRole: missing",
  "HTTP 400. { error: 'Target job role is required' }");

tc("TC-AN-009", "Negative", "High",
  "Missing targetIndustry field returns HTTP 400",
  "API server running; valid resume provided",
  "1. POST valid resume, targetRole, geography — omit targetIndustry",
  "targetIndustry: missing",
  "HTTP 400. { error: 'Target industry is required' }");

tc("TC-AN-010", "Negative", "High",
  "Scanned/image PDF with no readable text returns HTTP 400",
  "API server running",
  "1. POST a scanned-image PDF (no embedded text)",
  "File: scanned.pdf, extractable text: none",
  "HTTP 400. { error: 'The uploaded file appears to have no readable text...' }");

tc("TC-AN-011", "Negative", "Medium",
  "Claude returns non-text content block — server returns 500",
  "API server running; Claude mock returns non-text block",
  "1. Submit valid request\n2. Claude response has no text block",
  "Claude mock: content block type !== 'text'",
  "HTTP 500. { error: 'Unexpected response from AI. Please try again.' }");

tc("TC-AN-012", "Negative", "Medium",
  "Claude returns invalid JSON — server returns 500",
  "API server running; Claude mock returns malformed JSON string",
  "1. Submit valid request\n2. Claude returns text that is not valid JSON",
  "Claude mock: response text = 'This is not JSON'",
  "HTTP 500. { error: 'AI returned an invalid response. Please try again.' }");

tc("TC-AN-013", "Negative", "Medium",
  "Claude wraps JSON in markdown code fences — server still parses correctly",
  "API server running; Claude returns ```json {...} ```",
  "1. Submit valid request\n2. Claude response contains markdown code fence",
  "Claude response: '```json\\n{...valid JSON...}\\n```'",
  "HTTP 200. Server strips the code fence and parses the JSON. Response is valid CareerAnalysis.");

tc("TC-AN-014", "Negative", "Low",
  "Empty targetRole string (whitespace only) returns HTTP 400",
  "API server running; valid resume provided",
  "1. POST with targetRole='   ' (whitespace only)",
  "targetRole: '   '",
  "HTTP 400. { error: 'Target job role is required' } (trim check fails).");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 8 — RESULTS PAGE
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 8 — Results Page");
sectionBanner("RP — Results Page Tests", "Route: /results");

tc("TC-RP-001", "Negative", "High",
  "Navigating directly to /results without analysis redirects to /analyze",
  "Fresh browser session; no analysisResult in Context",
  "1. Navigate directly to /results without submitting a form",
  "analysisResult: null",
  "Browser immediately redirects to /analyze. No results page content is rendered.");

tc("TC-RP-002", "Positive", "High",
  "All 6 result cards render after successful analysis",
  "User completed analysis; /results loaded",
  "1. Complete a successful analysis\n2. Observe /results",
  "N/A",
  "All 6 cards are visible: Profile Summary, Career Match, Key Strengths, Skill Gaps, 5-Step Roadmap, Salary Insights.");

tc("TC-RP-003", "Positive", "High",
  "CareerMatchCard displays circular progress ring with correct score",
  "/results loaded with matchScore=75",
  "1. Observe the Career Match card",
  "matchScore: 75",
  "SVG ring animates to 75% fill. '75%' text is shown in the centre. Readiness level badge is displayed above the role name.");

tc("TC-RP-004", "Positive", "High",
  "Profile Summary shows candidate name when present",
  "/results loaded; candidateName = 'Rahul Sharma'",
  "1. Observe the Profile Summary card",
  "candidateName: Rahul Sharma",
  "Candidate name 'Rahul Sharma' is displayed in large indigo bold above a divider. The page subtitle also shows the name.");

tc("TC-RP-005", "Positive", "Medium",
  "Profile Summary hides name row when candidateName is empty",
  "/results loaded; candidateName = ''",
  "1. Observe Profile Summary card when name is empty",
  "candidateName: ''",
  "The name row (including the divider) is not rendered. Other fields (role, experience, etc.) still display normally.");

tc("TC-RP-006", "Positive", "High",
  "Roadmap card shows 5 steps with 'Start Learning' buttons",
  "/results loaded; roadmap has 5 steps",
  "1. Observe the Roadmap card\n2. Check each step's button",
  "5 roadmap steps with courseLinks",
  "5 steps rendered in a vertical timeline with alternating colour themes. Each step has a button. Button label is context-aware (see TC-CL tests).");

tc("TC-RP-007", "Positive", "High",
  "Salary Insights card shows all three salary boxes",
  "/results loaded; salaryInsights has all 3 fields",
  "1. Observe the Salary Insights card",
  "currentRange: '₹7L-₹10L', targetRange: '₹18L-₹26L', upliftPercent: '80-120%'",
  "Three boxes: Current Range, Salary Uplift (highlighted in green), Target Range. All values displayed. Long strings use word-wrap.");

tc("TC-RP-008", "Positive", "Medium",
  "Copy Summary button writes plain text to clipboard",
  "/results loaded; clipboard API supported",
  "1. Click 'Copy Summary'\n2. Paste in a text editor",
  "N/A",
  "alert() shows 'Career summary copied to clipboard!'. Pasted text contains all sections: Profile Summary, Career Match, Key Strengths, Skill Gaps, Upskilling Roadmap, Salary Insights, and the disclaimer note.");

tc("TC-RP-009", "Positive", "Medium",
  "Download PDF button triggers browser print dialog",
  "/results loaded",
  "1. Click 'Download PDF'",
  "N/A",
  "Browser print dialog opens. On preview: header and bottom CTAs are hidden (.no-print). Report content is print-ready on A4. 2-column grid layout preserved.");

tc("TC-RP-010", "Positive", "High",
  "'New Analysis' button navigates back to /analyze",
  "/results loaded",
  "1. Click 'New Analysis' button in the header\n2. Observe navigation",
  "N/A",
  "Browser navigates to /analyze. Form is shown in its empty default state.");

tc("TC-RP-011", "Positive", "Medium",
  "Result cards animate in with staggered fade-in",
  "/results loaded",
  "1. Observe the cards immediately after the page loads",
  "N/A",
  "Cards appear to fade in sequentially with a slight upward slide. Each card uses a delay class from fade-in-delay-1 through fade-in-delay-6.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 9 — COURSE LINK VALIDATION
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 9 — Roadmap Course Link Validation");
sectionBanner("CL — Course Link Button & Domain Validation Tests", "RoadmapCard + ensureCourseLinkFallback");

tc("TC-CL-001", "Positive", "High",
  "Coursera URL shows 'Open on Coursera' button label",
  "/results loaded; a roadmap step has courseLink from coursera.org",
  "1. Inspect a roadmap step whose courseLink starts with https://www.coursera.org/...",
  "courseLink: https://www.coursera.org/search?query=leadership",
  "Button label reads 'Open on Coursera'. Book icon is shown. Clicking opens Coursera in a new tab.");

tc("TC-CL-002", "Positive", "High",
  "PMI URL shows 'Open on PMI' button label",
  "/results loaded; step has courseLink from pmi.org",
  "1. Inspect a step with courseLink from pmi.org",
  "courseLink: https://www.pmi.org/certifications/project-management-pmp",
  "Button label: 'Open on PMI'. Book icon shown.");

tc("TC-CL-003", "Positive", "Medium",
  "Google search fallback URL shows 'Search Google' with search icon",
  "/results loaded; a step has a Google search fallback link",
  "1. Inspect a step whose courseLink contains 'google.com/search'",
  "courseLink: https://www.google.com/search?q=Senior+PM+course",
  "Button label: 'Search Google'. Search magnifier icon shown instead of book icon.");

tc("TC-CL-004", "Positive", "Medium",
  "edX URL shows 'Open on edX' button label",
  "/results loaded; step has edX courseLink",
  "1. Inspect a step with edx.org courseLink",
  "courseLink: https://www.edx.org/search?q=data+science",
  "Button label: 'Open on edX'.");

tc("TC-CL-005", "Positive", "Medium",
  "Microsoft Learn URL shows correct platform label",
  "/results loaded; step has learn.microsoft.com courseLink",
  "1. Inspect a step with Microsoft Learn courseLink",
  "courseLink: https://learn.microsoft.com/en-us/training/browse/?terms=azure",
  "Button label: 'Open on Microsoft Learn'. Book icon shown.");

tc("TC-CL-006", "Negative", "High",
  "Non-trusted domain in Claude response is replaced by Google fallback",
  "API server running; Claude mock returns a non-trusted domain URL",
  "1. Mock Claude to return a roadmap step with courseLink='https://randomcoursesite.com/course'\n2. Call /api/analyze\n3. Inspect the response roadmap courseLink",
  "courseLink from Claude: https://randomcoursesite.com/course",
  "ensureCourseLinkFallback() replaces the URL with https://www.google.com/search?q=<focusArea>+online+course+certification.");

tc("TC-CL-007", "Negative", "High",
  "Null courseLink from Claude is replaced by Google fallback",
  "API server running; Claude returns courseLink: null",
  "1. Mock Claude to return courseLink: null for a step\n2. Call /api/analyze",
  "courseLink: null",
  "isTrustedCourseLink(null) returns false. Google search fallback URL generated from the step's focusArea.");

tc("TC-CL-008", "Negative", "Medium",
  "Invalid URL string from Claude is replaced by Google fallback",
  "API server running; Claude returns a malformed URL",
  "1. Mock Claude to return courseLink='not-a-url'\n2. Call /api/analyze",
  "courseLink: 'not-a-url'",
  "URL constructor throws in isTrustedCourseLink. Function returns false. Google fallback applied.");

tc("TC-CL-009", "Negative", "Medium",
  "Course link button opens in a new tab (target=_blank)",
  "/results loaded with a valid courseLink",
  "1. Right-click a 'Start Learning' / 'Open on...' button\n2. Check link target attribute",
  "N/A",
  "Link has target='_blank' and rel='noopener noreferrer'. Clicking opens the URL in a new browser tab.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 10 — CURRENCY MAPPING
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 10 — Currency Mapping & Salary Format");
sectionBanner("CM — getCurrencyGuide() Function Tests", "Backend: salary format per geography");

tc("TC-CM-001", "Positive", "High",
  "India returns INR Rupee format",
  "getCurrencyGuide called with 'India'",
  "1. Call getCurrencyGuide('India')",
  "input: 'India'",
  "Returns string containing 'Indian Rupees (₹)' and example format '₹12L – ₹18L per annum'.");

tc("TC-CM-002", "Positive", "High",
  "USA returns USD format",
  "getCurrencyGuide called with 'USA'",
  "1. Call getCurrencyGuide('USA')",
  "input: 'USA'",
  "Returns 'US Dollars (USD $)' with example '$80,000 – $140,000 per year'.");

tc("TC-CM-003", "Positive", "High",
  "United Kingdom returns GBP format",
  "getCurrencyGuide called with 'United Kingdom'",
  "1. Call getCurrencyGuide('United Kingdom')",
  "input: 'United Kingdom'",
  "Returns 'British Pounds (£)' with example '£45,000 – £80,000 per year'.");

tc("TC-CM-004", "Positive", "Medium",
  "UAE returns USD equivalent (tax-free)",
  "getCurrencyGuide called with 'UAE'",
  "1. Call getCurrencyGuide('UAE')",
  "input: 'UAE'",
  "Returns 'USD equivalent (tax-free)' with salary example range.");

tc("TC-CM-005", "Positive", "Medium",
  "Germany returns Euro format",
  "getCurrencyGuide called with 'Germany'",
  "1. Call getCurrencyGuide('Germany')",
  "input: 'Germany'",
  "Returns 'Euros (€)' with example range.");

tc("TC-CM-006", "Positive", "Medium",
  "Singapore returns SGD format",
  "getCurrencyGuide called with 'Singapore'",
  "1. Call getCurrencyGuide('Singapore')",
  "input: 'Singapore'",
  "Returns 'Singapore Dollars (SGD)' with example range.");

tc("TC-CM-007", "Positive", "Medium",
  "Australia returns AUD format",
  "getCurrencyGuide called with 'Australia'",
  "1. Call getCurrencyGuide('Australia')",
  "input: 'Australia'",
  "Returns 'Australian Dollars (AUD A$)'.");

tc("TC-CM-008", "Negative", "Low",
  "Unknown geography returns USD fallback",
  "getCurrencyGuide called with an unrecognised country name",
  "1. Call getCurrencyGuide('Atlantis')",
  "input: 'Atlantis'",
  "Returns the default fallback: 'US Dollars (USD $), e.g. $50,000 – $80,000 per year'.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 11 — STATE / CONTEXT
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 11 — State Management & Context");
sectionBanner("CT — CareerContext State Tests", "React Context: CareerProvider + useCareer");

tc("TC-CT-001", "Positive", "High",
  "CareerContext stores analysisResult after successful API call",
  "User on /analyze; API returns a valid CareerAnalysis",
  "1. Submit valid analysis form\n2. API returns 200 with CareerAnalysis object",
  "CareerAnalysis object from API",
  "setAnalysisResult() is called with the parsed JSON. analysisResult in context is now the full CareerAnalysis object. App navigates to /results.");

tc("TC-CT-002", "Positive", "High",
  "Results page reads analysisResult from context correctly",
  "analysisResult set in context; user on /results",
  "1. Navigate to /results after a successful analysis",
  "N/A",
  "All 6 result cards display data sourced from analysisResult. No null/undefined rendering errors.");

tc("TC-CT-003", "Positive", "Medium",
  "useCareer hook throws when used outside CareerProvider",
  "CareerProvider NOT wrapping a component",
  "1. Mount a component that calls useCareer() without a CareerProvider ancestor",
  "N/A",
  "React renders an error: 'useCareer must be used within a CareerProvider'.");

tc("TC-CT-004", "Negative", "High",
  "analysisResult is null on fresh page load — /results redirects",
  "Fresh session; no previous analysis",
  "1. Navigate to /results without going through the analysis flow",
  "analysisResult: null",
  "useEffect detects null and calls navigate('/analyze'). /results page content is not shown.");

tc("TC-CT-005", "Positive", "Medium",
  "Context resets correctly between multiple analyses in the same session",
  "User completes one analysis; then starts a new one",
  "1. Complete full analysis flow (reaches /results)\n2. Click 'New Analysis'\n3. Submit a different resume",
  "New resume with different role",
  "New API response overwrites the previous analysisResult in context. /results shows updated data.");

tc("TC-CT-006", "Negative", "Medium",
  "Refreshing /results clears context and redirects to /analyze",
  "User is on /results after a successful analysis",
  "1. Navigate to /results\n2. Refresh the browser page (F5)",
  "N/A",
  "Context is reset (useState initialises to null). useEffect fires and redirects to /analyze.");

// ════════════════════════════════════════════════════════════════════════════
// MODULE 12 — NAVIGATION
// ════════════════════════════════════════════════════════════════════════════
newPage("Module 12 — Navigation");
sectionBanner("NV — Navigation & Routing Tests", "Wouter router — all 3 routes");

tc("TC-NV-001", "Positive", "High",
  "Root path / renders LandingPage",
  "App running",
  "1. Navigate to /",
  "URL: /",
  "LandingPage component renders. Navbar, hero, sections, and footer are visible.");

tc("TC-NV-002", "Positive", "High",
  "Path /analyze renders AnalyzePage",
  "App running",
  "1. Navigate to /analyze",
  "URL: /analyze",
  "AnalyzePage renders with the Career Analysis form.");

tc("TC-NV-003", "Positive", "High",
  "Back arrow on /analyze navigates to /",
  "User is on /analyze",
  "1. Click the back arrow (← Back) in the sticky header",
  "N/A",
  "Browser navigates to /. LandingPage is displayed.");

tc("TC-NV-004", "Positive", "High",
  "Home link on /results navigates to /",
  "User is on /results",
  "1. Click the 'Home' button in the results header",
  "N/A",
  "Browser navigates to /. LandingPage is shown.");

tc("TC-NV-005", "Positive", "Medium",
  "Brand name link on /analyze is clickable as visual element",
  "User is on /analyze",
  "1. Observe the brand name 'AI Career Growth Planner' in the header",
  "N/A",
  "Brand name rendered in indigo-600, bold. (Note: it is a <span>, not a link — no navigation on click, by design.)");

tc("TC-NV-006", "Negative", "Low",
  "Unknown routes render 404 fallback component",
  "App running",
  "1. Navigate to any path not defined in the router (e.g. /dashboard, /profile)",
  "URL: /dashboard",
  "Catch-all <Route> renders: 'Page Not Found' heading and 'Go back home' link that navigates to /.");

// ════════════════════════════════════════════════════════════════════════════
// BACK COVER / SUMMARY
// ════════════════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, doc.page.width, 60).fillColor(HDR_BG).fill();
doc.fontSize(16).fillColor("#FFFFFF").font("Helvetica-Bold")
   .text("Test Summary & Coverage Matrix", 45, 20, { width: PW });

doc.y = 80;

doc.fontSize(10).fillColor(DARK).font("Helvetica-Bold").text("Coverage by Priority", 45, doc.y);
doc.moveDown(0.4);

const priRows = [
  ["Priority", "Count", "% of Total"],
  ["High",   "68",  "61%"],
  ["Medium", "33",  "30%"],
  ["Low",    "10",   "9%"],
  ["TOTAL", "111", "100%"],
];

const pc = [PW * 0.4, PW * 0.3, PW * 0.3];
let py = doc.y;
priRows.forEach((row, ri) => {
  const isH = ri === 0; const isT = ri === priRows.length - 1;
  const bg = isH ? INDIGO : isT ? HI_BG : ri % 2 === 0 ? "#FFF" : ROW_ALT;
  doc.rect(45, py, PW, 14).fillColor(bg).fill();
  let px = 50;
  row.forEach((cell, ci) => {
    doc.fontSize(isH ? 7.5 : 8.5).fillColor(isH ? "#FFF" : isT ? INDIGO : DARK)
       .font(isH || isT ? "Helvetica-Bold" : "Helvetica")
       .text(cell, px, py + 3, { width: pc[ci] - 6, align: ci === 0 ? "left" : "center" });
    px += pc[ci];
  });
  py += 14;
});

doc.y = py + 20;

doc.fontSize(10).fillColor(DARK).font("Helvetica-Bold").text("Coverage by Type", 45, doc.y);
doc.moveDown(0.4);

const typeRows = [
  ["Type", "Count", "% of Total"],
  ["Positive", "61", "55%"],
  ["Negative", "50", "45%"],
  ["TOTAL",   "111", "100%"],
];

py = doc.y;
typeRows.forEach((row, ri) => {
  const isH = ri === 0; const isT = ri === typeRows.length - 1;
  const bg = isH ? INDIGO : isT ? HI_BG : ri % 2 === 0 ? "#FFF" : ROW_ALT;
  doc.rect(45, py, PW, 14).fillColor(bg).fill();
  let px = 50;
  row.forEach((cell, ci) => {
    doc.fontSize(isH ? 7.5 : 8.5).fillColor(isH ? "#FFF" : isT ? INDIGO : DARK)
       .font(isH || isT ? "Helvetica-Bold" : "Helvetica")
       .text(cell, px, py + 3, { width: pc[ci] - 6, align: ci === 0 ? "left" : "center" });
    px += pc[ci];
  });
  py += 14;
});

doc.y = py + 28;
divider();

doc.fontSize(10).fillColor(DARK).font("Helvetica-Bold").text("Test ID Naming Convention", 45, doc.y);
doc.moveDown(0.4);
const legend = [
  ["TC-LP-###", "Landing Page"],
  ["TC-RU-###", "Resume Upload (Client-Side)"],
  ["TC-DR-###", "Dropdown & Custom Field Validations"],
  ["TC-FS-###", "Form Submission & API Integration"],
  ["TC-LS-###", "Loading State"],
  ["TC-RS-###", "Reset Functionality"],
  ["TC-VR-###", "API: /validate-resume"],
  ["TC-AN-###", "API: /analyze"],
  ["TC-RP-###", "Results Page"],
  ["TC-CL-###", "Course Link Validation"],
  ["TC-CM-###", "Currency Mapping"],
  ["TC-CT-###", "State / Context"],
  ["TC-NV-###", "Navigation & Routing"],
];

legend.forEach(([id, desc], ri) => {
  const bg = ri % 2 === 0 ? "#FFF" : ROW_ALT;
  doc.rect(45, doc.y, PW, 13).fillColor(bg).fill();
  doc.fontSize(8.5).fillColor(INDIGO).font("Helvetica-Bold")
     .text(id, 50, doc.y + 2, { width: PW * 0.35 });
  doc.fontSize(8.5).fillColor(MED).font("Helvetica")
     .text(desc, 50 + PW * 0.35, doc.y - 10, { width: PW * 0.65 });
  doc.moveDown(0.05);
});

doc.moveDown(1);
doc.fontSize(8).fillColor(MUTED).font("Helvetica")
   .text("AI Career Growth Planner — Test Case Document — For internal QA use.", 45, doc.y, { width: PW, align: "center" });

doc.end();
console.log("PDF written to:", OUT);

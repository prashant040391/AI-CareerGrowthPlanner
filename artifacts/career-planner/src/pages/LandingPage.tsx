import { useLocation } from "wouter";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600 tracking-tight">VeloCareer (Velocity + Career) - Accelerate Your Potential</span>
          <button
            onClick={() => navigate("/analyze")}
            className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white py-24 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            AI Career Growth Planner
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume. Define your target role. Discover the skills, roadmap, and salary path to get there.
          </p>
          <button
            onClick={() => navigate("/analyze")}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Career Analysis
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">Three simple steps to unlock your career potential</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Upload Your Resume",
                desc: "Upload your resume. Our system extracts your work history, skills, and experience automatically.",
              },
              {
                step: "02",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Define Your Target Role",
                desc: "Tell us where you want to go — your target job role and industry.",
              },
              {
                step: "03",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Get Results",
                desc: "Receive a detailed AI-generated report: skill gaps, roadmap, strengths, and salary growth projections.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">{step}</span>
                  <div className="h-px flex-1 bg-indigo-100" />
                </div>
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What You Get</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">A complete picture of where you are and where you need to go</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                color: "bg-indigo-50 border-indigo-100",
                iconColor: "text-indigo-600",
                label: "Profile Analysis",
                desc: "Detailed breakdown of your current role, experience, skills, tools, and education extracted from your resume.",
              },
              {
                color: "bg-amber-50 border-amber-100",
                iconColor: "text-amber-600",
                label: "Skill Gaps",
                desc: "Identify exactly which skills are missing or need deepening to qualify for your target role.",
              },
              {
                color: "bg-green-50 border-green-100",
                iconColor: "text-green-600",
                label: "Personalized Roadmap",
                desc: "A 5-step, 12-month actionable upskilling plan tailored to your specific profile and goals.",
              },
              {
                color: "bg-blue-50 border-blue-100",
                iconColor: "text-blue-600",
                label: "Salary Insights",
                desc: "Realistic salary range estimates for your current level and target role, with expected uplift percentage.",
              },
            ].map(({ color, iconColor, label, desc }) => (
              <div key={label} className={`${color} border rounded-xl p-6`}>
                <div className={`${iconColor} font-bold text-sm mb-2 uppercase tracking-wide`}>{label}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why It Matters</h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Most professionals lack clarity on exactly what it takes to move to the next level. AI Career Growth Planner bridges that gap — turning your resume into a precise, data-driven roadmap for career advancement.
            With AI-driven career planning, you get personalized, actionable guidance instead of generic advice, saving months of guesswork and helping you focus your energy where it counts most.
          </p>
          <button
            onClick={() => navigate("/analyze")}
            className="mt-10 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl text-base hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5"
          >
            Start Career Analysis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-white font-semibold">AI Career Growth Planner</span>
          <p className="text-center italic text-gray-500 text-xs max-w-md">
            Disclaimer: This is an AI-powered tool for career planning guidance. Results are indicative and should be used alongside professional career advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

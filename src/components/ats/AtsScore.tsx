import React, { useState, useEffect, useMemo } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { Progress } from "@/components/ui/progress";

const OPTIMIZATION_TIPS = [
  "Include more action verbs",
  "Add quantifiable achievements",
  "Keep summary concise",
  "Tailor skills to the job description",
];

function keywordMatchScore(resume: string, jobDesc: string) {
  if (!resume || !jobDesc) return 0;
  // Simple normalized matching: count unique jobDesc keywords present in resume
  const jobWords = Array.from(new Set(jobDesc.toLowerCase().match(/\w+/g) || []));
  const resumeWords = new Set(resume.toLowerCase().match(/\w+/g) || []);
  if (jobWords.length === 0) return 0;
  const matchCount = jobWords.filter((word) => resumeWords.has(word)).length;
  return Math.min(100, Math.round((matchCount / jobWords.length) * 100));
}

function resumeTextFromData(data: any): string {
  if (!data) return "";
  const sections = [
    data.personalInfo?.fullName,
    data.personalInfo?.summary,
    (data.experience || []).map((x: any) => [x.jobTitle, x.company, x.description].join(" ")).join(" "),
    (data.education || []).map((x: any) => [x.degree, x.institution, x.details].join(" ")).join(" "),
    (data.skills || []).join(" "),
  ];
  return sections.filter(Boolean).join(" ");
}

// FIXED: Ensure both functions are exported as named exports (for Vitest tests)
export { keywordMatchScore, resumeTextFromData };

const CircularProgress = ({ value }: { value: number }) => {
  // value: 0-100
  const angle = (value / 100) * 360;
  const r = 38, c = 2 * Math.PI * r;
  const offset = c - (angle / 360) * c;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" className="mx-auto block">
      <circle
        cx="45" cy="45" r={r}
        stroke="#e5e7eb"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx="45" cy="45" r={r}
        stroke="#3b82f6"
        strokeWidth="8"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.3em" fontSize="2rem" className="fill-[#111827] font-bold">{value}</text>
    </svg>
  )
};

const AtsScore: React.FC = () => {
  const { resume } = useResume();
  const [jobDesc, setJobDesc] = useState("");
  const resumeText = useMemo(() => resumeTextFromData(resume?.data), [resume]);
  const score = useMemo(() => keywordMatchScore(resumeText, jobDesc), [resumeText, jobDesc]);

  return (
    <div className="bg-background border rounded-lg p-4 mb-6">
      <h2 className="font-semibold text-lg mb-2">ATS Score</h2>
      <CircularProgress value={score} />
      <div className="text-center text-sm text-muted-foreground mb-3">Keyword match</div>
      <textarea
        className="w-full min-h-[68px] p-2 border rounded-md mb-3 text-sm"
        placeholder="Paste job description here…"
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
      />
      <div className="mt-2">
        <h3 className="font-medium text-sm mb-1">Optimization Tips</h3>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
          {OPTIMIZATION_TIPS.map(tip => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
};

export default AtsScore;


import React from "react";
import { useResume } from "@/contexts/ResumeContext";

// Simple template style map. In future, replace with template data.
const TEMPLATE_STYLES: Record<string, { bg: string; font: string }> = {
  // Use actual UUIDs in production, here just for demo.
  "Modern Blue": { bg: "bg-blue-50", font: "font-inter" },
  "Sleek Grey": { bg: "bg-gray-100", font: "font-sans" },
  "Tech Black": { bg: "bg-black text-white", font: "font-mono" },
  "Code Green": { bg: "bg-green-50", font: "font-inter" },
  "Pro Tan": { bg: "bg-yellow-50", font: "font-serif" },
};

const ResumePreview: React.FC = () => {
  const { resume } = useResume();
  if (!resume) {
    return <div className="text-center text-muted-foreground">Loading preview...</div>;
  }
  const { personalInfo = {}, experience = [], education = [], skills = [], template_id } = resume.data || {};

  // For simplicity, use name-based mapping; in production, use IDs
  // Simulate by matching to template name if possible; fallback if not found
  let templateStyle = TEMPLATE_STYLES["Modern Blue"];
  if (template_id) {
    // find by template_id (normally UUID), but here just show a simple mapping demo; refine for real
    for (const [tplName, style] of Object.entries(TEMPLATE_STYLES)) {
      if (template_id.includes(tplName)) {
        templateStyle = style;
        break;
      }
    }
  }

  return (
    <div className={`p-4 rounded-lg border min-h-[600px] transition-all ${templateStyle.bg} ${templateStyle.font}`}>
      <h2 className="font-bold text-lg">{personalInfo.fullName || "Your Name"}</h2>
      <div className="text-xs text-muted-foreground">{personalInfo.email} {personalInfo.phone ? "• " + personalInfo.phone : ""}</div>
      <div className="mt-2 text-sm">{personalInfo.summary}</div>
      <hr className="my-2" />

      <h3 className="font-semibold text-base">Experience</h3>
      {Array.isArray(experience) && experience.length > 0 ? (
        experience.map((item: any) => (
          <div key={item.id} className="mb-2">
            <div className="font-medium">{item.jobTitle} <span className="text-xs text-muted-foreground">at {item.company}</span></div>
            <div className="text-xs text-muted-foreground">{item.startDate} – {item.endDate}</div>
            <div className="text-sm">{item.description}</div>
          </div>
        ))
      ) : (
        <span className="text-xs text-muted-foreground">No experience listed.</span>
      )}

      <hr className="my-2" />

      <h3 className="font-semibold text-base">Education</h3>
      {Array.isArray(education) && education.length > 0 ? (
        education.map((item: any) => (
          <div key={item.id} className="mb-2">
            <div className="font-medium">{item.degree} <span className="text-xs text-muted-foreground">{item.institution}</span></div>
            <div className="text-xs text-muted-foreground">{item.startDate} – {item.endDate}</div>
            <div className="text-sm">{item.details}</div>
          </div>
        ))
      ) : (
        <span className="text-xs text-muted-foreground">No education listed.</span>
      )}

      <hr className="my-2" />

      <h3 className="font-semibold text-base">Skills</h3>
      <div className="flex flex-wrap gap-2 mt-1">
        {(skills && skills.length > 0)
          ? skills.map((s: string) => (
              <span className="bg-blue-100 text-blue-900 px-2 py-1 rounded-full text-xs" key={s}>{s}</span>
            ))
          : <span className="text-xs text-muted-foreground">No skills listed.</span>
        }
      </div>
    </div>
  );
};

export default ResumePreview;

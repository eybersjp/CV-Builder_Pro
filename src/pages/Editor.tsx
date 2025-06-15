
import React from "react";
import { useParams } from "react-router-dom";
import ThreePanelLayout from "@/components/layout/ThreePanelLayout";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/resume/SkillsForm";
import ResumePreview from "@/components/resume/ResumePreview";
import { ResumeProvider, useResume } from "@/contexts/ResumeContext";
import { usePDFExport } from "@/hooks/usePDFExport";
import { Download, Loader } from "lucide-react";

const SaveStatus = () => {
  const { status } = useResume();
  return (
    <div className="text-xs text-muted-foreground pl-1 pb-2 h-3">
      {status === "saving" && <span>Saving...</span>}
      {status === "saved" && <span>All changes saved</span>}
      {status === "error" && <span className="text-destructive">Save failed!</span>}
    </div>
  );
};

const DownloadPDFButton = () => {
  const { downloadPDF, loading } = usePDFExport();
  return (
    <button
      disabled={loading}
      onClick={downloadPDF}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-primary/90 disabled:opacity-60 transition disabled:cursor-not-allowed ml-auto"
      aria-busy={loading}
      aria-label="Download PDF"
    >
      {loading ? (
        <>
          <Loader className="animate-spin" /> Generating PDF...
        </>
      ) : (
        <>
          <Download /> Download PDF
        </>
      )}
    </button>
  );
};

const EditorContent = () => (
  <div>
    <div className="flex items-center mb-2">
      <h1 className="text-2xl font-bold">Resume Editor</h1>
      <div className="ml-auto flex items-center">
        <DownloadPDFButton />
      </div>
    </div>
    <SaveStatus />
    <PersonalInfoForm />
    <ExperienceForm />
    <EducationForm />
    <SkillsForm />
  </div>
);

const Editor = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>No resume selected.</div>;

  return (
    <ResumeProvider id={id}>
      <ThreePanelLayout
        leftSidebar={<div className="text-center">Left Sidebar</div>}
        mainContent={<EditorContent />}
        rightPreview={<ResumePreview />}
      />
    </ResumeProvider>
  );
};

export default Editor;

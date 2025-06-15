
import React from "react";
import { useParams } from "react-router-dom";
import ThreePanelLayout from "@/components/layout/ThreePanelLayout";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/resume/SkillsForm";
import ResumePreview from "@/components/resume/ResumePreview";
import { ResumeProvider, useResume } from "@/contexts/ResumeContext";

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

const EditorContent = () => (
  <div>
    <h1 className="text-2xl font-bold mb-2">Resume Editor</h1>
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

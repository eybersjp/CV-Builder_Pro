
import React from "react";
import { useParams } from "react-router-dom";
import ThreePanelLayout from "@/components/layout/ThreePanelLayout";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/resume/SkillsForm";

const Editor = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <ThreePanelLayout
      leftSidebar={<div className="text-center">Left Sidebar</div>}
      mainContent={
        <div>
          <h1 className="text-2xl font-bold mb-6">Editor for Resume ID: {id}</h1>
          <PersonalInfoForm />
          <ExperienceForm />
          <EducationForm />
          <SkillsForm />
        </div>
      }
      rightPreview={<div className="text-center">Live Preview</div>}
    />
  );
};

export default Editor;

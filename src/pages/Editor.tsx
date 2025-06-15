import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ThreePanelLayout from "@/components/layout/ThreePanelLayout";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/resume/SkillsForm";
import ResumePreview from "@/components/resume/ResumePreview";
import { ResumeProvider, useResume } from "@/contexts/ResumeContext";
import { usePDFExport } from "@/hooks/usePDFExport";
import { Download, Loader, Home, ArrowLeft, Settings } from "lucide-react";
import AtsScore from "@/components/ats/AtsScore";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const SidebarNavigation = () => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <div className="flex gap-2 mb-4">
        {/* Dashboard Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Go to Dashboard"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go to Dashboard</TooltipContent>
        </Tooltip>
        {/* Back Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Go Back"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go back</TooltipContent>
        </Tooltip>
        {/* Settings Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Go to Settings"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go to Settings</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

const Editor = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>No resume selected.</div>;

  return (
    <>
      <Header />
      <ResumeProvider id={id}>
        <ThreePanelLayout
          leftSidebar={
            <div>
              <SidebarNavigation />
              <AtsScore />
              <div className="mt-4 text-center">Left Sidebar</div>
            </div>
          }
          mainContent={<EditorContent />}
          rightPreview={<ResumePreview />}
        />
      </ResumeProvider>
    </>
  );
};

export default Editor;

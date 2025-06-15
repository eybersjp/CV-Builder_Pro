
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTemplates } from "@/hooks/useTemplates";
import TemplateCard from "@/components/templates/TemplateCard";
import { useResume } from "@/contexts/ResumeContext";
import Header from "@/components/layout/Header";

const Templates = () => {
  const { data: templates, isLoading, error } = useTemplates();
  const { resume, updateSection } = useResume();

  // FIX: Safely access template_id from resume.data
  const currentTemplateId = resume?.data?.template_id || "";

  // Handler to set template_id for this resume
  const handleSelect = (templateId: string) => {
    updateSection("template_id", templateId);
  };

  return (
    <>
      <Header />
      <main className="px-4 py-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" tabIndex={0}>Choose a Resume Template</h1>
        {isLoading && <div aria-live="polite">Loading templates...</div>}
        {error && <div className="text-destructive" aria-live="polite">Failed to load templates.</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates &&
            templates.map((tpl: any) => (
              <TemplateCard
                key={tpl.id}
                name={tpl.name}
                preview_image_url={tpl.preview_image_url}
                is_premium={tpl.is_premium}
                selected={tpl.id === currentTemplateId}
                onClick={() => handleSelect(tpl.id)}
                tabIndex={0}
                aria-label={`Select resume template: ${tpl.name}`}
                role="button"
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelect(tpl.id);
                  }
                }}
              />
            ))}
        </div>
        {!isLoading && templates?.length === 0 && (
          <div className="text-muted-foreground" tabIndex={0}>No templates available.</div>
        )}
      </main>
    </>
  );
};

export default Templates;

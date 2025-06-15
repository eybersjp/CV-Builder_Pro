import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Resume } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

interface ResumeContextType {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  updateSection: (section: keyof Resume["data"], value: any) => void;
  status: "idle" | "saving" | "saved" | "error";
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ id, children }: { id: string, children: React.ReactNode }) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [debouncedData, setDebouncedData] = useState<Resume["data"] | null>(null);

  // Fetch resume on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (mounted && data) setResume(data as Resume);
    })();
    return () => { mounted = false; };
  }, [id]);

  // Provide handy section update
  const updateSection = useCallback(
    (section: keyof Resume["data"], value: any) => {
      if (!resume) return;
      const newData = { ...resume.data, [section]: value };
      setResume({ ...resume, data: newData });
      setDebouncedData(newData);
    },
    [resume]
  );

  // Debounced auto-save handler
  useDebounce(debouncedData, 2000, async (dataToSave) => {
    if (!resume || !dataToSave) return;
    setStatus("saving");
    const { error } = await supabase
      .from("resumes")
      .update({ data: dataToSave, updated_at: new Date().toISOString() })
      .eq("id", resume.id);
    setStatus(error ? "error" : "saved");
    if (!error) setTimeout(() => setStatus("idle"), 1000);
  });

  return (
    <ResumeContext.Provider value={{
      resume,
      setResume: (r) => { setResume(r); setDebouncedData(r.data); },
      updateSection,
      status
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}

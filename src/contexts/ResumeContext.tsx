
import React from "react";
import { useResumeStore } from "@/stores/useResumeStore";

// This file is now deprecated! Use useResumeStore instead.
export function ResumeProvider({ id, children }: { id: string, children: React.ReactNode }) {
  // For legacy provider support, auto-fetch resume if needed
  React.useEffect(() => {
    if (id) useResumeStore.getState().fetchResume(id);
  }, [id]);
  return <>{children}</>;
}

export function useResume() {
  // Use Zustand's selector for optimal UI updates
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const updateSection = useResumeStore((s) => s.updateSection);
  const status = useResumeStore((s) => s.status);
  return { resume, setResume, updateSection, status };
}


import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Resume } from "@/types";
import { supabase } from "@/integrations/supabase/client";

type ResumeStatus = "idle" | "saving" | "saved" | "error";

interface ResumeState {
  resume: Resume | null;
  status: ResumeStatus;
  setResume: (resume: Resume) => void;
  updateSection: (section: keyof Resume["data"], value: any) => void;
  fetchResume: (id: string) => Promise<void>;
  saveResume: () => Promise<void>;
}

export const useResumeStore = create<ResumeState>()(
  immer((set, get) => ({
    resume: null,
    status: "idle",
    setResume: (resume: Resume) => set({ resume }),
    updateSection: (section, value) => {
      const { resume } = get();
      if (!resume) return;
      set((state) => {
        state.resume = { ...resume, data: { ...(resume.data || {}), [section]: value } };
        state.status = "saving";
      });
      // Debounced save
      clearTimeout((window as any).__resume_save_timeout);
      (window as any).__resume_save_timeout = setTimeout(get().saveResume, 1000);
    },
    fetchResume: async (id: string) => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (data) set({ resume: data as Resume });
    },
    saveResume: async () => {
      const { resume } = get();
      if (!resume) return;
      set({ status: "saving" });
      const { error } = await supabase
        .from("resumes")
        .update({ data: resume.data, updated_at: new Date().toISOString() })
        .eq("id", resume.id);
      set({ status: error ? "error" : "saved" });
      if (!error) setTimeout(() => set({ status: "idle" }), 600);
    },
  }))
);

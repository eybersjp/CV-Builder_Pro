
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";

type HookOptions = {
  userId?: string;
  onSuccess?: (resumeId: string) => void;
};

export function useCvUpload({ userId, onSuccess }: HookOptions = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const uploadAndParseCv = useCallback(
    async (file: File) => {
      if (!userId) {
        toast.error("User not loaded. Please sign in again.");
        return;
      }
      const toastId = toast.loading("Parsing your CV, this may take a moment...");

      try {
        // Build multipart form data
        const formData = new FormData();
        formData.append("file", file);

        // Correctly get access token for Authorization header
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token ?? "";

        // POST to the parse-cv edge function
        const response = await fetch(
          `https://dgtralqrsgmtqlyiivej.functions.supabase.co/parse-cv`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          let errText;
          try {
            errText = await response.text();
          } catch {}
          throw new Error(
            errText && errText.startsWith("{")
              ? JSON.parse(errText).error || "Unknown error"
              : errText || "Failed to parse CV (edge function error)"
          );
        }

        const { resume, error } = await response.json();

        if (error || !resume) {
          throw new Error(error || "Failed to parse CV. Please make sure the file is a valid PDF or DOCX and try again.");
        }

        // Insert the resume into Supabase resumes table
        const { data, error: dbError } = await supabase
          .from("resumes")
          .insert([
            {
              user_id: userId,
              title: resume.personalInfo?.fullName
                ? `${resume.personalInfo.fullName}'s Resume`
                : "Imported Resume",
              data: resume,
            },
          ])
          .select("id")
          .single();

        if (dbError) {
          throw new Error(
            dbError.message || "Resume could not be saved. Please try again."
          );
        }

        toast.success("Resume parsed and imported successfully!", { id: toastId });
        // Invalidate user's resumes cache so Dashboard lists refresh
        await queryClient.invalidateQueries({ queryKey: ["resumes", userId] });

        if (onSuccess) {
          onSuccess(data.id);
        } else {
          navigate(`/editor/${data.id}`);
        }
      } catch (err: any) {
        toast.error(
          err?.message ||
            "Failed to parse CV. Please ensure it is a valid PDF or DOCX file and try again.",
          { id: toastId }
        );
      }
    },
    [userId, onSuccess, navigate, queryClient]
  );

  return {
    uploadAndParseCv,
  };
}

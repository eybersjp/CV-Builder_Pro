
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";

type HookOptions = {
  userId?: string;
  onSuccess?: (resumeId: string) => void;
};

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function useCvUpload({ userId, onSuccess }: HookOptions = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const uploadAndParseCv = useCallback(
    async (file: File) => {
      if (!userId) {
        toast.error("User not loaded. Please sign in again.");
        return;
      }
      // File size validation
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error("File is too large. Maximum allowed file size is 10MB.");
        return;
      }
      // Basic type validation (reliable for PDF, less so for DOCX, but still good UX)
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error("Unsupported file type. Only PDF and DOCX files are accepted.");
        return;
      }

      // Security log: user started upload
      console.info(
        "[SECURITY] User initiated CV upload",
        { name: file.name, type: file.type, size: file.size }
      );

      const toastId = toast.loading("Parsing your CV, this may take a moment...");

      try {
        // Build multipart form data
        const formData = new FormData();
        formData.append("file", file);

        // Use supabase.functions.invoke for calling the parse-cv edge function
        let result;
        try {
          const { data, error } = await supabase.functions.invoke("parse-cv", {
            body: formData,
          });
          if (error) {
            // Do not leak internal errors to user
            throw new Error("Unable to parse CV. Please try again later.");
          }
          result = data;
        } catch (error: any) {
          console.error("[SECURITY] CV upload backend error", error);
          toast.error("Upload Failed", {
            description: "Unable to parse CV. Please check your file and try again.",
            id: toastId,
          });
          return;
        }

        const { resume, error: parseError } = result || {};

        if (parseError || !resume) {
          throw new Error(
            "Failed to parse CV. Please make sure the file is a valid PDF or DOCX and try again."
          );
        }

        // Insert the resume into Supabase resumes table
        const { data: dbData, error: dbError } = await supabase
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
          console.error("[SECURITY] Supabase resumes insert error", dbError);
          throw new Error(
            "Resume could not be saved. Please try again later."
          );
        }

        toast.success("Resume parsed and imported successfully!", { id: toastId });
        // Invalidate user's resumes cache so Dashboard lists refresh
        await queryClient.invalidateQueries({ queryKey: ["resumes", userId] });

        if (onSuccess) {
          onSuccess(dbData.id);
        } else {
          navigate(`/editor/${dbData.id}`);
        }
      } catch (err: any) {
        // Only show generic errors to the user
        console.error("[SECURITY] Unexpected CV upload error", err);
        toast.error("Upload Failed", {
          description:
            "Failed to parse CV. Please ensure it is a valid PDF or DOCX file and try again.",
          id: toastId,
        });
      }
    },
    [userId, onSuccess, navigate, queryClient]
  );

  return {
    uploadAndParseCv,
  };
}

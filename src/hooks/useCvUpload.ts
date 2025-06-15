
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

        // Use supabase.functions.invoke for calling the parse-cv edge function
        let result;
        try {
          const { data, error } = await supabase.functions.invoke("parse-cv", {
            body: formData,
          });
          if (error) {
            throw error;
          }
          result = data;
        } catch (error: any) {
          // -- Detailed error handling
          console.log(error);
          toast({
            title: "Upload Failed",
            description: error?.message || "Unable to parse CV.",
            variant: "destructive",
            id: toastId,
          });
          return;
        }

        const { resume, error: parseError } = result || {};

        if (parseError || !resume) {
          throw new Error(
            parseError || "Failed to parse CV. Please make sure the file is a valid PDF or DOCX and try again."
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
          throw new Error(
            dbError.message || "Resume could not be saved. Please try again."
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
        console.log(err);
        toast({
          title: "Upload Failed",
          description:
            err?.message ||
            "Failed to parse CV. Please ensure it is a valid PDF or DOCX file and try again.",
          variant: "destructive",
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

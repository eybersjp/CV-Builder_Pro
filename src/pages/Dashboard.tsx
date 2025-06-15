import React, { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Plus, FileText, Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Fetch current user profile (first name)
async function fetchUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No user session found");
  const { data, error } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return { id: user.id, first_name: data?.first_name ?? "" };
}

// Fetch all resumes for the current user
async function fetchUserResumes(userId: string) {
  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Create a new resume for the current user
async function createResume({ userId, title }: { userId: string; title?: string }) {
  const { data, error } = await supabase
    .from("resumes")
    .insert([
      {
        user_id: userId,
        title: title ?? "Untitled Resume",
      },
    ])
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch user profile (first name and id)
  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
  });

  // Fetch user resumes
  const {
    data: resumes,
    isLoading: resumesLoading,
    error: resumesError,
  } = useQuery({
    queryKey: ["resumes", userProfile?.id],
    queryFn: () => (userProfile ? fetchUserResumes(userProfile.id) : Promise.resolve([])),
    enabled: !!userProfile,
  });

  // Create resume mutation
  const createResumeMutation = useMutation({
    mutationFn: async () => {
      if (!userProfile) throw new Error("No user profile loaded.");
      return await createResume({ userId: userProfile.id });
    },
    onSuccess: (newResumeId) => {
      toast.success("Resume created!");
      queryClient.invalidateQueries({ queryKey: ["resumes", userProfile?.id] });
      navigate(`/editor/${newResumeId}`);
    },
    onError: (err: any) => {
      toast.error("Failed to create a new resume. Please try again.");
      // Optionally: console.error(err);
    },
  });

  // Handlers
  const onCreateResume = useCallback(() => {
    createResumeMutation.mutate();
  }, [createResumeMutation]);

  const onUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For now, just show a toast and clear input
    toast.info(`Selected file: ${file.name}`);
    e.target.value = ""; // Reset input so the same file can be picked again
  };

  const onCardClick = useCallback(
    (resumeId: string) => {
      navigate(`/editor/${resumeId}`);
    },
    [navigate]
  );

  // Render logic
  return (
    <main className="max-w-6xl mx-auto px-4 pt-8 pb-16 min-h-screen font-inter">
      {/* Welcome Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground" tabIndex={0}>
          {profileLoading
            ? "Loading..."
            : profileError
            ? "Welcome!"
            : `Welcome back${userProfile?.first_name ? `, ${userProfile.first_name}` : ""}!`}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={onCreateResume}
            size="lg"
            className="bg-primary text-white font-semibold px-5 py-3 rounded-lg text-base shadow hover:bg-primary/90 transition"
            disabled={createResumeMutation.isPending}
            aria-label="Create New Resume"
          >
            <Plus className="mr-2" aria-hidden="true" /> {createResumeMutation.isPending ? "Creating..." : "Create New Resume"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="font-semibold px-5 py-3 rounded-lg text-base shadow"
            onClick={onUploadClick}
            aria-label="Upload Existing CV"
          >
            <Upload className="mr-2" aria-hidden="true" /> Upload Existing CV
          </Button>
          {/* Hidden file input */}
          <input
            ref={uploadInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={onFileChange}
            aria-label="Upload CV"
            tabIndex={-1}
          />
        </div>
      </header>

      {/* Resume List or Empty State */}
      <section>
        {resumesLoading ? (
          <div className="text-muted-foreground text-center pt-12" aria-live="polite">Loading your resumes...</div>
        ) : resumesError ? (
          <div className="text-destructive text-center pt-12" aria-live="polite">Failed to load resumes.</div>
        ) : resumes && resumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-2">
            {resumes.map((resume: { id: string; title: string; updated_at: string | null }) => (
              <Card
                key={resume.id}
                tabIndex={0}
                role="button"
                aria-label={`Edit resume: ${resume.title || "Untitled Resume"}`}
                className="cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none transition hover:shadow-lg"
                onClick={() => onCardClick(resume.id)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    onCardClick(resume.id);
                  }
                }}
                aria-pressed="false"
              >
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <FileText className="text-primary" aria-hidden="true" focusable="false" />
                  <CardTitle className="truncate flex-1 text-base">
                    <span>{resume.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {resume.updated_at
                      ? "Updated " + format(new Date(resume.updated_at), "PPP p")
                      : ""}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-lg font-semibold text-foreground" tabIndex={0}>You haven't created any resumes yet.</div>
            <Button
              onClick={onCreateResume}
              size="lg"
              className="bg-primary text-white font-semibold px-5 py-3 rounded-lg text-base shadow hover:bg-primary/90 transition"
              disabled={createResumeMutation.isPending}
              aria-label="Create New Resume"
            >
              <Plus className="mr-2" aria-hidden="true" /> {createResumeMutation.isPending ? "Creating..." : "Create New Resume"}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;

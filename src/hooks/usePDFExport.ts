
import { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";

export function usePDFExport() {
  const { resume } = useResume();
  const [loading, setLoading] = useState(false);

  const downloadPDF = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const res = await fetch("https://dgtralqrsgmtqlyiivej.supabase.co/functions/v1/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // can add Authorization if you want to restrict to authenticated users only
        },
        body: JSON.stringify({ resume }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Download using an anchor
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to generate PDF. Please try again.");
      // Optionally, use toast for better UX
      // import { toast } from "@/components/ui/toaster"; toast({ title: ..., description: ... })
    } finally {
      setLoading(false);
    }
  };

  return { downloadPDF, loading };
}

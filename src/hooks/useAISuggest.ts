
import { useState } from "react";

export function useAISuggest() {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (jobTitle: string, company: string) => {
    setLoading(true);
    setSuggestions(null);
    setError(null);

    try {
      const res = await fetch("https://dgtralqrsgmtqlyiivej.supabase.co/functions/v1/openai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, company }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch AI suggestions.");
      setSuggestions(data.suggestions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, error, fetchSuggestions, setSuggestions, setError };
}

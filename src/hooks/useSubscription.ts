
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    // Try to fetch the user's own subscription
    const fetch = async () => {
      // Use 'as any' to access subscriptions table missing from types
      const { data, error } = await (supabase as any)
        .from("subscriptions")
        .select("plan,status")
        .maybeSingle();

      // Consider pro if plan is 'pro' and status is 'active'
      if (!error && data?.plan === "pro" && data?.status === "active") {
        setIsPro(true);
      } else {
        setIsPro(false);
      }
    };
    fetch();
  }, []);

  return { isPro };
}

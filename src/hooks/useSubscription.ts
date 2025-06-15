
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    // Try to fetch the user's own subscription
    const fetch = async () => {
      const { data, error } = await supabase.from("subscriptions")
        .select("plan, status")
        .single();
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

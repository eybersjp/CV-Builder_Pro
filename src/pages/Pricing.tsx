
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const PLAN_CODE = "PLN_znso24tjat3dud3";

function useUserEmail() {
  // Fetch user profile for email (works if stored in 'profiles')
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    supabase.auth.getUser()
      .then(({ data: { user } }) => {
        if (mounted) setEmail(user?.email || null);
      });
    return () => { mounted = false; };
  }, []);

  return email;
}

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const email = useUserEmail();

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please sign in to continue.");
      return;
    }
    setLoading(true);
    let res: any;
    try {
      const { data, error } = await supabase.functions.invoke("initialize-paystack-transaction", {
        body: { email }
      });
      setLoading(false);
      if (error || !data?.authorization_url) {
        toast.error(data?.error || error?.message || "Could not start payment");
        return;
      }
      window.location.href = data.authorization_url;
    } catch (e) {
      setLoading(false);
      toast.error("Failed to start Paystack checkout");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-[80vh] bg-background p-4">
      <section className="w-full max-w-md rounded-xl border shadow-lg bg-white p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-3 text-blue-700">Upgrade to Pro</h1>
        <p className="text-gray-700 mb-6 text-center">
          Unlock every feature for serious job-seekers.
        </p>
        <div className="w-full mb-6">
          <div className="border border-blue-200 rounded-lg p-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-blue-700">₦7,000</span>
              <span className="text-lg font-medium text-gray-700">/month</span>
            </div>
            <ul className="mt-4 mb-0 list-disc pl-6 text-gray-700 text-sm space-y-1">
              <li>Unlimited Resumes</li>
              <li>AI-Powered Suggestions</li>
              <li>Access to all premium templates</li>
              <li>Export to Word, PDF, and TXT</li>
              <li>Priority support</li>
              <li>Cancel anytime</li>
            </ul>
          </div>
        </div>
        <button
          className="mt-2 px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
          onClick={handleSubscribe}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? <Loader className="animate-spin" /> : "Subscribe to Pro"}
        </button>
      </section>
    </main>
  );
};
export default Pricing;


import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Loader } from "lucide-react";

const PLAN_PRICE_ID = "price_1Ra5F4C4KygyFJqUEFW8zBoT";

const Pricing = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { price_id: PLAN_PRICE_ID },
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to create checkout session");
      return;
    }
    if (data?.url) {
      window.open(data.url, '_blank');
    }
  };

  return (
    <main className="flex justify-center items-center min-h-[80vh] bg-background p-4">
      <section className="w-full max-w-md rounded-xl border shadow-lg bg-white p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-3 text-blue-700">Upgrade to Pro</h1>
        <p className="text-gray-700 mb-6 text-center">
          Unlock unlimited AI suggestions, premium templates, and enhanced features.
        </p>
        <div className="w-full mb-6">
          <div className="border border-blue-200 rounded-lg p-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-blue-700">$9</span>
              <span className="text-lg font-medium text-gray-700">/month</span>
            </div>
            <ul className="mt-4 mb-0 list-disc pl-6 text-gray-700 text-sm space-y-1">
              <li>Unlimited AI content suggestions</li>
              <li>Access to all premium resume templates</li>
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
          {loading ? <Loader className="animate-spin" /> : "Subscribe"}
        </button>
      </section>
    </main>
  );
};

export default Pricing;

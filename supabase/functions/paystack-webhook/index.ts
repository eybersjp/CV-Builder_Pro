
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Paystack always posts JSON webhook
  const event = await req.json();

  // Verify: Only process successful charges, with required data
  if (
    event.event === "charge.success" &&
    event.data &&
    event.data.customer &&
    event.data.customer.email
  ) {
    const email = event.data.customer.email;
    const paystack_customer_code = event.data.customer.customer_code;
    const paystack_subscription_code = event.data.subscription
      ? event.data.subscription.subscription_code
      : null;

    // Find user_id for this email (because subscriptions table is by user_id)
    // Find in profiles table
    const { data: userProfile, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email) // If email column exists in profiles
      .maybeSingle();

    // If email isn't found in our DB, we can't update subscription
    if (userError || !userProfile?.id) {
      return new Response(
        JSON.stringify({ error: "User not found for webhook email" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Upsert subscription: if exists, update; if not, insert
    const { error: upsertErr } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: userProfile.id,
          plan: "pro",
          status: "active",
          stripe_customer_id: paystack_customer_code, // We'll use this to store the Paystack customer code
          // Optionally store paystack_subscription_code in a new column if you add one
        },
        { onConflict: ["user_id"] }
      );

    if (upsertErr) {
      return new Response(
        JSON.stringify({ error: upsertErr.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Ignore other event types
  return new Response(JSON.stringify({ ignored: true }), {
    status: 200,
    headers: corsHeaders,
  });
});

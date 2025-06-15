
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) throw new Error("STRIPE key missing in env");
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!endpointSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return new Response("Webhook Error", { status: 400, headers: corsHeaders });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // Retrieve customer id & metadata from session
      const stripe_customer_id = session.customer;
      const customer_email = session.customer_email || session.customer_details?.email;
      
      // Upsert into subscriptions table by matching on email; set plan = 'pro'
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Try to find user_id by email in users table
      let { data: users } = await supabaseClient
        .from("users")
        .select("id")
        .eq("email", customer_email);

      const user_id = users?.[0]?.id || null;

      // Upsert by user_id or email as available
      await supabaseClient
        .from("subscriptions")
        .upsert(
          {
            user_id,
            plan: "pro",
            status: "active",
            stripe_customer_id,
            current_period_end: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { onConflict: "user_id" }
        );
    }

    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Webhook fn error", err);
    return new Response("Webhook error", { status: 500, headers: corsHeaders });
  }
});

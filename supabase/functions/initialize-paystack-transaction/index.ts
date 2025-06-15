
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { email } = await req.json();

    if (!email)
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: corsHeaders }
      );

    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET_KEY)
      return new Response(
        JSON.stringify({ error: "Server missing Paystack key" }),
        { status: 500, headers: corsHeaders }
      );

    const body = {
      email,
      plan: "PLN_znso24tjat3dud3",
      channels: ["card"], // (optional: can add more)
      // Any additional params like metadata (user id/user email for matching)
    };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || !data.status)
      return new Response(
        JSON.stringify({ error: data.message || "Paystack error" }),
        { status: 400, headers: corsHeaders }
      );

    const { authorization_url, reference } = data.data;

    return new Response(
      JSON.stringify({ authorization_url, reference }),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message || "Failed to initialize payment" }),
      { status: 500, headers: corsHeaders }
    );
  }
});

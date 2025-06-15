
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobTitle, company } = await req.json();

    if (!openAIApiKey) throw new Error("OpenAI API Key is not configured");
    if (!jobTitle || !company) throw new Error("Missing fields");

    const prompt =
      `Write 3-4 professional, achievement-oriented resume bullet points for the following job:\n\n` +
      `Job Title: ${jobTitle}\nCompany: ${company}\n` +
      `The bullet points should be concise and start with strong action verbs.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer. Always answer with only the bullet points as Markdown list items (e.g., '- Managed...').",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ suggestions: text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("openai-suggest error:", error);
    return new Response(JSON.stringify({ error: error.message || error.toString() }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

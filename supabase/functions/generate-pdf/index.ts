
// Edge function: generate-pdf
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Fast in-memory css for resume PDF styles (update with design system as needed)
const resumeStyles = `
  body { font-family: Inter, Arial, sans-serif; margin: 0; padding: 0; background: #f9fafb; color: #111827; }
  .cv-container { background: #fff; margin: 24px auto; padding: 32px 40px; border-radius: 10px; width: 90%; max-width: 720px; box-shadow: 0 2px 16px #0001; }
  h2 { font-size: 1.25rem; margin-top: 16px; margin-bottom: 6px; }
  h3 { font-size: 1.075rem; margin-bottom: 5px; }
  .section { margin-bottom: 18px; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-pill { background: #dbeafe; color: #1d4ed8; font-size: 0.95em; padding: 4px 13px; border-radius: 999px; margin: 2px 2px 2px 0;}
  .subtle { color: #6b7280; font-size: 0.97em; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 18px 0; }
`;

// Simple template backgrounds/colors
const TEMPLATE_BG: Record<string, string> = {
  "Modern Blue": "#f0f7ff",
  "Sleek Grey": "#f4f4f6",
  "Tech Black": "#101012;color:white",
  "Code Green": "#f1fcf6",
  "Pro Tan": "#f8faf5"
};

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume } = await req.json();
    if (!resume || !resume.data) throw new Error("Missing resume data!");

    const data = resume.data;
    const tplName = (() => {
      // Allow some flexibility for template key/id (so, match defaults from ResumePreview)
      if (!data.template_id) return "Modern Blue";
      // Simple mapping if template_id contains template name
      for (const name of Object.keys(TEMPLATE_BG)) {
        if (data.template_id.includes(name)) return name;
      }
      return "Modern Blue";
    })();
    const bg = TEMPLATE_BG[tplName] || "#fff";
    // Prepare HTML (matches ResumePreview structure)
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>${resumeStyles}</style>
        </head>
        <body style="background:${bg};">
          <div class="cv-container">
            <h2 style="font-weight:700;font-size:1.6rem">${data.personalInfo?.fullName || "Your Name"}</h2>
            <div class="subtle">${data.personalInfo?.email || ""}${data.personalInfo?.phone ? " • " + data.personalInfo.phone : ""}</div>
            <div class="section" style="margin-top:9px">${data.personalInfo?.summary || ""}</div>
            <hr class="divider" />

            <div class="section">
              <h3 style="font-weight:600">Experience</h3>
              ${
                Array.isArray(data.experience) && data.experience.length
                  ? data.experience.map((item: any) =>
                      `<div style="margin-bottom:7px;">
                        <div style="font-weight:500">${item.jobTitle || ""} <span class="subtle">at ${item.company || ""}</span></div>
                        <div class="subtle">${item.startDate || ""} – ${item.endDate || ""}</div>
                        <div>${item.description || ""}</div>
                      </div>`
                    ).join("")
                  : `<span class="subtle">No experience listed.</span>`
              }
            </div>
            <hr class="divider" />

            <div class="section">
              <h3 style="font-weight:600">Education</h3>
              ${
                Array.isArray(data.education) && data.education.length
                  ? data.education.map((item: any) =>
                      `<div style="margin-bottom:7px;">
                        <div style="font-weight:500">${item.degree || ""} <span class="subtle">${item.institution || ""}</span></div>
                        <div class="subtle">${item.startDate || ""} – ${item.endDate || ""}</div>
                        <div>${item.details || ""}</div>
                      </div>`
                    ).join("")
                  : `<span class="subtle">No education listed.</span>`
              }
            </div>
            <hr class="divider" />

            <div class="section">
              <h3 style="font-weight:600">Skills</h3>
              <div class="skills-list">
              ${
                data.skills && data.skills.length
                  ? data.skills.map((s: string) => `<span class="skill-pill">${s}</span>`).join("")
                  : `<span class="subtle">No skills listed.</span>`
              }
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Puppeteer: render HTML to PDF
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: { width: 793, height: 1122 }, // Approx A4
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "24px", left: "0", right: "0", bottom: "24px" },
    });
    await browser.close();

    return new Response(pdfBuf, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume.pdf"`,
      },
    });
  } catch (e) {
    console.error("[generate-pdf error]", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

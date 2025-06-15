import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MultipartReader } from "https://deno.land/std@0.224.0/http/multipart_reader.ts";

// Read .pdf using pdf.js Deno port
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib?dts";

// Read .docx using docx-reading Deno module
import JSZip from "https://cdn.skypack.dev/jszip?dts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function extractTextFromPDF(buffer: Uint8Array): Promise<string> {
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    let text = "";
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      text += page.getTextContent().items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  } catch (err) {
    throw new Error("Failed to extract text from PDF: " + (err?.message ?? err));
  }
}

async function extractTextFromDocx(buffer: Uint8Array): Promise<string> {
  // This is a very minimal DOCX to text extractor (looks for document.xml and pulls text nodes)
  try {
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")?.async("string");
    if (!documentXml) throw new Error("Could not find main DOCX XML.");
    // Very naive plain text extraction:
    const matches = documentXml.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    return matches ? matches.map((m) => m.replace(/<[^>]+>/g, "")).join(" ") : "";
  } catch (err) {
    throw new Error("Failed to extract text from DOCX: " + (err?.message ?? err));
  }
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

async function parseMultipartForm(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
  if (!boundaryMatch) throw new Error("Content-Type does not contain a boundary.");
  const boundary = boundaryMatch[1];
  const body = await req.arrayBuffer();
  const mr = new MultipartReader(new Deno.Buffer(new Uint8Array(body)), boundary);
  const form = await mr.readForm();
  const file = form.file("file");
  if (!file) throw new Error("No file uploaded.");
  const filename = file.filename ?? "upload";
  const ext = getFileExtension(filename);
  if (!(ext === "pdf" || ext === "docx")) throw new Error("Only .pdf and .docx files are supported.");
  const fileContent = await Deno.readFile(file.filename);
  return { buffer: fileContent, ext, filename };
}

function getResumePrompt(extractedText: string) {
  // Resume fields must match src/types/index.ts
  return `
You are an expert recruiter and ATS expert. Carefully extract the following from the provided resume text.

Return BACK ONLY this JSON:

{
  personalInfo: { fullName: string, email: string, phone: string, summary: string },
  experience: Array<{ id: string, jobTitle: string, company: string, startDate: string, endDate: string, description: string }>,
  education: Array<{ id: string, degree: string, institution: string, startDate: string, endDate: string, details: string }>,
  skills: string[]
}

Field rules:
- For experience and education, create a unique id for each (e.g., using a hash or random string).
- string fields may be empty if not present.
- summary is a brief professional summary/objective, not the whole resume.
- skills is an array of short skill names.
- Use ISO 8601 months (YYYY-MM) for dates if possible (otherwise best effort).
- Respond with only valid compact JSON matching this type. Do NOT explain or add comments.

Resume to parse:
---
${extractedText}
---
`;
}

async function callOpenAIForResume(text: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openAIApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert recruiter and resume parser.",
        },
        {
          role: "user",
          content: getResumePrompt(text),
        },
      ],
      max_tokens: 2048,
      temperature: 0.2,
    }),
  });
  if (!response.ok) {
    const txt = await response.text();
    throw new Error("OpenAI error: " + txt);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST is allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Content-Type must be multipart/form-data" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Parse file upload
    const boundary = contentType.split("boundary=")[1];
    const body = await req.arrayBuffer();
    const mr = new MultipartReader(new Deno.Buffer(new Uint8Array(body)), boundary);
    const form = await mr.readForm();
    const uploadFile = form.file("file");
    if (!uploadFile) {
      return new Response(JSON.stringify({ error: "No file uploaded. Please include a file in form field 'file'." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const filename = uploadFile.filename ?? "uploaded";
    const ext = getFileExtension(filename);
    if (!(ext === "pdf" || ext === "docx")) {
      return new Response(JSON.stringify({ error: "Unsupported file type. Only .pdf and .docx are accepted." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const fileContent = await uploadFile.readAll();

    // Extract text content
    let extractedText = "";
    if (ext === "pdf") {
      extractedText = await extractTextFromPDF(fileContent);
    } else if (ext === "docx") {
      extractedText = await extractTextFromDocx(fileContent);
    }
    if (!extractedText || !extractedText.trim()) {
      return new Response(JSON.stringify({ error: "Failed to extract text from file." }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Call OpenAI for parsing
    const openAIResponse = await callOpenAIForResume(extractedText);

    // Parse response and ensure structure
    try {
      const parsed = JSON.parse(openAIResponse);
      // Just echo, front-end will validate by Resume type
      return new Response(JSON.stringify({ resume: parsed }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to process OpenAI response: " + err?.message, result: openAIResponse }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

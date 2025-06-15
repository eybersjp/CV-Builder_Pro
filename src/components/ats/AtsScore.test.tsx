
import { describe, it, expect } from "vitest";
import { keywordMatchScore, resumeTextFromData } from "./AtsScore";

// Mock test resume and job description
describe("AtsScore - keywordMatchScore", () => {
  it("returns 0 if no keywords match", () => {
    expect(keywordMatchScore("Hello world", "engineer developer")).toBe(0);
  });

  it("gives 100 if all keywords in job description are present in resume", () => {
    expect(keywordMatchScore("engineer developer", "developer engineer")).toBe(100);
  });

  it("returns correct percentage for partial match", () => {
    expect(keywordMatchScore("developer", "developer engineer manager")).toBe(Math.round(1 / 3 * 100));
  });

  it("is case-insensitive", () => {
    expect(keywordMatchScore("Engineer", "engineer")).toBe(100);
  });

  it("ignores duplicate words in job description", () => {
    expect(keywordMatchScore("developer", "developer developer DEVELOPER")).toBe(100);
  });

  it("returns 0 for empty input", () => {
    expect(keywordMatchScore("", "engineer")).toBe(0);
    expect(keywordMatchScore("resume", "")).toBe(0);
  });
});

describe("AtsScore - resumeTextFromData", () => {
  it("combines all text sections", () => {
    const d = {
      personalInfo: { fullName: "John Doe", summary: "Enthusiastic Developer" },
      experience: [
        { jobTitle: "Developer", company: "Tech", description: "Worked on X" }
      ],
      education: [
        { degree: "BS", institution: "Univ", details: "CompSci" }
      ],
      skills: ["React", "TypeScript"]
    };
    const result = resumeTextFromData(d);
    expect(result).toContain("John Doe");
    expect(result).toContain("Enthusiastic Developer");
    expect(result).toContain("Developer");
    expect(result).toContain("Tech");
    expect(result).toContain("CompSci");
    expect(result).toContain("React");
    expect(result).toContain("TypeScript");
  });

  it("returns empty string if no data", () => {
    expect(resumeTextFromData(null)).toBe("");
  });
});

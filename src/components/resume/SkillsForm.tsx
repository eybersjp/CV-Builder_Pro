
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SKILL_PLACEHOLDER = [
  "JavaScript", "Public Speaking", "Project Management", "Salesforce"
];

const SkillsForm: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);

  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder={`E.g. ${SKILL_PLACEHOLDER[0]}`}
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
        />
        <Button variant="outline" type="button" onClick={addSkill}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && (
          <span className="text-muted-foreground">No skills added yet.</span>
        )}
        {skills.map(skill => (
          <span key={skill} className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full flex items-center gap-1">
            {skill}
            <Button
              variant="ghost"
              size="icon"
              className="p-0 ml-1"
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
            >
              ×
            </Button>
          </span>
        ))}
      </div>
    </section>
  );
};

export default SkillsForm;

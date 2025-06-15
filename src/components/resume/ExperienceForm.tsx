
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResume } from "@/contexts/ResumeContext";

const defaultExperience = {
  id: "",
  jobTitle: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
};

const ExperienceForm: React.FC = () => {
  const { resume, updateSection } = useResume();
  const experience: any[] = Array.isArray(resume?.data?.experience) ? resume.data.experience : [];

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    updateSection("experience", updated);
  };

  const addExperience = () => {
    updateSection("experience", [
      ...experience,
      { ...defaultExperience, id: Date.now().toString() },
    ]);
  };

  const removeExperience = (index: number) => {
    updateSection("experience", experience.filter((_: any, i: number) => i !== index));
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Experience</h2>
        <Button variant="outline" size="sm" type="button" onClick={addExperience}>Add</Button>
      </div>
      <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
        {experience.length === 0 && (
          <span className="text-muted-foreground">No experience added yet.</span>
        )}
        {experience.map((item: any, idx: number) => (
          <div key={item.id} className="border rounded-lg p-4 flex flex-col gap-3 bg-muted/30 relative">
            <Button
              variant="destructive"
              size="sm"
              type="button"
              className="absolute top-2 right-2"
              onClick={() => removeExperience(idx)}
            >
              Remove
            </Button>
            <Input
              name="jobTitle"
              placeholder="Job Title"
              value={item.jobTitle}
              onChange={e => handleChange(idx, e)}
            />
            <Input
              name="company"
              placeholder="Company"
              value={item.company}
              onChange={e => handleChange(idx, e)}
            />
            <div className="flex gap-2">
              <Input
                name="startDate"
                type="month"
                placeholder="Start Date (YYYY-MM)"
                value={item.startDate}
                onChange={e => handleChange(idx, e)}
              />
              <Input
                name="endDate"
                type="month"
                placeholder="End Date (YYYY-MM or Present)"
                value={item.endDate}
                onChange={e => handleChange(idx, e)}
              />
            </div>
            <Textarea
              name="description"
              placeholder="Describe your responsibilities, achievements, etc."
              value={item.description}
              onChange={e => handleChange(idx, e)}
              rows={3}
            />
          </div>
        ))}
      </form>
    </section>
  );
};

export default ExperienceForm;

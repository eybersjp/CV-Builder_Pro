
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResume } from "@/contexts/ResumeContext";

const defaultEducation = {
  id: "",
  degree: "",
  institution: "",
  startDate: "",
  endDate: "",
  details: "",
};

const EducationForm: React.FC = () => {
  const { resume, updateSection } = useResume();
  const education: any[] = Array.isArray(resume?.data?.education) ? resume.data.education : [];

  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = [...education];
    updated[idx] = {
      ...updated[idx],
      [e.target.name]: e.target.value,
    };
    updateSection("education", updated);
  };

  const addEducation = () => {
    updateSection("education", [
      ...education,
      { ...defaultEducation, id: Date.now().toString() },
    ]);
  };

  const removeEducation = (idx: number) => {
    updateSection("education", education.filter((_: any, i: number) => i !== idx));
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button variant="outline" size="sm" type="button" onClick={addEducation}>Add</Button>
      </div>
      <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
        {education.length === 0 && (
          <span className="text-muted-foreground">No education history yet.</span>
        )}
        {education.map((item: any, idx: number) => (
          <div key={item.id} className="border rounded-lg p-4 flex flex-col gap-3 bg-muted/30 relative">
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              type="button"
              onClick={() => removeEducation(idx)}
            >
              Remove
            </Button>
            <Input
              name="degree"
              placeholder="Degree (e.g. B.S. Computer Science)"
              value={item.degree}
              onChange={e => handleChange(idx, e)}
            />
            <Input
              name="institution"
              placeholder="Institution"
              value={item.institution}
              onChange={e => handleChange(idx, e)}
            />
            <div className="flex gap-2">
              <Input
                name="startDate"
                type="month"
                placeholder="Start Date"
                value={item.startDate}
                onChange={e => handleChange(idx, e)}
              />
              <Input
                name="endDate"
                type="month"
                placeholder="End Date"
                value={item.endDate}
                onChange={e => handleChange(idx, e)}
              />
            </div>
            <Textarea
              name="details"
              placeholder="Additional details (honors, GPA, etc.)"
              value={item.details}
              onChange={e => handleChange(idx, e)}
              rows={2}
            />
          </div>
        ))}
      </form>
    </section>
  );
};

export default EducationForm;

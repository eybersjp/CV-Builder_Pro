
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useResume } from "@/contexts/ResumeContext";

const defaultPersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  summary: "",
};

const PersonalInfoForm: React.FC = () => {
  const { resume, updateSection } = useResume();
  const personalInfo = resume?.data?.personalInfo ?? defaultPersonalInfo;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateSection("personalInfo", { ...personalInfo, [e.target.name]: e.target.value });
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <form className="grid gap-4" onSubmit={e => e.preventDefault()}>
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Your full name"
            value={personalInfo.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            value={personalInfo.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="(555) 123-4567"
            value={personalInfo.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            name="summary"
            placeholder="Professional summary or objective"
            value={personalInfo.summary}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </form>
    </section>
  );
};

export default PersonalInfoForm;

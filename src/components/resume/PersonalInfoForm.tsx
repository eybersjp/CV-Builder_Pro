
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
}

const defaultPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  summary: "",
};

const PersonalInfoForm: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  // For demonstration, on submit show alert (will remove in real integration)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Personal Info: " + JSON.stringify(personalInfo, null, 2));
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
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
        <Button type="submit" className="w-fit">Save Personal Info</Button>
      </form>
    </section>
  );
};

export default PersonalInfoForm;


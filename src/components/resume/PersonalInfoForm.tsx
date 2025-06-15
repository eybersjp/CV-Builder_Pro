
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const [info, setInfo] = useState<PersonalInfo>(defaultPersonalInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid gap-4">
        <Input
          label="Full Name"
          name="fullName"
          placeholder="Your full name"
          value={info.fullName}
          onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          placeholder="you@example.com"
          value={info.email}
          onChange={handleChange}
        />
        <Input
          label="Phone"
          name="phone"
          placeholder="(555) 123-4567"
          value={info.phone}
          onChange={handleChange}
        />
        <Textarea
          name="summary"
          placeholder="Professional summary or objective"
          value={info.summary}
          onChange={handleChange}
          rows={3}
        />
      </div>
    </section>
  );
};

export default PersonalInfoForm;


import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResume } from "@/contexts/ResumeContext";
import { Sparkles, Loader, ClipboardCopy } from "lucide-react";
import { useAISuggest } from "@/hooks/useAISuggest";
import Modal from "../ui/Modal";

interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

const defaultExperience: ExperienceItem = {
  id: "",
  jobTitle: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
};

const ExperienceForm: React.FC = () => {
  const { resume, updateSection } = useResume();
  const experience: ExperienceItem[] = resume?.data?.experience || [];

  const setExperienceList = (list: ExperienceItem[]) => {
    updateSection("experience", list);
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = [...experience];
    updated[index] = {
      ...updated[index],
      [e.target.name]: e.target.value,
    };
    setExperienceList(updated);
  };

  const addExperience = () => {
    setExperienceList([
      ...experience,
      { ...defaultExperience, id: Date.now().toString() },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperienceList(experience.filter((_, i) => i !== index));
  };

  // For AI Suggest modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const { suggestions, loading, error, fetchSuggestions, setSuggestions, setError } = useAISuggest();

  const handleAISuggest = (idx: number) => {
    const exp = experience[idx];
    if (!exp.jobTitle || !exp.company) {
      setSuggestions(null);
      setError("Please enter both Job Title and Company first.");
      setModalOpen(true);
      setModalIdx(idx);
      return;
    }
    setSuggestions(null);
    setModalOpen(true);
    setModalIdx(idx);
    fetchSuggestions(exp.jobTitle, exp.company);
  };

  const handleCopy = () => {
    if (!suggestions) return;
    navigator.clipboard.writeText(suggestions.replace(/^- /gm, "")).catch(() => {});
  };

  const closeModal = () => {
    setModalOpen(false);
    setSuggestions(null);
    setError(null);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Experience</h2>
        <Button variant="outline" size="sm" type="button" onClick={addExperience}>Add</Button>
      </div>
      <div className="flex flex-col gap-6">
        {experience.length === 0 && (
          <span className="text-muted-foreground">No experience added yet.</span>
        )}
        {experience.map((item, idx) => (
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
            <div className="relative">
              <Textarea
                name="description"
                placeholder="Describe your responsibilities, achievements, etc."
                value={item.description}
                onChange={e => handleChange(idx, e)}
                rows={3}
              />
              <Button
                type="button"
                className="absolute top-1 right-1"
                size="sm"
                variant="secondary"
                tabIndex={-1}
                onClick={() => handleAISuggest(idx)}
                aria-label="AI Suggest"
              >
                <Sparkles className="mr-1 h-4 w-4" /> AI Suggest
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="AI Suggestions"
      >
        {loading ? (
          <div className="flex gap-2 items-center py-8 justify-center text-muted-foreground">
            <Loader className="animate-spin" /> Generating suggestions...
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : suggestions ? (
          <div>
            <div
              className="whitespace-pre-line mb-4"
              style={{ fontFamily: "Inter, sans-serif" }}
              dangerouslySetInnerHTML={{
                __html: suggestions
                  .replace(/^- /gm, "<li>")
                  .replace(/\n/g, "</li>\n")
                  .replace(/<li><\/li>/g, '') // remove empty
                  .replace(/^/, "<ul class='list-disc pl-5'>")
                  .replace(/$/, "</ul>")
              }}
            />
            <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2">
              <ClipboardCopy className="h-4 w-4" /> Copy All
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground">Suggestions will appear here.</span>
        )}
      </Modal>
    </section>
  );
};

export default ExperienceForm;

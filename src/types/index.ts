
export interface Resume {
  id: string;
  user_id: string;
  title: string;
  data: Record<string, any> | null; // For experience, education, skills, etc.
  created_at: string | null;
  updated_at: string | null;
}

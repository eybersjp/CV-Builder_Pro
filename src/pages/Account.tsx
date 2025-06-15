
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
};

const Account = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "" });

  useEffect(() => {
    let ignore = false;
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      // get the email
      const email = user.email;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!ignore && data) {
        setProfile({ ...data, email });
        setForm({ first_name: data.first_name ?? "", last_name: data.last_name ?? "" });
      }
      if (error) {
        toast({ title: "Profile Error", description: error.message, variant: "destructive" });
      }
      setLoading(false);
    };
    fetchProfile();
    return () => { ignore = true; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Updated", description: "Your profile information was updated." });
      setProfile({ ...profile, ...form });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }
  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">No profile found.</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-lg bg-card shadow-lg rounded-lg p-8 border">
        <h2 className="text-2xl font-bold mb-4">Account</h2>
        <form className="space-y-5" onSubmit={handleSave}>
          <div>
            <label className="block mb-1 text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" value={profile.email ?? ""} readOnly className="bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="first_name">First Name</label>
              <Input
                id="first_name"
                name="first_name"
                required
                value={form.first_name}
                onChange={handleChange}
                disabled={saving}
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="last_name">Last Name</label>
              <Input
                id="last_name"
                name="last_name"
                required
                value={form.last_name}
                onChange={handleChange}
                disabled={saving}
                autoComplete="family-name"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Account;

import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

type AuthMode = "login" | "signup";

const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", first_name: "", last_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "signup") {
      // sign up: send extra profile fields in metadata
      const { email, password, first_name, last_name } = form;
      const redirectUrl = `${window.location.origin}/dashboard`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name, last_name },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setError(error.message);
        toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sign Up Successful", description: "Check your email to confirm your account!" });
        setTimeout(() => navigate("/dashboard"), 1600);
      }
    } else {
      // login
      const { email, password } = form;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        toast({ title: "Sign In Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!" });
        setTimeout(() => navigate("/dashboard"), 1200);
      }
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {mode === "signup" && (
        <div className="grid grid-cols-2 gap-3">
          <Input
            name="first_name"
            aria-label="First name"
            placeholder="First name"
            value={form.first_name}
            onChange={onChange}
            required
            disabled={loading}
            autoComplete="given-name"
          />
          <Input
            name="last_name"
            aria-label="Last name"
            placeholder="Last name"
            value={form.last_name}
            onChange={onChange}
            required
            disabled={loading}
            autoComplete="family-name"
          />
        </div>
      )}
      <Input
        type="email"
        name="email"
        aria-label="Email address"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
        autoComplete="email"
        required
        disabled={loading}
      />
      <Input
        type="password"
        name="password"
        aria-label="Password"
        placeholder="Password"
        value={form.password}
        onChange={onChange}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        required
        minLength={6}
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
        variant="default"
      >
        {loading ? (mode === "login" ? "Signing In..." : "Signing Up...") : (mode === "login" ? "Sign In" : "Sign Up")}
      </Button>
      {error && <div className="text-destructive text-sm text-center">{error}</div>}
    </form>
  );
};

export default AuthForm;

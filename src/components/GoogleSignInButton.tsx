
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const GoogleSignInButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl }
    });
    if (error) {
      toast({ title: "Google Sign In Failed", description: error.message, variant: "destructive" });
    }
    // On success, Supabase redirects -- so we don't need post-action code here.
    setLoading(false);
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 border border-input bg-background text-foreground hover:bg-accent"
      variant="outline"
      type="button"
      aria-label="Sign in with Google"
    >
      <span className="text-lg"><FcGoogle /></span>
      {loading ? "Connecting..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleSignInButton;

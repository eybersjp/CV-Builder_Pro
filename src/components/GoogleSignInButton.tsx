
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import GoogleIcon from "@/components/GoogleIcon";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const GoogleSignInButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl }
    });
    if (error) {
      toast({ title: "Google Sign In Failed", description: error.message, variant: "destructive" });
    }
    setLoading(false);
    // On success, Supabase will redirect, so no navigation needed.
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 border border-input font-medium text-base py-2 bg-white hover:bg-gray-50 text-foreground shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
      type="button"
      aria-label="Sign in with Google"
      variant="outline"
      tabIndex={0}
    >
      <GoogleIcon size={22} />
      {loading ? "Connecting to Google..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleSignInButton;

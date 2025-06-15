
import React, { useState } from "react";
import AuthForm from "@/components/AuthForm";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-2 font-inter">
      <div className="w-full max-w-md bg-card shadow-lg rounded-lg p-6 md:p-8 space-y-6 border">
        {/* Brand & welcome */}
        <div className="flex flex-col items-center mb-2 space-y-2">
          <img src="/placeholder.svg" alt="CV-Builder Pro" className="h-12" />
          <h2 className="text-2xl font-semibold text-foreground mt-1">
            Welcome to CV-Builder Pro
          </h2>
          <p className="text-base text-muted-foreground">
            Professional, ATS-ready resumes in minutes
          </p>
        </div>

        {/* Tabs navigation */}
        <div className="flex justify-center mb-2">
          <button
            aria-label="Sign In"
            className={`flex-1 px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors
              ${mode === "login"
                ? "bg-background text-primary border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:bg-accent"}`}
            onClick={() => setMode("login")}
            disabled={mode === "login"}
            type="button"
          >
            Log In
          </button>
          <button
            aria-label="Sign Up"
            className={`flex-1 px-4 py-2 rounded-t-md font-medium border-b-2 transition-colors
              ${mode === "signup"
                ? "bg-background text-primary border-primary"
                : "bg-muted text-muted-foreground border-transparent hover:bg-accent"}`}
            onClick={() => setMode("signup")}
            disabled={mode === "signup"}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <div className="rounded-b-md bg-card pt-2">
          <AuthForm mode={mode} />
        </div>

        {/* Divider */}
        <div className="flex items-center my-2">
          <hr className="flex-1 border-muted" />
          <span className="mx-2 text-muted-foreground text-sm whitespace-nowrap">or</span>
          <hr className="flex-1 border-muted" />
        </div>

        {/* Google Auth (for BOTH flows) */}
        <GoogleSignInButton />

        {/* Demo note */}
        <div className="text-xs text-muted-foreground text-center mt-3">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default Auth;

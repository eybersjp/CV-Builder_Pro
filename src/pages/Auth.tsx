
import React, { useState } from "react";
import AuthForm from "@/components/AuthForm";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card shadow-lg rounded-lg p-8 space-y-8 border">
        <div className="flex justify-center mb-4">
          <img src="/placeholder.svg" alt="CV-Builder Pro" className="h-12" />
        </div>
        <div className="flex justify-center space-x-2">
          <button
            aria-label="Sign In"
            className={`px-4 py-2 rounded ${mode === "login" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
            onClick={() => setMode("login")}
            disabled={mode === "login"}
          >Sign In</button>
          <button
            aria-label="Sign Up"
            className={`px-4 py-2 rounded ${mode === "signup" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
            onClick={() => setMode("signup")}
            disabled={mode === "signup"}
          >Sign Up</button>
        </div>
        <AuthForm mode={mode} />
        <div className="flex items-center my-4">
          <hr className="flex-1 border-muted" />
          <span className="mx-2 text-muted-foreground text-sm">or</span>
          <hr className="flex-1 border-muted" />
        </div>
        <GoogleSignInButton />
      </div>
    </div>
  );
};

export default Auth;

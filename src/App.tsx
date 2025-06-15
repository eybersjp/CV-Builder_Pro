
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import LandingPage from "./pages/LandingPage";
import React, { Suspense, lazy } from "react";

// Lazy load heavy pages
const Editor = lazy(() => import("./pages/Editor"));
const Templates = lazy(() => import("./pages/Templates"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/editor/:id"
            element={
              <Suspense fallback={<div className="flex justify-center items-center py-24 text-lg">Loading Editor…</div>}>
                <Editor />
              </Suspense>
            }
          />
          <Route
            path="/templates"
            element={
              <Suspense fallback={<div className="flex justify-center items-center py-24 text-lg">Loading Templates…</div>}>
                <Templates />
              </Suspense>
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

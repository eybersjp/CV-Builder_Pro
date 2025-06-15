
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LayoutTemplate, BadgeCheck, ArrowRight, FileText, Wand2, Download, User } from "lucide-react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Templates", href: "#templates" },
  { name: "Pricing", href: "/pricing" },
];

const features = [
  {
    title: "AI-Powered Suggestions",
    icon: Wand2,
    description: "Get personalized resume content and bullet points tailored to your experience and job goals.",
  },
  {
    title: "Professional Templates",
    icon: LayoutTemplate,
    description: "Choose from 10+ modern, ATS-friendly templates that make your resume stand out.",
  },
  {
    title: "ATS Optimization",
    icon: BadgeCheck,
    description: "Your resume is optimized for Applicant Tracking Systems to boost your interview chances.",
  },
];

const howSteps = [
  {
    step: "1. Choose a Template",
    icon: LayoutTemplate,
    text: "Pick from a selection of professionally designed templates."
  },
  {
    step: "2. Add Your Details with AI Help",
    icon: Sparkles,
    text: "Let our AI guide you to craft perfect achievements and summaries."
  },
  {
    step: "3. Download Your Resume",
    icon: Download,
    text: "Export your resume in PDF, Word, or TXT formats instantly."
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      {/* Header/Nav */}
      <header className="w-full border-b bg-white/90 sticky top-0 z-30">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <span>
              <img src="/logo.png" alt="CV-Builder Pro logo" className="h-9 w-9 md:h-11 md:w-11 object-contain rounded-[6px]" />
            </span>
            CV-Builder Pro
          </Link>
          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.href.startsWith("/") ? (
                  <Link to={link.href} className="text-base text-foreground hover:text-primary transition">{link.name}</Link>
                ) : (
                  <a href={link.href} className="text-base text-foreground hover:text-primary transition">{link.name}</a>
                )}
              </li>
            ))}
            <Link to="/auth" className="px-4 py-2 rounded-md text-sm font-semibold text-foreground hover:bg-accent border border-border ml-2">
              Log In
            </Link>
            <Link to={{ pathname: "/auth" }} className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary ml-2 shadow hover:bg-primary/90 transition">
              Sign Up
            </Link>
          </ul>
          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/auth" className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-primary shadow hover:bg-primary/90 transition">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-16 bg-[linear-gradient(120deg,rgba(59,130,246,0.13)_0%,rgba(240,246,255,0.27)_100%)]">
        <h1 className="text-[2.5rem] md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Create Your Professional Resume in Minutes
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          Our AI-powered platform helps you build ATS-optimized resumes that land interviews.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-primary text-white text-lg font-semibold shadow-lg hover:bg-primary/90 transition-all"
        >
          Create My Resume for Free
          <ArrowRight className="ml-1" size={20} />
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Why Choose CV-Builder Pro?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {features.map(({ title, icon: Icon, description }) => (
            <div
              className="bg-white rounded-lg shadow-md px-6 py-8 flex flex-col items-center gap-4 border"
              key={title}
            >
              <span className="flex items-center justify-center rounded-full bg-blue-100 text-primary mb-2" aria-label={title}>
                <Icon size={36} strokeWidth={2} />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-base text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-blue-50/70 px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">How It Works</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {howSteps.map(({ step, icon: Icon, text }, i) => (
            <div className="flex flex-col items-center text-center" key={step}>
              <span className="mb-4 flex items-center justify-center h-16 w-16 bg-primary rounded-full text-white shadow">
                <Icon size={32} />
              </span>
              <h4 className="text-lg font-bold mb-1">{step}</h4>
              <p className="text-base text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="flex flex-col items-center justify-center px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Ready to Land Your Dream Job?
        </h2>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-primary text-white text-lg font-semibold shadow-lg hover:bg-primary/90 transition-all"
        >
          Create My Resume for Free
          <ArrowRight className="ml-1" size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t bg-white/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div>&copy; {new Date().getFullYear()} CV-Builder Pro</div>
          <div className="flex gap-3">
            <a href="/privacy-policy" className="hover:text-primary underline transition">Privacy Policy</a>
            <span>/</span>
            <a href="/terms-of-service" className="hover:text-primary underline transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

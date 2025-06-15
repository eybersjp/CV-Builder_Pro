
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Templates", href: "/templates" },
  { name: "Pricing", href: "/pricing" },
];

const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setLoggedIn(!!session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setLoggedIn(!!session);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="flex items-center py-4 px-6 border-b border-border bg-background min-h-14 w-full">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold text-primary tracking-tight hover:opacity-80 transition focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
        aria-label="CV-Builder Pro Home"
      >
        <img
          src="/logo.png"
          alt="CV-Builder Pro logo"
          className="h-9 w-9 md:h-10 md:w-10 object-contain"
          style={{ borderRadius: 6 }}
        />
        <span className="hidden md:inline">CV-Builder Pro</span>
      </Link>
      <nav
        className="ml-8 flex items-center gap-4 flex-1"
        aria-label="Main navigation"
      >
        {navLinks.map((link) =>
          link.href.startsWith("/") ? (
            <Link
              key={link.name}
              to={link.href}
              className={`text-base font-medium text-foreground hover:text-primary transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                location.pathname.startsWith(link.href) ? "underline" : ""
              }`}
              tabIndex={0}
              aria-current={location.pathname === link.href ? "page" : undefined}
            >
              {link.name}
            </Link>
          ) : (
            <a
              key={link.name}
              href={link.href}
              className="text-base font-medium text-foreground hover:text-primary transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              tabIndex={0}
              aria-label={link.name}
            >
              {link.name}
            </a>
          )
        )}
      </nav>
      <div className="flex items-center gap-2">
        {loggedIn ? (
          <>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-md text-sm font-semibold text-foreground hover:bg-accent border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                location.pathname.startsWith("/dashboard") ? "underline" : ""
              }`}
              tabIndex={0}
              aria-current={
                location.pathname.startsWith("/dashboard") ? "page" : undefined
              }
              aria-label="Go to Dashboard"
            >
              Dashboard
            </Link>
            <Button
              variant="outline"
              className="px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              type="button"
              onClick={handleSignOut}
              aria-label="Sign Out"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              className="px-4 py-2 rounded-md text-sm font-semibold text-foreground hover:bg-accent border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              tabIndex={0}
              aria-label="Log In"
            >
              Log In
            </Link>
            <Link
              to="/auth"
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary ml-2 shadow hover:bg-primary/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              tabIndex={0}
              aria-label="Sign Up"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

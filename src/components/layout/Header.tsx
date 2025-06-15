
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setLoggedIn(!!session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) setLoggedIn(!!session);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="flex items-center py-4 px-6 border-b border-border bg-background min-h-14 w-full">
      {/* App Logo/Name */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary tracking-tight hover:opacity-80 transition">
        <img
          src="/logo.png"
          alt="CV-Builder Pro logo"
          className="h-9 w-9 md:h-10 md:w-10 object-contain"
          style={{ borderRadius: 6 }}
        />
        <span className="hidden sm:inline">CV-Builder Pro</span>
      </Link>
      <nav className="ml-8 flex items-center gap-4 flex-1">
        {loggedIn && (
          <Link
            to="/dashboard"
            className={`text-base font-medium text-foreground hover:text-primary transition ${
              location.pathname.startsWith("/dashboard") ? "underline" : ""
            }`}
            aria-current={location.pathname === "/dashboard" ? "page" : undefined}
          >
            Dashboard
          </Link>
        )}
        {/* Add more navigation links here if needed */}
      </nav>
    </header>
  );
};

export default Header;

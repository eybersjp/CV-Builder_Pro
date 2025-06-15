
import React from "react";
import { useSubscription } from "@/hooks/useSubscription";

// HOC that only renders the child if user is pro; else shows a fallback or prompt
const withProGuard = (Component: React.ComponentType<any>, Fallback?: React.ReactNode) => {
  return function Wrapped(props: any) {
    const { isPro } = useSubscription();
    if (isPro === null) return <div>Checking subscription...</div>;
    if (!isPro)
      return (
        Fallback || 
        <div className="text-center p-6">
          <h2 className="font-bold mb-1">Upgrade to Pro</h2>
          <p className="text-muted-foreground mb-4">
            This feature requires a Pro subscription.
          </p>
          <a className="btn bg-blue-600 text-white px-4 py-2 rounded" href="/pricing">
            Go to Pricing
          </a>
        </div>
      );
    return <Component {...props} />;
  };
};

export default withProGuard;

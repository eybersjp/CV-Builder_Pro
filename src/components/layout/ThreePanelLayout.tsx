
import React from "react";

interface ThreePanelLayoutProps {
  leftSidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightPreview: React.ReactNode;
}

const ThreePanelLayout: React.FC<ThreePanelLayoutProps> = ({
  leftSidebar,
  mainContent,
  rightPreview,
}) => (
  <div className="flex flex-col min-h-screen md:flex-row bg-background">
    {/* Left sidebar */}
    <aside className="w-full md:w-1/5 bg-sidebar px-4 py-6 border-b md:border-b-0 md:border-r border-border">
      {leftSidebar}
    </aside>
    {/* Main panel */}
    <main className="w-full md:w-3/5 px-4 py-6">
      {mainContent}
    </main>
    {/* Right preview panel */}
    <section className="w-full md:w-1/5 bg-muted/60 px-4 py-6 border-t md:border-t-0 md:border-l border-border">
      {rightPreview}
    </section>
  </div>
);

export default ThreePanelLayout;

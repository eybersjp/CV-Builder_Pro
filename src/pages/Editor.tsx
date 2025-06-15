
import React from "react";
import { useParams } from "react-router-dom";
import ThreePanelLayout from "@/components/layout/ThreePanelLayout";

const Editor = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <ThreePanelLayout
      leftSidebar={<div className="text-center">Left Sidebar</div>}
      mainContent={
        <div>
          <h1 className="text-2xl font-bold mb-3">Editor for Resume ID: {id}</h1>
          <div className="text-muted-foreground">Editor main content area.</div>
        </div>
      }
      rightPreview={<div className="text-center">Live Preview</div>}
    />
  );
};

export default Editor;

import React from "react";
import Header from "@/components/layout/Header";

const Settings = () => {
  return (
    <>
      <Header />
      {/* You can add your settings UI here */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>This is the settings page content.</p>
      </div>
    </>
  );
};

export default Settings;

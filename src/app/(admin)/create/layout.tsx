"use client";

import React from "react";
import { Navbar } from "./_components/Navbar";

// Create context for tab state
interface TabContextType {
  activeTab: "content" | "seo" | "blog";
  setActiveTab: (tab: "content" | "seo" | "blog") => void;
  seoBadge: { count: number; total: number };
  setSeoBadge: (badge: { count: number; total: number }) => void;
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
}

const TabContext = React.createContext<TabContextType | null>(null);

export const useTabContext = () => {
  const context = React.useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext must be used within TabProvider");
  }
  return context;
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = React.useState<"content" | "seo" | "blog">(
    () => {
      if (typeof window !== "undefined") {
        const savedTab = localStorage.getItem("pageEditorTab");
        return savedTab === "seo" || savedTab === "blog" ? savedTab : "content";
      }
      return "content";
    }
  );
  const [seoBadge, setSeoBadge] = React.useState({ count: 0, total: 4 });
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(
    null
  );

  const contextValue = {
    activeTab,
    setActiveTab,
    seoBadge,
    setSeoBadge,
    selectedPageId,
    setSelectedPageId,
  };

  return (
    <TabContext.Provider value={contextValue}>
      <div className="relative h-screen bg-zinc-950">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          seoBadge={seoBadge}
          selectedPageId={selectedPageId}
        />
        <main className="w-full bg-zinc-950 transition-all duration-300 ease-in-out pt-14">
          {children}
        </main>
      </div>
    </TabContext.Provider>
  );
}

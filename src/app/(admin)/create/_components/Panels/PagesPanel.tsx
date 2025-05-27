"use client";

import React from "react";
import { PagesList } from "@/src/app/(admin)/_components/PagesList";

export function PagesPanel() {
  const handleSelectPage = (pageId: string, pageType: string) => {
    // Dispatch event to communicate with main page
    window.dispatchEvent(
      new CustomEvent("selectPage", { detail: { pageId, pageType } }),
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <PagesList onSelectPage={handleSelectPage} />
    </div>
  );
}

"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return (
    <div
      className="max-h-screen w-screen absolute fixed inset-0 z-100"
      suppressHydrationWarning={true}
    >
      <NextStudio config={config} />
    </div>
  );
}

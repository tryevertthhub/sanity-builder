"use client";

import React from "react";
import Link from "next/link";
import { BLOCK_COMPONENTS } from "@/src/components/blocks";

export default function ExplorePage() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Just a small delay to show loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Loading Blocks...</h1>
          </div>
        </header>
      </div>
    );
  }

  // Get block names from BLOCK_COMPONENTS
  const blockNames = Object.entries(BLOCK_COMPONENTS).map(
    ([key, component]) => {
      // Use the actual component name for display
      const componentName = component.name;
      return componentName;
    }
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Explore Blocks</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blockNames.map((blockName) => (
            <Link
              key={blockName}
              href={`/explore/${blockName}`}
              className="group relative block overflow-hidden rounded-lg border border-gray-800 bg-gray-900 p-8 transition-colors hover:border-gray-700"
            >
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {blockName}
                </h2>
                <p className="text-sm text-gray-400">
                  Click to view documentation, code examples, and live preview.
                </p>
              </div>
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

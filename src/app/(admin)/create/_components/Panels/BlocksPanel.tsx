"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { BLOCK_COMPONENTS } from "@/src/components/blocks";

type BlockTypeKey = keyof typeof BLOCK_COMPONENTS;

const globalBlockTypes = ["navbarBlock", "footerBlock"] as const;
const blockTypes = Object.entries(BLOCK_COMPONENTS)
  .filter(
    ([key]) =>
      !globalBlockTypes.includes(key as (typeof globalBlockTypes)[number]),
  )
  .map(([key, Component]) => ({
    key: key as BlockTypeKey,
    name: Component.name || key,
  }));

export function BlocksPanel() {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter blocks based on search
  const filteredBlocks = blockTypes.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddBlock = (type: BlockTypeKey) => {
    // Dispatch event to communicate with main page
    window.dispatchEvent(new CustomEvent("addBlock", { detail: { type } }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blocks..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-0"
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-1 gap-2 p-4">
          {filteredBlocks.map(({ key, name }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleAddBlock(key)}
              className="flex items-center gap-3 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors text-left group"
            >
              <div className="w-8 h-8 bg-zinc-800 group-hover:bg-zinc-700 rounded-md flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{name}</div>
                <div className="text-xs text-zinc-500">Add {name} block</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

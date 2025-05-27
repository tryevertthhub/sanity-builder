"use client";

import React from "react";
import { Plus } from "lucide-react";

// Create a global event to communicate with the page
const triggerAddBlock = (type: string) => {
  window.dispatchEvent(new CustomEvent("addBlock", { detail: { type } }));
};

export function BlogPanel() {
  const handleAddBlogBlock = () => {
    triggerAddBlock("blogBlock");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">Blog Editor</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Create rich blog content with inline blocks and formatting.
        </p>
        <button
          type="button"
          onClick={handleAddBlogBlock}
          className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors text-left group"
        >
          <div className="w-8 h-8 bg-zinc-800 group-hover:bg-zinc-700 rounded-md flex items-center justify-center flex-shrink-0">
            <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">New Blog Post</div>
            <div className="text-xs text-zinc-500">
              Start writing a new blog post
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

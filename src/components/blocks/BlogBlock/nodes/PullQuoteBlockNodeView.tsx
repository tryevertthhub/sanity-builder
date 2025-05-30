import React from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { cn } from "@/src/lib/utils";

export const PullQuoteBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  const { quote, author } = node.attrs;

  return (
    <NodeViewWrapper>
      <div className="w-full my-12 bg-gradient-to-r from-purple-900/60 to-zinc-900/80 border-l-4 border-purple-500 p-10 rounded-lg shadow-md">
        <blockquote className="text-3xl font-serif italic text-white/90 mb-6 leading-relaxed">
          <textarea
            value={quote}
            onChange={(e) => updateAttributes({ quote: e.target.value })}
            placeholder="Enter your quote here..."
            className="w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded resize-none text-3xl italic text-white/90"
            rows={3}
          />
        </blockquote>
        <div className="text-right mt-4">
          <input
            type="text"
            value={author}
            onChange={(e) => updateAttributes({ author: e.target.value })}
            placeholder="Author name"
            className="bg-transparent border-none text-purple-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded text-lg"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

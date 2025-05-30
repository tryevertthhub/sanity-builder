import React, { useEffect } from "react";
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { cn } from "@/src/lib/utils";

export const PullQuoteBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  getPos,
  editor,
}) => {
  useEffect(() => {
    console.log("PullQuoteBlockNodeView mounted at position:", getPos());
    return () => console.log("PullQuoteBlockNodeView unmounted");
  }, [getPos]);

  return (
    <NodeViewWrapper className="pullquote-block-wrapper">
      <div className="w-full my-12 bg-gradient-to-r from-purple-900/60 to-zinc-900/80 border-l-4 border-purple-500 p-10 rounded-lg shadow-md">
        <blockquote className="text-3xl font-serif italic text-white/90 mb-6 leading-relaxed text-left">
          <NodeViewContent
            as="div"
            className="w-full text-3xl italic text-white/90 mb-2 outline-none placeholder-white/50 pullquote-quote"
            data-placeholder="Enter your quote here..."
            contentEditable={true}
          />
        </blockquote>
        <div className="text-left mt-4">
          {" "}
          {/* Changed from text-right to text-left */}
          <NodeViewContent
            as="div"
            className="bg-transparent border-none text-purple-300 font-semibold outline-none placeholder-white/50 text-lg pullquote-author"
            data-placeholder="Author name"
            contentEditable={true}
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

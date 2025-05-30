import React, { useEffect, useRef } from "react";
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { cn } from "@/src/lib/utils";

export const CalloutBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  getPos,
  editor,
}) => {
  const { type } = node.attrs;

  // Log mount/unmount for debugging
  useEffect(() => {
    console.log("CalloutBlockNodeView mounted at position:", getPos());
    return () => console.log("CalloutBlockNodeView unmounted");
  }, [getPos]);

  return (
    <NodeViewWrapper className="callout-block-wrapper">
      <div className="w-full my-8 border-l-4 border-purple-500 bg-zinc-900/80 p-8 rounded-lg flex items-start gap-6 shadow-md">
        <div className="flex-shrink-0 mt-1">
          {type === "info" && (
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {type === "warning" && (
            <svg
              className="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
          {type === "error" && (
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <div className="flex-grow">
          <NodeViewContent
            as="div"
            className="w-full text-xl font-bold text-white mb-2 outline-none placeholder-white/50 callout-title"
            data-placeholder="Callout title..."
            contentEditable={true}
          />
          <div className="text-white/80 text-base">
            <NodeViewContent
              as="div"
              className="outline-none min-h-[1.5rem] callout-content"
              data-placeholder="Enter callout content..."
              contentEditable={true}
            />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

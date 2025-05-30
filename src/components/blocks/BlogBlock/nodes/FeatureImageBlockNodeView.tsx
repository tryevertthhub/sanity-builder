import React from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

export const FeatureImageBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
}) => {
  const { imageUrl, alt, caption, fullWidth } = node.attrs;

  return (
    <NodeViewWrapper>
      <div className={cn("w-full my-12", fullWidth ? "mx-[-10vw]" : "mx-auto")}>
        <div className="relative w-full overflow-hidden bg-white/5 rounded-lg border border-white/10">
          {imageUrl ? (
            <div className="relative aspect-video w-full">
              <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
                sizes={fullWidth ? "100vw" : "800px"}
              />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center text-white/40 w-full">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p>Click to upload an image</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <input
            type="text"
            value={alt}
            onChange={(e) => updateAttributes({ alt: e.target.value })}
            placeholder="Image description"
            className="w-full bg-transparent border-none text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded mb-1"
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder="Image caption"
            className="w-full bg-transparent border-none text-purple-200 text-base italic focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

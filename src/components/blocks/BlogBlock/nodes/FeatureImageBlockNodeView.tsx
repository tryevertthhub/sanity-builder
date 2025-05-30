import React, { useEffect, useRef } from "react";
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

export const FeatureImageBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
  getPos,
}) => {
  const { imageUrl, fullWidth } = node.attrs;
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize content if missing
  useEffect(() => {
    if (getPos === undefined) return;
    const pos = getPos();
    const altNode = node.content?.content?.find(
      (child) => child.type.name === "altBlock"
    );
    const captionNode = node.content?.content?.find(
      (child) => child.type.name === "captionBlock"
    );

    if (!altNode || !captionNode) {
      editor
        .chain()
        .setNodeSelection(pos)
        .command(({ tr }) => {
          const newNode = editor.schema.nodes.featureImageBlock.create(
            { imageUrl, fullWidth },
            [
              editor.schema.nodes.altBlock.create(
                {},
                editor.schema.text(" ") // Use a space as default non-empty text
              ),
              editor.schema.nodes.captionBlock.create(
                {},
                editor.schema.text(" ") // Use a space as default non-empty text
              ),
            ]
          );
          tr.replaceSelectionWith(newNode);
          return true;
        })
        .run();
    }
  }, [node.content, editor, getPos]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateAttributes({ imageUrl: event.target.result as string });
          if (inputRef.current) inputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const altNode = node.content?.content?.find(
    (child) => child.type.name === "altBlock"
  );
  const altText = altNode?.content?.[0]?.text || "";

  const captionNode = node.content?.content?.find(
    (child) => child.type.name === "captionBlock"
  );
  const captionText = captionNode?.content?.[0]?.text || "";

  return (
    <NodeViewWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn("my-12", fullWidth ? "w-full" : "max-w-5xl mx-auto")}
      >
        <div className="relative w-full overflow-hidden bg-white/5 rounded-lg border border-white/10">
          {imageUrl ? (
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={imageUrl}
                alt={altText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          ) : (
            <label
              className="flex items-center justify-center w-full h-64 cursor-pointer bg-zinc-900/50"
              htmlFor="image-upload"
            >
              <div className="text-center text-white/40">
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
              <input
                id="image-upload"
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden pointer-events-auto"
              />
            </label>
          )}
        </div>
        <div className="mt-4 space-y-2 pointer-events-auto">
          {imageUrl && (
            <div>
              <label className="text-white/70 text-sm">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => updateAttributes({ imageUrl: e.target.value })}
                placeholder="Image URL"
                className="w-full bg-transparent border-none text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded pointer-events-auto"
              />
            </div>
          )}
          <div>
            <label className="text-white/70 text-sm">Alt Text</label>
            <NodeViewContent
              as="div"
              className="w-full text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded p-1 featureimage-alt"
              data-placeholder="Image description"
              contentEditable={true}
              onBlur={(e) => {
                const pos = getPos && getPos();
                if (pos !== undefined) {
                  editor
                    .chain()
                    .setNodeSelection(pos)
                    .updateAttributes("featureImageBlock", {
                      altText: e.target.innerText,
                    })
                    .run();
                }
              }}
            />
          </div>
          <div>
            <label className="text-white/70 text-sm">Caption</label>
            <NodeViewContent
              as="div"
              className="w-full text-gray-400 text-sm italic focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded p-1 featureimage-caption"
              data-placeholder="Image caption"
              contentEditable={true}
              onBlur={(e) => {
                const pos = getPos && getPos();
                if (pos !== undefined) {
                  editor
                    .chain()
                    .setNodeSelection(pos)
                    .updateAttributes("featureImageBlock", {
                      captionText: e.target.innerText,
                    })
                    .run();
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={fullWidth}
              onChange={(e) =>
                updateAttributes({ fullWidth: e.target.checked })
              }
              className="w-4 h-4 text-purple-500 bg-transparent border-white/20 rounded focus:ring-purple-500/50 pointer-events-auto"
            />
            <label className="text-white/70 text-sm">Full Width</label>
          </div>
        </div>
      </motion.div>
    </NodeViewWrapper>
  );
};

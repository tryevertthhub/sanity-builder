import { BlogRichEditor } from "./BlogRichEditor";
import { BlogBlock as BlogBlockType } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { InlineEdit } from "@/src/components/shared/InlineEdit";
import { useMemo } from "react";

interface BlogBlockProps extends BlogBlockType {
  isEditMode?: boolean;
  onFieldEdit?: (field: string, value: any) => void;
}

function portableTextToTiptapDoc(portableText) {
  if (!Array.isArray(portableText) || portableText.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }
  return {
    type: "doc",
    content: portableText.map((block) => {
      if (block._type === "block") {
        if (
          block.style === "h1" ||
          block.style === "h2" ||
          block.style === "h3"
        ) {
          return {
            type: "heading",
            attrs: { level: Number(block.style.replace("h", "")) },
            content: block.children.map((child) => ({
              type: "text",
              text: child.text,
            })),
          };
        }
        if (block.style === "blockquote") {
          return {
            type: "blockquote",
            content: block.children.map((child) => ({
              type: "text",
              text: child.text,
            })),
          };
        }
        // Default to paragraph
        return {
          type: "paragraph",
          content: block.children.map((child) => ({
            type: "text",
            text: child.text,
          })),
        };
      }
      if (block._type === "calloutBlock") {
        return {
          type: "calloutBlock",
          attrs: { type: block.type || "info" },
          content: [
            {
              type: "titleBlock",
              content: [{ type: "text", text: block.title || "" }],
            },
            {
              type: "contentBlock",
              content: [{ type: "text", text: block.content || "" }],
            },
          ],
        };
      }
      if (block._type === "pullQuoteBlock") {
        return {
          type: "pullQuoteBlock",
          content: [
            {
              type: "quoteBlock",
              content: [{ type: "text", text: block.quote || "" }],
            },
            {
              type: "authorBlock",
              content: [{ type: "text", text: block.author || "" }],
            },
          ],
        };
      }
      if (block._type === "imageBlock") {
        return {
          type: "imageBlock",
          attrs: { src: block.src || "" },
        };
      }
      if (block._type === "featureImageBlock") {
        return {
          type: "featureImageBlock",
          attrs: { src: block.src || "" },
        };
      }
      // fallback
      return { type: "paragraph" };
    }),
  };
}

export function BlogBlock({
  title,
  content,
  isEditMode,
  onFieldEdit,
}: BlogBlockProps) {
  // Pass the actual content array to the editor
  const tiptapContent = useMemo(
    () => portableTextToTiptapDoc(content),
    [content]
  );

  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto px-4 py-8",
        isEditMode && "border border-zinc-800 rounded-lg"
      )}
    >
      {isEditMode && onFieldEdit ? (
        <InlineEdit
          value={title || "Untitled"}
          onChange={(val) => onFieldEdit("title", val)}
          fieldName="title"
          as="h1"
          className="text-4xl font-bold mb-8"
        />
      ) : (
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
      )}
      <BlogRichEditor
        value={tiptapContent}
        onChange={(val) => onFieldEdit && onFieldEdit("content", val)}
        isEditMode={isEditMode}
      />
    </div>
  );
}

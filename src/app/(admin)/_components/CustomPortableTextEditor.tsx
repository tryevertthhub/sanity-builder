"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { ImageUpload } from "@/src/components/ui/image-upload";

interface Block {
  _type: string;
  _key: string;
  content?: string;
  image?: any;
  code?: string;
  language?: string;
  items?: string[];
}

const BLOCK_TYPES = [
  { type: "h1", label: "Heading 1", icon: "🔠" },
  { type: "h2", label: "Heading 2", icon: "🔡" },
  { type: "paragraph", label: "Paragraph", icon: "📄" },
  { type: "text", label: "Text Block", icon: "📝" },
  { type: "bulletList", label: "Bullet List", icon: "•" },
  { type: "numberList", label: "Numbered List", icon: "1." },
  { type: "code", label: "Code Block", icon: "💻" },
  { type: "image", label: "Image Block", icon: "🖼️" },
];

function createEmptyBlock(type: string): Block {
  const block: Block = {
    _type: type,
    _key: Math.random().toString(36).substr(2, 9),
  };
  switch (type) {
    case "h1":
    case "h2":
    case "paragraph":
    case "text":
      block.content = "";
      break;
    case "bulletList":
    case "numberList":
      block.items = [""];
      break;
    case "code":
      block.code = "";
      block.language = "javascript";
      break;
    case "image":
      block.image = null;
      break;
  }
  return block;
}

interface CustomPortableTextEditorProps {
  value: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function CustomPortableTextEditor({
  value,
  onChange,
}: CustomPortableTextEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(
    value || [createEmptyBlock("paragraph")]
  );
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuIndex, setSlashMenuIndex] = useState(0);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
  const editorRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  // Handle block change
  const handleBlockChange = (index: number, updates: Partial<Block>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  };

  // Handle add block
  const handleAddBlock = (type: string, index: number) => {
    const newBlock = createEmptyBlock(type);
    const newBlocks = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1),
    ];
    setBlocks(newBlocks);
    setTimeout(() => {
      editorRefs.current[newBlock._key]?.focus();
    }, 0);
    onChange?.(newBlocks);
  };

  // Handle remove block
  const handleRemoveBlock = (index: number) => {
    if (blocks.length === 1) return;
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  };

  // Handle slash command
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    if (
      e.key === "/" &&
      (e.target as HTMLInputElement | HTMLTextAreaElement).value === ""
    ) {
      setShowSlashMenu(true);
      setSlashMenuIndex(0);
      const rect = (
        e.target as HTMLInputElement | HTMLTextAreaElement
      ).getBoundingClientRect();
      setSlashMenuPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    } else if (showSlashMenu) {
      if (e.key === "ArrowDown") {
        setSlashMenuIndex((i) => (i + 1) % BLOCK_TYPES.length);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSlashMenuIndex(
          (i) => (i - 1 + BLOCK_TYPES.length) % BLOCK_TYPES.length
        );
        e.preventDefault();
      } else if (e.key === "Enter") {
        handleAddBlock(BLOCK_TYPES[slashMenuIndex].type, index);
        setShowSlashMenu(false);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setShowSlashMenu(false);
      }
    } else if (
      e.key === "Backspace" &&
      (e.target as HTMLInputElement | HTMLTextAreaElement).value === "" &&
      blocks.length > 1
    ) {
      handleRemoveBlock(index);
    }
  };

  // Render block
  const renderBlock = (block: Block, index: number) => {
    switch (block._type) {
      case "h1":
        return (
          <input
            ref={(el) => {
              editorRefs.current[block._key] = el;
            }}
            type="text"
            value={block.content || ""}
            onChange={(e) =>
              handleBlockChange(index, { content: e.target.value })
            }
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder="Heading 1"
            className="w-full text-3xl font-bold bg-zinc-900 border-b border-zinc-700 py-2 px-2 mb-2 outline-none"
            onFocus={() => setFocusedBlock(block._key)}
          />
        );
      case "h2":
        return (
          <input
            ref={(el) => {
              editorRefs.current[block._key] = el;
            }}
            type="text"
            value={block.content || ""}
            onChange={(e) =>
              handleBlockChange(index, { content: e.target.value })
            }
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder="Heading 2"
            className="w-full text-2xl font-semibold bg-zinc-900 border-b border-zinc-700 py-2 px-2 mb-2 outline-none"
            onFocus={() => setFocusedBlock(block._key)}
          />
        );
      case "paragraph":
      case "text":
        return (
          <Textarea
            // @ts-ignore
            ref={(el) => (editorRefs.current[block._key] = el)}
            value={block.content || ""}
            onChange={(e) =>
              handleBlockChange(index, { content: e.target.value })
            }
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder={
              block._type === "paragraph" ? "Paragraph text..." : "Text..."
            }
            className="min-h-[60px] bg-zinc-900 border-zinc-800"
            onFocus={() => setFocusedBlock(block._key)}
          />
        );
      case "bulletList":
      case "numberList":
        return (
          <Textarea
            // @ts-ignore
            ref={(el) => (editorRefs.current[block._key] = el)}
            value={(block.items || []).join("\n")}
            onChange={(e) =>
              handleBlockChange(index, { items: e.target.value.split("\n") })
            }
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder={
              block._type === "bulletList"
                ? "Bullet list: one item per line"
                : "Numbered list: one item per line"
            }
            className="min-h-[60px] bg-zinc-900 border-zinc-800"
            onFocus={() => setFocusedBlock(block._key)}
          />
        );
      case "code":
        return (
          <Textarea
            // @ts-ignore
            ref={(el) => (editorRefs.current[block._key] = el)}
            value={block.code || ""}
            onChange={(e) => handleBlockChange(index, { code: e.target.value })}
            onKeyDown={(e) => handleKeyDown(e, index)}
            placeholder="Enter your code here..."
            className="min-h-[100px] font-mono bg-zinc-900 border-zinc-800"
            onFocus={() => setFocusedBlock(block._key)}
          />
        );
      case "image":
        return (
          <div className="space-y-2">
            {block.image ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={block.image.url}
                  alt="Block image"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleBlockChange(index, { image: null })}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <ImageUpload
                onUpload={(file) => {
                  const imageUrl = URL.createObjectURL(file);
                  handleBlockChange(index, { image: { url: imageUrl } });
                }}
                isUploading={false}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col w-full">
      {blocks.map((block, index) => (
        <div
          key={block._key}
          className="relative group flex items-stretch w-full"
          style={{ minHeight: 36, margin: "0 0 2px 0" }}
        >
          {/* Remove block button, only on hover/focus */}
          {blocks.length > 1 && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute left-[-32px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 text-lg px-1"
              onClick={() => handleRemoveBlock(index)}
              aria-label="Delete block"
            >
              ×
            </button>
          )}
          <div className="flex-1">
            {renderBlock(block, index)}
            {/* Placeholder for empty blocks */}
            {(block.content === "" || block.content === undefined) &&
              (block._type === "paragraph" || block._type === "text") && (
                <span className="pointer-events-none select-none text-zinc-400 text-sm absolute left-2 top-2 opacity-60">
                  Type / for commands
                </span>
              )}
          </div>
          {/* Slash menu, floating and minimal */}
          {showSlashMenu && focusedBlock === block._key && (
            <div
              className="absolute z-50 bg-zinc-900 border border-zinc-700 rounded shadow-xl"
              style={{ top: 36, left: 8, minWidth: 220 }}
            >
              {BLOCK_TYPES.map((b, i) => (
                <div
                  key={b.type}
                  className={`px-4 py-2 cursor-pointer flex items-center gap-2 text-sm ${i === slashMenuIndex ? "bg-zinc-800 text-white" : "text-zinc-300"}`}
                  onMouseDown={() => {
                    handleAddBlock(b.type, index);
                    setShowSlashMenu(false);
                  }}
                >
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

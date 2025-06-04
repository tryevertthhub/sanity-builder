"use client";

import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { ImageUpload } from "@/src/components/ui/image-upload";
import { GripVertical, Trash2, Image as ImageIcon, Code } from "lucide-react";

interface Block {
  _type: string;
  _key: string;
  content?: string;
  image?: any;
  code?: string;
  language?: string;
  items?: string[];
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const BLOCK_TYPES = {
  text: {
    icon: "📝",
    label: "Text Block",
  },
  image: {
    icon: "🖼️",
    label: "Image Block",
  },
  code: {
    icon: "💻",
    label: "Code Block",
  },
  h1: {
    icon: "🔠",
    label: "Heading 1",
  },
  h2: {
    icon: "🔡",
    label: "Heading 2",
  },
  paragraph: {
    icon: "📄",
    label: "Paragraph",
  },
  bulletList: {
    icon: "•",
    label: "Bullet List",
  },
  numberList: {
    icon: "1.",
    label: "Numbered List",
  },
};

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editingBlockIndex, setEditingBlockIndex] = useState<
    number | "new" | null
  >(null);
  const [modalBlockDraft, setModalBlockDraft] = useState<any>(null);

  // Add Block: open modal for new block
  const handleAddBlock = (type: string) => {
    const newBlock: Block = {
      _type: type,
      _key: Math.random().toString(36).substr(2, 9),
    };

    switch (type) {
      case "text":
        newBlock.content = "";
        break;
      case "code":
        newBlock.code = "";
        newBlock.language = "javascript";
        break;
      case "h1":
      case "h2":
        newBlock.content = "";
        break;
      case "paragraph":
        newBlock.content = "";
        break;
      case "bulletList":
      case "numberList":
        newBlock.items = [""];
        break;
    }

    setEditingBlockIndex("new");
    setModalBlockDraft(newBlock);
  };

  const handleUpdateBlock = (index: number, updates: Partial<Block>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange(newBlocks);
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const handleImageUpload = async (file: File, index: number) => {
    setIsUploading(true);
    try {
      // Here you would typically upload to your storage service
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      handleUpdateBlock(index, { image: { url: imageUrl } });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Save modal edits
  const saveModalBlock = () => {
    if (modalBlockDraft) {
      if (editingBlockIndex === "new") {
        // Add new block
        onChange([...blocks, modalBlockDraft]);
      } else if (typeof editingBlockIndex === "number") {
        // Update existing block
        handleUpdateBlock(editingBlockIndex, modalBlockDraft);
      }
    }
    setEditingBlockIndex(null);
    setModalBlockDraft(null);
  };

  // Close modal without saving
  const closeModal = () => {
    setEditingBlockIndex(null);
    setModalBlockDraft(null);
  };

  // Render block summary for list view
  const renderBlockSummary = (block: Block) => {
    switch (block._type) {
      case "h1":
      case "h2":
      case "paragraph":
      case "text":
        return (
          <span className="truncate block text-zinc-300">
            {block.content || (
              <span className="italic text-zinc-500">Empty</span>
            )}
          </span>
        );
      case "bulletList":
      case "numberList":
        return (
          <span className="truncate block text-zinc-300">
            {(block.items || []).filter(Boolean).length} item
            {(block.items || []).length !== 1 ? "s" : ""}
          </span>
        );
      case "code":
        return (
          <span className="truncate block text-zinc-300 font-mono">
            {block.code || <span className="italic text-zinc-500">Empty</span>}
          </span>
        );
      case "image":
        return block.image ? (
          <img src={block.image.url} alt="" className="h-8 w-auto rounded" />
        ) : (
          <span className="italic text-zinc-500">No image</span>
        );
      default:
        return null;
    }
  };

  // Render block editor for modal
  const renderModalBlockEditor = (block: Block, setBlock: (b: any) => void) => {
    switch (block._type) {
      case "text":
        return (
          <Textarea
            value={block.content || ""}
            onChange={(e) => setBlock({ ...block, content: e.target.value })}
            placeholder="Write your content here..."
            className="min-h-[100px] bg-zinc-900 border-zinc-800"
          />
        );
      case "h1":
        return (
          <input
            type="text"
            value={block.content || ""}
            onChange={(e) => setBlock({ ...block, content: e.target.value })}
            placeholder="Heading 1"
            className="w-full text-3xl font-bold bg-zinc-900 border-b border-zinc-700 py-2 px-2 mb-2 outline-none"
          />
        );
      case "h2":
        return (
          <input
            type="text"
            value={block.content || ""}
            onChange={(e) => setBlock({ ...block, content: e.target.value })}
            placeholder="Heading 2"
            className="w-full text-2xl font-semibold bg-zinc-900 border-b border-zinc-700 py-2 px-2 mb-2 outline-none"
          />
        );
      case "paragraph":
        return (
          <Textarea
            value={block.content || ""}
            onChange={(e) => setBlock({ ...block, content: e.target.value })}
            placeholder="Paragraph text..."
            className="min-h-[60px] bg-zinc-900 border-zinc-800"
          />
        );
      case "bulletList":
        return (
          <Textarea
            value={(block.items || []).join("\n")}
            onChange={(e) =>
              setBlock({ ...block, items: e.target.value.split("\n") })
            }
            placeholder="Bullet list: one item per line"
            className="min-h-[60px] bg-zinc-900 border-zinc-800"
          />
        );
      case "numberList":
        return (
          <Textarea
            value={(block.items || []).join("\n")}
            onChange={(e) =>
              setBlock({ ...block, items: e.target.value.split("\n") })
            }
            placeholder="Numbered list: one item per line"
            className="min-h-[60px] bg-zinc-900 border-zinc-800"
          />
        );
      case "code":
        return (
          <Textarea
            value={block.code || ""}
            onChange={(e) => setBlock({ ...block, code: e.target.value })}
            placeholder="Enter your code here..."
            className="min-h-[100px] font-mono bg-zinc-900 border-zinc-800"
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
                  onClick={() => setBlock({ ...block, image: null })}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <ImageUpload
                onUpload={(file) => {
                  // For modal, just use local URL for now
                  const imageUrl = URL.createObjectURL(file);
                  setBlock({ ...block, image: { url: imageUrl } });
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

  const renderBlock = (block: Block, index: number) => {
    switch (block._type) {
      case "text":
        return (
          <div className="space-y-2">
            <Textarea
              value={block.content || ""}
              onChange={(e) =>
                handleUpdateBlock(index, { content: e.target.value })
              }
              placeholder="Write your content here..."
              className="min-h-[100px] bg-zinc-900 border-zinc-800"
            />
          </div>
        );
      case "h1":
        return (
          <input
            type="text"
            value={block.content || ""}
            onChange={(e) =>
              handleUpdateBlock(index, { content: e.target.value })
            }
            placeholder="Heading 1"
            className="w-full text-3xl font-bold bg-zinc-900 border-b border-zinc-700 py-2 px-2 mb-2 outline-none"
          />
        );
      case "h2":
        return (
          <input
            type="text"
            value={block.content || ""}
            onChange={(e) =>
              handleUpdateBlock(index, { content: e.target.value })
            }
            placeholder="Heading 2"
            className="w-full text-2xl font-semibold bg-zinc-900 border-b border-zinc-700 py-2 px-2 mb-2 outline-none"
          />
        );
      case "paragraph":
        return (
          <Textarea
            value={block.content || ""}
            onChange={(e) =>
              handleUpdateBlock(index, { content: e.target.value })
            }
            placeholder="Paragraph text..."
            className="min-h-[60px] bg-zinc-900 border-zinc-800"
          />
        );
      case "bulletList":
        return (
          <Textarea
            value={(block.items || []).join("\n")}
            onChange={(e) =>
              handleUpdateBlock(index, { items: e.target.value.split("\n") })
            }
            placeholder="Bullet list: one item per line"
            className="min-h-[60px] bg-zinc-900 border-zinc-800"
          />
        );
      case "numberList":
        return (
          <Textarea
            value={(block.items || []).join("\n")}
            onChange={(e) =>
              handleUpdateBlock(index, { items: e.target.value.split("\n") })
            }
            placeholder="Numbered list: one item per line"
            className="min-h-[60px] bg-zinc-900 border-zinc-800"
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
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleUpdateBlock(index, { image: null })}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <ImageUpload
                onUpload={(file) => handleImageUpload(file, index)}
                isUploading={isUploading}
              />
            )}
          </div>
        );

      case "code":
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={block.language || "javascript"}
                onChange={(e) =>
                  handleUpdateBlock(index, { language: e.target.value })
                }
                placeholder="Language"
                className="w-32 bg-zinc-900 border-zinc-800"
              />
            </div>
            <Textarea
              value={block.code || ""}
              onChange={(e) =>
                handleUpdateBlock(index, { code: e.target.value })
              }
              placeholder="Enter your code here..."
              className="min-h-[100px] font-mono bg-zinc-900 border-zinc-800"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <div
          key={block._key}
          className="group relative p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          onClick={() => {
            setEditingBlockIndex(index);
            setModalBlockDraft({ ...blocks[index] });
          }}
        >
          {/* Block Controls */}
          <div
            className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
              onClick={() => handleRemoveBlock(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Block Summary */}
          {renderBlockSummary(block)}
        </div>
      ))}

      {/* Block Editing Modal */}
      {editingBlockIndex !== null && modalBlockDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8">
            <button
              type="button"
              className="absolute top-3 right-3 text-zinc-400 hover:text-white text-2xl"
              onClick={closeModal}
              title="Close"
            >
              ×
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Edit Block</h3>
              {renderModalBlockEditor(modalBlockDraft, setModalBlockDraft)}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={saveModalBlock}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Block Menu */}
      <hr className="my-6 border-zinc-800" />
      <div className="flex justify-center mt-4 mb-4">
        <div className="flex flex-wrap gap-3 bg-zinc-900/80 border border-zinc-700 rounded-xl shadow-lg px-4 py-2">
          {Object.entries(BLOCK_TYPES).map(([type, { icon, label }]) => (
            <Button
              key={type}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddBlock(type)}
              className="text-zinc-400 hover:text-white min-w-[150px]"
            >
              <span className="mr-2">{icon}</span>
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { useBlockState } from "@/src/app/(admin)/hooks/useBlockState";
import { Block } from "@/src/app/(admin)/types";
import { BlockLibrary } from "@/src/app/(admin)/_components/BlockLibrary";
import { StructurePanel } from "@/src/app/(admin)/_components/StructurePanel";
import { PageBuilder } from "@/src/components/pagebuilder";
import { Button } from "@/src/components/ui/button";
import { SEOPanel } from "@/src/app/(admin)/_components/SEOPanel";
import { BlockPreviewWrapper } from "@/src/app/(admin)/_components/BlockPreviewWrapper";
import { SchemaEditor } from "@/src/app/(admin)/_components/SchemaEditor";

export function PageEditorPanel({
  initialPage,
  onPublish,
  openTab: initialOpenTab,
}: {
  initialPage?: any;
  onPublish: (data: {
    blocks: Block[];
    seo: any;
    slug: string;
  }) => Promise<void>;
  openTab?: "content" | "seo";
}) {
  const [activeTab, setActiveTab] = React.useState<"content" | "seo">(
    initialOpenTab || "content"
  );
  const [seo, setSeo] = React.useState(initialPage?.seo || {});
  const [slug, setSlug] = React.useState(initialPage?.slug?.current || "");
  const {
    blocks,
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    clearBlocks,
  } = useBlockState(initialPage?.pageBuilder || []);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (initialOpenTab) setActiveTab(initialOpenTab);
  }, [initialOpenTab]);

  const handlePublish = async () => {
    setSaving(true);
    await onPublish({ blocks, seo, slug });
    setSaving(false);
  };

  // Add PreviewPanel for block editing (like create page)
  function PreviewPanel({
    blocks,
    updateBlock,
  }: {
    blocks: Block[];
    updateBlock: (id: string, updatedBlock: Partial<Block>) => void;
  }) {
    const [editingBlock, setEditingBlock] = React.useState<Block | null>(null);

    const handleSaveBlock = (updatedBlock: Block) => {
      updateBlock(updatedBlock.id, updatedBlock);
      setEditingBlock(null);
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {blocks.map((block, idx) => (
            <BlockPreviewWrapper
              key={block.id || block._key || block._id || idx}
              block={block}
              onEdit={setEditingBlock}
              onInspect={() => {}}
              onUpdate={updateBlock}
              isEditMode={true}
            />
          ))}
        </div>
        {editingBlock && (
          <SchemaEditor
            block={editingBlock}
            onClose={() => setEditingBlock(null)}
            onSave={handleSaveBlock}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-72 border-r border-zinc-800 bg-zinc-900/95">
        <BlockLibrary onAddBlock={addBlock} onAddGlobalComponent={addBlock} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === "content" ? "text-blue-400 border-b-2 border-blue-500" : "text-zinc-400"}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === "seo" ? "text-blue-400 border-b-2 border-blue-500" : "text-zinc-400"}`}
          >
            SEO
          </button>
          <Button
            onClick={handlePublish}
            disabled={saving}
            className="ml-4 mr-4"
          >
            {saving ? "Saving..." : "Publish"}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTab === "content" ? (
            <PreviewPanel blocks={blocks} updateBlock={updateBlock} />
          ) : (
            <SEOPanel
              initialData={{
                seoTitle: seo?.title || "",
                seoDescription: seo?.description || "",
                seoImage: seo?.ogImage || null,
                seoNoIndex: seo?.noIndex || false,
              }}
              onSave={(data) => {
                setSeo({
                  title: data.seoTitle,
                  description: data.seoDescription,
                  ogImage: data.seoImage,
                  noIndex: data.seoNoIndex,
                });
              }}
              isNewPage={!initialPage}
            />
          )}
        </div>
      </div>
      <div className="w-80 border-l border-zinc-800 bg-zinc-900/95">
        <StructurePanel
          selectedBlocks={blocks}
          onRemoveBlock={removeBlock}
          onDragEnd={(result: any) => {
            if (!result.destination) return;
            reorderBlocks(result.source.index, result.destination.index);
          }}
        />
      </div>
    </div>
  );
}

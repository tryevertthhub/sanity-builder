"use client";
import React from "react";
import { useBlockState } from "@/src/app/(admin)/hooks/useBlockState";
import { Block } from "@/src/app/(admin)/types";
import { BlockLibrary } from "@/src/app/(admin)/_components/BlockLibrary";
import { StructurePanel } from "@/src/app/(admin)/_components/StructurePanel";
import { PageBuilder } from "@/src/components/pagebuilder";
import { Button } from "@/src/components/ui/button";
import { SEOPanel } from "@/src/app/(admin)/_components/SEOPanel";

export function PageEditorPanel({
  initialPage,
  onPublish,
}: {
  initialPage?: any;
  onPublish: (data: {
    blocks: Block[];
    seo: any;
    slug: string;
  }) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = React.useState<"content" | "seo">(
    "content",
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

  const handlePublish = async () => {
    setSaving(true);
    await onPublish({ blocks, seo, slug });
    setSaving(false);
  };

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
            <PageBuilder
              pageBuilder={blocks}
              id={initialPage?._id || "new"}
              type="page"
              isEditMode={true}
            />
          ) : (
            <SEOPanel
              initialData={seo}
              onSave={setSeo}
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

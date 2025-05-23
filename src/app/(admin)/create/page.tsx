"use client";

import React from "react";
import { BLOCKS } from "@/src/components/blocks";
import { LoadingOverlay, SuccessOverlay } from "../_components/Loading";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "./actions";
import { Block, DeviceType, BlockType } from "../types";
import { PreviewToolbar } from "../_components/PreviewToolbar";
import { BlockLibrary } from "../_components/BlockLibrary";
import { DeviceFrame } from "../_components/DeviceFrame";
import { StructurePanel } from "../_components/StructurePanel";
import { BlockPreviewWrapper } from "../_components/BlockPreviewWrapper";
import { SchemaEditor } from "../_components/SchemaEditor";
import { CodeInspector } from "../_components/CodeInspector";
import { usePageData } from "../hooks/usePageData";
import { PagePreview } from "../_components/PagePreview";
import { useBlockState } from "../hooks/useBlockState";

const generateKey = (length = 12) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

export default function CreatePage() {
  const router = useRouter();
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(
    null
  );
  const [selectedPageType, setSelectedPageType] = React.useState<string | null>(
    null
  );
  const [activeBlock, setActiveBlock] = React.useState<Block | null>(null);
  const [slug, setSlug] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [createResult, setCreateResult] = React.useState<{
    success: boolean;
  } | null>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [showStructure, setShowStructure] = React.useState(true);
  const [device, setDevice] = React.useState<DeviceType>("desktop");
  const [sidebarWidth, setSidebarWidth] = React.useState(320);
  const [showDeviceFrame, setShowDeviceFrame] = React.useState(true);
  const [showInspector, setShowInspector] = React.useState(false);
  const [inspectedBlock, setInspectedBlock] = React.useState<Block | null>(
    null
  );

  const {
    blocks: loadedBlocks,
    isLoading,
    updateBlocks,
  } = usePageData(selectedPageId, selectedPageType);

  const {
    blocks: selectedBlocks,
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    clearBlocks,
  } = useBlockState();

  // Use loaded blocks if viewing a page, otherwise use selected blocks
  const displayBlocks = React.useMemo(() => {
    if (selectedPageId) {
      return (loadedBlocks[0]?.pageBuilder || []).map((block: any) => ({
        id: block._key || Math.random().toString(36).substring(2, 15),
        type: block._type,
        ...block,
      }));
    }
    return selectedBlocks;
  }, [selectedPageId, loadedBlocks, selectedBlocks]);

  // Update slug when loaded blocks change
  React.useEffect(() => {
    if (selectedPageId && loadedBlocks.length > 0) {
      const pageDoc = loadedBlocks[0];
      if (pageDoc?.slug?.current) {
        setSlug(pageDoc.slug.current);
      }
    }
  }, [loadedBlocks, selectedPageId]);

  // Handle page selection
  const handleSelectPage = (pageId: string, pageType: string) => {
    setSelectedPageId(pageId);
    setSelectedPageType(pageType);
    // Set the slug based on the page type
    if (pageType === "homePage") {
      setSlug("/");
    }
  };

  // Handle clearing page selection
  const handleClearPageSelection = () => {
    setSelectedPageId(null);
    setSelectedPageType(null);
    clearBlocks(); // Clear blocks when clearing page selection
  };

  // Handle adding a new block
  const handleAddBlock = (type: BlockType) => {
    let newBlock;
    if (type === "blogBlock") {
      newBlock = {
        id: generateKey(),
        type,
        title: "New Blog Post",
        content: [
          {
            _type: "block",
            style: "normal",
            children: [
              { _type: "span", text: "Start writing your blog post..." },
            ],
          },
        ],
      };
    } else {
      newBlock = {
        id: generateKey(),
        type,
      };
    }

    const block = addBlock(type, newBlock);
    setActiveBlock(block);
  };

  // Handle removing a block
  const handleRemoveBlock = (id: string) => {
    removeBlock(id);
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderBlocks(result.source.index, result.destination.index);
  };

  // Handle block updates
  const handleBlockUpdate = (blockId: string, updatedBlock: Block) => {
    if (selectedPageId) {
      // Update the loaded blocks directly
      const updatedBlocks = loadedBlocks.map((page) => {
        if (page.pageBuilder) {
          return {
            ...page,
            pageBuilder: page.pageBuilder.map((block: any) =>
              block._key === blockId ? { ...block, ...updatedBlock } : block
            ),
          };
        }
        return page;
      });
      updateBlocks(updatedBlocks);
    }
    // Always update the block state
    updateBlock(blockId, updatedBlock);
  };

  // Handle page creation/update
  const handleCreatePage = async (type: "page" | "homePage" = "page") => {
    if (!slug || selectedBlocks.length === 0) return;

    setIsCreating(true);
    setCreateResult(null);

    try {
      const document: any = {
        title:
          type === "homePage"
            ? "Home Page"
            : slug.split("/").pop()?.replace(/-/g, " ") || "New Page",
        pageBuilder: selectedBlocks.map(
          ({ id, type: blockType, ...blockData }) => ({
            _key: generateKey(),
            _type: blockType,
            ...blockData,
          })
        ),
      };

      // Ensure slug starts with "/" for all pages
      const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;

      // Set slug for all pages (including homepage)
      document.slug = {
        _type: "slug",
        current: normalizedSlug, // Keep the leading slash for all pages
      };

      let result;
      if (selectedPageId) {
        // Update existing page
        result = await updatePage(
          selectedPageId,
          document,
          type as "page" | "homePage"
        );
      } else {
        // Create new page
        result = await createPage(document, type);
      }

      setCreateResult(result);

      if (result.success) {
        // Wait a bit longer for Sanity to process the changes
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Clear blocks after successful page creation/update
        clearBlocks();

        // Use the normalized slug for redirection
        router.refresh();
        window.location.href = normalizedSlug;
        return;
      } else {
        throw new Error(result.error || "Failed to create/update page");
      }
    } catch (error) {
      console.error("Error creating/updating page:", error);
      alert("Failed to create/update page. Please try again.");
      setIsCreating(false);
    }
  };

  const PreviewPanel = ({ className = "" }: { className?: string }) => {
    const [editingBlock, setEditingBlock] = React.useState<Block | null>(null);

    const handleSaveBlock = (updatedBlock: Block) => {
      handleBlockUpdate(updatedBlock.id, updatedBlock);
    };

    // Add null check for displayBlocks
    if (!displayBlocks) {
      return null;
    }

    return (
      <div className={`${className} flex flex-col h-full`}>
        <PreviewToolbar
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          device={device}
          setDevice={setDevice}
          showDeviceFrame={showDeviceFrame}
          setShowDeviceFrame={setShowDeviceFrame}
          slug={slug}
          setSlug={setSlug}
          showInspector={showInspector}
          setShowInspector={setShowInspector}
          setInspectedBlock={setInspectedBlock}
          showStructure={showStructure}
          setShowStructure={setShowStructure}
          handleCreatePage={handleCreatePage}
          isCreating={isCreating}
          selectedBlocks={displayBlocks}
          isEditing={!!selectedPageId}
          selectedPageId={selectedPageId}
        />
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            <DeviceFrame device={device} showDeviceFrame={showDeviceFrame}>
              <div className="p-4">
                {displayBlocks
                  .filter(
                    (block): block is Block =>
                      block !== null && block !== undefined && "id" in block
                  )
                  .map((block) => (
                    <BlockPreviewWrapper
                      key={block.id}
                      block={block}
                      onEdit={(block) => setEditingBlock(block)}
                      onInspect={(block) => {
                        setInspectedBlock(block);
                        setShowInspector(true);
                      }}
                      onUpdate={handleBlockUpdate}
                    />
                  ))}
              </div>
            </DeviceFrame>
          </div>
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
  };

  return (
    <>
      <div className="h-screen bg-zinc-950 flex">
        {!isFullScreen && (
          <div
            className="border-r border-zinc-800 bg-zinc-900/95 backdrop-blur-xl flex flex-col"
            style={{ width: `${sidebarWidth}px` }}
          >
            <BlockLibrary
              onAddBlock={handleAddBlock}
              onAddGlobalComponent={handleAddBlock}
              onSelectPage={handleSelectPage}
            />
          </div>
        )}

        <div className="flex-1 flex">
          {isFullScreen ? (
            <div className="relative flex-1">
              <PreviewPanel className="h-full" />
              {showStructure && !showInspector && (
                <div className="absolute top-20 right-6 w-80 max-h-[calc(100vh-6rem)] rounded-lg border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl overflow-hidden">
                  <StructurePanel
                    selectedBlocks={displayBlocks}
                    onDragEnd={handleDragEnd}
                    onRemoveBlock={handleRemoveBlock}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex-1">
                <PreviewPanel className="h-full" />
              </div>

              {showStructure && !showInspector && (
                <div className="w-80 border-l border-zinc-800 bg-zinc-900/95 backdrop-blur-xl">
                  <StructurePanel
                    className="h-full"
                    selectedBlocks={displayBlocks}
                    onDragEnd={handleDragEnd}
                    onRemoveBlock={handleRemoveBlock}
                  />
                </div>
              )}

              {showInspector && (
                <CodeInspector
                  inspectedBlock={inspectedBlock}
                  showInspector={showInspector}
                  setShowInspector={setShowInspector}
                  setInspectedBlock={setInspectedBlock}
                  showStructure={showStructure}
                  setShowStructure={setShowStructure}
                />
              )}
            </>
          )}
        </div>
      </div>

      {isCreating && (
        <>
          {createResult?.success ? (
            <SuccessOverlay url={slug.startsWith("/") ? slug : `/${slug}`} />
          ) : (
            <LoadingOverlay />
          )}
        </>
      )}
    </>
  );
}

"use client";

import React from "react";

import { LoadingOverlay, SuccessOverlay } from "../_components/Loading";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "./actions";
import type { Block, DeviceType, BlockType } from "../types";
import { PreviewToolbar } from "../_components/PreviewToolbar";
import { DeviceFrame } from "../_components/DeviceFrame";
import { StructurePanel } from "../_components/StructurePanel";
import { BlockPreviewWrapper } from "../_components/BlockPreviewWrapper";
import { SchemaEditor } from "../_components/SchemaEditor";
import { CodeInspector } from "../_components/CodeInspector";
import { usePageData } from "../hooks/usePageData";
import { PagePreview } from "../_components/PagePreview";
import { useBlockState } from "../hooks/useBlockState";
import { SEOPanel } from "../_components/SEOPanel";
import { useTabContext } from "./layout";

const generateKey = (length = 12) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

export default function CreatePage() {
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    seoBadge,
    setSeoBadge,
    selectedPageId: layoutSelectedPageId,
    setSelectedPageId: setLayoutSelectedPageId,
  } = useTabContext();

  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(
    layoutSelectedPageId || null
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
  const [showDeviceFrame, setShowDeviceFrame] = React.useState(true);
  const [showInspector, setShowInspector] = React.useState(false);
  const [inspectedBlock, setInspectedBlock] = React.useState<Block | null>(
    null
  );
  const [seoData, setSeoData] = React.useState<any>(null);

  const handleSeoBadge = React.useCallback(
    (count: number, total: number) => {
      const newBadge = { count, total };
      if (setSeoBadge) {
        setSeoBadge(newBadge);
      }
    },
    [setSeoBadge]
  );

  // Sync selectedPageId with layout
  React.useEffect(() => {
    if (setLayoutSelectedPageId && selectedPageId !== layoutSelectedPageId) {
      setLayoutSelectedPageId(selectedPageId);
    }
  }, [selectedPageId, layoutSelectedPageId, setLayoutSelectedPageId]);

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

  // Remember last-used tab for existing pages
  React.useEffect(() => {
    if (selectedPageId) {
      localStorage.setItem("pageEditorTab", activeTab);
    }
  }, [activeTab, selectedPageId]);

  // Listen for sidebar events
  React.useEffect(() => {
    const handleAddBlockEvent = (event: CustomEvent) => {
      const { type } = event.detail;
      handleAddBlock(type);
    };

    const handleSelectPageEvent = (event: CustomEvent) => {
      const { pageId, pageType } = event.detail;
      handleSelectPage(pageId, pageType);
    };

    window.addEventListener("addBlock", handleAddBlockEvent as EventListener);
    window.addEventListener(
      "selectPage",
      handleSelectPageEvent as EventListener
    );

    return () => {
      window.removeEventListener(
        "addBlock",
        handleAddBlockEvent as EventListener
      );
      window.removeEventListener(
        "selectPage",
        handleSelectPageEvent as EventListener
      );
    };
  }, []);

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

  const handleSeoPublish = async (seoData: any) => {
    setIsCreating(true);
    setCreateResult(null);
    try {
      let document: any = {
        ...seoData,
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
      document.slug = {
        _type: "slug",
        current: normalizedSlug,
      };
      let result;
      if (selectedPageId) {
        // Update existing page
        result = await updatePage(
          selectedPageId,
          document,
          selectedPageType || "page"
        );
      } else {
        // Create new page
        result = await createPage(document, selectedPageType || "page");
      }
      setCreateResult(result);
      if (result.success) {
        await new Promise((resolve) => setTimeout(resolve, 2500));
        clearBlocks();
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
              <div className="">
                {displayBlocks
                  .filter(
                    (block): block is Block =>
                      block !== null && block !== undefined && "id" in block
                  )
                  .map((block, idx) => (
                    <BlockPreviewWrapper
                      key={block.id || block._key || block._id || idx}
                      block={block}
                      onEdit={(block) => setEditingBlock(block)}
                      onInspect={(block) => {
                        setInspectedBlock(block);
                        setShowInspector(true);
                      }}
                      onUpdate={handleBlockUpdate}
                      isEditMode={true}
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
        <div className="flex-1 flex flex-col ml-16">
          <div className="flex-1 overflow-y-auto">
            {activeTab === "content" ? (
              <div className="h-full flex flex-col">
                <PreviewPanel className="flex-1" />
              </div>
            ) : (
              <SEOPanel
                initialData={seoData}
                onSave={setSeoData}
                isNewPage={!selectedPageId}
                setCompletionCount={handleSeoBadge}
                onPublish={handleSeoPublish}
              />
            )}
          </div>
        </div>

        {showStructure && !showInspector && !isFullScreen && (
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

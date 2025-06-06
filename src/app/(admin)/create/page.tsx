"use client";

import React, { createContext } from "react";
import { LoadingOverlay, SuccessOverlay } from "../_components/Loading";
import { useRouter } from "next/navigation";
import { createPage, updatePage, deletePage } from "./actions";
import type { Block, DeviceType, BlockType, PageType } from "../types";
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
import { PageCreationWizard } from "../_components/PageCreationWizard";
import { SidebarLeft } from "./_components/Sidebar/SidebarLeft";

const generateKey = (length = 12) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

export const PageBuilderContext = createContext<{
  handleAddBlock: (type: BlockType) => void;
}>({ handleAddBlock: () => {} });

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
  const [selectedPageType, setSelectedPageType] =
    React.useState<PageType | null>(null);
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
  const [showWizard, setShowWizard] = React.useState(!selectedPageId);

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

  // Pass loadedBlocks as initialBlocks to useBlockState
  const {
    blocks: selectedBlocks,
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    clearBlocks,
    setBlocks,
  } = useBlockState(loadedBlocks, false);

  // Sync loadedBlocks with selectedBlocks when loadedBlocks changes
  React.useEffect(() => {
    if (loadedBlocks.length > 0) {
      setBlocks(
        loadedBlocks[0]?.pageBuilder?.map((block: any) => ({
          ...block,
          id: block._key || generateKey(),
        })) || []
      );
    } else if (selectedPageId) {
      setBlocks([]);
    }
  }, [loadedBlocks, setBlocks, selectedPageId]);

  // Use only selectedBlocks for display
  const displayBlocks = selectedBlocks;

  // Update slug when loadedBlocks change
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

  // Handle page selection
  const handleSelectPage = (pageId: string, pageType: PageType) => {
    setSelectedPageId(pageId);
    setSelectedPageType(pageType);
    if (pageType === "homePage") {
      setSlug("/");
    }
  };

  // Handle clearing page selection
  const handleClearPageSelection = () => {
    setSelectedPageId(null);
    setSelectedPageType(null);
    clearBlocks();
    setShowWizard(true);
  };

  // Handle adding a new block
  const handleAddBlock = React.useCallback(
    (type: BlockType) => {
      const newBlock = {
        id: generateKey(),
        type,
      };
      const block = addBlock(type, newBlock);
      setActiveBlock(block);
    },
    [addBlock]
  );

  // Handle removing a block
  const handleRemoveBlock = React.useCallback(
    (id: string) => {
      removeBlock(id);
    },
    [removeBlock]
  );

  // Handle drag and drop reordering
  const handleDragEnd = React.useCallback(
    (result: any) => {
      if (!result.destination) return;
      reorderBlocks(result.source.index, result.destination.index);
    },
    [reorderBlocks]
  );

  // Handle block updates
  const handleBlockUpdate = React.useCallback(
    (blockId: string, updatedBlock: Block) => {
      updateBlock(blockId, updatedBlock);
      if (selectedPageId) {
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
    },
    [loadedBlocks, selectedPageId, updateBlock, updateBlocks]
  );

  // Handle page creation/update
  const handleCreatePage = async (type: PageType = "page") => {
    if (!slug || displayBlocks.length === 0) return;

    setIsCreating(true);
    setCreateResult(null);

    try {
      const document: any = {
        title:
          type === "homePage"
            ? "Home Page"
            : slug.split("/").pop()?.replace(/-/g, " ") || "New Page",
        pageBuilder: displayBlocks.map(
          ({ id, type: blockType, ...blockData }) => ({
            _key: generateKey(),
            _type: blockType,
            ...blockData,
          })
        ),
      };

      const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
      document.slug = {
        _type: "slug",
        current: normalizedSlug,
      };

      let result;
      if (selectedPageId) {
        result = await updatePage(selectedPageId, document, type);
      } else {
        result = await createPage(document, type);
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

  const handleSeoPublish = async (seoData: any) => {
    setIsCreating(true);
    setCreateResult(null);
    try {
      let document: any = {
        ...seoData,
        pageBuilder: displayBlocks.map(
          ({ id, type: blockType, ...blockData }) => ({
            _key: generateKey(),
            _type: blockType,
            ...blockData,
          })
        ),
      };
      const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
      document.slug = {
        _type: "slug",
        current: normalizedSlug,
      };
      let result;
      if (selectedPageId) {
        result = await updatePage(
          selectedPageId,
          document,
          selectedPageType || "page"
        );
      } else {
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

  // Handle wizard completion
  const handleWizardComplete = React.useCallback(
    (data: {
      pageType: "page" | "homePage";
      slug: string;
      title: string;
      templateBlocks: any[];
    }) => {
      setSelectedPageType(data.pageType);
      setSlug(data.slug);
      setBlocks(
        (data.templateBlocks || []).map((block) => ({
          ...block,
          id: block._key || generateKey(),
        }))
      );
      setShowWizard(false);
    },
    [setBlocks]
  );

  // Handle page reset
  const handlePageReset = async () => {
    if (!selectedPageId) return;

    try {
      setIsCreating(true);
      const result = await updatePage(
        selectedPageId,
        {
          pageBuilder: [],
          title: "Reset Page",
        },
        selectedPageType || "page"
      );

      if (result.success) {
        clearBlocks();
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to reset page");
      }
    } catch (error) {
      console.error("Error resetting page:", error);
      alert("Failed to reset page. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle page deletion
  const handlePageDelete = async () => {
    if (
      !selectedPageId ||
      !confirm("Are you sure you want to delete this page?")
    )
      return;

    try {
      setIsCreating(true);
      const result = await deletePage(selectedPageId);

      if (result.success) {
        handleClearPageSelection();
        router.push("/create");
      } else {
        throw new Error(result.error || "Failed to delete page");
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Failed to delete page. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const PreviewPanel = ({ className = "" }: { className?: string }) => {
    const [editingBlock, setEditingBlock] = React.useState<Block | null>(null);

    const handleSaveBlock = React.useCallback(
      (updatedBlock: Block) => {
        handleBlockUpdate(updatedBlock.id, updatedBlock);
      },
      [handleBlockUpdate]
    );

    if (!displayBlocks) {
      return null;
    }

    return (
      <div className={`${className} flex flex-col h-full`}>
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
    <PageBuilderContext.Provider value={{ handleAddBlock }}>
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800 shadow-lg">
        {/* Navbar */}
      </div>
      <div className="flex h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <aside className="relative flex flex-col items-center bg-zinc-900/90 border-zinc-800 py-4 z-40">
          <SidebarLeft />
        </aside>
        <main className="flex-1 flex flex-col h-full min-h-0 ml-16 px-4">
          <div className="flex flex-col flex-grow justify-center items-center h-full min-h-0">
            <div className="w-full mb-4">
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
            </div>
            <div className="flex-1 w-full bg-zinc-900/80 rounded-2xl shadow-2xl border border-zinc-800 p-6 min-h-[400px] flex flex-col items-center justify-center transition-all overflow-auto">
              {displayBlocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <div className="mb-4 text-6xl">🧩</div>
                  <h2 className="text-2xl font-bold text-zinc-200 mb-2">
                    Start building your page
                  </h2>
                  <p className="text-zinc-400 mb-4">
                    Add blocks from the left to begin creating your stunning
                    page.
                  </p>
                  <button
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                    onClick={() => handleAddBlock("heroBlock")}
                  >
                    + Add First Block
                  </button>
                </div>
              ) : (
                <PreviewPanel className="w-full h-full" />
              )}
            </div>
          </div>
        </main>
        {showStructure && !showInspector && !isFullScreen && (
          <aside className="w-80 flex flex-col h-full bg-zinc-900/95 border-l border-zinc-800 shadow-xl z-30">
            <div className="flex-1 overflow-y-auto">
              <StructurePanel
                className="h-full"
                selectedBlocks={displayBlocks}
                onDragEnd={handleDragEnd}
                onRemoveBlock={handleRemoveBlock}
                onReset={handlePageReset}
                onDelete={handlePageDelete}
                isEditing={!!selectedPageId}
              />
            </div>
            <div className="p-4 border-t border-zinc-800 flex gap-2">
              <button
                className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow"
                onClick={handlePageReset}
              >
                Reset Page
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
                onClick={handlePageDelete}
              >
                Delete Page
              </button>
            </div>
          </aside>
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
        {activeTab === "seo" &&
          !showWizard &&
          !showInspector &&
          !isFullScreen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="relative w-full max-w-screen-2xl h-[80vh] bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-6 overflow-y-auto flex flex-col">
                <SEOPanel
                  initialData={seoData}
                  onSave={setSeoData}
                  isNewPage={!selectedPageId}
                  setCompletionCount={handleSeoBadge}
                  onPublish={handleSeoPublish}
                  pageId={selectedPageId || undefined}
                  pageTitle={loadedBlocks[0]?.title || undefined}
                  pageSlug={slug}
                />
                <button
                  className="absolute top-3 right-3 text-zinc-400 hover:text-white text-xl"
                  onClick={() => setActiveTab && setActiveTab("content")}
                  title="Close SEO Panel"
                >
                  ×
                </button>
              </div>
            </div>
          )}
      </div>
      {showWizard && (
        <PageCreationWizard
          onComplete={handleWizardComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}
      {isCreating && (
        <>
          {createResult?.success ? (
            <SuccessOverlay url={slug.startsWith("/") ? slug : `/${slug}`} />
          ) : (
            <LoadingOverlay />
          )}
        </>
      )}
    </PageBuilderContext.Provider>
  );
}

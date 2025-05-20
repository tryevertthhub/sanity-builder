"use client";

import React from "react";
import { BLOCKS } from "@/src/components/blocks";
import { LoadingOverlay, SuccessOverlay } from "../_components/Loading";
import { useRouter } from "next/navigation";
import { createPage } from "./actions";
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

const generateKey = (length = 12) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

export default function CreatePage() {
  const router = useRouter();
  const [selectedBlocks, setSelectedBlocks] = React.useState<Block[]>([]);
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

  const { blocks: loadedBlocks, isLoading } = usePageData(
    selectedPageId,
    selectedPageType
  );

  // Use loaded blocks if viewing a page, otherwise use selected blocks
  const displayBlocks = selectedPageId ? loadedBlocks : selectedBlocks;

  // Handle page selection
  const handleSelectPage = (pageId: string, pageType: string) => {
    setSelectedPageId(pageId);
    setSelectedPageType(pageType);
    setSelectedBlocks([]); // Clear any blocks from create mode
  };

  // Handle clearing page selection
  const handleClearPageSelection = () => {
    setSelectedPageId(null);
    setSelectedPageType(null);
    setSelectedBlocks([]);
  };

  // Handle adding a new block
  const handleAddBlock = (type: BlockType) => {
    const blockDef = BLOCKS[type];
    const schema = blockDef.schema;

    // Get schema-level initial values first
    const schemaInitialValues = (
      typeof schema.initialValue === "object" ? schema.initialValue : {}
    ) as Record<string, any>;

    // Get field-level initial values
    const fieldInitialValues: Record<string, any> = {};
    schema.fields?.forEach((field: any) => {
      if (field.name === "buttons" && !schemaInitialValues?.buttons) {
        fieldInitialValues.buttons = [
          {
            _key: generateKey(),
            text: "Get Started",
            variant: "default",
            url: {
              type: "external",
              external: "#",
              openInNewTab: false,
            },
          },
          {
            _key: generateKey(),
            text: "Learn More",
            variant: "outline",
            url: {
              type: "external",
              external: "#",
              openInNewTab: false,
            },
          },
        ];
      } else if (
        field.initialValue &&
        !(field.name in (schemaInitialValues || {}))
      ) {
        fieldInitialValues[field.name] = field.initialValue;
      }
    });

    const newBlock: Block = {
      id: generateKey(),
      type,
      ...fieldInitialValues,
      ...schemaInitialValues,
    };

    setSelectedBlocks((prev) => [...prev, newBlock]);
    setActiveBlock(newBlock);
  };

  // Handle removing a block
  const handleRemoveBlock = (id: string) => {
    setSelectedBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedBlocks(items);
  };

  // Handle page creation
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

      const result = await createPage(document, type);
      setCreateResult(result);

      if (result.success) {
        // Wait a bit longer for Sanity to process the changes
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Use the normalized slug for redirection
        router.refresh();
        window.location.href = normalizedSlug;
        return;
      } else {
        throw new Error(result.error || "Failed to create page");
      }
    } catch (error) {
      console.error("Error creating page:", error);
      alert("Failed to create page. Please try again.");
      setIsCreating(false);
    }
  };

  const PreviewPanel = ({ className = "" }: { className?: string }) => {
    const [editingBlock, setEditingBlock] = React.useState<Block | null>(null);

    const handleSaveBlock = (updatedBlock: Block) => {
      setSelectedBlocks((prev) =>
        prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
      );
    };

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
        />
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            <DeviceFrame device={device} showDeviceFrame={showDeviceFrame}>
              <div className="p-4">
                {selectedPageId ? (
                  <PagePreview
                    blocks={displayBlocks}
                    isLoading={isLoading}
                    onInspect={(block) => {
                      setInspectedBlock(block);
                      setShowInspector(true);
                    }}
                    enableInspection={showInspector}
                  />
                ) : (
                  displayBlocks.map((block) => (
                    <BlockPreviewWrapper
                      key={block.id}
                      block={block}
                      onEdit={(block) => setEditingBlock(block)}
                      onInspect={(block) => {
                        setInspectedBlock(block);
                        setShowInspector(true);
                      }}
                    />
                  ))
                )}
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

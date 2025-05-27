import React from "react";
import {
  ArrowLeft,
  Maximize2,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Grid,
  LayoutPanelLeft,
  Save,
  Minimize2,
  Code,
  List,
  Layout,
} from "lucide-react";
import { UrlInput } from "./UrlInput";
import { Block, DeviceType } from "../types";

interface PreviewToolbarProps {
  isFullScreen: boolean;
  setIsFullScreen: (value: boolean) => void;
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  showDeviceFrame: boolean;
  setShowDeviceFrame: (show: boolean) => void;
  slug: string;
  setSlug: (slug: string) => void;
  showInspector: boolean;
  setShowInspector: (show: boolean) => void;
  setInspectedBlock: (block: Block | null) => void;
  showStructure: boolean;
  setShowStructure: (show: boolean) => void;
  handleCreatePage: (type: "page" | "homePage") => void;
  isCreating: boolean;
  selectedBlocks: Block[];
  isEditing?: boolean;
  selectedPageId?: string | null;
}

export function PreviewToolbar({
  isFullScreen,
  setIsFullScreen,
  device,
  setDevice,
  showDeviceFrame,
  setShowDeviceFrame,
  slug,
  setSlug,
  showInspector,
  setShowInspector,
  setInspectedBlock,
  showStructure,
  setShowStructure,
  handleCreatePage,
  isCreating,
  selectedBlocks,
  isEditing = false,
  selectedPageId = null,
}: PreviewToolbarProps) {
  const [pageType, setPageType] = React.useState<"page" | "homePage">(
    selectedPageId === "homePage" ? "homePage" : "page",
  );
  const [localSlug, setLocalSlug] = React.useState(slug);

  // Update local slug when prop changes
  React.useEffect(() => {
    setLocalSlug(slug);
  }, [slug]);

  // Debounce the slug update
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSlug !== slug) {
        setSlug(localSlug);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSlug, slug, setSlug]);

  return (
    <div className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
            title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullScreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded-lg transition-colors ${
                device === "desktop"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-1.5 rounded-lg transition-colors ${
                device === "tablet"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
              title="Tablet view"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded-lg transition-colors ${
                device === "mobile"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowDeviceFrame(!showDeviceFrame)}
            className={`p-1.5 rounded-lg transition-colors ${
              showDeviceFrame
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            }`}
            title={showDeviceFrame ? "Hide device frame" : "Show device frame"}
          >
            <Layout className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {isEditing && selectedPageId && (
            <div className="text-sm text-zinc-400">
              Editing: <span className="text-white">{selectedPageId}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={localSlug}
              onChange={(e) => setLocalSlug(e.target.value)}
              placeholder="Enter page URL..."
              className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={pageType}
              onChange={(e) =>
                setPageType(e.target.value as "page" | "homePage")
              }
              className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="page">Regular Page</option>
              <option value="homePage">Home Page</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowInspector(!showInspector);
                setShowStructure(!showInspector);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                showInspector
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
              title={showInspector ? "Hide inspector" : "Show inspector"}
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowStructure(!showStructure)}
              className={`p-1.5 rounded-lg transition-colors ${
                showStructure
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
              title={showStructure ? "Hide structure" : "Show structure"}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleCreatePage(pageType)}
            disabled={isCreating || !localSlug || selectedBlocks.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed rounded-lg text-white transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isCreating
                ? "Publishing..."
                : isEditing
                  ? "Update Page"
                  : "Publish"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

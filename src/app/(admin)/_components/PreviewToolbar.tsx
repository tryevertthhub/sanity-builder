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
} from "lucide-react";
import { UrlInput } from "./UrlInput";

interface PreviewToolbarProps {
  isFullScreen: boolean;
  setIsFullScreen: (value: boolean) => void;
  device: "mobile" | "tablet" | "laptop" | "desktop";
  setDevice: (device: "mobile" | "tablet" | "laptop" | "desktop") => void;
  showDeviceFrame: boolean;
  setShowDeviceFrame: (value: boolean) => void;
  slug: string;
  setSlug: (value: string) => void;
  showInspector: boolean;
  setShowInspector: (value: boolean) => void;
  setInspectedBlock: (value: any | null) => void;
  showStructure: boolean;
  setShowStructure: (value: boolean) => void;
  handleCreatePage: (type: "page" | "homePage") => void;
  isCreating: boolean;
  selectedBlocks: any[];
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
}: PreviewToolbarProps) {
  const [pageType, setPageType] = React.useState<"page" | "homePage">(
    slug === "/" ? "homePage" : "page"
  );

  return (
    <div className="h-15 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {isFullScreen ? (
            <button
              onClick={() => setIsFullScreen(false)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Exit Preview</span>
            </button>
          ) : (
            <button
              onClick={() => setIsFullScreen(true)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="h-6 w-px bg-zinc-800" />

        {/* Device switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1">
            <button
              onClick={() => setDevice("mobile")}
              className={`p-2 rounded-md ${
                device === "mobile"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              } transition-all duration-200`}
              title="Mobile view (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-2 rounded-md ${
                device === "tablet"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              } transition-all duration-200`}
              title="Tablet view (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("laptop")}
              className={`p-2 rounded-md ${
                device === "laptop"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              } transition-all duration-200`}
              title="Laptop view (1024px)"
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("desktop")}
              className={`p-2 rounded-md ${
                device === "desktop"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              } transition-all duration-200`}
              title="Desktop view (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeviceFrame(!showDeviceFrame)}
              className={`p-2 rounded-lg ${
                showDeviceFrame
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              } transition-all duration-200`}
              title="Toggle device frame"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* URL Input */}
        <UrlInput value={slug} onChange={setSlug} onTypeChange={setPageType} />

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1">
            <button
              onClick={() => {
                if (showInspector) {
                  setShowInspector(false);
                  setInspectedBlock(null);
                  setShowStructure(true);
                } else {
                  setShowStructure(!showStructure);
                }
              }}
              className={`p-2 rounded-md ${
                showStructure && !showInspector
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              } transition-all duration-200`}
              title="Toggle structure panel"
            >
              <LayoutPanelLeft className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleCreatePage(pageType)}
            disabled={isCreating || !slug || selectedBlocks.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed rounded-lg text-white transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isCreating ? "Publishing..." : "Publish"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

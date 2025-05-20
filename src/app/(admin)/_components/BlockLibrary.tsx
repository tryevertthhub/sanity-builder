import React from "react";
import {
  Search,
  Plus,
  Globe,
  PanelTop,
  PanelBottom,
  Layers,
  FileText,
  LayoutPanelLeft,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { BLOCK_COMPONENTS } from "@/src/components/blocks";
import { PagesList } from "./PagesList";

type BlockType = keyof typeof BLOCK_COMPONENTS;

const globalBlockTypes = ["navbarBlock", "footerBlock"] as const;
const blockTypes = Object.entries(BLOCK_COMPONENTS)
  .filter(([key]) => !globalBlockTypes.includes(key as any))
  .map(([key, Component]) => ({
    key: key as BlockType,
    name: Component.name || key,
  }));

interface BlockLibraryProps {
  onAddBlock: (type: BlockType) => void;
  onAddGlobalComponent: (type: (typeof globalBlockTypes)[number]) => void;
  onSelectPage?: (pageId: string, pageType: string) => void;
}

export function BlockLibrary({
  onAddBlock,
  onAddGlobalComponent,
  onSelectPage,
}: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter blocks based on search
  const filteredBlocks = blockTypes.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <LayoutPanelLeft className="w-5 h-5 text-zinc-400" />
          Block Builder
        </h2>
      </div>
      <Tabs defaultValue="blocks" className="h-full mt-2 px-2">
        <TabsList className="w-full border-b border-zinc-800 px-1">
          <TabsTrigger value="blocks" className="flex-1">
            <Layers className="w-4 h-4 mr-2" />
            Blocks
          </TabsTrigger>
          {/* <TabsTrigger value="global" className="flex-1">
            <Globe className="w-4 h-4 mr-2" />
            Global
          </TabsTrigger> */}
          <TabsTrigger value="pages" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Pages
          </TabsTrigger>
        </TabsList>

        <div className="h-[calc(100%-48px)] overflow-hidden">
          <TabsContent value="blocks" className="h-full">
            <div className="h-full flex flex-col">
              <div className="border-b border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blocks..."
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                <div className="grid grid-cols-1 gap-2 p-4">
                  {filteredBlocks.map(({ key, name }) => (
                    <button
                      key={key}
                      onClick={() => onAddBlock(key)}
                      className="flex items-center gap-3 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors text-left group"
                    >
                      <div className="w-8 h-8 bg-zinc-800 group-hover:bg-zinc-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {name}
                        </div>
                        <div className="text-xs text-zinc-500">
                          Add {name} block
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="global" className="h-full overflow-y-auto">
            <div className="grid grid-cols-1 gap-2 p-4">
              {[
                {
                  key: "navbarBlock" as const,
                  name: "Navigation",
                  icon: PanelTop,
                },
                {
                  key: "footerBlock" as const,
                  name: "Footer",
                  icon: PanelBottom,
                },
              ].map(({ key, name, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => onAddGlobalComponent(key)}
                  className="flex items-center gap-3 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors text-left group"
                >
                  <div className="w-8 h-8 bg-zinc-800 group-hover:bg-zinc-700 rounded-md flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{name}</div>
                    <div className="text-xs text-zinc-500">
                      Add {name} component
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pages" className="h-full overflow-y-auto">
            <PagesList onSelectPage={onSelectPage} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

import { Layers } from "lucide-react";
import { Sidebar } from "./index";
import { BlocksPanel } from "../Panels/BlocksPanel";
import { useContext } from "react";
import { PageBuilderContext } from "../../page";

// Wrap Lucide icon in a function to match IconType
const LayersIcon = (props: any) => <Layers {...props} />;

export const SidebarLeft = () => {
  // Use context or props to get handleAddBlock from the page builder
  const { handleAddBlock } = useContext(PageBuilderContext);

  const buttons = [
    {
      id: "blocks",
      icon: LayersIcon,
      panelContent: (
        <div className="rounded-2xl bg-zinc-900/95 shadow-2xl border border-zinc-800 p-4 mt-4">
          <BlocksPanel onAddBlock={handleAddBlock} />
        </div>
      ),
    },
  ];

  return <Sidebar position="left" buttons={buttons} defaultPanel="blocks" />;
};

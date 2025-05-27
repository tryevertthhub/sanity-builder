import { Layers, PenLine, FileText } from "lucide-react";
import { Sidebar } from "./index";
import { BlocksPanel } from "../Panels/BlocksPanel";
import { BlogPanel } from "../Panels/BlogPanel";
import { PagesPanel } from "../Panels/PagesPanel";

export const SidebarLeft = () => {
  const buttons = [
    {
      id: "blocks",
      icon: Layers,
      panelContent: <BlocksPanel />,
    },
    {
      id: "blog",
      icon: PenLine,
      panelContent: <BlogPanel />,
    },
    {
      id: "pages",
      icon: FileText,
      panelContent: <PagesPanel />,
    },
  ];

  return <Sidebar position="left" buttons={buttons} defaultPanel="blocks" />;
};

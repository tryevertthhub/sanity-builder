import React from "react";
import { Code, X, Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Block } from "../types";
import { BLOCK_COMPONENTS } from "@/src/components/blocks";

type CodeInspectorProps = {
  inspectedBlock: Block | null;
  showInspector: boolean;
  setShowInspector: (show: boolean) => void;
  setInspectedBlock: (block: Block | null) => void;
  showStructure: boolean;
  setShowStructure: (show: boolean) => void;
};

export function CodeInspector({
  inspectedBlock,
  showInspector,
  setShowInspector,
  setInspectedBlock,
  showStructure,
  setShowStructure,
}: CodeInspectorProps) {
  const [activeTab, setActiveTab] = React.useState<"component" | "schema">(
    "component"
  );
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [blockData, setBlockData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const response = await fetch(
          `/api/blocks?type=${inspectedBlock?.type}`
        );
        const data = await response.json();
        if (data.blocks) {
          const block = data.blocks.find(
            (b: any) =>
              b.name.toLowerCase() === inspectedBlock?.type.toLowerCase()
          );
          if (block) {
            setBlockData({
              ...block,
              component: BLOCK_COMPONENTS[inspectedBlock.type],
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch block data:", error);
        setIsLoading(false);
      }
    };

    if (inspectedBlock) {
      fetchBlockData();
    }
  }, [inspectedBlock?.type]);

  const getCodeContent = () => {
    if (!blockData) return "";

    switch (activeTab) {
      case "component":
        return blockData.code;
      case "schema":
        return blockData.schema;
      default:
        return "";
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCodeContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-w-[600px] border-l border-zinc-800 bg-zinc-900/95 backdrop-blur-xl">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white">
            Loading Block Data...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-w-[600px] border-l border-zinc-800 bg-zinc-900/95 backdrop-blur-xl flex flex-col h-full ${
        showInspector ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-zinc-400" />
          Block Code
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowInspector(false);
              setInspectedBlock(null);
              if (!showStructure) {
                setShowStructure(true);
              }
            }}
            className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-4 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("component")}
          className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
            activeTab === "component"
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Component
        </button>
        <button
          onClick={() => setActiveTab("schema")}
          className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
            activeTab === "schema"
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Schema
        </button>
        <button
          onClick={copyToClipboard}
          className="ml-auto text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <SyntaxHighlighter
          language="typescript"
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "10px",
            height: "100%",
            overflow: "auto",
          }}
          showLineNumbers={true}
          wrapLongLines={false}
          wrapLines={false}
        >
          {getCodeContent()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Code, Copy, Eye, Info, Wand2 } from "lucide-react";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BLOCK_COMPONENTS } from "@/src/components/blocks";
import { BlockPrompt } from "../components/BlockPrompt";

export default function BlockDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = React.use(params);
  // Find the matching block key by removing 'Block' suffix
  const blockKey = Object.keys(BLOCK_COMPONENTS).find(
    (key) => type.toLowerCase().replace(/block$/i, "") === key.toLowerCase(),
  );

  const [activeTab, setActiveTab] = React.useState<"code" | "info" | "prompt">(
    "code",
  );
  const [activeCodeTab, setActiveCodeTab] = React.useState<
    "component" | "schema"
  >("component");
  const [isLoading, setIsLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [blockData, setBlockData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const response = await fetch("/api/blocks");
        const data = await response.json();
        if (data.blocks) {
          const block = data.blocks.find(
            (b: any) => b.name.toLowerCase() === type.toLowerCase(),
          );
          if (block && blockKey) {
            // Get initial values from the schema object
            const schemaModule = block.schemaObject;
            const schema =
              schemaModule.default || Object.values(schemaModule)[0];

            // Get schema-level initial values
            const schemaInitialValues = schema.initialValue || {};

            // Get field-level initial values
            const fieldInitialValues = {};
            schema.fields?.forEach((field: any) => {
              if (field.initialValue && !(field.name in schemaInitialValues)) {
                fieldInitialValues[field.name] = field.initialValue;
              }
            });

            setBlockData({
              ...block,
              component: BLOCK_COMPONENTS[blockKey],
              sampleData: {
                _type: schema.name,
                ...fieldInitialValues, // Field-level values first
                ...schemaInitialValues, // Schema-level values override if needed
              },
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch block data:", error);
        setIsLoading(false);
      }
    };

    fetchBlockData();
  }, [type, blockKey]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Loading Block Data...</h1>
        </div>
      </div>
    );
  }

  if (!blockData || !BLOCK_COMPONENTS[blockKey]) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Block Not Found</h1>
          <p className="text-gray-400 mb-8">
            The block type "{type}" is not available for preview.
          </p>
          <Link
            href="/explore"
            className="text-blue-500 hover:text-blue-400 flex items-center justify-center gap-2"
          >
            ← Back to Blocks
          </Link>
        </div>
      </div>
    );
  }

  // Function to get the appropriate code based on the active tab
  const getCodeContent = () => {
    switch (activeCodeTab) {
      case "component":
        return blockData.code || "// Loading component code...";
      case "schema":
        return blockData.schema || "// Loading schema code...";
      default:
        return "";
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Preview Section */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-white">{type}</h1>
        </div>
        <div className="border border-[#181818] rounded-xl overflow-hidden ">
          <blockData.component {...blockData.sampleData} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-[450px] border-l border-[#181818] overflow-hidden flex flex-col bg-black/50 backdrop-blur-sm">
        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center px-6 py-3 transition-colors ${
              activeTab === "code"
                ? "text-white border-b-2 border-blue-500 bg-white/5"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Code className="mr-2" size={16} />
            Code
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`flex items-center px-6 py-3 transition-colors ${
              activeTab === "info"
                ? "text-white border-b-2 border-blue-500 bg-white/5"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Info className="mr-2" size={16} />
            Info
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`flex items-center px-6 py-3 transition-colors ${
              activeTab === "prompt"
                ? "text-white border-b-2 border-blue-500 bg-white/5"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Wand2 className="mr-2" size={16} />
            Prompt
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "code" && (
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveCodeTab("component")}
                  className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                    activeCodeTab === "component"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Component
                </button>
                <button
                  onClick={() => setActiveCodeTab("schema")}
                  className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                    activeCodeTab === "schema"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Schema
                </button>
              </div>

              <div className="relative group">
                <button
                  onClick={() => copyToClipboard(getCodeContent())}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-xs">Copied!</span>
                    </div>
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <SyntaxHighlighter
                  language="typescript"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",

                    fontSize: "10px",
                  }}
                  showLineNumbers={true}
                  wrapLongLines={false}
                  wrapLines={false}
                >
                  {getCodeContent()}
                </SyntaxHighlighter>
              </div>
            </div>
          )}

          {activeTab === "info" && (
            <div className="p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  The <span className="text-blue-400 font-medium">{type}</span>{" "}
                  is a versatile component designed for creating impactful page
                  sections. It supports the following features:
                </p>
                {blockData.schema && (
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-white mb-4">
                      Schema Fields
                    </h4>
                    <div className="space-y-4">
                      {typeof blockData.schema === "object" &&
                        blockData.schema.fields?.map((field: any) => (
                          <div
                            key={field.name}
                            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <strong className="text-blue-400">
                                {field.title || field.name}
                              </strong>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                {field.type}
                              </span>
                            </div>
                            {field.description && (
                              <p className="mt-2 text-sm text-gray-400">
                                {field.description}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "prompt" && (
            <BlockPrompt
              blockName={type}
              componentCode={blockData.code}
              schemaCode={blockData.schema}
            />
          )}
        </div>
      </div>
    </div>
  );
}

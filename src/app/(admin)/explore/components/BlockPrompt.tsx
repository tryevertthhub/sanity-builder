import React from "react";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type BlockPromptProps = {
  blockName: string;
  componentCode: string;
  schemaCode: string;
};

export function BlockPrompt({
  blockName,
  componentCode,
  schemaCode,
}: BlockPromptProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const generateCursorPrompt = () => {
    // Convert PascalCase to camelCase for the key in BLOCK_COMPONENTS
    const camelCaseName = blockName
      .replace(/Block$/, "")
      .replace(/^[A-Z]/, (c) => c.toLowerCase());

    return `Create a new Sanity block called ${blockName} with the following structure:

First, ensure you have these dependencies in your project:
\`\`\`json
{
  "dependencies": {
    "@sanity/client": "latest",
    "lucide-react": "latest",
    "next": "latest",
    "sanity": "latest",
    "@portabletext/react": "latest",
    "@sanity/image-url": "latest"
  }
}
\`\`\`

Project Structure:
\`\`\`
src/
  components/
    blocks/
      index.ts         # Central registry of all blocks
      ${blockName}/    # Your block folder
        index.tsx      # Component implementation
        schema.ts      # Sanity schema definition
    richtext/         # Portable Text renderer
    preview-image/    # Sanity image component
\`\`\`

Component (src/components/blocks/${blockName}/index.tsx):
\`\`\`typescript
${componentCode}
\`\`\`

Schema (src/components/blocks/${blockName}/schema.ts):
\`\`\`typescript
${schemaCode}
\`\`\`

You'll need these shared components:
- \`RichText\` component for rendering Portable Text
- \`PreviewImage\` component for Sanity image handling
- Common schema fields (\`buttonsField\`, \`richTextField\`) in \`@/src/sanity/schemaTypes/common\`

Integration Steps:
1. Create the block directory: src/components/blocks/${blockName}
2. Add the component file (index.tsx) with the provided code
3. Add the schema file (schema.ts) with the provided code
4. Register the block in src/components/blocks/index.ts:

\`\`\`typescript
// At the top with other schema imports
import { ${camelCaseName} } from "./${blockName}/schema";

// In the component imports section
import { ${blockName} } from "./${blockName}";

// Add to BLOCK_COMPONENTS (key should be camelCase, value is the PascalCase component)
export const BLOCK_COMPONENTS = {
  // ... existing components
  ${camelCaseName}: ${blockName},
} as const;

// Add to pageBuilderBlocks array for Sanity Studio
export const pageBuilderBlocks = [
  // ... existing blocks
  ${camelCaseName},
];
\`\`\`

Note: The block name in BLOCK_COMPONENTS uses camelCase (${camelCaseName}), while the component name uses PascalCase (${blockName}). This follows the existing pattern in your blocks registry.

The block will then be available in:
1. Your page builder through BLOCK_COMPONENTS
2. Sanity Studio through pageBuilderBlocks
3. The explore page for previewing and generating new blocks`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">
          Generate Block with Cursor
        </h3>
        <p className="text-sm text-gray-400">
          Copy this prompt to create this block in another project using Cursor
          AI. The prompt includes all necessary code and instructions.
        </p>
      </div>
      <div className="relative group">
        <button
          onClick={() => copyToClipboard(generateCursorPrompt())}
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
        <div className="rounded-xl overflow-hidden shadow-xl shadow-black/20">
          <SyntaxHighlighter
            language="markdown"
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              fontSize: "10px",
            }}
          >
            {generateCursorPrompt()}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

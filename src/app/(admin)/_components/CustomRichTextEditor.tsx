import React, { useState, useRef, useCallback } from "react";

type BlockType = "paragraph" | "h1" | "h2" | "ul" | "ol";

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

const BLOCK_COMMANDS = [
  { type: "h1" as BlockType, label: "Heading 1" },
  { type: "h2" as BlockType, label: "Heading 2" },
  { type: "ul" as BlockType, label: "Bulleted List" },
  { type: "ol" as BlockType, label: "Numbered List" },
];

function getCaretCoordinates(textarea: HTMLTextAreaElement) {
  const div = document.createElement("div");
  const style = getComputedStyle(textarea);
  for (const prop of [
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontSizeAdjust",
    "lineHeight",
    "fontFamily",
    "textAlign",
    "textTransform",
    "textIndent",
    "textDecoration",
    "letterSpacing",
    "wordSpacing",
  ]) {
    // @ts-ignore
    div.style[prop] = style[prop];
  }
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.top = textarea.offsetTop + "px";
  div.style.left = textarea.offsetLeft + "px";
  div.style.zIndex = "-1000";
  div.textContent = textarea.value.substring(0, textarea.selectionStart!);
  const span = document.createElement("span");
  span.textContent =
    textarea.value.substring(
      textarea.selectionStart!,
      textarea.selectionStart! + 1
    ) || ".";
  div.appendChild(span);
  document.body.appendChild(div);
  const rect = span.getBoundingClientRect();
  const coords = { left: rect.left, top: rect.top + rect.height };
  document.body.removeChild(div);
  return coords;
}

export default function CustomRichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  // The main content is a list of blocks, but by default it's a single paragraph block
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      return value
        ? JSON.parse(value)
        : [{ id: "1", type: "paragraph", content: "" }];
    } catch {
      return [{ id: "1", type: "paragraph", content: "" }];
    }
  });
  const [showSlash, setShowSlash] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(
    blocks[0].id
  );
  const [slashMenuPos, setSlashMenuPos] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const textareaRefs = useRef<{ [id: string]: HTMLTextAreaElement | null }>({});

  // Update parent
  const updateBlocks = useCallback(
    (newBlocks: Block[]) => {
      setBlocks(newBlocks);
      onChange(JSON.stringify(newBlocks));
    },
    [onChange]
  );

  // Handle input in paragraph block
  const handleParagraphInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    blockId: string
  ) => {
    const newBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, content: e.target.value } : block
    );
    updateBlocks(newBlocks);
  };

  // Handle keydown in paragraph block
  const handleParagraphKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    blockId: string
  ) => {
    if (showSlash) {
      if (e.key === "ArrowDown") {
        setSlashIndex((i) => (i + 1) % BLOCK_COMMANDS.length);
        e.preventDefault();
        return;
      } else if (e.key === "ArrowUp") {
        setSlashIndex(
          (i) => (i - 1 + BLOCK_COMMANDS.length) % BLOCK_COMMANDS.length
        );
        e.preventDefault();
        return;
      } else if (e.key === "Enter") {
        e.preventDefault();
        insertSpecialBlock(blockId, BLOCK_COMMANDS[slashIndex].type);
        return;
      } else if (e.key === "Escape") {
        setShowSlash(false);
        e.preventDefault();
        return;
      }
    }
    if (e.key === "/") {
      setShowSlash(true);
      setSlashIndex(0);
      setActiveBlockId(blockId);
      setTimeout(() => {
        const textarea = textareaRefs.current[blockId];
        if (textarea) {
          const coords = getCaretCoordinates(textarea);
          setSlashMenuPos({
            top: coords.top + window.scrollY,
            left: coords.left + window.scrollX,
          });
        }
      }, 0);
      e.preventDefault();
    }
  };

  // Insert a special block at the caret position in the paragraph
  const insertSpecialBlock = (blockId: string, type: BlockType) => {
    const textarea = textareaRefs.current[blockId];
    if (!textarea) return;
    const caret = textarea.selectionStart || 0;
    const content = textarea.value;
    const before = content.slice(0, caret - 1); // Remove the slash
    const after = content.slice(caret);
    const newBlocks: Block[] = [];
    // Add text before slash as paragraph
    if (before)
      newBlocks.push({
        id: Date.now() + "-p1",
        type: "paragraph",
        content: before,
      });
    // Add the special block
    newBlocks.push({ id: Date.now() + "-sp", type, content: "" });
    // Add text after caret as paragraph
    if (after)
      newBlocks.push({
        id: Date.now() + "-p2",
        type: "paragraph",
        content: after,
      });
    // Replace the current block with new blocks
    const idx = blocks.findIndex((b) => b.id === blockId);
    const updated = [
      ...blocks.slice(0, idx),
      ...newBlocks,
      ...blocks.slice(idx + 1),
    ];
    updateBlocks(updated);
    setShowSlash(false);
    setTimeout(() => {
      // Focus the special block
      const spId = newBlocks.find((b) => b.type === type)?.id;
      if (spId && textareaRefs.current[spId]) {
        textareaRefs.current[spId]?.focus();
      }
    }, 0);
  };

  // Handle input in special block
  const handleSpecialInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    blockId: string
  ) => {
    const newBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, content: e.target.value } : block
    );
    updateBlocks(newBlocks);
  };

  // Handle keydown in special block
  const handleSpecialKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    blockId: string
  ) => {
    const idx = blocks.findIndex((b) => b.id === blockId);
    const block = blocks[idx];
    // List block Enter logic
    if (block.type === "ul" || block.type === "ol") {
      if (e.key === "Enter") {
        e.preventDefault();
        if (block.content.trim() === "") {
          // Exit list: insert paragraph below
          const newBlock: Block = {
            id: Date.now().toString(),
            type: "paragraph",
            content: "",
          };
          const updated = [
            ...blocks.slice(0, idx + 1),
            newBlock,
            ...blocks.slice(idx + 1),
          ];
          updateBlocks(updated);
          setTimeout(() => {
            textareaRefs.current[newBlock.id]?.focus();
          }, 0);
        } else {
          // New list item
          const newBlock: Block = {
            id: Date.now().toString(),
            type: block.type,
            content: "",
          };
          const updated = [
            ...blocks.slice(0, idx + 1),
            newBlock,
            ...blocks.slice(idx + 1),
          ];
          updateBlocks(updated);
          setTimeout(() => {
            textareaRefs.current[newBlock.id]?.focus();
          }, 0);
        }
        return;
      }
    }
    // Slash command in special block
    if (showSlash) {
      if (e.key === "ArrowDown") {
        setSlashIndex((i) => (i + 1) % BLOCK_COMMANDS.length);
        e.preventDefault();
        return;
      } else if (e.key === "ArrowUp") {
        setSlashIndex(
          (i) => (i - 1 + BLOCK_COMMANDS.length) % BLOCK_COMMANDS.length
        );
        e.preventDefault();
        return;
      } else if (e.key === "Enter") {
        e.preventDefault();
        insertSpecialBlock(blockId, BLOCK_COMMANDS[slashIndex].type);
        return;
      } else if (e.key === "Escape") {
        setShowSlash(false);
        e.preventDefault();
        return;
      }
    }
    if (e.key === "/") {
      setShowSlash(true);
      setSlashIndex(0);
      setActiveBlockId(blockId);
      setTimeout(() => {
        const textarea = textareaRefs.current[blockId];
        if (textarea) {
          const coords = getCaretCoordinates(textarea);
          setSlashMenuPos({
            top: coords.top + window.scrollY,
            left: coords.left + window.scrollX,
          });
        }
      }, 0);
      e.preventDefault();
    }
    // Default: Enter in heading or other special block creates paragraph below
    if ((block.type === "h1" || block.type === "h2") && e.key === "Enter") {
      e.preventDefault();
      const newBlock: Block = {
        id: Date.now().toString(),
        type: "paragraph",
        content: "",
      };
      const updated = [
        ...blocks.slice(0, idx + 1),
        newBlock,
        ...blocks.slice(idx + 1),
      ];
      updateBlocks(updated);
      setTimeout(() => {
        textareaRefs.current[newBlock.id]?.focus();
      }, 0);
    }
  };

  // Render block
  const renderBlock = (block: Block, idx: number) => {
    const ref = (el: HTMLTextAreaElement | null) => {
      textareaRefs.current[block.id] = el;
    };
    if (block.type === "paragraph") {
      return (
        <textarea
          ref={ref}
          value={block.content}
          onChange={(e) => handleParagraphInput(e, block.id)}
          onKeyDown={(e) => handleParagraphKeyDown(e, block.id)}
          className="w-full outline-none resize-none bg-transparent text-base block-textarea"
          style={{ minHeight: "2em", lineHeight: 1.7, marginBottom: "0.2em" }}
          placeholder="Type '/' for commands"
          rows={1}
          autoCorrect="on"
          autoCapitalize="sentences"
          spellCheck={true}
        />
      );
    }
    if (block.type === "h1") {
      return (
        <textarea
          ref={ref}
          value={block.content}
          onChange={(e) => handleSpecialInput(e, block.id)}
          onKeyDown={(e) => handleSpecialKeyDown(e, block.id)}
          className="w-full outline-none resize-none bg-transparent text-4xl font-extrabold mb-2 mt-6 block-heading block-textarea"
          style={{ lineHeight: 1.2, marginBottom: "0.2em" }}
          placeholder="Heading 1"
          rows={1}
          autoCorrect="on"
          autoCapitalize="sentences"
          spellCheck={true}
        />
      );
    }
    if (block.type === "h2") {
      return (
        <textarea
          ref={ref}
          value={block.content}
          onChange={(e) => handleSpecialInput(e, block.id)}
          onKeyDown={(e) => handleSpecialKeyDown(e, block.id)}
          className="w-full outline-none resize-none bg-transparent text-2xl font-bold mb-1 mt-4 block-heading block-textarea"
          style={{ lineHeight: 1.3, marginBottom: "0.2em" }}
          placeholder="Heading 2"
          rows={1}
          autoCorrect="on"
          autoCapitalize="sentences"
          spellCheck={true}
        />
      );
    }
    if (block.type === "ul") {
      return (
        <div className="flex flex-row items-start gap-2 align-middle min-h-[2em] block-list-row">
          <span
            className="select-none text-lg leading-none align-middle pt-2.5 pl-1 pr-1.5"
            style={{ width: "1.5em", textAlign: "right" }}
          >
            •
          </span>
          <textarea
            ref={ref}
            value={block.content}
            onChange={(e) => handleSpecialInput(e, block.id)}
            onKeyDown={(e) => handleSpecialKeyDown(e, block.id)}
            className="w-full outline-none resize-none bg-transparent text-base block-listitem block-textarea"
            style={{ lineHeight: 1.7, marginBottom: "0.2em" }}
            placeholder="List item"
            rows={1}
            autoCorrect="on"
            autoCapitalize="sentences"
            spellCheck={true}
          />
        </div>
      );
    }
    if (block.type === "ol") {
      // Find the number for this ol block (consecutive ols)
      let n = 1;
      for (let i = idx - 1; i >= 0; i--) {
        if (blocks[i].type === "ol") n++;
        else break;
      }
      return (
        <div className="flex flex-row items-start gap-2 align-middle min-h-[2em] block-list-row">
          <span
            className="select-none text-lg leading-none align-middle pt-2.5 pl-1 pr-1.5"
            style={{ width: "1.5em", textAlign: "right" }}
          >
            {n}.
          </span>
          <textarea
            ref={ref}
            value={block.content}
            onChange={(e) => handleSpecialInput(e, block.id)}
            onKeyDown={(e) => handleSpecialKeyDown(e, block.id)}
            className="w-full outline-none resize-none bg-transparent text-base block-listitem block-textarea"
            style={{ lineHeight: 1.7, marginBottom: "0.2em" }}
            placeholder="List item"
            rows={1}
            autoCorrect="on"
            autoCapitalize="sentences"
            spellCheck={true}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full">
      <style>{`
        .block-textarea::placeholder {
          color: #aaa;
          opacity: 0.7;
        }
        .block-heading {
          background: none;
          border: none;
        }
        .block-listitem {
          background: none;
          border: none;
        }
        .block-list-row {
          margin-bottom: 0.2em;
          align-items: flex-start;
        }
        .block-list-row textarea {
          margin-top: 0.1em;
        }
        .block-list-row span {
          margin-top: 0.45em;
        }
      `}</style>
      <div className="w-full min-h-[200px] border border-gray-300 p-4 rounded">
        {blocks.map((block, idx) => (
          <div key={block.id} className="mb-1 last:mb-0">
            {renderBlock(block, idx)}
          </div>
        ))}
      </div>
      {showSlash && activeBlockId && (
        <div
          className="absolute z-50 bg-white border border-gray-300 rounded shadow-xl"
          style={{
            top: slashMenuPos.top + 4,
            left: slashMenuPos.left,
            minWidth: 220,
          }}
        >
          {BLOCK_COMMANDS.map((b, i) => (
            <div
              key={b.type}
              className={`px-4 py-2 cursor-pointer flex items-center gap-2 text-sm ${
                i === slashIndex
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                insertSpecialBlock(activeBlockId, b.type);
              }}
              tabIndex={0}
              aria-selected={i === slashIndex}
            >
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

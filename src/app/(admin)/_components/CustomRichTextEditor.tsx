import React, { useRef, useState, useEffect } from "react";

const BLOCK_COMMANDS = [
  { type: "paragraph", label: "Text" },
  { type: "h1", label: "Heading 1" },
  { type: "h2", label: "Heading 2" },
  { type: "ul", label: "Bulleted List" },
  { type: "ol", label: "Numbered List" },
];

export default function CustomRichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSlash, setShowSlash] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const [slashPos, setSlashPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Force LTR direction on the editor
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.dir = "ltr";
      editor.lang = "en";
      editor.style.direction = "ltr";
      editor.style.textAlign = "left";
      editor.style.unicodeBidi = "embed";
    }
  }, []);

  // Handle input
  const handleInput = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      onChange(htmlContent);
    }
  };

  // Handle keydown for slash command
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const sel = window.getSelection();
    if (!sel) return;

    // Force LTR on any new content
    if (editorRef.current) {
      editorRef.current.dir = "ltr";
      editorRef.current.style.direction = "ltr";
    }

    const node = sel.anchorNode;
    if (!node) return;
    const text = node.textContent || "";

    // Show slash menu if '/' is typed at start of line
    if (e.key === "/" && text.trim() === "") {
      e.preventDefault(); // Prevent the slash from being typed
      setShowSlash(true);
      setSlashIndex(0);
      // Position menu below caret
      setTimeout(() => {
        const range = sel.getRangeAt(0).cloneRange();
        const rect = range.getBoundingClientRect();
        setSlashPos({
          top: rect.bottom + window.scrollY + 5,
          left: rect.left + window.scrollX,
        });
      }, 0);
    } else if (showSlash) {
      if (e.key === "ArrowDown") {
        setSlashIndex((i) => (i + 1) % BLOCK_COMMANDS.length);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSlashIndex(
          (i) => (i - 1 + BLOCK_COMMANDS.length) % BLOCK_COMMANDS.length
        );
        e.preventDefault();
      } else if (e.key === "Enter") {
        e.preventDefault();
        formatOrInsertBlock(BLOCK_COMMANDS[slashIndex].type);
        setShowSlash(false);
      } else if (e.key === "Escape") {
        setShowSlash(false);
        e.preventDefault();
      } else {
        setShowSlash(false);
      }
    }
  };

  // Format current block or insert new block
  const formatOrInsertBlock = (type: string) => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel) return;

    const range = sel.getRangeAt(0);
    let block = sel.anchorNode as HTMLElement | null;

    // Find the parent block element
    while (block && block !== editorRef.current && block.nodeType !== 1) {
      block = block.parentElement;
    }

    if (!block || block === editorRef.current) {
      // Fallback: insert new block
      insertBlock(type);
      return;
    }

    // If block is empty or only contains '/', replace it
    const blockText = block.textContent || "";
    if (
      blockText.trim() === "/" ||
      blockText.trim() === "" ||
      blockText.trim() === "\u200E"
    ) {
      // Replace block with new type
      const newBlock = createBlock(type);
      block.replaceWith(newBlock);

      // Move caret to new block
      setTimeout(() => {
        focusBlock(newBlock, sel);
        handleInput();
      }, 0);
    } else {
      // Insert new block after current
      insertBlock(type);
    }
  };

  // Create a new block element
  const createBlock = (type: string): HTMLElement => {
    let el: HTMLElement;

    if (type === "paragraph") {
      el = document.createElement("p");
      el.innerHTML = "&nbsp;";
    } else if (type === "h1" || type === "h2") {
      el = document.createElement(type);
      el.innerHTML = "&nbsp;";
    } else if (type === "ul" || type === "ol") {
      el = document.createElement(type);
      const li = document.createElement("li");
      li.innerHTML = "&nbsp;";
      li.setAttribute("dir", "ltr");
      li.setAttribute("lang", "en");
      li.style.direction = "ltr";
      li.style.textAlign = "left";
      el.appendChild(li);
    } else {
      el = document.createElement("p");
      el.innerHTML = "&nbsp;";
    }

    // Force LTR attributes and styles
    el.setAttribute("dir", "ltr");
    el.setAttribute("lang", "en");
    el.style.direction = "ltr";
    el.style.textAlign = "left";
    el.style.unicodeBidi = "embed";

    return el;
  };

  // Focus on a block element
  const focusBlock = (block: HTMLElement, sel: Selection) => {
    const range = document.createRange();

    if (block.nodeName === "UL" || block.nodeName === "OL") {
      const li = block.querySelector("li");
      if (li) {
        range.selectNodeContents(li);
        range.collapse(true);
      } else {
        range.selectNodeContents(block);
        range.collapse(true);
      }
    } else {
      range.selectNodeContents(block);
      range.collapse(true);
    }

    sel.removeAllRanges();
    sel.addRange(range);
    editorRef.current?.focus();
  };

  // Insert block at caret (fallback)
  const insertBlock = (type: string) => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel) return;

    const range = sel.getRangeAt(0);

    // Remove the slash if it exists
    if (range.endContainer.nodeType === 3 && range.endOffset > 0) {
      const text = range.endContainer.textContent || "";
      if (text.charAt(range.endOffset - 1) === "/") {
        range.setStart(range.endContainer, range.endOffset - 1);
        range.deleteContents();
      }
    }

    const newBlock = createBlock(type);
    range.insertNode(newBlock);

    setTimeout(() => {
      focusBlock(newBlock, sel);
      handleInput();
    }, 0);
  };

  // Set initial value and ensure LTR
  useEffect(() => {
    if (editorRef.current && typeof value === "string") {
      editorRef.current.innerHTML = value;

      // Force LTR on all child elements
      const allElements = editorRef.current.querySelectorAll("*");
      allElements.forEach((el) => {
        (el as HTMLElement).dir = "ltr";
        (el as HTMLElement).style.direction = "ltr";
        (el as HTMLElement).style.textAlign = "left";
      });
    }
  }, [value]);

  // Handle paste to ensure LTR content
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    if (text) {
      document.execCommand("insertText", false, text);
      setTimeout(handleInput, 0);
    }
  };

  return (
    <div className="relative w-full">
      <style>{`
        .ltr-rich-editor {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
        .ltr-rich-editor * {
          direction: ltr !important;
          text-align: left !important;
          unicode-bidi: embed !important;
        }
        .ltr-rich-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .ltr-rich-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .ltr-rich-editor p {
          margin: 0.5em 0;
        }
        .ltr-rich-editor ul, .ltr-rich-editor ol {
          padding-left: 2em;
          margin: 0.5em 0;
        }
        .ltr-rich-editor li {
          margin: 0.2em 0;
        }
        .ltr-rich-editor [dir="rtl"] {
          direction: ltr !important;
          text-align: left !important;
        }
      `}</style>
      <div
        ref={editorRef}
        className="ltr-rich-editor w-full min-h-[200px] outline-none text-lg bg-transparent"
        contentEditable
        spellCheck={true}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        style={{
          whiteSpace: "pre-wrap",
          textAlign: "left",
          direction: "ltr",
          unicodeBidi: "embed",
        }}
        suppressContentEditableWarning
        dir="ltr"
        lang="en"
      />
      {/* Custom placeholder for empty content */}
      {(!value || value.trim() === "" || value === "&nbsp;") && (
        <span className="absolute left-2 top-2 text-zinc-400 opacity-60 pointer-events-none select-none">
          Type / for commands
        </span>
      )}
      {showSlash && (
        <div
          className="absolute z-50 bg-zinc-900 border border-zinc-700 rounded shadow-xl"
          style={{ top: slashPos.top, left: slashPos.left, minWidth: 220 }}
        >
          {BLOCK_COMMANDS.map((b, i) => (
            <div
              key={b.type}
              className={`px-4 py-2 cursor-pointer flex items-center gap-2 text-sm ${i === slashIndex ? "bg-zinc-800 text-white" : "text-zinc-300"}`}
              onMouseDown={(e) => {
                e.preventDefault();
                formatOrInsertBlock(b.type);
                setShowSlash(false);
              }}
            >
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

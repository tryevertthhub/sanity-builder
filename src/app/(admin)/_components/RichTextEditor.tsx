import React, { useRef, useState, useEffect } from "react";

const BLOCK_COMMANDS = [
  { type: "paragraph", label: "Text" },
  { type: "h1", label: "Heading 1" },
  { type: "h2", label: "Heading 2" },
  { type: "ul", label: "Bulleted List" },
  { type: "ol", label: "Numbered List" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSlash, setShowSlash] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);
  const [slashPos, setSlashPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Ensure LTR and at least one block
  const ensureLTRAndBlock = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current;

    // Remove RTL Unicode marks
    editor.innerHTML = editor.innerHTML.replace(
      /[\u200E\u200F\u202A-\u202E]/g,
      ""
    );

    // Ensure at least one paragraph
    if (
      (editor.innerText.trim() === "" ||
        editor.innerText.trim() === "\u200B") &&
      editor.childNodes.length === 0
    ) {
      const p = document.createElement("p");
      p.setAttribute("dir", "ltr");
      p.style.direction = "ltr";
      p.innerHTML = "\u200B"; // Zero-width space
      editor.appendChild(p);

      // Place caret inside
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(p);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    // Ensure all blocks are LTR
    editor.querySelectorAll("h1, h2, p, ul, ol, li").forEach((el) => {
      el.setAttribute("dir", "ltr");
      (el as HTMLElement).style.textAlign = "left";
    });
  };

  // Initialize editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setAttribute("dir", "ltr");
      editorRef.current.style.direction = "ltr";
      editorRef.current.style.unicodeBidi = "embed";
      if (typeof value === "string") {
        editorRef.current.innerHTML = value;
      }
      ensureLTRAndBlock();
    }
  }, [value]);

  // Handle input changes
  const handleInput = () => {
    ensureLTRAndBlock();
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML.replace(
        /[\u200E\u200F\u202A-\u202E]/g,
        ""
      );
      onChange(htmlContent);
    }
  };

  // Handle keydown events for slash commands
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const sel = window.getSelection();
    if (!sel || !editorRef.current) return;

    const node = sel.anchorNode;
    if (!node) return;
    const text = node.textContent || "";

    if (e.key === "/" && text.trim() === "") {
      e.preventDefault();
      setShowSlash(true);
      setSlashIndex(0);
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

  // Create a new block element
  const createBlock = (type: string): HTMLElement => {
    let el: HTMLElement;
    if (type === "paragraph") {
      el = document.createElement("p");
      el.innerHTML = "\u200B";
    } else if (type === "h1" || type === "h2") {
      el = document.createElement(type);
      el.innerHTML = "\u200B";
    } else if (type === "ul" || type === "ol") {
      el = document.createElement(type);
      const li = document.createElement("li");
      li.innerHTML = "\u200B";
      li.setAttribute("dir", "ltr");
      li.style.direction = "ltr";
      el.appendChild(li);
    } else {
      el = document.createElement("p");
      el.innerHTML = "\u200B";
    }
    el.setAttribute("dir", "ltr");
    el.style.direction = "ltr";
    el.style.unicodeBidi = "embed";
    return el;
  };

  // Focus on a block
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

  // Format or insert block
  const formatOrInsertBlock = (type: string) => {
    if (!editorRef.current || !window.getSelection()) return;
    const sel = window.getSelection()!;
    const range = sel.getRangeAt(0);
    let block = sel.anchorNode as HTMLElement | null;

    // Find parent block
    while (block && block !== editorRef.current && block.nodeType !== 1) {
      block = block.parentElement;
    }

    if (!block || block === editorRef.current) {
      insertBlock(type);
      return;
    }

    const blockText = block.textContent || "";
    if (
      blockText.trim() === "/" ||
      blockText.trim() === "" ||
      blockText.trim() === "\u200E"
    ) {
      const newBlock = createBlock(type);
      block.replaceWith(newBlock);
      setTimeout(() => {
        focusBlock(newBlock, sel);
        handleInput();
      }, 0);
    } else {
      insertBlock(type);
    }
  };

  // Insert block at caret
  const insertBlock = (type: string) => {
    if (!editorRef.current || !window.getSelection()) return;
    const sel = window.getSelection()!;
    const range = sel.getRangeAt(0);

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

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text/plain")
      .replace(/[\u200E\u200F\u202A-\u202E]/g, "");
    if (text) {
      document.execCommand("insertText", false, text);
      setTimeout(handleInput, 0);
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={editorRef}
        className="rich-editor w-full min-h-[200px] outline-none text-lg bg-transparent"
        contentEditable
        spellCheck
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        style={{
          direction: "rtl",
          unicodeBidi: "embed",
        }}
        suppressContentEditableWarning
        dir="ltr"
      />
      {editorRef.current &&
        (editorRef.current.innerText.trim() === "" ||
          editorRef.current.innerText.trim() === "\u200B") && (
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
              className={`px-4 py-2 cursor-pointer flex items-center gap-2 text-sm ${
                i === slashIndex ? "bg-zinc-800 text-white" : "text-zinc-300"
              }`}
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

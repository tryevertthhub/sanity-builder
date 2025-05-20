import React from "react";
import { Code, Zap, Sliders } from "lucide-react";
import { Block } from "../types";
import { BLOCK_COMPONENTS } from "@/src/components/blocks";

declare global {
  interface Window {
    lastKnownMouseX?: number;
    lastKnownMouseY?: number;
  }
}

export function BlockPreviewWrapper({
  block,
  onEdit,
  onInspect,
}: {
  block: Block;
  onEdit: (block: Block) => void;
  onInspect: (block: Block) => void;
}) {
  const Component = BLOCK_COMPONENTS[block.type] as React.ComponentType<any>;
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editableContent, setEditableContent] = React.useState<{
    element: HTMLElement;
    fieldName: string;
    originalText: string;
  } | null>(null);

  const [hoveredField, setHoveredField] = React.useState<{
    name: string;
    element: HTMLElement | null;
    rect: any | null;
  } | null>(null);

  // Helper to find the closest text node parent
  const findTextNodeParent = (element: HTMLElement): HTMLElement | null => {
    let current: HTMLElement | null = element;
    while (
      current &&
      (!current.textContent?.trim() || current.children.length > 0)
    ) {
      current = current.parentElement;
    }
    return current;
  };

  // Helper to get element position relative to wrapper
  const getRelativePosition = (element: HTMLElement) => {
    if (!wrapperRef.current) return null;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      top: elementRect.top - wrapperRect.top,
      left: elementRect.left - wrapperRect.left,
      width: elementRect.width,
      height: elementRect.height,
    };
  };

  // Helper to match text content with block fields
  const matchTextWithFields = (text: string, element: HTMLElement) => {
    const fields = Object.entries(block);
    for (const [key, value] of fields) {
      // Handle string values
      if (typeof value === "string" && value === text) {
        return key;
      }

      // Handle button labels
      if (key === "buttons" && Array.isArray(value)) {
        const buttonMatch = value.find((btn) => btn.text === text);
        if (buttonMatch) {
          return "button-label";
        }
      }

      // Handle rich text
      if (key === "richText" && Array.isArray(value)) {
        const richTextContent = value[0]?.children?.[0]?.text;
        if (richTextContent === text) {
          return "richText";
        }
      }

      // Handle images
      if (key === "image" && element.tagName.toLowerCase() === "img") {
        return "image";
      }
    }
    return null;
  };

  const makeElementEditable = (element: HTMLElement, fieldName: string) => {
    // If we're already editing this element, don't do anything
    if (editableContent?.element === element) return;

    // If we're editing a different element, save its changes first
    if (editableContent) {
      // Handle saving changes here if needed
    }

    setIsEditing(true);
    const originalText = element.textContent || "";
    element.contentEditable = "true";
    element.focus();

    element.style.outline = "none";
    element.style.borderRadius = "4px";
    element.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
    element.style.padding = "2px 4px";
    element.style.margin = "-2px -4px";

    setEditableContent({
      element,
      fieldName,
      originalText,
    });

    // Clear hover state while editing
    setHoveredField(null);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Store mouse position for later use
    window.lastKnownMouseX = e.clientX;
    window.lastKnownMouseY = e.clientY;

    if (isEditing || editableContent) {
      setHoveredField(null);
      return;
    }

    const target = e.target as HTMLElement;
    if (!target || !wrapperRef.current?.contains(target)) {
      setHoveredField(null);
      return;
    }

    if (target.tagName.toLowerCase() === "img") {
      const rect = getRelativePosition(target);
      if (rect) {
        setHoveredField({ name: "image", element: target, rect });
      }
      return;
    }

    const textParent = findTextNodeParent(target);
    if (!textParent) {
      setHoveredField(null);
      return;
    }

    const text = textParent.textContent?.trim();
    if (!text) {
      setHoveredField(null);
      return;
    }

    const fieldName = matchTextWithFields(text, textParent);
    if (fieldName) {
      const rect = getRelativePosition(textParent);
      if (rect) {
        setHoveredField({ name: fieldName, element: textParent, rect });
      }
    } else {
      setHoveredField(null);
    }
  };

  React.useEffect(() => {
    if (!wrapperRef.current) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // If we're editing and click outside the editable element
      if (editableContent) {
        if (!editableContent.element.contains(target)) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      // If we have a hovered field and we're not editing
      if (
        !isEditing &&
        hoveredField?.element &&
        target.contains(hoveredField.element)
      ) {
        e.preventDefault();
        e.stopPropagation();
        makeElementEditable(hoveredField.element, hoveredField.name);
      }
    };

    const wrapper = wrapperRef.current;
    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("click", handleClick, true);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("click", handleClick, true);
    };
  }, [block, hoveredField, editableContent, isEditing]);

  React.useEffect(() => {
    return () => {
      if (editableContent) {
        // Cleanup editable content if needed
      }
    };
  }, []);

  return (
    <div className="relative group" ref={wrapperRef}>
      <div className="relative z-10">
        <Component {...block} _type={block.type} />
      </div>
      {!isEditing && hoveredField && hoveredField.rect && (
        <div
          className="pointer-events-none absolute z-20"
          style={{
            top: hoveredField.rect.top,
            left: hoveredField.rect.left,
            width: hoveredField.rect.width,
            height: hoveredField.rect.height,
          }}
        >
          <div className="absolute inset-0 ring-2 ring-blue-500 ring-offset-2 ring-offset-black rounded" />
          <div className="absolute -top-6 left-0 flex items-center gap-2">
            <div className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded whitespace-nowrap">
              Click to edit {hoveredField.name}
            </div>
          </div>
        </div>
      )}
      {!isEditing && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -top-3 left-4 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Zap className="w-3 h-3" />
            {block.type}
          </div>
          <div className="absolute -top-3 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(block);
              }}
              className="px-2 py-0.5 bg-zinc-900 text-white text-xs font-medium rounded flex items-center gap-1 hover:bg-zinc-800"
            >
              <Sliders className="w-3 h-3" />
              Edit Fields
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInspect(block);
              }}
              className="px-2 py-0.5 bg-zinc-900 text-white text-xs font-medium rounded flex items-center gap-1 hover:bg-zinc-800"
            >
              <Code className="w-3 h-3" />
              View Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

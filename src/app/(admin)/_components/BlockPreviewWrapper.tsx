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
  onUpdate,
}: {
  block: Block;
  onEdit: (block: Block) => void;
  onInspect: (block: Block) => void;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
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

  const makeElementEditable = (element: HTMLElement, fieldName: string) => {
    // If we're already editing this element, don't do anything
    if (editableContent?.element === element) return;

    // If we're editing a different element, save its changes first
    if (editableContent) {
      saveEditableContent();
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

  const saveEditableContent = () => {
    if (!editableContent) return;

    const { element, fieldName, originalText } = editableContent;
    const newText = element.textContent || "";

    // Only update if the text has changed
    if (newText !== originalText) {
      onUpdate(block.id, { [fieldName]: newText });
    }

    // Reset the element
    element.contentEditable = "false";
    element.style.backgroundColor = "";
    element.style.padding = "";
    element.style.margin = "";

    setEditableContent(null);
    setIsEditing(false);
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

    // Match text with block fields
    const fieldName = Object.keys(block).find(
      (key) => block[key as keyof Block] === text
    );

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
          saveEditableContent();
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (editableContent) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          saveEditableContent();
        } else if (e.key === "Escape") {
          e.preventDefault();
          if (editableContent.element) {
            editableContent.element.textContent = editableContent.originalText;
          }
          saveEditableContent();
        }
      }
    };

    const wrapper = wrapperRef.current;
    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [block, hoveredField, editableContent, isEditing]);

  React.useEffect(() => {
    return () => {
      if (editableContent) {
        saveEditableContent();
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative group"
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <Component
        {...block}
        onEdit={(field: string, value: any) => {
          if (field === "title" && (!value || !value.trim())) {
            onUpdate(block.id, { [field]: "Contact Us" });
          } else {
            onUpdate(block.id, { [field]: value });
          }
        }}
        onFieldEdit={(field: string, value: any) => {
          if (field === "title" && (!value || !value.trim())) {
            onUpdate(block.id, { [field]: "Contact Us" });
          } else {
            onUpdate(block.id, { [field]: value });
          }
        }}
      />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(block)}
          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-colors"
          title="Edit Block"
        >
          <Sliders className="w-4 h-4" />
        </button>
        <button
          onClick={() => onInspect(block)}
          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-colors ml-1"
          title="Inspect Block"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>
      {hoveredField && !isEditing && (
        <div
          className="absolute pointer-events-none bg-blue-500/10 border border-blue-500/20 rounded"
          style={{
            top: hoveredField.rect.top,
            left: hoveredField.rect.left,
            width: hoveredField.rect.width,
            height: hoveredField.rect.height,
          }}
        />
      )}
    </div>
  );
}

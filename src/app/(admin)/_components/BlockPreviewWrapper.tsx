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
  isEditMode = true,
  disableInlineEditing = false,
}: {
  block: Block;
  onEdit: (block: Block) => void;
  onInspect: (block: Block) => void;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  isEditMode?: boolean;
  disableInlineEditing?: boolean;
}) {
  const Component = BLOCK_COMPONENTS[block.type] as React.ComponentType<any>;
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Completely local state management - no optimistic hook
  const [localBlock, setLocalBlock] = React.useState(block);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editableContent, setEditableContent] = React.useState<{
    element: HTMLElement;
    fieldName: string;
    originalText: string;
  } | null>(null);

  // Track fields that are being edited to prevent prop overwrites
  const editingFieldsRef = React.useRef<Set<string>>(new Set());
  const updateTimeoutsRef = React.useRef<Map<string, NodeJS.Timeout>>(
    new Map()
  );

  const [hoveredField, setHoveredField] = React.useState<{
    name: string;
    element: HTMLElement | null;
    rect: any | null;
  } | null>(null);

  // Dirty flag: once user edits, never update from props
  const [isDirty, setIsDirty] = React.useState(false);

  // Only update local block from props if not dirty
  React.useEffect(() => {
    if (!isDirty) {
      setLocalBlock(block);
    }
  }, [block, isDirty]);

  // Immediate update handler for inline edits
  const handleFieldEdit = React.useCallback(
    (field: string, value: any) => {
      setIsDirty(true);
      editingFieldsRef.current.add(field);

      // Compute the updated block
      const updated = { ...localBlock, [field]: value };
      setLocalBlock(updated);

      // Persist the change after state update (microtask)
      if (onUpdate && block.id) {
        Promise.resolve().then(() => onUpdate(block.id, updated));
      }

      // Clear existing timeout
      const existingTimeout = updateTimeoutsRef.current.get(field);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      editingFieldsRef.current.delete(field);
    },
    [block.id, onUpdate, localBlock]
  );

  // Helper to find the closest text node parent
  const findTextNodeParent = React.useCallback(
    (element: HTMLElement): HTMLElement | null => {
      let current: HTMLElement | null = element;
      while (
        current &&
        (!current.textContent?.trim() || current.children.length > 0)
      ) {
        current = current.parentElement;
      }
      return current;
    },
    []
  );

  // Helper to get element position relative to wrapper
  const getRelativePosition = React.useCallback((element: HTMLElement) => {
    if (!wrapperRef.current) return null;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      top: elementRect.top - wrapperRect.top,
      left: elementRect.left - wrapperRect.left,
      width: elementRect.width,
      height: elementRect.height,
    };
  }, []);

  const makeElementEditable = React.useCallback(
    (element: HTMLElement, fieldName: string) => {
      if (!isEditMode) return;

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

      // Store original styles
      const originalBg = element.style.backgroundColor;
      const originalPadding = element.style.padding;
      const originalMargin = element.style.margin;
      const originalBorder = element.style.border;
      const originalBoxShadow = element.style.boxShadow;

      // Apply editing styles
      element.style.outline = "none";
      element.style.borderRadius = "4px";
      element.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      element.style.padding = "2px 4px";
      element.style.margin = "-2px -4px";
      element.style.border = "1px solid rgba(59, 130, 246, 0.4)";
      element.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.2)";

      setEditableContent({
        element,
        fieldName,
        originalText,
      });

      // Store original styles on element for restoration
      (element as any)._originalStyles = {
        backgroundColor: originalBg,
        padding: originalPadding,
        margin: originalMargin,
        border: originalBorder,
        boxShadow: originalBoxShadow,
      };

      // Clear hover state while editing
      setHoveredField(null);

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection?.removeAllRanges();
      selection?.addRange(range);
    },
    [isEditMode, editableContent]
  );

  const saveEditableContent = React.useCallback(() => {
    if (!editableContent) return;

    const { element, fieldName, originalText } = editableContent;
    const newText = element.textContent || "";

    // Only update if the text has changed
    if (newText !== originalText) {
      handleFieldEdit(fieldName, newText);
    }

    // Restore original styles
    const originalStyles = (element as any)._originalStyles;
    if (originalStyles) {
      element.style.backgroundColor = originalStyles.backgroundColor;
      element.style.padding = originalStyles.padding;
      element.style.margin = originalStyles.margin;
      element.style.border = originalStyles.border;
      element.style.boxShadow = originalStyles.boxShadow;
    } else {
      // Fallback cleanup
      element.style.backgroundColor = "";
      element.style.padding = "";
      element.style.margin = "";
      element.style.border = "";
      element.style.boxShadow = "";
    }

    element.contentEditable = "false";
    setEditableContent(null);
    setIsEditing(false);
  }, [editableContent, handleFieldEdit]);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isEditMode) return;

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

      // Match text with local block fields
      const fieldName = Object.keys(localBlock).find(
        (key) => localBlock[key as keyof Block] === text
      );

      if (fieldName) {
        const rect = getRelativePosition(textParent);
        if (rect) {
          setHoveredField({ name: fieldName, element: textParent, rect });
        }
      } else {
        setHoveredField(null);
      }
    },
    [
      isEditMode,
      isEditing,
      editableContent,
      localBlock,
      findTextNodeParent,
      getRelativePosition,
    ]
  );

  React.useEffect(() => {
    if (!wrapperRef.current || !isEditMode || disableInlineEditing) return;

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
          editableContent.element.blur();
        } else if (e.key === "Escape") {
          e.preventDefault();
          if (editableContent.element) {
            editableContent.element.textContent = editableContent.originalText;
          }
          editableContent.element.blur();
        }
      }
    };

    const wrapper = wrapperRef.current;
    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);

    if (editableContent?.element) {
      editableContent.element.addEventListener("blur", saveEditableContent);
    }

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
      if (editableContent?.element) {
        editableContent.element.removeEventListener(
          "blur",
          saveEditableContent
        );
      }
    };
  }, [
    localBlock,
    hoveredField,
    editableContent,
    isEditing,
    isEditMode,
    handleMouseMove,
    saveEditableContent,
    makeElementEditable,
    disableInlineEditing,
  ]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (editableContent) {
        saveEditableContent();
      }
      // Clear all timeouts
      updateTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      updateTimeoutsRef.current.clear();
      editingFieldsRef.current.clear();
    };
  }, [editableContent, saveEditableContent]);

  const componentProps = React.useMemo(
    () => ({
      ...localBlock,
      onEdit: isEditMode ? handleFieldEdit : undefined,
      onFieldEdit: isEditMode ? handleFieldEdit : undefined,
    }),
    [localBlock, isEditMode, handleFieldEdit]
  );

  return (
    <div
      ref={wrapperRef}
      className="relative group"
      data-block-id={block.id}
      data-block-type={block.type}
    >
      <Component {...componentProps} />
      {isEditMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(localBlock)}
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-colors"
            title="Edit Block"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInspect(localBlock)}
            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white transition-colors ml-1"
            title="Inspect Block"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      )}
      {!disableInlineEditing && hoveredField && !isEditing && isEditMode && (
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

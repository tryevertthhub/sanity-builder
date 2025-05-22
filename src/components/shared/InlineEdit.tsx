"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface InlineEditProps {
  value: string;
  onChange: (val: string) => void;
  fieldName: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  children?: React.ReactNode;
  preserveStyles?: boolean;
}

export function InlineEdit({
  value,
  onChange,
  fieldName,
  as = "span",
  className = "",
  inputClassName = "",
  multiline = false,
  children,
  preserveStyles = true,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const valueRef = useRef(value);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Keep track of the latest value
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Only update currentValue if we're not editing and not updating
  useEffect(() => {
    if (!editing && !isUpdating) {
      setCurrentValue(value);
    }
  }, [value, editing, isUpdating]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      // Select all text when starting to edit
      if (ref.current.select) {
        ref.current.select();
      }
    }
  }, [editing]);

  const handleSave = useCallback(() => {
    setEditing(false);

    if (currentValue !== valueRef.current) {
      setIsUpdating(true);
      onChange(currentValue);

      // Clear updating flag after a delay
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    }
  }, [currentValue, onChange]);

  const handleCancel = useCallback(() => {
    setCurrentValue(valueRef.current);
    setEditing(false);
    setIsUpdating(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const Tag = as;
  const displayValue = editing || isUpdating ? currentValue : value;

  if (editing) {
    const Input = multiline ? "textarea" : "input";
    return (
      <Input
        ref={ref as any}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          inputClassName,
          preserveStyles ? className : "",
          "bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-1 py-0.5 rounded w-full min-w-0",
          multiline ? "min-h-[40px]" : ""
        )}
        style={{ outline: "none" }}
      />
    );
  }

  return (
    <span
      className={cn(
        "relative group/inline-edit",
        className,
        "px-1 py-0.5 rounded transition-all duration-150 hover:bg-blue-400/10 focus-within:bg-blue-400/10",
        isUpdating && "bg-blue-400/5 border border-blue-400/20"
      )}
      tabIndex={0}
      onClick={() => {
        setCurrentValue(valueRef.current);
        setEditing(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setCurrentValue(valueRef.current);
          setEditing(true);
        }
      }}
      role="button"
      aria-label={`Edit ${fieldName}`}
      title={`Edit ${fieldName}`}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      <Tag className="inline-edit-value">{children || displayValue}</Tag>
      <span className="absolute top-1 right-1 z-10 opacity-0 group-hover/inline-edit:opacity-100 transition-opacity pointer-events-auto bg-zinc-900/80 rounded-full p-1 shadow-lg border border-blue-400/60">
        <Pencil className="w-4 h-4 text-blue-400" />
      </span>
      <span
        className={cn(
          "absolute left-0 right-0 top-0 bottom-0 border border-blue-400/40 rounded pointer-events-none group-hover/inline-edit:border-blue-400/80 transition-all",
          isUpdating && "border-blue-400/60"
        )}
      />
    </span>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [temp, setTemp] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setTemp(value);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    if (temp !== value) onChange(temp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setTemp(value);
      setEditing(false);
    }
  };

  const Tag = as;

  if (editing) {
    const Input = multiline ? "textarea" : "input";
    return (
      <Input
        ref={ref as any}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${inputClassName} ${
          preserveStyles ? className : ""
        } bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-1 py-0.5 rounded w-full min-w-0 ${
          multiline ? "min-h-[40px]" : ""
        }`}
        style={{ outline: "none" }}
      />
    );
  }

  return (
    <span
      className={`relative group/inline-edit ${className} px-1 py-0.5 rounded transition-all duration-150 hover:bg-blue-400/10 focus-within:bg-blue-400/10`}
      tabIndex={0}
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setEditing(true);
      }}
      role="button"
      aria-label={`Edit ${fieldName}`}
      title={`Edit ${fieldName}`}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      <Tag className="inline-edit-value">{children || value}</Tag>
      <span className="absolute top-1 right-1 z-10 opacity-0 group-hover/inline-edit:opacity-100 transition-opacity pointer-events-auto bg-zinc-900/80 rounded-full p-1 shadow-lg border border-blue-400/60">
        <Pencil className="w-4 h-4 text-blue-400" />
      </span>
      <span className="absolute left-0 right-0 top-0 bottom-0 border border-blue-400/40 rounded pointer-events-none group-hover/inline-edit:border-blue-400/80 transition-all" />
    </span>
  );
}

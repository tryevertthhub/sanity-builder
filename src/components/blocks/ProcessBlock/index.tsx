"use client";

import { useRef, useId, useState, useEffect, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

// InlineEdit utility
const InlineEdit = ({
  value,
  onChange,
  fieldName,
  as = "span",
  className = "",
  inputClassName = "",
  multiline = false,
  children,
  ...props
}: {
  value: string;
  onChange: (val: string) => void;
  fieldName: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  children?: ReactNode;
  [key: string]: any;
}) => {
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

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            } else if (e.key === "Escape") {
              setEditing(false);
              setTemp(value);
            }
          }}
          className={`inline-edit-input ${inputClassName} border-2 border-blue-400/80 bg-zinc-900/90 text-white rounded-lg p-2 w-full resize-vertical font-inherit focus:bg-zinc-800/90 focus:border-blue-500/80 focus:shadow-lg`}
          style={{ minHeight: 40, width: "100%" }}
        />
      );
    }
    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          else if (e.key === "Escape") {
            setEditing(false);
            setTemp(value);
          }
        }}
        className={`inline-edit-input ${inputClassName} border-2 border-blue-400/80 bg-zinc-900/90 text-white rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:bg-zinc-800/90 focus:border-blue-500/80 focus:shadow-lg`}
        style={{ minWidth: 80 }}
      />
    );
  }

  const Tag = as;
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
      <Tag className="inline-edit-value font-semibold tracking-tight">
        {children || value}
      </Tag>
      <span className="absolute top-1 right-1 z-10 opacity-0 group-hover/inline-edit:opacity-100 transition-opacity pointer-events-auto bg-zinc-900/80 rounded-full p-1 shadow-lg border border-blue-400/60">
        <svg
          className="w-4 h-4 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.213-1.213l1-4a4 4 0 01.828-1.414z"
          />
        </svg>
      </span>
      <span className="absolute left-0 right-0 top-0 bottom-0 border border-blue-400/40 rounded pointer-events-none group-hover/inline-edit:border-blue-400/80 transition-all" />
    </span>
  );
};

export type ProcessBlockProps = {
  _type: "processBlock";
  heading?: string;
  description?: string;
  steps?: {
    _key: string;
    title: string;
    description: string;
    icon: string;
  }[];
};

const StepIcon = ({
  icon,
  className,
  "aria-hidden": ariaHidden,
}: {
  icon: string;
  className?: string;
  "aria-hidden"?: boolean;
}) => {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[icon];
  return Icon ? (
    <Icon className={cn("w-6 h-6", className)} aria-hidden={ariaHidden} />
  ) : null;
};

export function ProcessBlock({
  heading = "Our Process",
  description = "We follow a proven methodology to deliver exceptional results",
  steps = [],
}: ProcessBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const headingId = useId();

  const handleFieldChange = (field: string, value: any) => {
    // Implement your onEdit logic here
  };

  const handleStepField = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    handleFieldChange("steps", newSteps);
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-black py-24 lg:py-32"
      aria-labelledby={headingId}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <InlineEdit
            value={heading}
            onChange={(val) => handleFieldChange("heading", val)}
            fieldName="heading"
            as="h2"
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          />
          <InlineEdit
            value={description}
            onChange={(val) => handleFieldChange("description", val)}
            fieldName="description"
            as="p"
            className="mt-6 text-lg leading-8 text-gray-400"
          />
        </motion.div>

        {/* Process Steps */}
        <div className="relative mt-16 sm:mt-20 lg:mt-24">
          {/* Vertical Line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gray-800 via-gray-700 to-transparent sm:left-1/2 sm:-ml-1"
            aria-hidden="true"
          />

          <ol className="relative space-y-8">
            {steps.map((step, index) => (
              <motion.li
                key={step._key}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={cn(
                  "relative flex items-start",
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse",
                  "gap-8 sm:gap-12"
                )}
              >
                {/* Step Number */}
                <div
                  className="absolute left-4 -translate-x-1/2 sm:left-1/2"
                  aria-hidden="true"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-800 bg-black text-sm font-semibold text-gray-300">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "ml-12 sm:ml-0 sm:w-1/2",
                    index % 2 === 0 ? "sm:pr-16" : "sm:pl-16"
                  )}
                >
                  <div className="group relative rounded-2xl border border-gray-800/50 bg-black/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/70 hover:bg-black/40">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                        <StepIcon
                          icon={step.icon}
                          className="text-gray-300"
                          aria-hidden={true}
                        />
                      </div>
                      <InlineEdit
                        value={step.title}
                        onChange={(val) => handleStepField(index, "title", val)}
                        fieldName={`steps.${index}.title`}
                        as="h3"
                        className="text-xl font-semibold text-white"
                      />
                    </div>
                    <InlineEdit
                      value={step.description}
                      onChange={(val) =>
                        handleStepField(index, "description", val)
                      }
                      fieldName={`steps.${index}.description`}
                      as="p"
                      className="mt-4 text-gray-400"
                      multiline
                    />

                    {/* Decorative gradient */}
                    <div
                      className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-gray-800/5 via-gray-800/2 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

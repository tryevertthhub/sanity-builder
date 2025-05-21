"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useId } from "react";
import { Scale, Users, Lightbulb } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export type WhyChooseBlockProps = {
  _type: "whyChooseBlock";
  heading?: string;
  description?: string;
  features?: {
    _key: string;
    title: string;
    description: string;
    icon: string;
    stats: {
      value: string;
      label: string;
    };
  }[];
  callToAction?: {
    heading: string;
    description: string;
    button: {
      label: string;
      link: {
        href: string;
        openInNewTab: boolean;
      };
    };
  };
};

const iconMap = {
  scale: Scale,
  users: Users,
  lightbulb: Lightbulb,
};

const FeatureIcon = ({
  name,
  "aria-hidden": ariaHidden,
}: {
  name: string;
  "aria-hidden"?: boolean;
}) => {
  const Icon = iconMap[name as keyof typeof iconMap];
  return Icon ? (
    <Icon className="h-8 w-8 text-primary" aria-hidden={ariaHidden} />
  ) : null;
};

// --- InlineEdit utility (copied and styled from TeamBlock) ---
const InlineEdit = ({
  value,
  onChange,
  fieldName,
  as = "span",
  className = "",
  inputClassName = "",
  multiline = false,
  children,
}: {
  value: string;
  onChange: (val: string) => void;
  fieldName: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  children?: React.ReactNode;
}) => {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const ref = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  React.useEffect(() => {
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

// --- Icon Picker Popover ---
const ICONS = ["scale", "users", "lightbulb"];
const IconMap = {
  scale: Scale,
  users: Users,
  lightbulb: Lightbulb,
};
const IconPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const Icon = IconMap[value as keyof typeof IconMap] || Scale;
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-900 border border-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change icon"
      >
        <Icon className="w-8 h-8 text-blue-400" />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 left-0 bg-zinc-900 border border-gray-700 rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2">
          {ICONS.map((icon) => {
            const IconComp = IconMap[icon as keyof typeof IconMap];
            return (
              <button
                key={icon}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-blue-400/10"
                onClick={() => {
                  onChange(icon);
                  setOpen(false);
                }}
                aria-label={`Select ${icon} icon`}
              >
                <IconComp className="w-6 h-6 text-blue-400" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export function WhyChooseBlock({
  heading = "Elevating Legal Excellence Through Innovation",
  description = "Experience a new standard in legal services where cutting-edge technology meets decades of expertise. Our innovative approach ensures your business receives unparalleled legal support tailored to modern challenges.",
  features = [],
  callToAction,
  onEdit,
}: WhyChooseBlockProps & { onEdit?: (field: string, value: any) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);
  const headingId = useId();

  const handleField = (field: string, value: any) => {
    if (onEdit) onEdit(field, value);
  };
  const handleFeatureField = (idx: number, field: string, value: any) => {
    if (!onEdit) return;
    const newFeatures = [...features];
    newFeatures[idx] = { ...newFeatures[idx], [field]: value };
    onEdit("features", newFeatures);
  };
  const handleFeatureStats = (idx: number, statField: string, value: any) => {
    if (!onEdit) return;
    const newFeatures = [...features];
    newFeatures[idx] = {
      ...newFeatures[idx],
      stats: { ...newFeatures[idx].stats, [statField]: value },
    };
    onEdit("features", newFeatures);
  };
  const handleAddFeature = () => {
    if (!onEdit) return;
    const newFeatures = [
      ...features,
      {
        _key: Math.random().toString(36).slice(2, 10),
        title: "New Feature",
        description: "",
        icon: "scale",
        stats: { value: "", label: "" },
      },
    ];
    onEdit("features", newFeatures);
  };
  const handleRemoveFeature = (idx: number) => {
    if (!onEdit) return;
    const newFeatures = [...features];
    newFeatures.splice(idx, 1);
    onEdit("features", newFeatures);
  };
  const handleCTAField = (field: string, value: any) => {
    if (!onEdit) return;
    onEdit("callToAction", { ...callToAction, [field]: value });
  };
  const handleCTAButtonField = (field: string, value: any) => {
    if (!onEdit) return;
    onEdit("callToAction", {
      ...callToAction,
      button: { ...callToAction?.button, [field]: value },
    });
  };
  const handleCTAButtonLinkField = (field: string, value: any) => {
    if (!onEdit) return;
    onEdit("callToAction", {
      ...callToAction,
      button: {
        ...callToAction?.button,
        link: { ...callToAction?.button?.link, [field]: value },
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-24"
      aria-labelledby={heading ? headingId : undefined}
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative mx-auto max-w-7xl px-6 lg:px-8"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            id={headingId}
            variants={itemVariants}
            className="bg-gradient-to-r from-gray-100 py via-white to-gray-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            <InlineEdit
              value={heading}
              onChange={(val) => handleField("heading", val)}
              fieldName="heading"
              as="span"
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-300"
              inputClassName="text-4xl font-bold tracking-tight bg-transparent text-white"
            />
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-8 text-gray-400"
          >
            <InlineEdit
              value={description}
              onChange={(val) => handleField("description", val)}
              fieldName="description"
              as="span"
              className="inline-block"
              inputClassName="text-lg leading-8 bg-transparent text-gray-400"
              multiline
            />
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24"
        >
          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {features.map((feature, idx) => (
              <motion.div
                key={feature._key}
                variants={itemVariants}
                className="group relative rounded-2xl border border-gray-800/40 bg-gradient-to-br from-gray-900/80 to-gray-900/60 p-10 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:scale-[1.025]"
                style={{
                  minHeight: 420,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <button
                  className="absolute top-4 right-4 bg-zinc-900/80 border border-red-400/40 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow"
                  onClick={() => handleRemoveFeature(idx)}
                  tabIndex={-1}
                  aria-label="Remove feature"
                  type="button"
                  style={{ fontSize: 0 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="flex flex-col items-center w-full">
                  {/* Icon with glow and popover */}
                  <div className="relative flex flex-col items-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-700/30 via-blue-400/10 to-gray-900/60 shadow-lg">
                      <IconPicker
                        value={feature.icon}
                        onChange={(icon) =>
                          handleFeatureField(idx, "icon", icon)
                        }
                      />
                    </div>
                  </div>
                  {/* Title */}
                  <InlineEdit
                    value={feature.title}
                    onChange={(val) => handleFeatureField(idx, "title", val)}
                    fieldName="title"
                    as="dt"
                    className="block text-center text-xl font-extrabold leading-tight bg-gradient-to-r from-blue-200 via-white to-blue-400 bg-clip-text text-transparent drop-shadow mb-2"
                    inputClassName="text-xl font-extrabold text-white bg-transparent text-center"
                  />
                  {/* Stats badge */}
                  {feature.stats && (
                    <div className="flex flex-col items-center gap-1 mb-4">
                      <InlineEdit
                        value={feature.stats.value}
                        onChange={(val) =>
                          handleFeatureStats(idx, "value", val)
                        }
                        fieldName="stats.value"
                        as="span"
                        className="inline-block px-4 py-1 rounded-full bg-blue-900/40 text-blue-200 font-bold text-base shadow border border-blue-400/20 mb-1"
                        inputClassName="text-base font-bold bg-blue-900/40 text-blue-200 text-center"
                      />
                      <InlineEdit
                        value={feature.stats.label}
                        onChange={(val) =>
                          handleFeatureStats(idx, "label", val)
                        }
                        fieldName="stats.label"
                        as="span"
                        className="block text-xs text-blue-100/80 tracking-wide"
                        inputClassName="text-xs text-blue-100/80 bg-transparent text-center"
                      />
                    </div>
                  )}
                  {/* Description */}
                  <InlineEdit
                    value={feature.description}
                    onChange={(val) =>
                      handleFeatureField(idx, "description", val)
                    }
                    fieldName="description"
                    as="dd"
                    className="mt-2 text-base leading-7 text-gray-200 text-center"
                    inputClassName="text-base leading-7 text-gray-200 bg-transparent w-full text-center"
                    multiline
                  />
                </div>
              </motion.div>
            ))}
          </dl>
          <button
            className="mt-8 px-4 py-2 rounded-lg border-2 border-dashed border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 w-full"
            onClick={handleAddFeature}
            type="button"
          >
            <svg
              className="w-4 h-4 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Feature
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto mt-24 max-w-3xl text-center"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-lg border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80 sm:p-12"
          >
            <InlineEdit
              value={callToAction?.heading || ""}
              onChange={(val) => handleCTAField("heading", val)}
              fieldName="cta.heading"
              as="h3"
              className="bg-gradient-to-r from-gray-100 via-white to-gray-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent"
              inputClassName="text-3xl font-bold tracking-tight bg-transparent text-white"
            />
            <InlineEdit
              value={callToAction?.description || ""}
              onChange={(val) => handleCTAField("description", val)}
              fieldName="cta.description"
              as="p"
              className="mt-4 text-lg text-gray-400"
              inputClassName="text-lg text-gray-400 bg-transparent"
              multiline
            />
            <div className="mt-8 flex flex-col items-center gap-2">
              <InlineEdit
                value={callToAction?.button?.label || ""}
                onChange={(val) => handleCTAButtonField("label", val)}
                fieldName="cta.button.label"
                as="span"
                className="text-base font-medium text-white"
                inputClassName="text-base font-medium text-white bg-transparent"
              />
              <InlineEdit
                value={callToAction?.button?.link?.href || ""}
                onChange={(val) => handleCTAButtonLinkField("href", val)}
                fieldName="cta.button.link.href"
                as="span"
                className="text-base text-blue-400 underline"
                inputClassName="text-base text-blue-400 bg-transparent"
              />
              <label className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={!!callToAction?.button?.link?.openInNewTab}
                  onChange={(e) =>
                    handleCTAButtonLinkField("openInNewTab", e.target.checked)
                  }
                  className="rounded border-zinc-700 bg-zinc-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                Open in new tab
              </label>
              <Link
                href={callToAction?.button?.link?.href || "#"}
                target={
                  callToAction?.button?.link?.openInNewTab ? "_blank" : "_self"
                }
                rel={
                  callToAction?.button?.link?.openInNewTab
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 text-base font-medium text-white shadow-lg shadow-black/20 transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl hover:shadow-black/30 mt-2"
              >
                {callToAction?.button?.label}
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

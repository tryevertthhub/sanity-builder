"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import React from "react";
import { useId } from "react";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { InlineEdit } from "@/src/components/shared/InlineEdit";

type ButtonType = {
  _key?: string;
  label?: string;
  variant?: "primary" | "secondary" | "tertiary";
  icon?: string;
  link?: {
    href: string;
    openInNewTab?: boolean;
  };
};

type ImageType = {
  asset: {
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
  };
};

export type HeroBlockProps = {
  _type: "heroBlock";
  mainHeading?: string;
  subHeading?: string;
  description?: string;
  serviceTags?: string[];
  featuredServices?: {
    _key: string;
    title: string;
    description: string;
    icon?: string;
    link: {
      href: string;
      openInNewTab?: boolean;
    };
  }[];
  ctaButtons?: ButtonType[];
  image?: ImageType;
  preview?: boolean;
  onEdit?: (field: string, value: any) => void;
};

// Simple utility function to combine class names
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// --- Inline Editor for Service Tags ---
const ServiceTagsInlineEditor = ({
  tags = [],
  onChange,
  preview,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  preview?: boolean;
}) => {
  const handleEdit = (idx: number, newValue: string) => {
    const newTags = [...tags];
    newTags[idx] = newValue;
    onChange(newTags);
  };
  const handleRemove = (idx: number) => {
    const newTags = [...tags];
    newTags.splice(idx, 1);
    onChange(newTags);
  };
  const handleAdd = () => {
    onChange([...tags, "New Tag"]);
  };

  return (
    <div
      className="flex flex-wrap gap-3 mt-16"
      role="list"
      aria-label="Service categories"
    >
      {tags.map((tag, idx) => (
        <div key={tag + idx} className="relative group" role="listitem">
          <InlineEdit
            value={tag}
            onChange={(val) => handleEdit(idx, val)}
            fieldName={`tag-${idx}`}
            as="span"
            className="px-4 py-2 rounded-lg border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm text-gray-400 hover:border-gray-700 hover:text-gray-200 transition-colors duration-300 cursor-pointer min-w-[80px] inline-block"
            inputClassName="px-4 py-2 rounded-lg border border-blue-400/80 bg-zinc-900/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/40 min-w-[80px] text-base font-normal"
          />
          {preview && (
            <button
              className="absolute -top-2 -right-2 bg-zinc-900/80 border border-red-400/60 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(idx)}
              tabIndex={-1}
              aria-label="Remove tag"
              type="button"
            >
              <svg
                className="w-3 h-3"
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
          )}
        </div>
      ))}
      {preview && (
        <button
          className="px-3 py-2 rounded-lg border border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 flex items-center gap-1"
          onClick={handleAdd}
          type="button"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Tag
        </button>
      )}
    </div>
  );
};

// --- Inline Editor for Featured Services ---
const ICONS = [
  "building",
  "home",
  "shield-check",
  "briefcase",
  "balance-scale",
  "gavel",
  "file-contract",
  "handshake",
  "chart-line",
];

const FeaturedServicesInlineEditor = ({
  services = [],
  onChange,
  preview,
}: {
  services: any[];
  onChange: (services: any[]) => void;
  preview?: boolean;
}) => {
  const handleField = (idx: number, field: string, value: any) => {
    const newArr = [...services];
    newArr[idx] = { ...newArr[idx], [field]: value };
    onChange(newArr);
  };
  const handleLinkField = (idx: number, subfield: string, value: any) => {
    const newArr = [...services];
    newArr[idx] = {
      ...newArr[idx],
      link: { ...newArr[idx].link, [subfield]: value },
    };
    onChange(newArr);
  };
  const handleRemove = (idx: number) => {
    const newArr = [...services];
    newArr.splice(idx, 1);
    onChange(newArr);
  };
  const handleAdd = () => {
    onChange([
      ...services,
      {
        _key: Math.random().toString(36).slice(2, 10),
        title: "New Service",
        description: "Service description...",
        icon: ICONS[0],
        link: { href: "#", openInNewTab: false },
      },
    ]);
  };
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
      role="region"
      aria-label="Featured services"
    >
      {services.map((service, idx) => (
        <div
          key={service._key || idx}
          className="relative group p-6 rounded-lg border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-sm hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300"
        >
          {/* Remove button */}
          {preview && (
            <button
              className="absolute -top-2 -right-2 bg-zinc-900/80 border border-red-400/60 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(idx)}
              tabIndex={-1}
              aria-label="Remove service"
              type="button"
            >
              <svg
                className="w-3 h-3"
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
          )}
          {/* Icon picker */}
          <div className="mb-4 flex items-center gap-2">
            <i
              className={`fas fa-${service.icon} text-2xl text-gray-400 group-hover:text-gray-300`}
            />
            {preview && (
              <select
                className="ml-2 px-2 py-1 rounded bg-zinc-800 text-gray-200 border border-gray-700 focus:outline-none"
                value={service.icon}
                onChange={(e) => handleField(idx, "icon", e.target.value)}
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* Title */}
          <InlineEdit
            value={service.title}
            onChange={(val) => handleField(idx, "title", val)}
            fieldName="title"
            as="div"
            className="text-xl font-semibold text-gray-200 mb-2 group-hover:text-white"
            inputClassName="text-xl font-semibold text-gray-200 mb-2 bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-1 py-0.5 rounded w-full min-w-0"
            multiline={false}
          />
          {/* Description */}
          <InlineEdit
            value={service.description}
            onChange={(val) => handleField(idx, "description", val)}
            fieldName="description"
            as="div"
            className="text-gray-500 group-hover:text-gray-400"
            inputClassName="text-gray-500 group-hover:text-gray-400 bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-1 py-0.5 rounded w-full min-w-0 min-h-[40px]"
            multiline
          />
          {/* Link fields */}
          {preview && (
            <div className="mt-4 space-y-2">
              <input
                className="w-full px-2 py-1 rounded bg-zinc-800 text-gray-200 border border-gray-700 focus:outline-none"
                value={service.link?.href || ""}
                onChange={(e) => handleLinkField(idx, "href", e.target.value)}
                placeholder="Service link URL"
              />
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={!!service.link?.openInNewTab}
                  onChange={(e) =>
                    handleLinkField(idx, "openInNewTab", e.target.checked)
                  }
                  className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                Open in new tab
              </label>
            </div>
          )}
        </div>
      ))}
      {preview && (
        <button
          className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 min-h-[180px]"
          onClick={handleAdd}
          type="button"
        >
          <svg
            className="w-8 h-8 mb-2"
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
          Add Service
        </button>
      )}
    </div>
  );
};

export function HeroBlock({
  mainHeading = "",
  subHeading = "",
  description = "",
  serviceTags = [],
  featuredServices = [],
  ctaButtons = [],
  image,
  preview = false,
  onEdit,
}: HeroBlockProps) {
  const { scrollY } = useScroll();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const headingId = useId();
  const [hasAnimated, setHasAnimated] = React.useState(false);

  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const handleServiceTagEdit = (index: number, newValue: string) => {
    if (onEdit && preview) {
      const newTags = [...serviceTags];
      newTags[index] = newValue;
      onEdit("serviceTags", newTags);
    }
  };

  const handleServiceEdit = (index: number, field: string, value: any) => {
    if (onEdit && preview) {
      const newServices = [...featuredServices];
      newServices[index] = {
        ...newServices[index],
        [field]: value,
      };
      onEdit("featuredServices", newServices);
    }
  };

  // Memoize the handlers to prevent unnecessary re-renders
  const handleFieldChange = React.useCallback(
    (field: string, value: any) => {
      if (onEdit) {
        onEdit(field, value);
      }
    },
    [onEdit]
  );

  const handleButtonChange = React.useCallback(
    (index: number, field: string, value: any) => {
      if (onEdit) {
        const newButtons = [...ctaButtons];
        newButtons[index] = {
          ...newButtons[index],
          [field]: value,
        };
        onEdit("ctaButtons", newButtons);
      }
    },
    [ctaButtons, onEdit]
  );

  // Detailed logging
  console.log("Hero Block Image Data:", {
    imageExists: !!image?.asset?.url,
    imageUrl: image?.asset?.url,
    metadata: image?.asset?.metadata,
    alt: image?.alt,
  });

  return (
    <section
      ref={ref}
      className="relative  min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden"
      aria-labelledby={mainHeading ? headingId : undefined}
      role="banner"
    >
      {/* Background Image */}
      {image?.asset?.url && (
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
          aria-hidden="true"
        >
          <Image
            src={image.asset.url}
            alt={image.alt || "Hero background"}
            fill
            className="object-cover object-center opacity-40"
            priority
            sizes="100vw"
            quality={100}
            role="presentation"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20 pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>
      )}

      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="pt-24 lg:pt-32">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                inView && !hasAnimated
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, y: 0 }
              }
              onAnimationComplete={() => setHasAnimated(true)}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Main Heading */}
              {onEdit ? (
                <InlineEdit
                  value={mainHeading}
                  onChange={(val) => handleFieldChange("mainHeading", val)}
                  fieldName="mainHeading"
                  as="h1"
                  className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight"
                  inputClassName="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight bg-transparent text-white"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-100">
                    {mainHeading}
                  </span>
                </InlineEdit>
              ) : (
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                  {mainHeading}
                </h1>
              )}

              {/* Sub Heading */}
              {onEdit ? (
                <InlineEdit
                  value={subHeading}
                  onChange={(val) => handleFieldChange("subHeading", val)}
                  fieldName="subHeading"
                  as="p"
                  className="text-xl md:text-2xl text-gray-100 font-light"
                  multiline
                />
              ) : (
                <p className="text-xl md:text-2xl text-gray-100 font-light">
                  {subHeading}
                </p>
              )}

              {/* Description */}
              {onEdit ? (
                <InlineEdit
                  value={description}
                  onChange={(val) => handleFieldChange("description", val)}
                  fieldName="description"
                  as="p"
                  className="text-gray-300 max-w-2xl leading-relaxed"
                  multiline
                />
              ) : (
                <p className="text-gray-300 max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  inView && !hasAnimated
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: 0 }
                }
                transition={{ duration: 0.4, delay: 0.8 }}
                className="flex flex-wrap gap-4 mt-8"
                role="group"
                aria-label="Call to action buttons"
              >
                {ctaButtons.map((button, index) => (
                  <Link
                    key={button._key || index}
                    href={button.link?.href || "#"}
                    target={button.link?.openInNewTab ? "_blank" : "_self"}
                    className={classNames(
                      "group relative px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300",
                      button.variant === "primary" &&
                        "bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 border border-gray-700 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30",
                      button.variant === "secondary" &&
                        "border border-gray-800 text-gray-200 hover:bg-gray-800/30 backdrop-blur-sm",
                      button.variant === "tertiary" &&
                        "text-gray-500 hover:text-gray-300"
                    )}
                    aria-label={button.label}
                    rel={
                      button.link?.openInNewTab
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <span className="relative flex items-center gap-2">
                      {button.label}
                      {button.variant !== "tertiary" && (
                        <svg
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      )}
                    </span>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Service Tags */}
          {onEdit && (
            <ServiceTagsInlineEditor
              tags={serviceTags}
              onChange={(tags) => handleFieldChange("serviceTags", tags)}
              preview={preview}
            />
          )}

          {/* Featured Services */}
          {onEdit && (
            <FeaturedServicesInlineEditor
              services={featuredServices}
              onChange={(svcs) => handleFieldChange("featuredServices", svcs)}
              preview={preview}
            />
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import React from "react";
import { useId } from "react";
import * as Icons from "lucide-react";
import { InlineEdit } from "@/src/components/shared/InlineEdit";
import { HeroBlockProps } from "./schema";

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");
const getIcon = (iconName: string) => {
  const IconComponent = Icons[
    iconName as keyof typeof Icons
  ] as React.ComponentType<any>;
  return IconComponent || Icons.Code;
};

// --- Inline Editor for Top Badges ---
const TopBadgesInlineEditor = ({
  badges = [],
  onChange,
  preview,
}: {
  badges: Array<{ _key: string; text: string; icon: string }>;
  onChange: (
    badges: Array<{ _key: string; text: string; icon: string }>
  ) => void;
  preview?: boolean;
}) => {
  const handleEdit = (idx: number, field: string, newValue: string) => {
    const newBadges = [...badges];
    newBadges[idx] = { ...newBadges[idx], [field]: newValue };
    onChange(newBadges);
  };

  const handleRemove = (idx: number) => {
    const newBadges = [...badges];
    newBadges.splice(idx, 1);
    onChange(newBadges);
  };

  const handleAdd = () => {
    onChange([
      ...badges,
      {
        _key: Math.random().toString(36).slice(2, 10),
        text: "New Badge",
        icon: "star",
      },
    ]);
  };

  const BADGE_ICONS = [
    "star",
    "trophy",
    "zap",
    "shield",
    "award",
    "users",
    "trending-up",
  ];

  return (
    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
      {badges.map((badge, idx) => {
        const IconComponent = getIcon(badge.icon);
        return (
          <div
            key={badge._key}
            className="group relative flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm border border-zinc-600/50 rounded-full hover:border-zinc-500/70 transition-all duration-300"
          >
            <div className="p-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
              <IconComponent className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              {preview && (
                <select
                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                  value={badge.icon}
                  onChange={(e) => handleEdit(idx, "icon", e.target.value)}
                >
                  {BADGE_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <InlineEdit
              value={badge.text}
              onChange={(val) => handleEdit(idx, "text", val)}
              fieldName={`badge-text-${idx}`}
              as="span"
              className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors duration-300"
              inputClassName="text-sm font-medium text-zinc-300 bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-2 py-1 rounded min-w-[120px]"
            />

            {preview && (
              <button
                className="absolute -top-2 -right-2 bg-zinc-900/80 border border-red-400/60 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(idx)}
                type="button"
              >
                <Icons.X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {preview && (
        <button
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 rounded-full"
          onClick={handleAdd}
          type="button"
        >
          <Icons.Plus className="w-4 h-4" />
          <span className="text-sm">Add Badge</span>
        </button>
      )}
    </div>
  );
};

// --- Premium Inline Editor for Features ---
const FeaturesInlineEditor = ({
  features = [],
  onChange,
  preview,
}: {
  features: Array<{
    _key: string;
    title: string;
    description: string;
    icon: string;
    highlight?: boolean;
  }>;
  onChange: (
    features: Array<{
      _key: string;
      title: string;
      description: string;
      icon: string;
      highlight?: boolean;
    }>
  ) => void;
  preview?: boolean;
}) => {
  const handleEdit = (idx: number, field: string, newValue: any) => {
    const newFeatures = [...features];
    newFeatures[idx] = { ...newFeatures[idx], [field]: newValue };
    onChange(newFeatures);
  };

  const handleRemove = (idx: number) => {
    const newFeatures = [...features];
    newFeatures.splice(idx, 1);
    onChange(newFeatures);
  };

  const handleAdd = () => {
    onChange([
      ...features,
      {
        _key: Math.random().toString(36).slice(2, 10),
        title: "New Feature",
        description: "Feature description...",
        icon: "blocks",
        highlight: false,
      },
    ]);
  };

  const FEATURE_ICONS = [
    "blocks",
    "zap",
    "palette",
    "database",
    "code",
    "smartphone",
    "layers",
    "settings",
    "rocket",
    "wand-2",
  ];

  return (
    <div className="space-y-16">
      {/* Premium Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-6">
          Everything you need to build
        </h2>
        <p className="text-xl text-zinc-400 leading-relaxed">
          Powerful features designed to accelerate your development workflow
        </p>
      </motion.div>

      {/* Premium Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => {
          const IconComponent = getIcon(feature.icon);
          const isHighlighted = feature.highlight;

          return (
            <motion.div
              key={feature._key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={classNames(
                "group relative p-8 rounded-3xl border backdrop-blur-xl transition-all duration-500 cursor-pointer overflow-hidden",
                isHighlighted
                  ? "bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-500/5 border-blue-500/20 hover:border-blue-400/40 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20"
                  : "bg-gradient-to-br from-zinc-900/60 via-zinc-800/40 to-zinc-900/60 border-zinc-700/40 hover:border-zinc-600/60 shadow-xl hover:shadow-2xl"
              )}
            >
              {/* Premium Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
              </div>

              {/* Highlight Glow Effect */}
              {isHighlighted && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-cyan-400/5 to-transparent rounded-3xl" />
              )}

              {/* Highlight Toggle */}
              {preview && (
                <button
                  className={classNames(
                    "absolute top-4 right-4 w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center backdrop-blur-sm",
                    isHighlighted
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400 shadow-lg shadow-blue-500/30"
                      : "border-zinc-600 hover:border-zinc-500 bg-zinc-800/50"
                  )}
                  onClick={() => handleEdit(idx, "highlight", !isHighlighted)}
                  title="Toggle highlight"
                  type="button"
                >
                  {isHighlighted && (
                    <Icons.Star className="w-4 h-4 text-white" />
                  )}
                </button>
              )}

              {/* Remove button */}
              {preview && (
                <button
                  className="absolute -top-3 -right-3 bg-zinc-900/90 border border-red-400/60 text-red-400 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm hover:bg-red-500/10"
                  onClick={() => handleRemove(idx)}
                  type="button"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              )}

              <div className="relative space-y-6">
                {/* Premium Icon Design */}
                <div className="relative">
                  <div
                    className={classNames(
                      "inline-flex p-4 rounded-2xl mb-6 transition-all duration-500 relative overflow-hidden",
                      isHighlighted
                        ? "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-blue-500/20 group-hover:from-blue-500/30 group-hover:via-cyan-500/15 group-hover:to-blue-500/30"
                        : "bg-gradient-to-br from-zinc-700/40 via-zinc-600/20 to-zinc-700/40 group-hover:from-zinc-600/50 group-hover:via-zinc-500/30 group-hover:to-zinc-600/50"
                    )}
                  >
                    {/* Icon glow effect */}
                    <div
                      className={classNames(
                        "absolute inset-0 rounded-2xl transition-all duration-500",
                        isHighlighted
                          ? "bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-xl"
                          : "bg-gradient-to-br from-zinc-500/10 to-zinc-400/10 blur-lg"
                      )}
                    />

                    <IconComponent
                      className={classNames(
                        "w-8 h-8 transition-all duration-500 relative z-10",
                        isHighlighted
                          ? "text-blue-300 group-hover:text-blue-200 group-hover:scale-110"
                          : "text-zinc-300 group-hover:text-zinc-100 group-hover:scale-110"
                      )}
                    />
                  </div>

                  {preview && (
                    <select
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={feature.icon}
                      onChange={(e) => handleEdit(idx, "icon", e.target.value)}
                    >
                      {FEATURE_ICONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Enhanced Title */}
                <InlineEdit
                  value={feature.title}
                  onChange={(val) => handleEdit(idx, "title", val)}
                  fieldName={`feature-title-${idx}`}
                  as="h3"
                  className={classNames(
                    "text-xl font-bold mb-4 transition-all duration-500 leading-tight",
                    isHighlighted
                      ? "text-white group-hover:text-blue-50"
                      : "text-zinc-100 group-hover:text-white"
                  )}
                  inputClassName="text-xl font-bold bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-3 py-2 rounded-lg w-full text-white"
                />

                {/* Enhanced Description */}
                <InlineEdit
                  value={feature.description}
                  onChange={(val) => handleEdit(idx, "description", val)}
                  fieldName={`feature-description-${idx}`}
                  as="p"
                  className="text-zinc-400 group-hover:text-zinc-300 transition-all duration-500 leading-relaxed text-base font-light"
                  inputClassName="text-zinc-400 bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-3 py-2 rounded-lg w-full min-h-[80px] text-base"
                  multiline
                />

                {/* Premium Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          );
        })}

        {preview && (
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{
              duration: 0.6,
              delay: features.length * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-blue-400/30 text-blue-400 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 hover:from-blue-500/10 hover:to-cyan-500/10 transition-all duration-300 min-h-[320px] backdrop-blur-sm group"
            onClick={handleAdd}
            type="button"
          >
            <div className="p-4 rounded-2xl bg-blue-500/10 mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
              <Icons.Plus className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-lg font-medium">Add Feature</span>
            <span className="text-sm text-blue-400/70 mt-1">
              Showcase another capability
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

// --- Inline Editor for CTA Buttons ---
const CTAButtonsInlineEditor = ({
  buttons = [],
  onChange,
  preview,
}: {
  buttons: Array<{
    _key?: string;
    label?: string;
    variant?: "primary" | "secondary" | "tertiary";
    icon?: string;
    link?: {
      href: string;
      openInNewTab?: boolean;
    };
  }>;
  onChange: (
    buttons: Array<{
      _key?: string;
      label?: string;
      variant?: "primary" | "secondary" | "tertiary";
      icon?: string;
      link?: {
        href: string;
        openInNewTab?: boolean;
      };
    }>
  ) => void;
  preview?: boolean;
}) => {
  const handleEdit = (idx: number, field: string, newValue: any) => {
    const newButtons = [...buttons];
    newButtons[idx] = { ...newButtons[idx], [field]: newValue };
    onChange(newButtons);
  };

  const handleLinkEdit = (idx: number, linkField: string, newValue: any) => {
    const newButtons = [...buttons];
    newButtons[idx] = {
      ...newButtons[idx],
      link: { ...newButtons[idx].link, [linkField]: newValue },
    };
    onChange(newButtons);
  };

  const handleRemove = (idx: number) => {
    const newButtons = [...buttons];
    newButtons.splice(idx, 1);
    onChange(newButtons);
  };

  const handleAdd = () => {
    onChange([
      ...buttons,
      {
        _key: Math.random().toString(36).slice(2, 10),
        label: "New Button",
        variant: "secondary" as const,
        icon: "arrow-right",
        link: { href: "#", openInNewTab: false },
      },
    ]);
  };

  const BUTTON_ICONS = [
    "play",
    "arrow-right",
    "external-link",
    "download",
    "rocket",
  ];
  const BUTTON_VARIANTS = ["primary", "secondary", "tertiary"];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {buttons.map((button, idx) => {
        const IconComponent = button.icon ? getIcon(button.icon) : null;
        return (
          <div key={button._key || idx} className="relative group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div
                className={classNames(
                  "group relative px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer",
                  button.variant === "primary" &&
                    "bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white hover:from-blue-400/90 hover:to-blue-500/90 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 border border-blue-400/30",
                  button.variant === "secondary" &&
                    "border border-zinc-600 text-zinc-200 hover:bg-zinc-800/50 backdrop-blur-sm hover:border-zinc-500 shadow-lg hover:shadow-xl",
                  button.variant === "tertiary" &&
                    "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <span className="relative flex items-center gap-3">
                  <InlineEdit
                    value={button.label}
                    onChange={(val) => handleEdit(idx, "label", val)}
                    fieldName={`button-label-${idx}`}
                    as="span"
                    className="font-semibold"
                    inputClassName="font-semibold bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-2 py-1 rounded text-white min-w-[100px]"
                  />
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  )}
                </span>
              </div>
            </motion.div>

            {/* Edit Controls */}
            {preview && (
              <div className="absolute -top-12 left-0 right-0 bg-zinc-900/90 backdrop-blur-sm border border-zinc-600/50 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 min-w-[250px]">
                <div className="space-y-2 text-xs">
                  {/* Variant */}
                  <select
                    className="w-full px-2 py-1 rounded bg-zinc-800 text-gray-200 border border-gray-700 text-xs"
                    value={button.variant}
                    onChange={(e) => handleEdit(idx, "variant", e.target.value)}
                  >
                    {BUTTON_VARIANTS.map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))}
                  </select>

                  {/* Icon */}
                  <select
                    className="w-full px-2 py-1 rounded bg-zinc-800 text-gray-200 border border-gray-700 text-xs"
                    value={button.icon || ""}
                    onChange={(e) => handleEdit(idx, "icon", e.target.value)}
                  >
                    <option value="">No icon</option>
                    {BUTTON_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>

                  {/* URL */}
                  <input
                    className="w-full px-2 py-1 rounded bg-zinc-800 text-gray-200 border border-gray-700 text-xs"
                    value={button.link?.href || ""}
                    onChange={(e) =>
                      handleLinkEdit(idx, "href", e.target.value)
                    }
                    placeholder="Button URL"
                  />

                  {/* New Tab */}
                  <label className="flex items-center gap-2 text-gray-400">
                    <input
                      type="checkbox"
                      checked={!!button.link?.openInNewTab}
                      onChange={(e) =>
                        handleLinkEdit(idx, "openInNewTab", e.target.checked)
                      }
                      className="rounded border-zinc-700 bg-zinc-800 text-blue-500"
                    />
                    Open in new tab
                  </label>
                </div>
              </div>
            )}

            {/* Remove button */}
            {preview && (
              <button
                className="absolute -top-2 -right-2 bg-zinc-900/80 border border-red-400/60 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => handleRemove(idx)}
                type="button"
              >
                <Icons.X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {preview && (
        <button
          className="flex items-center justify-center px-8 py-4 border-2 border-dashed border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 rounded-xl min-w-[150px]"
          onClick={handleAdd}
          type="button"
        >
          <Icons.Plus className="w-5 h-5 mr-2" />
          Add Button
        </button>
      )}
    </div>
  );
};

// Enhanced Dynamic Visual Building Blocks Component
const DynamicVisualBlocks = ({
  animationBlocks = [],
  onEdit,
  preview,
}: {
  animationBlocks?: Array<{
    _key: string;
    name: string;
    description: string;
    icon: string;
  }>;
  onEdit?: (field: string, value: any) => void;
  preview?: boolean;
}) => {
  const [activeBlock, setActiveBlock] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buildingStage, setBuildingStage] = useState("");

  // Default blocks that match the schema initial values
  const defaultBlocks: Array<{
    _key: string;
    name: string;
    description: string;
    icon: string;
  }> = [
    {
      _key: "header-block",
      name: "Header",
      description: "Navigation & branding",
      icon: "layout",
    },
    {
      _key: "hero-block",
      name: "Hero",
      description: "Hero section & CTA",
      icon: "sparkles",
    },
    {
      _key: "content-block",
      name: "Content",
      description: "Main content area",
      icon: "file-text",
    },
    {
      _key: "footer-block",
      name: "Footer",
      description: "Footer & links",
      icon: "grid-3x3",
    },
  ];

  // Use provided blocks or fall back to defaults
  const blocksToShow =
    animationBlocks.length > 0 ? animationBlocks : defaultBlocks;

  useEffect(() => {
    let mainTimeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    let currentBlockIndex = 0;

    const startBuildingSequence = () => {
      // Reset state for new block
      setIsBuilding(true);
      setProgress(0);
      setBuildingStage("Initializing");
      setActiveBlock(currentBlockIndex);

      // Building stages with proper timing
      const stages = [
        { name: "Analyzing", duration: 15 }, // 0-15%
        { name: "Generating", duration: 25 }, // 15-40%
        { name: "Applying", duration: 25 }, // 40-65%
        { name: "Optimizing ", duration: 20 }, // 65-85%
        { name: "Finalizing", duration: 10 }, // 85-95%
        { name: "Complete", duration: 5 }, // 95-100%
      ];

      let currentStageIndex = 0;
      let stageProgress = 0;
      let totalProgress = 0;

      setBuildingStage(stages[0].name);

      progressInterval = setInterval(() => {
        stageProgress += 1;
        totalProgress += 1;

        // Check if current stage is complete
        if (stageProgress >= stages[currentStageIndex].duration) {
          currentStageIndex++;
          stageProgress = 0;

          if (currentStageIndex < stages.length) {
            setBuildingStage(stages[currentStageIndex].name);
          }
        }

        setProgress(totalProgress);

        // When fully complete (100%)
        if (totalProgress >= 100) {
          clearInterval(progressInterval);

          // Show complete state briefly
          setTimeout(() => {
            setIsBuilding(false);

            // Move to next block after a pause
            setTimeout(() => {
              currentBlockIndex = (currentBlockIndex + 1) % blocksToShow.length;

              // Start next block after a longer pause
              setTimeout(() => {
                startBuildingSequence();
              }, 1500); // Pause between blocks
            }, 1000); // Pause after completion
          }, 800); // Show complete state
        }
      }, 50); // Slower, more visible progress (100 steps = 5 seconds total)
    };

    // Start the sequence after initial delay
    mainTimeout = setTimeout(() => {
      startBuildingSequence();
    }, 2000);

    // Cleanup function
    return () => {
      if (mainTimeout) clearTimeout(mainTimeout);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [blocksToShow.length]);

  // Use animation blocks from schema or defaults
  const blockConfigs = blocksToShow.map((block, index) => ({
    name: block.name,
    icon: getIcon(block.icon),
    description: block.description,
  }));

  const handleBlockEdit = (index: number, field: string, value: string) => {
    if (onEdit) {
      // Always work with the actual animationBlocks, not the fallback
      const currentBlocks =
        animationBlocks.length > 0 ? animationBlocks : defaultBlocks;
      const newBlocks = [...currentBlocks];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      onEdit("animationBlocks", newBlocks);
    }
  };

  const blockVariants = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
      },
    },
    building: {
      scale: [1, 1.04, 1],
      rotateY: [0, 1, -1, 0],
      transition: {
        duration: 1.2,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="relative max-w-3xl mx-auto"
    >
      {/* Premium Building Canvas */}
      <div className="relative p-8 bg-gradient-to-br from-zinc-900/95 via-zinc-800/80 to-zinc-900/95 backdrop-blur-2xl border border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/60">
        {/* Advanced Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.06),transparent_50%)] opacity-60 rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.06),transparent_50%)] opacity-60 rounded-2xl" />

        {/* Enhanced Building Progress Header */}
        <AnimatePresence>
          {isBuilding && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600/95 to-blue-500/95 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-xl border border-blue-400/40 backdrop-blur-lg z-50"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <div className="absolute inset-0 w-4 h-4 border-2 border-transparent border-b-blue-200 rounded-full animate-spin animate-reverse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs opacity-90">{buildingStage}</span>
                  <span className="text-xs text-blue-100">
                    Assembling {blockConfigs[activeBlock]?.name} block
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-white to-blue-100 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-white font-bold text-xs min-w-[2rem]">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative space-y-6">
          {blockConfigs.map((config, index) => {
            const isActive = activeBlock === index;
            const IconComponent = config.icon;
            const isBuilt =
              activeBlock > index ||
              (activeBlock === index && progress === 100);
            const isBuilding =
              activeBlock === index && progress > 0 && progress < 100;

            return (
              <motion.div
                key={blocksToShow[index]._key}
                variants={blockVariants}
                whileHover="hover"
                animate={isBuilding ? "building" : "animate"}
                className={classNames(
                  "relative p-6 rounded-2xl border cursor-pointer transition-all duration-700 group",
                  "bg-gradient-to-r from-zinc-800/70 via-zinc-700/50 to-zinc-800/70 border-zinc-600/50",
                  isActive &&
                    "ring-2 ring-blue-400/40 shadow-xl shadow-blue-500/25",
                  isBuilt &&
                    "bg-gradient-to-r from-blue-500/15 via-blue-400/10 to-blue-500/15 border-blue-500/40 shadow-lg shadow-blue-500/20",
                  isBuilding &&
                    "ring-3 ring-blue-400/30 shadow-xl shadow-blue-500/30"
                )}
                style={{
                  height:
                    index === 1
                      ? "130px"
                      : index === 0 || index === 3
                        ? "100px"
                        : "115px",
                }}
              >
                {/* Advanced Background Effects */}
                <div className="absolute inset-0 rounded-2xl transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-600/15 via-transparent to-zinc-600/10 rounded-2xl" />
                  {isBuilt && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 via-blue-300/8 to-transparent rounded-2xl" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.08),transparent_60%)] rounded-2xl" />
                    </>
                  )}
                  {isBuilding && (
                    <>
                      <motion.div
                        animate={{
                          background: [
                            "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15), transparent 50%)",
                            "radial-gradient(circle at 80% 50%, rgba(59,130,246,0.12), transparent 50%)",
                            "radial-gradient(circle at 50% 20%, rgba(96,165,250,0.15), transparent 50%)",
                            "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15), transparent 50%)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-2xl"
                      />
                      {/* Building particles */}
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-0.5 h-0.5 bg-blue-400 rounded-full"
                          style={{
                            left: `${25 + i * 15}%`,
                            top: `${40 + Math.sin(i) * 15}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>

                <div className="relative h-full flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Enhanced Icon */}
                    <div
                      className={classNames(
                        "relative p-3 rounded-xl transition-all duration-700 overflow-hidden",
                        isBuilt
                          ? "bg-gradient-to-br from-blue-500/25 via-blue-400/15 to-blue-500/25"
                          : "bg-zinc-700/50",
                        isBuilding && "animate-pulse"
                      )}
                    >
                      {/* Glow effects */}
                      {isBuilt && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-xl blur-lg" />
                      )}
                      {isBuilding && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/25 to-transparent rounded-xl"
                        />
                      )}
                      <IconComponent
                        className={classNames(
                          "w-7 h-7 transition-all duration-700 relative z-10",
                          isBuilt ? "text-blue-200" : "text-zinc-400"
                        )}
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      {/* Enhanced Editable Block Name */}
                      {onEdit ? (
                        <InlineEdit
                          value={config.name}
                          onChange={(val) =>
                            handleBlockEdit(index, "name", val)
                          }
                          fieldName={`animation-block-name-${index}`}
                          as="div"
                          className={classNames(
                            "text-xl font-bold transition-all duration-700",
                            isBuilt ? "text-blue-100" : "text-zinc-200"
                          )}
                          inputClassName="text-xl font-bold bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-3 py-2 rounded-lg text-white min-w-[120px]"
                        />
                      ) : (
                        <div
                          className={classNames(
                            "text-xl font-bold transition-all duration-700",
                            isBuilt ? "text-blue-100" : "text-zinc-200"
                          )}
                        >
                          {config.name}
                        </div>
                      )}

                      {/* Enhanced Editable Block Description */}
                      {onEdit ? (
                        <InlineEdit
                          value={config.description}
                          onChange={(val) =>
                            handleBlockEdit(index, "description", val)
                          }
                          fieldName={`animation-block-description-${index}`}
                          as="div"
                          className={classNames(
                            "text-sm transition-all duration-700",
                            isBuilt ? "text-blue-200/90" : "text-zinc-400"
                          )}
                          inputClassName="text-sm bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-3 py-2 rounded-lg min-w-[140px] text-blue-200"
                        />
                      ) : (
                        <div
                          className={classNames(
                            "text-sm transition-all duration-700",
                            isBuilt ? "text-blue-200/90" : "text-zinc-400"
                          )}
                        >
                          {config.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Preview Elements */}
                  <div className="flex-1 max-w-sm">
                    <div className="flex justify-end items-center gap-3">
                      {[20, 16, 12].map((width, i) => (
                        <motion.div
                          key={i}
                          className={classNames(
                            `w-${width} h-3 rounded-lg transition-all duration-700`,
                            isBuilt
                              ? "bg-gradient-to-r from-blue-400/50 to-blue-300/50"
                              : "bg-zinc-500/40"
                          )}
                          animate={
                            isBuilding
                              ? {
                                  opacity: [0.3, 1, 0.3],
                                  scale: [0.95, 1.05, 0.95],
                                }
                              : {}
                          }
                          transition={{
                            duration: 2,
                            repeat: isBuilding ? Infinity : 0,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Status Indicators */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-blue-400/40 shadow-lg shadow-blue-500/40"
                    >
                      {isBuilding ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <Icons.Sparkles className="w-4 h-4 text-white" />
                      )}
                    </motion.div>
                  )}
                  {isBuilt && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center border-2 border-blue-500/40 shadow-lg shadow-blue-600/40"
                    >
                      <Icons.Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Floating Tools */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute -left-8 top-1/4 p-3 bg-zinc-800/95 backdrop-blur-lg border border-zinc-600/60 rounded-xl shadow-xl"
        >
          <Icons.Palette className="w-5 h-5 text-blue-100" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.7, duration: 1 }}
          className="absolute -right-8 bottom-1/3 p-3 bg-zinc-800/95 backdrop-blur-lg border border-zinc-600/60 rounded-xl shadow-xl"
        >
          <Icons.Wand2 className="w-5 h-5 text-blue-100" />
        </motion.div>
      </div>

      {/* Enhanced Building Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="mt-8 flex justify-center gap-6"
      >
        {[
          { icon: Icons.MousePointer2, text: "Drag & Drop", color: "blue-400" },
          { icon: Icons.Paintbrush, text: "Customize", color: "blue-500" },
          { icon: Icons.Rocket, text: "Deploy", color: "blue-300" },
        ].map(({ icon: Icon, text, color }, i) => (
          <motion.div
            key={text}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`flex items-center gap-3 px-6 py-3 bg-zinc-800/80 backdrop-blur-lg border border-zinc-700/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <Icon className={`w-5 h-5 text-${color}`} />
            <span className="text-sm text-zinc-300 font-medium">{text}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export function HeroBlock({
  topBadges = [],
  animationBlocks = [],
  mainHeading = "",
  subHeading = "",
  description = "",
  features = [],
  ctaButtons = [],
  image,
  preview = false,
  onEdit,
}: HeroBlockProps) {
  const { scrollY } = useScroll();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const headingId = useId();

  const y = useTransform(scrollY, [0, 1000], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  // Memoize the handlers to prevent unnecessary re-renders
  const handleFieldChange = React.useCallback(
    (field: string, value: any) => {
      if (onEdit) {
        onEdit(field, value);
      }
    },
    [onEdit]
  );

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 overflow-hidden"
      aria-labelledby={mainHeading ? headingId : undefined}
      role="banner"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Advanced Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.08)_1px,transparent_1px)] bg-[size:6rem_6rem]" />

        {/* Strategic Color Orbs - Harmonious Blue */}
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, 80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/8 via-blue-400/6 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-tl from-blue-600/8 via-blue-500/6 to-transparent rounded-full blur-3xl"
        />

        {/* Floating Geometric Elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 3 === 0
                ? "bg-blue-400/20"
                : i % 3 === 1
                  ? "bg-blue-300/20"
                  : "bg-white/10"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Background Image */}
      {image?.asset?.url && (
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
          aria-hidden="true"
        >
          <Image
            src={image.asset.url}
            alt={image.alt || "Page builder interface"}
            fill
            className="object-cover object-center opacity-5"
            priority
            sizes="100vw"
            quality={90}
            role="presentation"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/40 to-transparent pointer-events-none" />
        </motion.div>
      )}

      <div className="relative mx-auto max-w-8xl px-6 lg:px-12 pt-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Side - Enhanced Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-10"
          >
            {/* Main Heading - Enhanced Typography */}
            {onEdit ? (
              <InlineEdit
                value={mainHeading}
                onChange={(val) => handleFieldChange("mainHeading", val)}
                fieldName="mainHeading"
                as="h1"
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.02em] leading-[0.9] relative"
                inputClassName="text-2xl font-black tracking-[-0.02em] bg-transparent text-white w-full leading-[0.9] border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-2 py-1 rounded"
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-zinc-100 bg-clip-text text-transparent relative">
                  {mainHeading}
                </span>
              </InlineEdit>
            ) : (
              <h1 className="text-2xl font-black tracking-[-0.02em] leading-[0.9] relative">
                <span className="bg-gradient-to-r from-white via-blue-100 to-zinc-100 bg-clip-text text-transparent relative">
                  {mainHeading}
                </span>
              </h1>
            )}

            {/* Sub Heading - Enhanced */}
            {onEdit ? (
              <InlineEdit
                value={subHeading}
                onChange={(val) => handleFieldChange("subHeading", val)}
                fieldName="subHeading"
                as="p"
                className="text-xl md:text-2xl text-zinc-300 leading-[1.3] font-light max-w-2xl tracking-[-0.01em]"
                inputClassName="text-2xl md:text-3xl text-zinc-300 bg-transparent border border-blue-400/80 focus:ring-2 focus:ring-blue-400/40 px-4 py-3 rounded-lg w-full"
                multiline
              />
            ) : (
              <p className="text-2xl md:text-3xl text-zinc-300 leading-[1.3] font-light max-w-2xl tracking-[-0.01em]">
                {subHeading}
              </p>
            )}

            {/* CTA Buttons - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-4"
            >
              {onEdit ? (
                <CTAButtonsInlineEditor
                  buttons={ctaButtons}
                  onChange={(newButtons) =>
                    handleFieldChange("ctaButtons", newButtons)
                  }
                  preview={preview}
                />
              ) : (
                <div className="flex flex-col sm:flex-row gap-6">
                  {ctaButtons.map((button, index) => {
                    const IconComponent = button.icon
                      ? getIcon(button.icon)
                      : null;
                    return (
                      <motion.div
                        key={button._key || index}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={button.link?.href || "#"}
                          target={
                            button.link?.openInNewTab ? "_blank" : "_self"
                          }
                          className={classNames(
                            "group relative px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm",
                            button.variant === "primary" &&
                              "bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white hover:from-blue-400/90 hover:to-blue-500/90 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 border border-blue-400/30",
                            button.variant === "secondary" &&
                              "border border-zinc-600 text-zinc-200 hover:bg-zinc-800/80 backdrop-blur-md hover:border-zinc-500/70 shadow-xl hover:shadow-2xl",
                            button.variant === "tertiary" &&
                              "text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          <span className="relative flex items-center gap-3 font-medium">
                            {button.label}
                            {IconComponent && (
                              <IconComponent className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            )}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Right Side - Enhanced Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <DynamicVisualBlocks
              animationBlocks={animationBlocks}
              onEdit={onEdit}
              preview={preview}
            />
          </motion.div>
        </div>

        {/* Premium Feature Cards */}
        {(features.length > 0 || onEdit) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-32"
          >
            <FeaturesInlineEditor
              features={features}
              onChange={(newFeatures) =>
                handleFieldChange("features", newFeatures)
              }
              preview={preview}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useId } from "react";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { InlineEdit } from "@/src/components/shared/InlineEdit";

// Define the types for the component
type ButtonType = {
  _key?: string;
  _type?: string;
  label?: string;
  icon?: string;
  link?: {
    href?: string;
    openInNewTab?: boolean;
  };
  variant?: "primary" | "secondary" | "tertiary" | "outline";
};

type PagebuilderType<T extends string> = {
  _type: T;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  richText?: any[];
  buttons?: ButtonType[];
  style?: "modern" | "glass" | "light" | "dark";
  backgroundStyle?: "gradient" | "geometric" | "mesh" | "simple";
  alignment?: "center" | "left";
};

export type CTABlockProps = PagebuilderType<"cta">;

const ButtonIcon = ({
  icon,
  "aria-hidden": ariaHidden,
}: {
  icon?: string;
  "aria-hidden"?: boolean;
}) => {
  if (!icon) return null;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[icon];
  return Icon ? <Icon className="w-4 h-4" aria-hidden={ariaHidden} /> : null;
};

export function CtaBlock({
  richText,
  title = "",
  subtitle = "",
  eyebrow = "",
  buttons = [],
  style = "modern",
  backgroundStyle = "gradient",
  alignment = "center",
  onFieldEdit,
}: CTABlockProps & { onFieldEdit?: (field: string, value: any) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const headingId = useId();
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Memoize the handlers to prevent unnecessary re-renders
  const handleFieldChange = React.useCallback(
    (field: string, value: any) => {
      if (onFieldEdit) {
        onFieldEdit(field, value);
      }
    },
    [onFieldEdit]
  );

  const handleButtonChange = React.useCallback(
    (index: number, field: string, value: any) => {
      if (onFieldEdit) {
        const newButtons = [...buttons];
        newButtons[index] = {
          ...newButtons[index],
          [field]: value,
        };
        onFieldEdit("buttons", newButtons);
      }
    },
    [buttons, onFieldEdit]
  );

  // Memoize the background classes
  const backgroundClasses = React.useMemo(() => {
    switch (backgroundStyle) {
      case "geometric":
        return "bg-gradient-to-br from-gray-900 via-gray-800 to-black";
      case "mesh":
        return "bg-gradient-to-br from-gray-900 via-gray-800/90 to-black bg-mesh-pattern";
      case "simple":
        return "bg-gradient-to-br from-gray-900 to-black";
      default: // gradient
        return "bg-gradient-to-r from-gray-900 via-gray-800 to-black";
    }
  }, [backgroundStyle]);

  // Memoize the button variant classes
  const getButtonVariantClasses = React.useCallback(
    (variant: string = "primary") => {
      switch (variant) {
        case "secondary":
          return "border border-gray-800 text-gray-300 hover:bg-gray-800/30 backdrop-blur-sm";
        case "outline":
          return "border border-gray-700 text-gray-300 hover:bg-gray-800/30 backdrop-blur-sm";
        case "tertiary":
          return "text-gray-400 hover:text-gray-200";
        default: // primary
          return "bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 border border-gray-700 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30";
      }
    },
    []
  );

  // Memoize the content alignment classes
  const alignmentClasses = React.useMemo(() => {
    return alignment === "center" ? "text-center" : "text-left";
  }, [alignment]);

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
      aria-labelledby={title ? headingId : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isInView && !hasAnimated
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 0 }
          }
          onAnimationComplete={() => setHasAnimated(true)}
          transition={{ duration: 0.6 }}
          className={`relative overflow-hidden isolate rounded-2xl ${backgroundClasses}`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
          </div>

          {/* Glow Effects */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-transparent rounded-full blur-3xl transform rotate-12 animate-pulse" />
            <div className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gray-800/30 via-gray-700/20 to-transparent rounded-full blur-3xl transform -rotate-12 animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative px-6 py-24 sm:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView && !hasAnimated
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, y: 0 }
              }
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`max-w-4xl mx-auto space-y-8 ${alignmentClasses}`}
            >
              <InlineEdit
                value={eyebrow}
                onChange={(val) => handleFieldChange("eyebrow", val)}
                fieldName="eyebrow"
                as="p"
                className="text-sm sm:text-base font-medium uppercase tracking-wider text-gray-400"
                preserveStyles={true}
              />
              <InlineEdit
                value={title}
                onChange={(val) => handleFieldChange("title", val)}
                fieldName="title"
                as="h2"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
                inputClassName="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-transparent text-white"
                preserveStyles={true}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300">
                  {title}
                </span>
              </InlineEdit>
              <InlineEdit
                value={subtitle}
                onChange={(val) => handleFieldChange("subtitle", val)}
                fieldName="subtitle"
                as="p"
                className={`text-xl sm:text-2xl text-gray-400 font-light max-w-2xl ${
                  alignment === "center" ? "mx-auto" : ""
                }`}
                multiline
                preserveStyles={true}
              />
              {/* RichText: now editable inline */}
              <InlineEdit
                value={
                  richText?.[0]?.children?.map((c: any) => c.text).join("\n") ||
                  ""
                }
                onChange={(val) => {
                  if (onFieldEdit) {
                    onFieldEdit("richText", [
                      {
                        _type: "block",
                        style: "normal",
                        children: [{ _type: "span", text: val }],
                      },
                    ]);
                  }
                }}
                fieldName="richText"
                as="div"
                className="prose prose-lg prose-invert prose-gray max-w-none opacity-80"
                multiline
                preserveStyles={true}
              />
              {buttons && buttons.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView && !hasAnimated
                      ? { opacity: 1, y: 0 }
                      : { opacity: 1, y: 0 }
                  }
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className={`flex flex-wrap gap-4 mt-8 ${
                    alignment === "center" ? "justify-center" : "justify-start"
                  }`}
                >
                  {buttons.map((button, index) => (
                    <InlineEdit
                      key={button._key || index}
                      value={button.label || ""}
                      onChange={(val) =>
                        handleButtonChange(index, "label", val)
                      }
                      fieldName={`button ${index + 1} label`}
                      as="span"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg border border-gray-700 bg-gray-800/30 text-white"
                      preserveStyles={true}
                    >
                      {button.label}
                      {button.icon ? (
                        <span className="transition-transform group-hover:translate-x-1">
                          <ButtonIcon icon={button.icon} aria-hidden={true} />
                        </span>
                      ) : null}
                    </InlineEdit>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

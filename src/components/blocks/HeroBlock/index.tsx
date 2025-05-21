"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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
      aria-labelledby="hero-heading"
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
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight"
                id="hero-heading"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-100">
                  {mainHeading}
                </span>
              </motion.h1>

              {/* Sub Heading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-100 font-light"
                role="doc-subtitle"
              >
                {subHeading}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 max-w-2xl leading-relaxed"
                aria-label="Hero description"
              >
                {description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 mt-8"
                role="group"
                aria-label="Call to action buttons"
              >
                {ctaButtons.map((button) => (
                  <Link
                    key={button._key}
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
          {serviceTags && serviceTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mt-16"
              role="list"
              aria-label="Service categories"
            >
              {serviceTags.map((tag, index) => (
                <motion.div
                  key={`${tag}-${index}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="group"
                  role="listitem"
                >
                  <div
                    className="px-4 py-2 rounded-lg border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm text-gray-400 hover:border-gray-700 hover:text-gray-200 transition-colors duration-300 cursor-text"
                    contentEditable={preview}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (onEdit && preview) {
                        const newTags = [...serviceTags];
                        newTags[index] = e.currentTarget.textContent || tag;
                        onEdit("serviceTags", newTags);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                    }}
                  >
                    {tag}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Featured Services */}
          {featuredServices && featuredServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
              role="region"
              aria-label="Featured services"
            >
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service._key}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="group"
                >
                  {preview ? (
                    <div className="p-6 rounded-lg border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-sm hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300">
                      {service.icon && (
                        <div className="mb-4 text-gray-400 group-hover:text-gray-300">
                          <i className={`fas fa-${service.icon} text-2xl`}></i>
                        </div>
                      )}
                      <div
                        className="text-xl font-semibold text-gray-200 mb-2 group-hover:text-white cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleServiceEdit(
                            index,
                            "title",
                            e.currentTarget.textContent || ""
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.currentTarget.blur();
                          }
                        }}
                      >
                        {service.title}
                      </div>
                      <div
                        className="text-gray-500 group-hover:text-gray-400 cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleServiceEdit(
                            index,
                            "description",
                            e.currentTarget.textContent || ""
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.currentTarget.blur();
                          }
                        }}
                      >
                        {service.description}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={service.link?.href || "#"}
                      target={service.link?.openInNewTab ? "_blank" : "_self"}
                    >
                      <div className="p-6 rounded-lg border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-sm hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300">
                        {service.icon && (
                          <div className="mb-4 text-gray-400 group-hover:text-gray-300">
                            <i
                              className={`fas fa-${service.icon} text-2xl`}
                            ></i>
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-200 mb-2 group-hover:text-white">
                          {service.title}
                        </h3>
                        <p className="text-gray-500 group-hover:text-gray-400">
                          {service.description}
                        </p>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

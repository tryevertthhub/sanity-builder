"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useId, useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { InlineEdit } from "@/src/components/shared/InlineEdit";

export type TestimonialBlockProps = {
  _type: "testimonialBlock";
  sectionHeading?: string;
  title?: string;
  subtitle?: string;
  testimonials?: {
    _key: string;
    quote: string;
    author: string;
    role?: string;
    company?: string;
    location?: string;
    image?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
    rating?: number;
  }[];
  backgroundImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  onEdit?: (field: string, value: any) => void;
};

export function TestimonialBlock({
  sectionHeading = "CLIENT TESTIMONIALS",
  title = "What Our Clients Say",
  subtitle = "Discover why businesses trust us with their legal needs",
  testimonials = [],
  backgroundImage,
  onEdit,
}: TestimonialBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);
  const headingId = useId();

  const handleField = (field: string, value: any) => {
    if (onEdit) onEdit(field, value);
  };
  const handleTestimonialField = (
    idx: number,
    field: string,
    value: string
  ) => {
    if (!onEdit) return;
    const newTestimonials = [...testimonials];
    newTestimonials[idx] = { ...newTestimonials[idx], [field]: value };
    onEdit("testimonials", newTestimonials);
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-24 lg:py-32"
      aria-labelledby={headingId}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      {backgroundImage && (
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 -z-20"
          aria-hidden="true"
        >
          <Image
            src={backgroundImage.asset.url}
            alt={backgroundImage.alt || ""}
            fill
            className="object-cover opacity-15 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </motion.div>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          {onEdit ? (
            <InlineEdit
              value={sectionHeading}
              onChange={(val) => handleField("sectionHeading", val)}
              fieldName="sectionHeading"
              as="p"
              className="text-base font-semibold uppercase tracking-wide text-gray-400"
            />
          ) : (
            <p className="text-base font-semibold uppercase tracking-wide text-gray-400">
              {sectionHeading}
            </p>
          )}
          {onEdit ? (
            <InlineEdit
              value={title}
              onChange={(val) => handleField("title", val)}
              fieldName="title"
              as="h2"
              className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-gray-200/80 via-white to-gray-200/80 bg-clip-text text-transparent"
            />
          ) : (
            <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-gray-200/80 via-white to-gray-200/80 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          {subtitle &&
            (onEdit ? (
              <InlineEdit
                value={subtitle}
                onChange={(val) => handleField("subtitle", val)}
                fieldName="subtitle"
                as="p"
                className="mt-6 text-lg leading-8 text-gray-400"
                multiline
              />
            ) : (
              <p className="mt-6 text-lg leading-8 text-gray-400">{subtitle}</p>
            ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._key}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="relative flex h-full flex-col rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80"
              >
                {/* Rating */}
                {testimonial.rating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex gap-x-1 mb-6"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.svg
                        key={i}
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: 0.8 + index * 0.1 + i * 0.1,
                        }}
                        className={
                          i < testimonial.rating!
                            ? "text-primary"
                            : "text-gray-800"
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        height="20"
                        width="20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    ))}
                  </motion.div>
                )}

                {/* Quote */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="flex-1"
                >
                  {onEdit ? (
                    <InlineEdit
                      value={testimonial.quote}
                      onChange={(val) =>
                        handleTestimonialField(index, "quote", val)
                      }
                      fieldName={`testimonials.${index}.quote`}
                      as="p"
                      className="text-lg font-medium leading-8 text-gray-200 group-hover:text-white"
                      multiline
                    />
                  ) : (
                    <p className="text-lg font-medium leading-8 text-gray-200 group-hover:text-white">
                      {testimonial.quote}
                    </p>
                  )}
                </motion.blockquote>

                {/* Author */}
                <motion.figcaption
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  className="mt-8 flex items-center gap-x-6 border-t border-gray-800/50 pt-6"
                >
                  {testimonial.image ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative h-14 w-14 overflow-hidden rounded-full border border-gray-800/50"
                    >
                      <Image
                        src={testimonial.image.asset.url}
                        alt={testimonial.image.alt || testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ) : (
                    <div
                      className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-xl font-semibold text-white"
                      aria-hidden="true"
                    >
                      {testimonial.author[0]}
                    </div>
                  )}
                  <div>
                    {onEdit ? (
                      <InlineEdit
                        value={testimonial.author}
                        onChange={(val) =>
                          handleTestimonialField(index, "author", val)
                        }
                        fieldName={`testimonials.${index}.author`}
                        as="div"
                        className="font-semibold text-white"
                      />
                    ) : (
                      <div className="font-semibold text-white">
                        {testimonial.author}
                      </div>
                    )}
                    {(testimonial.role || testimonial.company) && (
                      <div className="text-sm text-gray-400">
                        {testimonial.role && (
                          <InlineEdit
                            value={testimonial.role}
                            onChange={(val) =>
                              handleTestimonialField(index, "role", val)
                            }
                            fieldName={`testimonials.${index}.role`}
                            as="span"
                            className=""
                          />
                        )}
                        {testimonial.company && testimonial.role && " · "}
                        {testimonial.company && (
                          <InlineEdit
                            value={testimonial.company}
                            onChange={(val) =>
                              handleTestimonialField(index, "company", val)
                            }
                            fieldName={`testimonials.${index}.company`}
                            as="span"
                            className=""
                          />
                        )}
                      </div>
                    )}
                    {testimonial.location && (
                      <InlineEdit
                        value={testimonial.location}
                        onChange={(val) =>
                          handleTestimonialField(index, "location", val)
                        }
                        fieldName={`testimonials.${index}.location`}
                        as="div"
                        className="mt-1 text-sm text-gray-500"
                      />
                    )}
                  </div>
                </motion.figcaption>

                {/* Decorative gradient */}
                <div
                  className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-gray-800/5 via-gray-800/2 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

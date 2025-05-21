"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import React, { useState } from "react";

export type BlogPreviewBlockProps = {
  _type: "blogPreviewBlock";
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  blogs?: {
    _key: string;
    title: string;
    excerpt: string;
    publishDate: string;
    author?: {
      name: string;
      role?: string;
      image?: {
        asset: {
          url: string;
        };
        alt?: string;
      };
    };
    category?: string;
    slug: string;
    image?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
  }[];
};

// --- InlineEdit utility (copied and styled from other blocks) ---
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

export function BlogPreviewBlock({
  title = "Latest Insights & Updates",
  subtitle,
  viewAllLink,
  blogs = [],
  onEdit,
}: BlogPreviewBlockProps & { onEdit?: (field: string, value: any) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleField = (field: string, value: any) => {
    if (onEdit) onEdit(field, value);
  };
  const handleBlogField = (idx: number, field: string, value: any) => {
    if (!onEdit) return;
    const newBlogs = [...blogs];
    newBlogs[idx] = { ...newBlogs[idx], [field]: value };
    onEdit("blogs", newBlogs);
  };
  const handleBlogAuthorField = (idx: number, field: string, value: any) => {
    if (!onEdit) return;
    const newBlogs = [...blogs];
    newBlogs[idx] = {
      ...newBlogs[idx],
      author: { ...newBlogs[idx].author, [field]: value },
    };
    onEdit("blogs", newBlogs);
  };
  const handleAddBlog = () => {
    if (!onEdit) return;
    const newBlogs = [
      ...blogs,
      {
        _key: Math.random().toString(36).slice(2, 10),
        title: "New Blog Title",
        excerpt: "",
        publishDate: new Date().toISOString(),
        author: { name: "Author Name", role: "" },
        category: "",
        slug: "",
      },
    ];
    onEdit("blogs", newBlogs);
  };
  const handleRemoveBlog = (idx: number) => {
    if (!onEdit) return;
    const newBlogs = [...blogs];
    newBlogs.splice(idx, 1);
    onEdit("blogs", newBlogs);
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-32"
    >
      {/* Enhanced Background Patterns (dark mode) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 -z-10"
      >
        {/* Subtle grid pattern for dark mode */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.08)_1px,transparent_1px)] bg-[size:128px_128px]" />
        </div>
        {/* Enhanced radial gradients for dark mode */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-1/4 top-0 h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-blue-900 via-blue-800/50 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -right-1/4 top-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-bl from-blue-900 via-gray-900/50 to-transparent blur-3xl"
        />
      </motion.div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl lg:max-w-4xl text-center mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-br from-gray-100 via-white to-gray-300 bg-clip-text text-transparent min-h-[2.5em] flex items-center justify-center"
          >
            <InlineEdit
              value={title}
              onChange={(val) => handleField("title", val)}
              fieldName="title"
              as="span"
              className={`inline-block ${!title ? "text-gray-500/60 italic" : ""}`}
              inputClassName="text-4xl font-bold tracking-tight bg-transparent text-white"
            >
              {title || (
                <span className="text-gray-500/60 italic">
                  Click to edit title
                </span>
              )}
            </InlineEdit>
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative mt-6 text-lg leading-8 text-gray-400 max-w-xl mx-auto [text-wrap:balance]"
            >
              <InlineEdit
                value={subtitle}
                onChange={(val) => handleField("subtitle", val)}
                fieldName="subtitle"
                as="span"
                className="inline-block"
                inputClassName="text-lg leading-8 bg-transparent text-gray-400"
              />
            </motion.p>
          )}
          <div className="mt-4">
            <InlineEdit
              value={viewAllLink || ""}
              onChange={(val) => handleField("viewAllLink", val)}
              fieldName="viewAllLink"
              as="span"
              className="text-sm text-blue-400 underline"
              inputClassName="text-sm text-blue-400 bg-transparent"
            />
          </div>
        </motion.div>
        {/* Blog Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {blogs.map((blog, idx) => (
            <motion.article
              key={blog._key}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.9 + idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col bg-gradient-to-br from-gray-900/80 to-gray-900/60 rounded-2xl border border-gray-800/40 shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-700/60"
            >
              <button
                className="absolute top-4 right-4 bg-zinc-900/80 border border-red-400/40 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow"
                onClick={() => handleRemoveBlog(idx)}
                tabIndex={-1}
                aria-label="Remove blog"
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
              {/* Card content */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative flex flex-col rounded-2xl overflow-hidden bg-transparent"
              >
                {/* Image Container */}
                {blog.image && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-full overflow-hidden mb-4 rounded-xl"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/30 to-transparent"
                    />
                    <img
                      src={blog.image.asset.url}
                      alt={blog.image.alt || blog.title}
                      className="aspect-[16/9] w-full object-cover rounded-xl"
                    />
                  </motion.div>
                )}
                {/* Meta Information */}
                <div className="flex items-center gap-x-3 text-xs mb-4">
                  <motion.time
                    whileHover={{ scale: 1.05 }}
                    dateTime={blog.publishDate}
                    className="inline-flex items-center px-3 py-1.5 font-medium rounded-full bg-blue-900/40 text-blue-200 ring-1 ring-blue-800"
                  >
                    <InlineEdit
                      value={blog.publishDate}
                      onChange={(val) =>
                        handleBlogField(idx, "publishDate", val)
                      }
                      fieldName="publishDate"
                      as="span"
                      className="inline-block"
                      inputClassName="text-xs bg-transparent text-blue-200"
                    >
                      {(() => {
                        try {
                          const d = new Date(blog.publishDate);
                          return d.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          });
                        } catch {
                          return blog.publishDate;
                        }
                      })()}
                    </InlineEdit>
                  </motion.time>
                  {blog.category && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center px-3 py-1.5 font-medium rounded-full bg-gray-800/60 text-gray-200 ring-1 ring-gray-700"
                    >
                      <InlineEdit
                        value={blog.category}
                        onChange={(val) =>
                          handleBlogField(idx, "category", val)
                        }
                        fieldName="category"
                        as="span"
                        className="inline-block"
                        inputClassName="text-xs bg-transparent text-gray-200"
                      />
                    </motion.span>
                  )}
                </div>
                {/* Title */}
                <h3 className="text-2xl font-bold leading-tight text-white mb-3">
                  <InlineEdit
                    value={blog.title}
                    onChange={(val) => handleBlogField(idx, "title", val)}
                    fieldName="title"
                    as="span"
                    className="inline-block bg-gradient-to-r from-gray-100 via-white to-blue-200 bg-clip-text text-transparent"
                    inputClassName="text-2xl font-bold leading-tight bg-transparent text-white"
                    multiline
                  />
                </h3>
                {/* Excerpt */}
                <p className="text-base leading-7 text-gray-300 mb-6">
                  <InlineEdit
                    value={blog.excerpt}
                    onChange={(val) => handleBlogField(idx, "excerpt", val)}
                    fieldName="excerpt"
                    as="span"
                    className="inline-block"
                    inputClassName="text-base leading-7 text-gray-300 bg-transparent"
                    multiline
                  />
                </p>
                {/* Author Information */}
                {blog.author && (
                  <div className="flex items-center gap-x-3 mb-4">
                    {blog.author.image ? (
                      <img
                        src={blog.author.image.asset.url}
                        alt={blog.author.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-800"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-blue-800/80">
                        <span className="text-sm font-medium text-blue-200">
                          {blog.author.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-100">
                        <InlineEdit
                          value={blog.author.name}
                          onChange={(val) =>
                            handleBlogAuthorField(idx, "name", val)
                          }
                          fieldName="author.name"
                          as="span"
                          className="inline-block"
                          inputClassName="text-sm font-semibold text-gray-100 bg-transparent"
                        />
                      </span>
                      {blog.author.role && (
                        <span className="text-xs text-gray-400">
                          <InlineEdit
                            value={blog.author.role}
                            onChange={(val) =>
                              handleBlogAuthorField(idx, "role", val)
                            }
                            fieldName="author.role"
                            as="span"
                            className="inline-block"
                            inputClassName="text-xs text-gray-400 bg-transparent"
                          />
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {/* Slug */}
                <div className="mt-auto pt-2">
                  <InlineEdit
                    value={blog.slug}
                    onChange={(val) => handleBlogField(idx, "slug", val)}
                    fieldName="slug"
                    as="span"
                    className="text-xs text-blue-400 underline"
                    inputClassName="text-xs text-blue-400 bg-transparent"
                  />
                </div>
              </motion.div>
            </motion.article>
          ))}
          <button
            className="mt-8 px-4 py-2 rounded-lg border-2 border-dashed border-blue-400/40 text-blue-400 bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors duration-200 w-full"
            onClick={handleAddBlog}
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
            Add Blog
          </button>
        </motion.div>
        {/* View All Button */}
        {viewAllLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16 text-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={viewAllLink}
              className="inline-flex items-center justify-center px-6 py-3 font-bold rounded-full text-sm bg-blue-600 text-white hover:bg-blue-500"
            >
              View All blogs
              <motion.svg
                whileHover={{ x: 5 }}
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

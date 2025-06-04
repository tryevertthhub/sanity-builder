"use client";

import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface BlogPreviewProps {
  data: any;
}

export function BlogPreview({ data }: BlogPreviewProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-zinc-400">No preview available</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <time className="mb-3 block text-sm font-medium uppercase tracking-wider text-gray-400">
            {data.publishedAt
              ? format(new Date(data.publishedAt), "MMMM d, yyyy")
              : "Draft"}
          </time>
          <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300">
              {data.title || "Untitled Blog Post"}
            </span>
          </h1>
          {data.excerpt && (
            <p className="mt-6 text-xl sm:text-2xl text-gray-400 font-light max-w-3xl mx-auto">
              {data.excerpt}
            </p>
          )}
        </motion.header>

        {/* Featured Image */}
        {data.mainImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-12 sm:mb-16"
          >
            <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl border border-gray-800/50 shadow-lg shadow-black/20">
              <div className="aspect-video">
                <img
                  src={data.mainImage.url}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          {data.content?.map((block: any, index: number) => {
            switch (block._type) {
              case "h1":
                return (
                  <h1 key={block._key} className="text-4xl font-bold mb-4">
                    {block.content}
                  </h1>
                );
              case "h2":
                return (
                  <h2 key={block._key} className="text-2xl font-semibold mb-3">
                    {block.content}
                  </h2>
                );
              case "paragraph":
                return (
                  <p key={block._key} className="mb-3">
                    {block.content}
                  </p>
                );
              case "bulletList":
                return (
                  <ul key={block._key} className="list-disc pl-6 mb-3">
                    {(block.items || []).map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              case "numberList":
                return (
                  <ol key={block._key} className="list-decimal pl-6 mb-3">
                    {(block.items || []).map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                );
              case "text":
                return (
                  <p key={block._key} className="mb-3">
                    {block.content}
                  </p>
                );
              case "image":
                return block.image ? (
                  <div key={block._key} className="my-8">
                    <img
                      src={block.image.url}
                      alt=""
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                ) : null;
              case "code":
                return (
                  <div key={block._key} className="my-8">
                    <pre className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 overflow-x-auto">
                      <code className={`language-${block.language}`}>
                        {block.code}
                      </code>
                    </pre>
                  </div>
                );
              default:
                return null;
            }
          })}
        </motion.div>
      </article>
    </div>
  );
}

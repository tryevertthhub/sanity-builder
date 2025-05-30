"use client";

import { urlFor } from "../../../sanity/utils/utils";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import Image from "next/image";
import { motion } from "framer-motion";

interface blog {
  _id: string;
  title: string;
  mainImage: any;
  content: any[];
  publishedAt: string;
  excerpt: string;
}

export default function BlogClient({ blog }: { blog: blog }) {
  // Get dimensions from the mainImage metadata
  const width = blog.mainImage?.asset?.metadata?.dimensions?.width || 1200;
  const height = blog.mainImage?.asset?.metadata?.dimensions?.height || 800;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-24 sm:py-32 overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative  px-6 lg:px-8"
      >
        <article className="max-w-6xl mx-auto text-white">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center"
          >
            <time className="mb-3 block text-sm font-medium uppercase tracking-wider text-gray-400">
              {format(new Date(blog.publishedAt), "MMMM d, yyyy")}
            </time>
            <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300">
                {blog.title}
              </span>
            </h1>
            {blog.excerpt && (
              <p className="mt-6 text-xl sm:text-2xl text-gray-400 font-light max-w-3xl mx-auto">
                {blog.excerpt}
              </p>
            )}
          </motion.header>

          {blog.mainImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative mb-12 sm:mb-16"
            >
              <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl border border-gray-800/50 shadow-lg shadow-black/20">
                {/* Aspect ratio container */}
                <div style={{ paddingTop: `${(height / width) * 100}%` }} />
                <Image
                  src={urlFor(blog.mainImage).width(1200).url()}
                  alt={blog.title}
                  fill
                  className="absolute top-0 left-0 h-full w-full object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 1024px, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full"
          >
            <PortableText value={blog.content} />
          </motion.div>
        </article>
      </motion.div>
    </div>
  );
}

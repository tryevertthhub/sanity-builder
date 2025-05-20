"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

export function BlogPreviewBlock({
  title = "Latest Insights & Updates",
  subtitle,
  viewAllLink,
  blogs = [],
}: BlogPreviewBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-32">
      {/* Enhanced Background Patterns */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 -z-10"
      >
        {/* Sophisticated grid pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.slate.200/[0.05])_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.200/[0.05])_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.slate.200/[0.08])_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.200/[0.08])_1px,transparent_1px)] bg-[size:128px_128px]" />
        </div>

        {/* Enhanced radial gradients */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-1/4 top-0 h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-blue-50 via-blue-100/50 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -right-1/4 top-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-bl from-blue-50 via-slate-100/50 to-transparent blur-3xl"
        />
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl lg:max-w-4xl text-center mb-24"
        >
          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -inset-x-20 -top-20 -z-10 transform-gpu overflow-hidden"
          >
            <div className="absolute left-[calc(50%-20rem)] aspect-[2/1] w-[40rem] -translate-x-1/2 rotate-[30deg]">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 via-blue-50 to-transparent opacity-30 blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/10 to-transparent opacity-30 blur-xl" />
            </div>
          </motion.div>

          {/* Enhanced title container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Decorative frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -inset-x-10 -inset-y-8"
            >
              {/* Corner lines with gradients */}
              <div className="absolute top-0 left-0 w-32 h-32">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-200/80 to-transparent transform origin-left" />
                <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-blue-200/80 to-transparent transform origin-top" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32">
                <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-blue-200/80 to-transparent transform origin-right" />
                <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-blue-200/80 to-transparent transform origin-top" />
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32">
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-200/80 to-transparent transform origin-left" />
                <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-blue-200/80 to-transparent transform origin-bottom" />
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-blue-200/80 to-transparent transform origin-right" />
                <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-blue-200/80 to-transparent transform origin-bottom" />
              </div>
            </motion.div>

            {/* Enhanced title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative text-4xl font-bold tracking-tight sm:text-5xl"
            >
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-transparent bg-clip-text">
                  {title}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="absolute -inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-300/70 to-transparent"
                />
              </span>
            </motion.h2>
          </motion.div>

          {/* Enhanced subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative mt-6 text-lg leading-8 text-slate-600 max-w-xl mx-auto [text-wrap:balance]"
            >
              {subtitle}
              <motion.span
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-x-2 -inset-y-4 z-[-1] bg-blue-50/50 blur-xl"
              />
            </motion.p>
          )}
        </motion.div>

        {/* Enhanced Blog blogs Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {blogs.map((blog, index) => (
            <motion.article
              key={blog._key}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col bg-white rounded-2xl"
            >
              {/* Card shine effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-100/20 to-transparent"
              />

              {/* Card content */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative flex flex-col rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:border-slate-200"
              >
                {/* Image Container */}
                {blog.image && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-full overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/20 to-transparent"
                    />
                    <img
                      src={blog.image.asset.url}
                      alt={blog.image.alt || blog.title}
                      className="aspect-[16/9] w-full object-cover"
                    />
                    {/* Image shine effect */}
                    <motion.div
                      initial={{ x: "-200%", opacity: 0 }}
                      whileHover={{ x: "200%", opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
                    />
                  </motion.div>
                )}

                {/* Content Container */}
                <div className="relative flex-1 p-6 bg-white">
                  {/* Meta Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-x-4 text-xs mb-4"
                  >
                    <motion.time
                      whileHover={{ scale: 1.05 }}
                      dateTime={blog.publishDate}
                      className="relative inline-flex items-center px-3 py-1.5 font-medium rounded-full bg-blue-50/50 text-blue-600 ring-1 ring-blue-100"
                    >
                      {new Date(blog.publishDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </motion.time>
                    {blog.category && (
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="relative inline-flex items-center px-3 py-1.5 font-medium rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-100"
                      >
                        {blog.category}
                      </motion.span>
                    )}
                  </motion.div>

                  {/* Title and Excerpt */}
                  <div className="flex-1 space-y-4">
                    <motion.h3
                      whileHover={{ x: 5 }}
                      className="text-xl font-semibold text-slate-900"
                    >
                      <a
                        href={blog.slug ? `/blog/${blog.slug}` : "#"}
                        className="hover:text-blue-600 transition-colors duration-200 after:absolute after:inset-0"
                      >
                        <span className="relative">
                          <motion.span
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            className="absolute -inset-x-2 -inset-y-1 bg-blue-50/50 rounded-full"
                          />
                          <span className="relative z-10">{blog.title}</span>
                        </span>
                      </a>
                    </motion.h3>
                    <motion.p
                      whileHover={{ x: 5 }}
                      className="text-sm leading-6 text-slate-600 line-clamp-3"
                    >
                      {blog.excerpt}
                    </motion.p>
                  </div>

                  {/* Author Information */}
                  {blog.author && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative mt-8 flex items-center gap-x-4"
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-x-0 -bottom-6 h-px bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100"
                      />
                      <div className="relative flex items-center gap-x-4 pt-4">
                        {blog.author.image ? (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                          >
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-50 to-slate-50 blur"
                            />
                            <img
                              src={blog.author.image.asset.url}
                              alt={blog.author.name}
                              className="relative h-10 w-10 rounded-full object-cover ring-2 ring-white"
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100/80"
                          >
                            <span className="text-sm font-medium text-blue-600">
                              {blog.author.name.charAt(0)}
                            </span>
                          </motion.div>
                        )}
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="text-sm leading-6"
                        >
                          <p className="font-semibold text-slate-900">
                            {blog.author.name}
                          </p>
                          {blog.author.role && (
                            <p className="text-slate-600">{blog.author.role}</p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.article>
          ))}
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

"use client";

import { useState, useEffect, useRef, useId } from "react";
import { urlFor } from "../../../sanity/utils/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { client } from "../../../sanity/lib/client";

// Define the blog type locally or import from a shared types file
interface blog {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  excerpt: string;
  publishedAt: string;
}

export type blogsListBlockProps = {
  _type: "blogsListBlock";
  title?: string;
  subtitle?: string;
};

export function BlogsListBlock({
  title = "Latest Articles",
  subtitle = "Discover insights, updates, and expert knowledge from our team.",
}: blogsListBlockProps) {
  const [blogs, setblogs] = useState<blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headingId = useId();

  useEffect(() => {
    // Define the query string locally
    const localblogsQuery = `
      *[_type == "blog"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        mainImage,
        excerpt,
        publishedAt
      }
    `;

    const fetchblogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the imported client to fetch data
        const fetchedblogs = await client.fetch<blog[]>(localblogsQuery);
        setblogs(fetchedblogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchblogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-30 pb-8 overflow-hidden"
      aria-labelledby={title ? headingId : undefined}
    >
      {/* Background Patterns */}

      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            {title && (
              <h1
                id={headingId}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-white to-gray-300">
                  {title}
                </span>
              </h1>
            )}
            {subtitle && (
              <p className="text-xl text-gray-400 font-light">{subtitle}</p>
            )}
          </motion.div>
        )}

        {isLoading && (
          <div className="text-center text-gray-400" role="status">
            Loading blogs...
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center text-red-500" role="alert">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={blogs.length > 0 ? "visible" : "hidden"}
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog._id}
                variants={itemVariants}
                className="h-full"
              >
                <Link
                  href={`/blog/${blog.slug.current}`}
                  className="group block h-full"
                >
                  <article className="relative flex flex-col h-full overflow-hidden rounded-lg border border-gray-800/50 bg-gradient-to-br from-gray-900 to-gray-900/50 backdrop-blur-sm hover:border-gray-700/70 hover:from-gray-800/80 hover:to-gray-900/80 transition-all duration-300 p-6 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20">
                    {blog.mainImage && (
                      <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-4 border border-gray-800/50">
                        <Image
                          src={urlFor(blog.mainImage)
                            .width(600)
                            .height(338)
                            .url()}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                          aria-hidden="true"
                        ></div>
                      </div>
                    )}
                    <div className="flex flex-col flex-grow">
                      <time className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                        {format(new Date(blog.publishedAt), "MMMM d, yyyy")}
                      </time>
                      <h3 className="mb-3 text-lg font-semibold text-gray-200 transition duration-300 group-hover:text-white line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-400 group-hover:text-gray-300 line-clamp-3 flex-grow transition-colors duration-300">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-white mt-auto transition-colors duration-300">
                        <span>Read article</span>
                        <ArrowRight
                          className="ml-1.5 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

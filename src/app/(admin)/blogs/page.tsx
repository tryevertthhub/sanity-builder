"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { client } from "@/src/sanity/lib/client";

interface Blog {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  mainImage?: {
    asset: {
      url: string;
    };
  };
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true);
      try {
        const data = await client.fetch<Blog[]>(`
          *[_type == "blog"] | order(publishedAt desc) {
            _id,
            title,
            slug,
            publishedAt,
            excerpt,
            mainImage {
              asset-> {
                url
              }
            }
          }
        `);
        setBlogs(data);
      } catch (err) {
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
        <Button
          onClick={() => router.push("/blog-builder")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-zinc-400 mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-zinc-500">
                    <span>
                      Published on{" "}
                      {format(new Date(blog.publishedAt), "MMMM d, yyyy")}
                    </span>
                    <span className="mx-2">•</span>
                    <span>/{blog.slug.current}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/blog/${blog.slug.current}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/blog-builder?id=${blog._id}`)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this blog post?"
                        )
                      ) {
                        // TODO: Implement delete functionality
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

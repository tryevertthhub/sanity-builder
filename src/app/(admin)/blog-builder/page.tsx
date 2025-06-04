"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlogEditor } from "../_components/BlogEditor";
import { BlogPreview } from "../_components/BlogPreview";
import { client } from "@/src/sanity/lib/client";

export default function BlogBuilderPage() {
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!!blogId);
  const [blogDraft, setBlogDraft] = useState<any>(null);

  useEffect(() => {
    if (blogId) {
      client
        .fetch(
          `*[_type == "blog" && _id == $id][0]{
            _id,
            title,
            slug,
            excerpt,
            mainImage,
            content
          }`,
          { id: blogId }
        )
        .then((data) => {
          setBlog(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error loading blog:", error);
          setIsLoading(false);
        });
    }
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Editor (w-3/5) */}
      <div className="w-3/5 border-r border-zinc-800 overflow-auto">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <h1 className="text-2xl font-bold text-white">
              {blogId ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
          </div>
          <div className="flex-1 overflow-auto px-4 py-2">
            <BlogEditor initialData={blog} onChange={setBlogDraft} />
          </div>
        </div>
      </div>

      {/* Right Side - Preview (w-2/5) */}
      <div className="w-2/5 overflow-auto bg-zinc-950">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-2xl font-bold text-white">Preview</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-2xl mx-auto">
              <BlogPreview data={blogDraft || blog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

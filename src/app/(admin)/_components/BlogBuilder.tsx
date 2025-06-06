"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/src/sanity/lib/client";
import { BlogEditor } from "./BlogEditor";
import { BlogPreview } from "./BlogPreview";
import { SEOPanel } from "./SEOPanel";
import { Button } from "@/src/components/ui/button";
import { Save, Eye, EyeOff } from "lucide-react";

interface BlogBuilderProps {
  blogId?: string;
}

export function BlogBuilder({ blogId }: BlogBuilderProps) {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogData, setBlogData] = useState<any>(null);
  const [seoData, setSeoData] = useState<any>(null);

  // Fetch blog data if editing existing blog
  useEffect(() => {
    async function fetchBlogData() {
      if (!blogId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await client.fetch(
          `*[_type == "blog" && _id == $id][0]{
            _id,
            _type,
            title,
            slug,
            content,
            mainImage,
            publishedAt,
            excerpt,
            seo
          }`,
          { id: blogId }
        );
        setBlogData(data);
        setSeoData(data.seo || {});
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogData();
  }, [blogId]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const doc = {
        _type: "blog",
        ...blogData,
        seo: seoData,
      };

      if (blogId) {
        await client.patch(blogId).set(doc).commit();
      } else {
        const result = await client.create(doc);
        router.push(`/blog-builder/${result._id}`);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-sm text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">
            {blogId ? "Edit Blog" : "New Blog"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/blogs")}
            className="text-zinc-400 hover:text-white"
          >
            View Blogs
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="text-zinc-400 hover:text-white"
          >
            {isPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className={`flex-1 ${isPreview ? "hidden md:block" : "block"}`}>
          <BlogEditor initialData={blogData} onChange={setBlogData} />
        </div>

        {/* Preview */}
        {isPreview && (
          <div className="flex-1 border-l border-zinc-800 overflow-auto">
            <BlogPreview data={blogData} />
          </div>
        )}

        {/* SEO Panel */}
        <div className="w-96 border-l border-zinc-800 overflow-auto">
          <SEOPanel
            initialData={seoData}
            onSave={setSeoData}
            pageId={blogId}
            pageTitle={blogData?.title}
            pageSlug={blogData?.slug?.current}
          />
        </div>
      </div>
    </div>
  );
}

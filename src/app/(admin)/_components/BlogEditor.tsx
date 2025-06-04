"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Plus, Image as ImageIcon } from "lucide-react";
import { BlockEditor } from "./BlockEditor";
import { ImageUpload } from "@/src/components/ui/image-upload";
import { client } from "@/src/sanity/lib/client";
import { useRouter } from "next/navigation";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  mainImage: z.any().optional(),
  content: z.array(z.any()).default([]),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogEditorProps {
  initialData?: any;
  onChange: (data: any) => void;
  onSave?: () => void;
}

export function BlogEditor({ initialData, onChange, onSave }: BlogEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const prevFormData = useRef<BlogFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: [],
    },
  });

  const formData = watch();

  // Memoize onChange to prevent unnecessary re-renders
  const memoizedOnChange = useCallback(
    (data: BlogFormData) => {
      onChange(data);
    },
    [onChange]
  );

  // Update parent only when formData changes meaningfully
  useEffect(() => {
    // Stringify to perform deep comparison
    const currentData = JSON.stringify(formData);
    const prevData = JSON.stringify(prevFormData.current);

    if (currentData !== prevData) {
      memoizedOnChange(formData);
      prevFormData.current = formData;
    }
  }, [formData, memoizedOnChange]);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Upload image to Sanity
      const imageAsset = await client.assets.upload("image", file);

      // Create image reference
      const imageRef = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };

      setValue("mainImage", imageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddBlock = useCallback(
    (type: string) => {
      const newBlock = {
        _type: type,
        _key: Math.random().toString(36).substr(2, 9),
      };
      setValue("content", [...formData.content, newBlock]);
    },
    [formData.content, setValue]
  );

  const onSubmit = async (data: BlogFormData) => {
    setIsSaving(true);
    try {
      const blogData = {
        _type: "blog",
        title: data.title,
        slug: {
          _type: "slug",
          current: data.slug,
        },
        publishedAt: new Date().toISOString(),
        excerpt: data.excerpt,
        mainImage: data.mainImage,
        content: data.content,
      };

      if (initialData?._id) {
        // Update existing blog
        await client.patch(initialData._id).set(blogData).commit();
      } else {
        // Create new blog
        await client.create(blogData);
      }

      onSave?.();
      router.push("/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      {/* Basic Info */}
      <div className="p-6 space-y-6 border-b border-zinc-800">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">Title</label>
          <Input
            {...register("title")}
            placeholder="Enter blog title"
            className="bg-zinc-900 border-zinc-800"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">Slug</label>
          <Input
            {...register("slug")}
            placeholder="enter-blog-slug"
            className="bg-zinc-900 border-zinc-800"
          />
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">Excerpt</label>
          <Textarea
            {...register("excerpt")}
            placeholder="Enter a brief excerpt"
            className="bg-zinc-900 border-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">
            Featured Image
          </label>
          {formData.mainImage ? (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={formData.mainImage.asset?.url}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setValue("mainImage", null)}
              >
                Remove
              </Button>
            </div>
          ) : (
            <ImageUpload
              onUpload={handleImageUpload}
              isUploading={isUploading}
            />
          )}
        </div>
      </div>

      {/* Block Editor */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <BlockEditor
            blocks={formData.content}
            onChange={(blocks) => setValue("content", blocks)}
          />

          {/* Add Block Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => handleAddBlock("text")}
              className="text-zinc-400 hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Blog Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}

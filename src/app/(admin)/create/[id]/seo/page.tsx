"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/src/sanity/lib/client";
import { groq } from "next-sanity";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: {
    asset: {
      _ref: string;
    };
  };
}

const defaultSEO: SEOData = {
  title: "",
  description: "",
  keywords: [],
  ogImage: undefined,
};

interface Page {
  _id: string;
  title: string;
  seo: SEOData;
}

export default function SEOEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  // Load initial data
  useEffect(() => {
    fetchPage();
  }, [id]);

  // Debounced save to localStorage
  const debouncedSaveToLocalStorage = useDebouncedCallback((data: SEOData) => {
    localStorage.setItem(`seo_editor_${id}`, JSON.stringify(data));
  }, 1000);

  const fetchPage = async () => {
    try {
      // Try to load from localStorage first
      const savedData = localStorage.getItem(`seo_editor_${id}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setPage({
          _id: id,
          title: "Draft", // We'll update this when we fetch from Sanity
          seo: parsedData,
        });
        setIsDirty(true);
      }

      // Fetch from Sanity
      const query = groq`*[_type == "page" && _id == $id][0] {
        _id,
        title,
        seo
      }`;

      const data = await client.fetch(query, { id });

      // If we have saved data, merge it with Sanity data
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setPage({
          ...data,
          seo: {
            ...defaultSEO,
            ...(data?.seo || {}),
            ...parsedData,
            keywords: Array.isArray(parsedData?.keywords)
              ? parsedData.keywords
              : [],
          },
        });
      } else {
        setPage({
          ...data,
          seo: {
            ...defaultSEO,
            ...(data?.seo || {}),
            keywords: Array.isArray(data?.seo?.keywords)
              ? data.seo.keywords
              : [],
          },
        });
      }
    } catch (error) {
      console.error("Error fetching page:", error);
      toast.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  const handleSEOUpdate = (updates: Partial<SEOData>) => {
    if (!page) return;

    const newSeoData = {
      ...page.seo,
      ...updates,
    };

    setPage({
      ...page,
      seo: newSeoData,
    });

    setIsDirty(true);
    debouncedSaveToLocalStorage(newSeoData);
  };

  const handleSave = async () => {
    if (!page) return;

    setSaving(true);
    try {
      await client.patch(page._id).set({ seo: page.seo }).commit();

      // Clear localStorage after successful save
      localStorage.removeItem(`seo_editor_${id}`);
      setIsDirty(false);

      toast.success("SEO data updated successfully");
      router.push("/pages");
    } catch (error) {
      console.error("Error updating SEO:", error);
      toast.error("Failed to update SEO data");
    } finally {
      setSaving(false);
    }
  };

  // Clean up localStorage on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem(`seo_editor_${id}`);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Page not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">SEO Editor: {page.title}</h1>
        <div className="flex items-center gap-4">
          {isDirty && (
            <span className="text-sm text-yellow-500">
              You have unsaved changes
            </span>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Title</label>
          <input
            type="text"
            value={page.seo?.title || ""}
            onChange={(e) => handleSEOUpdate({ title: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Description</label>
          <textarea
            value={page.seo?.description || ""}
            onChange={(e) => handleSEOUpdate({ description: e.target.value })}
            className="w-full p-2 border rounded-md h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={
              Array.isArray(page.seo?.keywords)
                ? page.seo.keywords.join(", ")
                : ""
            }
            onChange={(e) =>
              handleSEOUpdate({
                keywords: e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean),
              })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Add image upload functionality here */}
      </div>
    </div>
  );
}

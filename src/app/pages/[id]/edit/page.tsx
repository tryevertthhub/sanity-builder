"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/src/sanity/lib/client";
import { toast } from "sonner";
import { PageEditorPanel } from "@/src/components/PageEditorPanel";

interface Block {
  _key: string;
  _type: string;
  [key: string]: any;
}

interface Page {
  _id: string;
  title: string;
  pageBuilder: Block[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  slug?: { current: string };
}

export default function PageEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const data = await client.fetch(
        `*[_type == "page" && _id == $id][0] {
          _id,
          title,
          pageBuilder,
          seo,
          slug
        }`,
        { id }
      );
      setPage(data || null);
    } catch (error) {
      console.error("Error fetching page:", error);
      toast.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async ({
    blocks,
    seo,
    slug,
  }: {
    blocks: Block[];
    seo: any;
    slug: string;
  }) => {
    if (!page) return;
    try {
      await client
        .patch(page._id)
        .set({ pageBuilder: blocks, seo, "slug.current": slug })
        .commit();
      toast.success("Page updated successfully");
      router.push("/pages");
    } catch (error) {
      console.error("Error updating page:", error);
      toast.error("Failed to update page");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  if (!page || !page._id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Page not found or missing ID.
      </div>
    );
  }

  return <PageEditorPanel initialPage={page} onPublish={handlePublish} />;
}

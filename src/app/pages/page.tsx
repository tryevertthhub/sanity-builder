"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { format } from "date-fns";
import { Eye, Search, Edit } from "lucide-react";
import { PageBuilder } from "@/src/components/pagebuilder";

interface Page {
  _id: string;
  title: string;
  slug: string;
  _updatedAt: string;
}

export default function PagesPanel() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/pages");
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (slug: string) => {
    const cleanSlug = slug.startsWith("/") ? slug.slice(1) : slug;
    window.open(`${window.location.origin}/${cleanSlug}`, "_blank");
  };

  const handleEditSEO = (pageId: string) => {
    router.push(`/pages/${pageId}/seo`);
  };

  const handleEditContent = (pageId: string) => {
    router.push(`/pages/${pageId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Pages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card key={page._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{page.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">/{page.slug}</p>
              <p className="text-sm text-gray-500">
                Last updated: {format(new Date(page._updatedAt), "MMM d, yyyy")}
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={() => handleView(page.slug)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button onClick={() => handleEditSEO(page._id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit SEO
              </Button>
              <Button onClick={() => handleEditContent(page._id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Content
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

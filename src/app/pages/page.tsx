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
import { motion } from "framer-motion";

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
    router.push(`/pages/${pageId}/edit?tab=seo`);
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 py-12">
      <h1 className="text-4xl font-extrabold mb-12 text-center text-white drop-shadow-lg tracking-tight">
        Pages
      </h1>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pages.map((page, idx) => (
            <motion.div
              key={page._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, type: "spring" }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
              }}
              className="rounded-2xl bg-zinc-900/80 border border-zinc-700 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[240px] p-7 group"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
                  {page.title}
                </h2>
                <p className="text-sm text-zinc-400 mb-1">//{page.slug}</p>
                <p className="text-xs text-zinc-500 mb-4">
                  Last updated:{" "}
                  {format(new Date(page._updatedAt), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button
                  onClick={() => handleView(page.slug)}
                  className="flex-1 bg-zinc-800 hover:bg-blue-700 text-white border border-zinc-700 shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button
                  onClick={() => handleEditSEO(page._id)}
                  className="flex-1 bg-blue-900 hover:bg-blue-700 text-blue-200 border border-blue-800 shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit SEO
                </Button>
                <Button
                  onClick={() => handleEditContent(page._id)}
                  className="flex-1 bg-green-900 hover:bg-green-700 text-green-200 border border-green-800 shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Content
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

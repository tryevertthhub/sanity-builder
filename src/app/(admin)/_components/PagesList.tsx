import React from "react";
import {
  FileText,
  ExternalLink,
  Home,
  Newspaper,
  Eye,
  Edit2,
} from "lucide-react";
import { client } from "@/src/sanity/lib/client";
import { useRouter } from "next/navigation";

interface PageData {
  _id: string;
  _type: string;
  title?: string;
  slug: string;
  description?: string;
}

interface PageGroupProps {
  title: string;
  icon: React.ElementType;
  pages: PageData[];
  accent: string;
  onSelectPage?: (pageId: string, pageType: string) => void;
}

interface PageGroupConfig {
  title: string;
  icon: React.ElementType;
  accent: string;
  types: string[];
  filter?: (page: PageData) => boolean;
}

const PAGE_GROUPS: PageGroupConfig[] = [
  {
    title: "Home",
    icon: Home,
    accent: "bg-emerald-500/20",
    types: ["homePage"],
  },
  {
    title: "Pages",
    icon: FileText,
    accent: "bg-violet-500/20",
    types: ["page"],
  },
];

const PageGroup = ({
  title,
  icon: Icon,
  pages,
  accent,
  onSelectPage,
}: PageGroupProps) => {
  const router = useRouter();
  // Remove duplicate slug warning and highlighting
  if (pages.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 mb-3">
        <div className={`p-1.5 rounded-md ${accent}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          {pages.map((page) => (
            <div
              key={page._id}
              className="group flex flex-col justify-between h-full bg-gradient-to-br from-zinc-900/80 via-zinc-800/80 to-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl hover:shadow-2xl hover:border-blue-600/60 transition-all duration-200 relative overflow-hidden backdrop-blur-md hover:scale-[1.025]"
            >
              <div className="flex-1 p-6 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-md ${accent} shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-zinc-400 font-mono tracking-wide">
                    {page._type}
                  </span>
                </div>
                <div className="mb-1 text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                  {page.title || page.slug}
                </div>
                <div className="text-xs text-zinc-400 truncate mb-2">
                  {page.slug}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 px-6 pb-4 pt-2 border-t border-zinc-800 bg-zinc-900/60">
                <button
                  onClick={() => onSelectPage?.(page._id, page._type)}
                  className="p-2 rounded-lg hover:bg-zinc-800/70 text-zinc-400 hover:text-blue-400 transition-all flex items-center"
                  title="Preview page"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <a
                  href={page.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-zinc-800/70 text-zinc-400 hover:text-green-400 transition-all flex items-center"
                  title="View page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() =>
                    router.push(
                      `/create/${page._id}/edit?slug=${encodeURIComponent(page.slug)}`
                    )
                  }
                  className="p-2 rounded-lg hover:bg-zinc-800/70 text-zinc-400 hover:text-purple-400 transition-all flex items-center"
                  title="Edit page"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export interface PagesListProps {
  className?: string;
  onSelectPage?: (pageId: string, pageType: string) => void;
}

export function PagesList({ className = "", onSelectPage }: PagesListProps) {
  const [pages, setPages] = React.useState<PageData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPages() {
      try {
        // Get all page types from the config
        const allPageTypes = PAGE_GROUPS.flatMap((group) => group.types);

        // Build the type filter
        const typeFilter = allPageTypes
          .map((type) => `_type == "${type}"`)
          .join(" || ");

        // Fetch all pages in a single query
        const result = await client.fetch(
          `*[${typeFilter}]{
            _id,
            _type,
            title,
            "slug": select(
              _type == "homePage" => "/",
              _type == "blogIndex" => "/blog",
              _type == "blog" => "/blog/" + slug.current,
              defined(slug.current) => "/" + slug.current
            )
          }`
        );

        // Clean up the slugs to remove any double slashes and ensure proper format
        const cleanedResults = result.filter(Boolean).map((page) => ({
          ...page,
          slug: page.slug
            .replace(/\/+/g, "/") // Replace multiple slashes with single slash
            .replace(/\/blog\/blog\//g, "/blog/"), // Remove duplicate blog prefix
        }));

        setPages(cleanedResults);
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPages();
  }, []);

  if (isLoading) {
    return (
      <div className={`${className} p-4`}>
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              <div className="h-6 bg-zinc-800/50 w-32 rounded-md" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-10 bg-zinc-800/30 rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className={`${className} p-8 text-center`}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/50 mb-4">
          <FileText className="w-6 h-6 text-zinc-400" />
        </div>
        <p className="text-sm text-zinc-400">No pages created yet</p>
      </div>
    );
  }

  return (
    <div className={`${className} p-4 space-y-8`}>
      {PAGE_GROUPS.map((group) => (
        <PageGroup
          key={group.title}
          title={group.title}
          icon={group.icon}
          accent={group.accent}
          pages={pages.filter(
            (page) =>
              group.types.includes(page._type) &&
              (!group.filter || group.filter(page))
          )}
          onSelectPage={onSelectPage}
        />
      ))}
    </div>
  );
}

import React from "react";
import { FileText, ExternalLink, Home, Newspaper, Eye } from "lucide-react";
import { client } from "@/src/sanity/lib/client";

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
      <div className="space-y-0.5">
        {pages.map((page) => (
          <div
            key={page._id}
            className="group flex items-center gap-2 px-4 py-2 hover:bg-zinc-800/50 rounded-lg transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <div className="text-sm font-medium text-zinc-100 truncate group-hover:text-violet-300 transition-colors">
                  {page.title || page.slug}
                </div>
                {page.title && (
                  <div className="text-xs text-zinc-600 truncate transition-colors group-hover:text-zinc-400 hidden sm:block">
                    {page.slug}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectPage?.(page._id, page._type)}
                className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-500 hover:text-zinc-300 transition-all flex items-center gap-1.5 text-xs opacity-0 group-hover:opacity-100"
                title="Preview page"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <a
                href={page.slug}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-500 hover:text-zinc-300 transition-all flex items-center gap-1.5 text-xs opacity-0 group-hover:opacity-100"
                title="View page"
              >
                <span className="font-medium">View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
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
          }`,
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
              (!group.filter || group.filter(page)),
          )}
          onSelectPage={onSelectPage}
        />
      ))}
    </div>
  );
}

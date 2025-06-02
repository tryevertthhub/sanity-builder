"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LuChevronRight,
  LuLayoutDashboard,
  LuPenTool,
  LuHome,
} from "react-icons/lu";
import { FileText, Tag, Edit3, User as UserIcon } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

interface NavbarProps {
  activeTab?: "content" | "seo";
  onTabChange?: (tab: "content" | "seo") => void;
  seoBadge?: { count: number; total: number };
  selectedPageId?: string | null;
}

const ContentButton = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-label="Content Panel"
    onClick={onClick}
    className={`group relative flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
      isActive
        ? "border-zinc-600 bg-gradient-to-b from-zinc-700 to-zinc-800 text-white shadow-lg shadow-black/20"
        : "border-transparent bg-transparent text-zinc-500 hover:border-zinc-600 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-800 hover:text-white hover:shadow-lg hover:shadow-black/20"
    }`}
    tabIndex={0}
  >
    <FileText className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
    <span>Block Builder</span>
  </button>
);

const SEOButton = ({
  isActive,
  onClick,
  seoBadge,
}: {
  isActive: boolean;
  onClick: () => void;
  seoBadge: { count: number; total: number };
}) => (
  <button
    type="button"
    aria-label="SEO Panel"
    onClick={onClick}
    className={`group relative flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
      isActive
        ? "border-zinc-600 bg-gradient-to-b from-zinc-700 to-zinc-800 text-white shadow-lg shadow-black/20"
        : "border-transparent bg-transparent text-zinc-500 hover:border-zinc-600 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-800 hover:text-white hover:shadow-lg hover:shadow-black/20"
    }`}
    tabIndex={0}
  >
    <Tag className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
    <span>SEO</span>
    <span
      className={`ml-2 inline-flex items-center justify-center rounded-full text-xs font-semibold px-1.5 py-0.5 ${
        seoBadge.count === seoBadge.total
          ? "bg-green-900/50 text-green-300 border border-green-800"
          : "bg-zinc-700 text-zinc-300 border border-zinc-600"
      }`}
      aria-label={`SEO completion: ${seoBadge.count} of ${seoBadge.total}`}
    >
      {seoBadge.count}/{seoBadge.total}
    </span>
  </button>
);

const EditButton = () => {
  const router = require("next/navigation").useRouter();
  return (
    <button
      type="button"
      aria-label="Go to Pages"
      onClick={() => router.push("/pages")}
      className="group relative flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg border transition-all duration-200 border-transparent bg-transparent text-zinc-500 hover:border-zinc-600 hover:bg-gradient-to-b hover:from-zinc-700 hover:to-zinc-800 hover:text-white hover:shadow-lg hover:shadow-black/20"
      tabIndex={0}
    >
      <Edit3 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
      <span>Edit</span>
    </button>
  );
};

const Breadcrumb = ({ pathname }: { pathname: string }) => {
  // Get icon for path segment
  const getSegmentIcon = (segment: string) => {
    switch (segment.toLowerCase()) {
      case "admin":
        return <LuLayoutDashboard size={14} />;
      case "create":
        return <LuPenTool size={14} />;
      case "home":
        return <LuHome size={14} />;
      default:
        return null;
    }
  };

  const formatPathname = (path: string): string | string[] => {
    if (path === "/") return "Home";

    return path
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
  };

  const pathSegments = formatPathname(pathname);

  return (
    <div className="flex hidden items-center text-zinc-400 lg:flex">
      {Array.isArray(pathSegments) ? (
        pathSegments.map((segment, index, array) => (
          <div key={segment} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1">
              {getSegmentIcon(segment) && (
                <span className="text-zinc-500">{getSegmentIcon(segment)}</span>
              )}
              <span className="font-medium text-xs tracking-wide text-zinc-500 uppercase">
                {segment}
              </span>
            </div>
            {index < array.length - 1 && (
              <LuChevronRight size={14} className="text-zinc-600" />
            )}
          </div>
        ))
      ) : (
        <span className="font-medium text-xs tracking-wider text-zinc-400 uppercase">
          {pathSegments}
        </span>
      )}
    </div>
  );
};

export const Navbar = ({
  activeTab = "content",
  onTabChange,
  seoBadge = { count: 0, total: 4 },
  selectedPageId,
}: NavbarProps) => {
  const pathname = usePathname();

  const handleTabChange = (tab: "content" | "seo") => {
    if (onTabChange) {
      onTabChange(tab);
    }
    // Remember last-used tab for existing pages
    if (selectedPageId) {
      localStorage.setItem("pageEditorTab", tab);
    }
  };

  // Simulated user avatar (replace with real user data if available)
  const userAvatar = (
    <div className="w-9 h-9 rounded-full border-2 border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-md">
      <UserIcon className="w-5 h-5 text-zinc-400" />
    </div>
  );

  return (
    <nav className="fixed top-0 right-0 left-0 z-[1000] h-16 px-6 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-lg rounded-b-2xl">
      {/* Left: Logo and Breadcrumbs */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950/80 border border-zinc-800 shadow">
            <Image
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="p-1"
            />
          </div>
        </Link>
        <div className="hidden md:block">
          <Breadcrumb pathname={pathname} />
        </div>
      </div>
      {/* Center: Tabs */}
      <div className="flex items-center gap-4 bg-zinc-800/60 rounded-xl px-2 py-1 shadow-inner">
        <ContentButton
          isActive={activeTab === "content"}
          onClick={() => handleTabChange("content")}
        />
        <SEOButton
          isActive={activeTab === "seo"}
          onClick={() => handleTabChange("seo")}
          seoBadge={seoBadge}
        />
        <EditButton />
      </div>
      {/* Right: User avatar */}
      <div className="flex items-center gap-4">{userAvatar}</div>
    </nav>
  );
};

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";

export const PreviewBar: FC = () => {
  const path = usePathname();
  return (
    <div className="fixed bottom-1 left-0 right-0 z-10 px-2 md:bottom-2 md:px-4">
      <div className="mx-auto max-w-96 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 p-2 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              Viewing the website in preview mode.
            </p>
          </div>
          <Link
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            href={`/api/disable-draft?slug=${path}`}
            prefetch={false}
          >
            Exit
          </Link>
        </div>
      </div>
    </div>
  );
};

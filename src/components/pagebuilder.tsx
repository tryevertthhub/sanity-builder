"use client";
import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute, type SanityDocument } from "next-sanity";
import { dataset, projectId, studioUrl } from "../sanity/lib/api";
import { BLOCK_COMPONENTS } from "./blocks";

type PageBlock = NonNullable<NonNullable<any>["pageBuilder"]>[number];

export type PageBuilderProps = {
  pageBuilder: PageBlock[];
  id: string;
  type: string;
};

type PageData = {
  _id: string;
  _type: string;
  pageBuilder?: PageBlock[];
};

type BlockType = keyof typeof BLOCK_COMPONENTS;

export function PageBuilder({
  pageBuilder: initialPageBuilder = [],
  id,
  type,
}: PageBuilderProps) {
  const pageBuilder = useOptimistic<PageBlock[], SanityDocument<PageData>>(
    initialPageBuilder,
    (currentPageBuilder, action) => {
      if (action.id === id && action.document.pageBuilder) {
        return action.document.pageBuilder;
      }

      return currentPageBuilder;
    }
  );

  return (
    <main
      className="flex flex-col w-full"
      data-sanity={createDataAttribute({
        id: id,
        baseUrl: studioUrl,
        projectId: projectId,
        dataset: dataset,
        type: type,
        path: "pageBuilder",
      }).toString()}
    >
      {pageBuilder.map((block) => {
        const Component = BLOCK_COMPONENTS[block._type] as any;

        if (!Component) {
          return (
            <div
              key={`${block._type}-${block._key}`}
              className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted rounded-lg"
            >
              Component not found for block type: <code>{block._type}</code>
            </div>
          );
        }

        return (
          <div
            key={`${block._type}-${block._key}`}
            data-sanity={createDataAttribute({
              id: id,
              baseUrl: studioUrl,
              projectId: projectId,
              dataset: dataset,
              type: type,
              path: `pageBuilder[_key=="${block._key}"]`,
            }).toString()}
          >
            <Component {...block} />
          </div>
        );
      })}
    </main>
  );
}

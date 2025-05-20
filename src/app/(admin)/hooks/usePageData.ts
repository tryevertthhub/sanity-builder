import { useEffect, useState } from "react";
import { client } from "@/src/sanity/lib/client";

export function usePageData(pageId: string | null, pageType: string | null) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPageData() {
      if (!pageId || !pageType) {
        setBlocks([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let result;

        // For blog blogs, fetch the entire document
        if (pageType === "blog") {
          result = await client.fetch(
            `*[_type == "blog" && _id == $id][0]{
              _id,
              _type,
              title,
              richText,
              authors[]->{
                _id,
                name,
                position,
                image
              },
              image,
              publishedAt
            }`,
            { id: pageId }
          );
          // For blogs, we'll return the richText as blocks
          setBlocks(result ? [result] : []);
        } else {
          // For other page types, just fetch pageBuilder
          result = await client.fetch(
            `*[_type == $type && _id == $id][0].pageBuilder`,
            { type: pageType, id: pageId }
          );
          setBlocks(result || []);
        }
      } catch (err) {
        console.error("Error fetching page data:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch page data")
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPageData();
  }, [pageId, pageType]);

  return { blocks, isLoading, error };
}

import { BLOCK_COMPONENTS } from "@/src/components/blocks";
import { Zap } from "lucide-react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/src/sanity/lib/client";

interface PagePreviewProps {
  blocks: Array<{
    _type: string;
    _key?: string;
    [key: string]: any;
  }>;
  isLoading?: boolean;
  onInspect?: (block: any) => void;
  enableInspection?: boolean;
  isEditMode?: boolean;
}

export function PagePreview({
  blocks,
  isLoading,
  onInspect,
  enableInspection = false,
  isEditMode = false,
}: PagePreviewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="">
      {blocks.map((block) => {
        // Special handling for blog content
        if (block._type === "blog") {
          return (
            <article key={block._id} className="max-w-3xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {block.title}
                </h1>
                {block.publishedAt && (
                  <time className="text-sm text-zinc-400">
                    {new Date(block.publishedAt).toLocaleDateString()}
                  </time>
                )}
                {block.authors?.[0] && (
                  <div className="flex items-center gap-3 mt-4">
                    {block.authors[0].image && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={urlFor(block.authors[0].image).url()}
                          alt={block.authors[0].name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-white">
                        {block.authors[0].name}
                      </div>
                      {block.authors[0].position && (
                        <div className="text-xs text-zinc-400">
                          {block.authors[0].position}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </header>

              {block.image && (
                <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={urlFor(block.image).url()}
                    alt={block.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <PortableText value={block.richText} />
              </div>
            </article>
          );
        }

        // Regular block handling
        const Component = BLOCK_COMPONENTS[block._type];
        if (!Component) {
          console.warn(`No component found for block type: ${block._type}`);
          return null;
        }

        return (
          <div
            key={block._key}
            className="relative group"
            onMouseEnter={() => enableInspection && onInspect?.(block)}
          >
            <div className="relative">
              <Component {...block} isEditMode={isEditMode} />
              {enableInspection && (
                <>
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="absolute -top-3 left-4 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-3 h-3" />
                    {block._type}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { PortableText } from "@portabletext/react";
import { blogTemplate } from "../../../sanity/templates/RichTextTemplate";

interface RichTextBlockProps {
  content: any[];
}

export function RichTextBlock({ content }: RichTextBlockProps) {
  if (!content?.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="prose prose-invert max-w-none">
        <PortableText value={content} components={blogTemplate} />
      </div>
    </div>
  );
} 
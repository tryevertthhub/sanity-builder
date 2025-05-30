import { defineField, defineType } from "sanity";
import { Quote } from "lucide-react";

export const pullQuoteBlock = defineType({
  name: "pullQuoteBlock",
  title: "Pull Quote Block",
  type: "object",
  icon: Quote,
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      description: "The main quote text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description: "Optional attribution for the quote",
    }),
  ],
  preview: {
    select: {
      quote: "quote",
      author: "author",
    },
    prepare({ quote, author }) {
      return {
        title: quote?.slice(0, 50) + (quote?.length > 50 ? "..." : ""),
        subtitle: author ? `— ${author}` : "Pull Quote",
      };
    },
  },
});

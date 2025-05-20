import { defineField, defineType } from "sanity";

// Define the GROQ query to fetch blogs for this block
export const blogsListBlock = defineType({
  name: "blogsListBlock",
  type: "object",
  title: "blogs List Block",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional title for the blogs section.",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
      description: "Optional subtitle for the blogs section.",
    }),
    // Note: The actual blogs are fetched using the exported
    // blogs_LIST_BLOCK_QUERY at the page level and passed to the component.
    // You could add fields here to *filter* blogs, e.g., by category,
    // or limit the number displayed, if needed.
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "blogs List Block",
        subtitle: "Displays a list of recent blogs",
      };
    },
  },
});

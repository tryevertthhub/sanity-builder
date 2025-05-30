import { defineField, defineType } from "sanity";
import { AlertTriangle } from "lucide-react";

export const calloutBlock = defineType({
  name: "calloutBlock",
  title: "Callout Block",
  type: "object",
  icon: AlertTriangle,
  fields: [
    defineField({
      name: "type",
      title: "Callout Type",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Warning", value: "warning" },
          { title: "Success", value: "success" },
          { title: "Error", value: "error" },
        ],
      },
      initialValue: "info",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional title for the callout",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      description: "The main content of the callout",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      content: "content",
    },
    prepare({ title, type, content }) {
      return {
        title: title || "Callout",
        subtitle: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${content?.slice(0, 50)}${content?.length > 50 ? "..." : ""}`,
      };
    },
  },
});

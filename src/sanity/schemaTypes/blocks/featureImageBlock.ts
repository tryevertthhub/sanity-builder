import { defineField, defineType } from "sanity";
import { ImageIcon } from "lucide-react";

export const featureImageBlock = defineType({
  name: "featureImageBlock",
  title: "Feature Image Block",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description:
        "Alternative text for the image (required for accessibility)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption text to display below the image",
    }),
  ],
  preview: {
    select: {
      title: "alt",
      caption: "caption",
      media: "image",
    },
    prepare({ title, caption, media }) {
      return {
        title: title || "Feature Image",
        subtitle: caption || "No caption",
        media,
      };
    },
  },
});

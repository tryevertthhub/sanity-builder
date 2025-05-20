import { defineField, defineType } from "sanity";

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich Text Block",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        defineField({
          name: "youtube",
          type: "object",
          title: "YouTube Video",
          fields: [
            {
              name: "url",
              type: "url",
              title: "YouTube URL",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        }),
        defineField({
          name: "video",
          type: "object",
          title: "Video",
          fields: [
            {
              name: "videoFile",
              type: "file",
              title: "Video File",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      content: "content",
    },
    prepare({ content }) {
      return {
        title: "Rich Text Block",
        subtitle: content ? `${content.length} blocks` : "No content",
      };
    },
  },
}); 
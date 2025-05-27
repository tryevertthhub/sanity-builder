import { defineType } from "sanity";

export const blog = defineType({
  name: "blog",
  title: "blog",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule: any) => Rule.required(),
                  },
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption for the image",
            },
          ],
        },
        {
          name: "youtube",
          title: "YouTube Video",
          type: "object",
          fields: [
            {
              name: "url",
              title: "YouTube Video URL",
              type: "url",
              validation: (Rule: any) =>
                Rule.required().regex(
                  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                  {
                    message: "Please enter a valid YouTube URL",
                  },
                ),
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
          preview: {
            select: {
              url: "url",
              caption: "caption",
            },
            prepare({ url, caption }) {
              return {
                title: caption || "YouTube Video",
                subtitle: url,
              };
            },
          },
        },
        {
          name: "externalLink",
          title: "External Link",
          type: "object",
          fields: [
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "text",
              title: "Link Text",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "openInNewTab",
              title: "Open in New Tab",
              type: "boolean",
              initialValue: true,
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
  },
});

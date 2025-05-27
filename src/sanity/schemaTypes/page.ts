import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Blocks",
      type: "array",
      of: [
        { type: "block" },
        { type: "image" },
        { type: "code" },
        { type: "table" },
        { type: "quote" },
        { type: "cta" },
        { type: "hero" },
        { type: "features" },
        { type: "testimonials" },
        { type: "pricing" },
        { type: "faq" },
        { type: "contact" },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Meta Title",
          type: "string",
          description: "Title used for search engines and browsers",
          validation: (Rule) =>
            Rule.max(60).warning("Should be under 60 characters"),
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          description: "Description for search engines",
          validation: (Rule) =>
            Rule.max(155).warning("Should be under 155 characters"),
        }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
          description: "Keywords for search engines",
        }),
        defineField({
          name: "ogImage",
          title: "Social Share Image",
          type: "image",
          description: "Image used when sharing on social media",
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug}`,
      };
    },
  },
});

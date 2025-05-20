import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";

export const blogPreviewBlockQuery = /* groq */ `
      _type == "blogPreviewBlock" => {
        _type,
        title,
        subtitle,
        viewAllLink,
        blogs[] {
          _key,
          title,
          excerpt,
          publishDate,
          author {
            name,
            role,
            image {
              asset-> {
                url
              },
              alt
            }
          },
          category,
          slug,
          image {
            asset-> {
              url
            },
            alt
          }
        }
      }
    `;

export const blogPreviewBlock = defineType({
  name: "blogPreviewBlock",
  title: "Blog Preview Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The main heading for the blog section",
      initialValue: "Our Blog & News",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
      description: "A brief description below the title",
      initialValue: "Expert insights and updates from our financial advisors",
    }),
    defineField({
      name: "viewAllLink",
      type: "string",
      title: "View All Link",
      description: "URL for the 'View All blogs' button",
      initialValue: "/blog",
    }),
    defineField({
      name: "blogs",
      type: "array",
      title: "Blog blogs",
      description: "Add featured blog blogs",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "blog Title",
              description: "The title of the blog blog",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "excerpt",
              type: "text",
              title: "Excerpt",
              description: "A brief summary of the blog",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "publishDate",
              type: "datetime",
              title: "Publish Date",
              description: "When the blog was published",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "author",
              type: "object",
              title: "Author",
              fields: [
                defineField({
                  name: "name",
                  type: "string",
                  title: "Name",
                  initialValue: "Author Name",
                }),
                defineField({
                  name: "role",
                  type: "string",
                  title: "Role",
                  initialValue: "Financial Advisor",
                }),
                defineField({
                  name: "image",
                  type: "image",
                  title: "Author Image",
                  fields: [
                    defineField({
                      name: "alt",
                      type: "string",
                      title: "Alt Text",
                      initialValue: "Author profile photo",
                    }),
                  ],
                }),
              ],
            }),
            defineField({
              name: "category",
              type: "string",
              title: "Category",
              description: "The blog category",
              initialValue: "Financial Planning",
            }),
            defineField({
              name: "slug",
              type: "string",
              title: "URL Slug",
              description: "The blog URL (e.g., /blog/blog-title)",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              type: "image",
              title: "Featured Image",
              description: "The main image for the blog blog",
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alt Text",
                  initialValue: "Blog blog featured image",
                }),
              ],
            }),
          ],
        },
      ],
      initialValue: [
        {
          _key: "blog1",
          title: "Understanding Retirement Planning in Today's Economy",
          excerpt:
            "Discover key strategies for securing your financial future in an ever-changing economic landscape.",
          publishDate: new Date().toISOString(),
          author: {
            name: "John Smith",
            role: "Senior Financial Advisor",
          },
          category: "Retirement Planning",
          slug: "understanding-retirement-planning",
        },
        {
          _key: "blog2",
          title: "Investment Strategies for Market Volatility",
          excerpt:
            "Learn how to protect and grow your portfolio during uncertain market conditions.",
          publishDate: new Date().toISOString(),
          author: {
            name: "Sarah Johnson",
            role: "Investment Strategist",
          },
          category: "Investment",
          slug: "investment-strategies-market-volatility",
        },
        {
          _key: "blog3",
          title: "Estate Planning: Protecting Your Legacy",
          excerpt:
            "Essential considerations for creating a comprehensive estate plan that secures your family's future.",
          publishDate: new Date().toISOString(),
          author: {
            name: "Michael Brown",
            role: "Estate Planning Specialist",
          },
          category: "Estate Planning",
          slug: "estate-planning-protecting-legacy",
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Blog Preview Block",
        subtitle: subtitle,
      };
    },
  },
});

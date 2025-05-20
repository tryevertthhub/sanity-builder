import { LayoutPanelLeft, Link, PanelTop } from "lucide-react";
import { defineField, defineType } from "sanity";

export const navbar = defineType({
  name: "navbar",
  type: "document",
  title: "Navigation",
  icon: PanelTop,
  description: "Navigation content for your website",
  fields: [
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      description: "Label used to identify navbar in the CMS",
      initialValue: "Main Navigation",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "columns",
      type: "array",
      title: "Navigation Items",
      description: "Navigation menu items",
      validation: (rule) => rule.required().min(1),
      of: [
        {
          name: "navLink",
          type: "object",
          title: "Navigation Link",
          icon: Link,
          fields: [
            defineField({
              name: "name",
              type: "string",
              title: "Name",
              description: "Name for the link",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "customUrl",
              validation: (rule) => rule.required(),
            }),
          ],
        },
        {
          name: "navDropdown",
          type: "object",
          title: "Dropdown Menu",
          icon: LayoutPanelLeft,
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
              description: "Title for the dropdown menu",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "links",
              type: "array",
              title: "Links",
              description: "Links in the dropdown menu",
              validation: (rule) => rule.required().min(1),
              of: [
                {
                  type: "object",
                  title: "Dropdown Link",
                  fields: [
                    defineField({
                      name: "name",
                      type: "string",
                      title: "Name",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "description",
                      type: "string",
                      title: "Description",
                    }),
                    defineField({
                      name: "url",
                      type: "customUrl",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
      initialValue: [
        {
          _type: "navLink",
          name: "About",
          url: {
            type: "internal",
            internal: { _type: "page", slug: { current: "about" } },
          },
        },
        {
          _type: "navDropdown",
          title: "Services",
          links: [
            {
              name: "Financial Planning",
              description:
                "Comprehensive financial planning and wealth management",
              url: {
                type: "internal",
                internal: {
                  _type: "page",
                  slug: { current: "services/financial-planning" },
                },
              },
            },
            {
              name: "Insurance Solutions",
              description: "Life, health, and property insurance solutions",
              url: {
                type: "internal",
                internal: {
                  _type: "page",
                  slug: { current: "services/insurance" },
                },
              },
            },
          ],
        },
        {
          _type: "navLink",
          name: "Contact",
          url: {
            type: "internal",
            internal: { _type: "page", slug: { current: "contact" } },
          },
        },
      ],
    }),
    defineField({
      name: "buttons",
      type: "array",
      title: "CTA Buttons",
      description: "Call-to-action buttons in the navigation",
      validation: (rule) => rule.max(2),
      of: [
        {
          type: "object",
          title: "Button",
          icon: Link,
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "customUrl",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "variant",
              type: "string",
              title: "Style Variant",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                ],
              },
              initialValue: "primary",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
      initialValue: [
        {
          label: "Get Started",
          variant: "primary",
          url: {
            type: "internal",
            internal: { _type: "page", slug: { current: "contact" } },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "label",
    },
    prepare: ({ title }) => ({
      title: title || "Main Navigation",
      media: PanelTop,
    }),
  },
});

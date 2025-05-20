import {
  LayoutPanelLeft,
  Link,
  PanelBottom,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { defineField, defineType } from "sanity";

export const footer = defineType({
  name: "footer",
  type: "document",
  title: "Footer",
  icon: PanelBottom,
  description: "Footer content for your website",
  fields: [
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      description: "Label used to identify footer in the CMS",
      initialValue: "Footer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "text",
      title: "Subtitle",
      rows: 2,
      description: "Subtitle that sits beneath the logo in the footer",
      initialValue:
        "Empowering financial advisors with innovative solutions and unparalleled support for their success.",
    }),
    defineField({
      name: "contactInfo",
      type: "object",
      title: "Contact Information",
      description: "Company contact details",
      fields: [
        defineField({
          name: "phone",
          type: "string",
          title: "Phone Number",
          description: "Main contact phone number",
          icon: Phone,
        }),
        defineField({
          name: "email",
          type: "string",
          title: "Email Address",
          description: "Main contact email address",
          icon: Mail,
        }),
        defineField({
          name: "address",
          type: "text",
          title: "Address",
          description: "Company address",
          icon: MapPin,
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      title: "Social Media Links",
      description: "Social media profiles",
      validation: (rule) => rule.unique().min(1),
      of: [
        {
          type: "object",
          icon: Link,
          fields: [
            defineField({
              name: "platform",
              type: "string",
              title: "Platform",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Twitter", value: "twitter" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "YouTube", value: "youtube" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              platform: "platform",
              url: "url",
            },
            prepare({ platform, url }) {
              return {
                title:
                  platform?.charAt(0).toUpperCase() + platform?.slice(1) ||
                  "Social Link",
                subtitle: url,
                media: Link,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "columns",
      type: "array",
      title: "Footer Columns",
      description: "Navigation columns for the footer",
      validation: (rule) => rule.required().min(2).max(4),
      of: [
        {
          type: "object",
          icon: LayoutPanelLeft,
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
              description: "Title for the column",
              validation: (rule) => rule.required(),
              initialValue: "Quick Links",
            }),
            defineField({
              name: "links",
              type: "array",
              title: "Links",
              description: "Links for the column",
              validation: (rule) => rule.required().min(1),
              of: [
                {
                  type: "object",
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
                  preview: {
                    select: {
                      title: "name",
                      externalUrl: "url.external",
                      urlType: "url.type",
                      internalUrl: "url.internal.slug.current",
                      openInNewTab: "url.openInNewTab",
                    },
                    prepare({
                      title,
                      externalUrl,
                      urlType,
                      internalUrl,
                      openInNewTab,
                    }) {
                      const url =
                        urlType === "external" ? externalUrl : internalUrl;
                      return {
                        title: title || "Untitled Link",
                        subtitle: `${urlType === "external" ? "External" : "Internal"} • ${url}${openInNewTab ? " ↗" : ""}`,
                        media: Link,
                      };
                    },
                  },
                },
              ],
            }),
          ],
        },
      ],
      initialValue: [
        {
          title: "Company",
          links: [
            {
              name: "About Us",
              url: {
                type: "internal",
                internal: { _type: "page", slug: { current: "about" } },
              },
            },
            {
              name: "Our Services",
              url: {
                type: "internal",
                internal: { _type: "page", slug: { current: "services" } },
              },
            },
            {
              name: "Contact",
              url: {
                type: "internal",
                internal: { _type: "page", slug: { current: "contact" } },
              },
            },
          ],
        },
        {
          title: "Resources",
          links: [
            {
              name: "Blog",
              url: {
                type: "internal",
                internal: { _type: "page", slug: { current: "blog" } },
              },
            },
            {
              name: "FAQ",
              url: {
                type: "internal",
                internal: { _type: "page", slug: { current: "faq" } },
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: "legalLinks",
      type: "array",
      title: "Legal Links",
      description: "Links to legal pages",
      validation: (rule) => rule.required().min(2),
      of: [
        {
          type: "object",
          icon: Link,
          fields: [
            defineField({
              name: "name",
              type: "string",
              title: "Name",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "customUrl",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
      initialValue: [
        {
          name: "Privacy Policy",
          url: {
            type: "internal",
            internal: { _type: "page", slug: { current: "privacy-policy" } },
          },
        },
        {
          name: "Terms & Conditions",
          url: {
            type: "internal",
            internal: { _type: "page", slug: { current: "terms" } },
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
      title: title || "Untitled Footer",
      media: PanelBottom,
    }),
  },
});

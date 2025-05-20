import { defineField, defineType } from "@sanity/types";

export const heroBlockQuery = /* groq */ `
  _type == "heroBlock" => {
    _type,
    mainHeading,
    subHeading,
    description,
    serviceTags[],
    featuredServices[] {
      _key,
      title,
      description,
      icon,
      link {
        href,
        openInNewTab
      }
    },
    ctaButtons[] {
      _key,
      label,
      variant,
      icon,
      link {
        href,
        openInNewTab
      }
    },
    image {
      asset->{
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      alt,
      hotspot
    }
  }
`;

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero Block",
  type: "object",
  fields: [
    defineField({
      name: "mainHeading",
      type: "string",
      title: "Main Heading",
      description: "The primary headline (keep it short and impactful)",
      validation: (Rule) => Rule.required().max(200),
      initialValue: "Comprehensive Legal Solutions for Business & Real Estate",
    }),
    defineField({
      name: "subHeading",
      type: "string",
      title: "Sub Heading",
      description: "A supporting headline that adds context",
      validation: (Rule) => Rule.required().max(80),
      initialValue: "Expert Legal Support in Washington & Oregon",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A compelling description of your services",

      initialValue:
        "Cascade Business Law specializes in providing comprehensive legal support across business and real estate matters. Licensed in both Washington and Oregon, we ensure personalized solutions for your unique legal challenges.",
    }),
    defineField({
      name: "serviceTags",
      type: "array",
      title: "Service Tags",
      description: "Key service areas to highlight",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(3).max(12),
      initialValue: [
        "Business Formation",
        "Commercial Contracts",
        "Mergers & Acquisitions",
        "Real Estate",
        "Property Development",
        "Labor & Employment",
        "Intellectual Property",
        "Nonprofits",
        "Commercial Leasing",
      ],
    }),
    defineField({
      name: "featuredServices",
      type: "array",
      title: "Featured Services",
      description: "Main services with descriptions",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Title",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Icon",
              description: "Icon name from the icon library",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "link",
              type: "object",
              title: "Link",
              fields: [
                {
                  name: "href",
                  type: "string",
                  title: "URL",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "openInNewTab",
                  type: "boolean",
                  title: "Open in New Tab",
                  initialValue: false,
                },
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().length(3),
      initialValue: [
        {
          _key: "business-law",
          title: "Business Law",
          description:
            "Comprehensive legal services for businesses, from formation to governance, contracts, and M&A transactions.",
          icon: "building",
          link: {
            href: "/services/business-law",
            openInNewTab: false,
          },
        },
        {
          _key: "real-estate",
          title: "Real Estate Law",
          description:
            "Expert guidance in property development, purchases, sales, and commercial leasing agreements.",
          icon: "home",
          link: {
            href: "/services/real-estate",
            openInNewTab: false,
          },
        },
        {
          _key: "corporate-compliance",
          title: "Corporate Compliance",
          description:
            "Ensuring your business meets all legal requirements while maintaining efficient operations.",
          icon: "shield-check",
          link: {
            href: "/services/compliance",
            openInNewTab: false,
          },
        },
      ],
    }),
    defineField({
      name: "ctaButtons",
      type: "array",
      title: "Call-to-Action Buttons",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "variant",
              type: "string",
              title: "Variant",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                  { title: "Tertiary", value: "tertiary" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Icon",
              description: "Icon name from the icon library",
            }),
            defineField({
              name: "link",
              type: "object",
              fields: [
                {
                  name: "href",
                  type: "string",
                  title: "URL",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "openInNewTab",
                  type: "boolean",
                  title: "Open in New Tab",
                  initialValue: false,
                },
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(3),
      initialValue: [
        {
          _key: "contact",
          label: "Contact Now",
          variant: "primary",
          icon: "phone",
          link: {
            href: "/contact",
            openInNewTab: false,
          },
        },
        {
          _key: "services",
          label: "Our Services",
          variant: "secondary",
          icon: "arrow-right",
          link: {
            href: "/services",
            openInNewTab: false,
          },
        },
      ],
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Hero Image",
      description: "The main background image",
      options: {
        hotspot: true,
      },
      // validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "mainHeading",
      subtitle: "subHeading",
      media: "image",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Hero Block",
      subtitle: subtitle || "",
      media,
    }),
  },
});

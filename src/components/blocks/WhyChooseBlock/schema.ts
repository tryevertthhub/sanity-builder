import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";
import { ShieldCheckIcon } from "lucide-react";

export const whyChooseBlockQuery = /* groq */ `
  _type == "whyChooseBlock" => {
    _type,
    heading,
    description,
    features[] {
      _key,
      title,
      description,
      icon,
      stats {
        value,
        label
      }
    },
    callToAction {
      heading,
      description,
      button {
        label,
        link {
          href,
          openInNewTab
        }
      }
    }
  }
`;

export const whyChooseBlock = defineType({
  name: "whyChooseBlock",
  title: "Why Choose Us Block",
  type: "object",
  icon: ShieldCheckIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description:
        "The main heading for this section - will be displayed with a gradient text effect",
      initialValue: "Elevating Legal Excellence Through Innovation",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description:
        "A compelling description of your value proposition - will be displayed in a muted gray",
      initialValue:
        "Experience a new standard in legal services where cutting-edge technology meets decades of expertise. Our innovative approach ensures your business receives unparalleled legal support tailored to modern challenges.",
    }),
    defineField({
      name: "features",
      type: "array",
      title: "Features",
      description:
        "Key features or reasons to choose your firm - displayed in a modern, gradient-styled grid",
      initialValue: [
        {
          _key: "expertise",
          title: "Strategic Legal Innovation",
          description:
            "Leveraging advanced legal tech and AI-driven insights to deliver sophisticated solutions that keep your business ahead of the curve.",
          icon: "lightbulb",
          stats: {
            value: "20+",
            label: "Years of Innovation",
          },
        },
        {
          _key: "clientSuccess",
          title: "Client-Centric Excellence",
          description:
            "Our dedicated team combines deep industry knowledge with personalized attention, ensuring your success is our top priority.",
          icon: "users",
          stats: {
            value: "50+",
            label: "Satisfied Clients",
          },
        },
        {
          _key: "globalReach",
          title: "Global Business Acumen",
          description:
            "With international expertise and local insight, we help navigate complex legal landscapes across borders and jurisdictions.",
          icon: "scale",
          stats: {
            value: "24/7",
            label: "Global Support",
          },
        },
      ],
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Feature Title",
              description: "A concise, impactful title for this feature",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Feature Description",
              description:
                "A compelling description that highlights the value of this feature",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Feature Icon",
              description:
                "Icon name from Lucide icons (e.g., 'scale', 'users', 'lightbulb') - will be displayed with a gradient background",
            }),
            defineField({
              name: "stats",
              type: "object",
              title: "Feature Statistics",
              description:
                "Impressive statistics that support this feature - displayed with gradient text",
              fields: [
                defineField({
                  name: "value",
                  type: "string",
                  title: "Statistic Value",
                  description:
                    "The numerical or text value (e.g., '500+', '24/7')",
                }),
                defineField({
                  name: "label",
                  type: "string",
                  title: "Statistic Label",
                  description:
                    "A brief description of what the value represents",
                }),
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({
      name: "callToAction",
      type: "object",
      title: "Call to Action",
      description: "A compelling call-to-action section with gradient styling",
      fields: [
        defineField({
          name: "heading",
          type: "string",
          title: "CTA Heading",
          initialValue: "Ready to Transform Your Legal Strategy?",
        }),
        defineField({
          name: "description",
          type: "text",
          title: "CTA Description",
          initialValue:
            "Schedule a consultation with our expert team to discover how our innovative legal solutions can protect and accelerate your business growth.",
        }),
        defineField({
          name: "button",
          type: "object",
          title: "CTA Button",
          description: "Button with gradient styling and hover effects",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Button Label",
              initialValue: "Book Your Strategy Session",
            }),
            defineField({
              name: "link",
              type: "object",
              title: "Button Link",
              fields: [
                defineField({
                  name: "href",
                  type: "string",
                  title: "URL",
                  initialValue: "/contact",
                }),
                defineField({
                  name: "openInNewTab",
                  type: "boolean",
                  title: "Open in New Tab",
                  initialValue: false,
                }),
              ],
            }),
          ],
        }),
      ],
      initialValue: {
        heading: "Ready to Transform Your Legal Strategy?",
        description:
          "Schedule a consultation with our expert team to discover how our innovative legal solutions can protect and accelerate your business growth.",
        button: {
          label: "Book Your Strategy Session",
          link: {
            href: "/contact",
            openInNewTab: false,
          },
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Why Choose Us Block",
        subtitle: subtitle || "",
      };
    },
  },
});

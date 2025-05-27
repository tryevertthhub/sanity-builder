import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";

export const statsBlockQuery = /* groq */ `
      _type == "statsBlock" => {
        _type,
        title,
        subtitle,
        stats[] {
          _key,
          value,
          label,
          description,
          icon {
            asset-> {
              url
            },
            alt
          }
        },
        backgroundImage {
          asset-> {
            url
          },
          alt
        }
      }
    `;

export const statsBlock = defineType({
  name: "statsBlock",
  title: "Stats Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The main heading for the stats section",
      initialValue: "Our Track Record",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "text",
      title: "Subtitle",
      description: "A brief description below the title",
      initialValue:
        "Numbers that demonstrate our commitment to excellence and client success.",
    }),
    defineField({
      name: "stats",
      type: "array",
      title: "Statistics",
      description: "Add key statistics to showcase",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              type: "string",
              title: "Value",
              description: "The numerical value or statistic",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              description: "Label describing the statistic",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
              description: "Optional additional context for the statistic",
            }),
            defineField({
              name: "icon",
              type: "image",
              title: "Statistic Icon",
              description: "An icon representing this statistic",
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alt Text",
                  initialValue: "Statistic icon",
                }),
              ],
            }),
          ],
        },
      ],
      initialValue: [
        {
          _key: "stat1",
          value: "$1B+",
          label: "Assets Under Management",
          description: "Trusted by clients to manage their wealth responsibly.",
        },
        {
          _key: "stat2",
          value: "25+",
          label: "Years of Experience",
          description:
            "Decades of expertise in financial planning and wealth management.",
        },
        {
          _key: "stat3",
          value: "98%",
          label: "Client Retention",
          description: "Long-lasting relationships built on trust and results.",
        },
        {
          _key: "stat4",
          value: "1,000+",
          label: "Satisfied Clients",
          description:
            "Helping individuals and families achieve their financial goals.",
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    defineField({
      name: "backgroundImage",
      type: "image",
      title: "Background Image",
      description: "Optional background image for the stats section",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          initialValue: "Stats section background",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Stats Block",
        subtitle: subtitle,
      };
    },
  },
});

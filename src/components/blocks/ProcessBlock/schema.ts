import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";
import { ListChecks } from "lucide-react";

export const processBlockQuery = /* groq */ `
  _type == "processBlock" => {
    _type,
    heading,
    description,
    steps[] {
      _key,
      title,
      description,
      icon
    }
  }
`;

export const processBlock = defineType({
  name: "processBlock",
  title: "Process Block",
  type: "object",
  icon: ListChecks,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description: "The main heading for the process section",
      initialValue: "Your Path to Legal Excellence",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A brief description of your process",
      initialValue:
        "We follow a structured approach to understand your needs, develop solutions, and deliver exceptional results for your business.",
    }),
    defineField({
      name: "steps",
      type: "array",
      title: "Process Steps",
      description: "The steps in your process (recommended: 4-6 steps)",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Step Title",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Step Description",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Step Icon",
              description:
                "Icon name from Lucide icons (e.g., 'search', 'fileText', 'handshake')",
            }),
          ],
        },
      ],
      initialValue: [
        {
          _key: "discovery",
          title: "Discovery & Assessment",
          description:
            "We conduct a thorough analysis of your legal needs through an in-depth consultation. Our team evaluates your situation, identifies potential challenges, and outlines strategic opportunities for your case.",
          icon: "search",
        },
        {
          _key: "strategy",
          title: "Strategic Planning",
          description:
            "Based on our assessment, we develop a comprehensive legal strategy tailored to your specific goals. We outline clear objectives, timelines, and expected outcomes for your approval.",
          icon: "fileText",
        },
        {
          _key: "execution",
          title: "Implementation",
          description:
            "Our experienced team executes the agreed-upon strategy with precision and attention to detail. We handle all legal documentation, negotiations, and proceedings on your behalf.",
          icon: "briefcase",
        },
        {
          _key: "review",
          title: "Ongoing Support",
          description:
            "We maintain regular communication throughout the process, providing updates and adjusting our approach as needed. Our commitment extends beyond the immediate case to ensure long-term success.",
          icon: "handshake",
        },
      ],
      validation: (Rule) => Rule.min(2).max(6),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Process Block",
        subtitle: subtitle || "",
      };
    },
  },
});

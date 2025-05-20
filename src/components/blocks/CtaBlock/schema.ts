import { PhoneIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { richTextField } from "../../../sanity/schemaTypes/common";

export const ctaBlockQuery = /* groq */ `
  _type == "cta" => {
    ...,
    _type,
    eyebrow,
    title,
    subtitle,
    style,
    richText[]{
      ...,
    },
    buttons[]{
      _key,
      label,
      variant,
      icon,
      link{
        href,
        openInNewTab
      }
    },
    backgroundStyle,
    alignment
  }
`;

export const cta = defineType({
  name: "cta",
  title: "Call to Action",
  type: "object",
  icon: PhoneIcon,
  fields: [
    defineField({
      name: "style",
      title: "CTA Style",
      type: "string",
      options: {
        list: [
          { title: "Modern Gradient", value: "modern" },
          { title: "Glass Morphism", value: "glass" },
          { title: "Minimal Light", value: "light" },
          { title: "Bold Dark", value: "dark" },
        ],
      },
      initialValue: "modern",
    }),
    defineField({
      name: "alignment",
      title: "Content Alignment",
      type: "string",
      options: {
        list: [
          { title: "Center", value: "center" },
          { title: "Left", value: "left" },
        ],
      },
      initialValue: "center",
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "The smaller text that sits above the title to provide context",
      initialValue: "Take the Next Step Forward",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The large text that is the primary focus of the block",
      initialValue: "Ready to Transform Your Digital Presence?",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "A supporting line that adds context to the title",
      initialValue:
        "Join us in creating innovative solutions that drive real business growth.",
    }),
    richTextField,
    defineField({
      name: "buttons",
      title: "Call-to-Action Buttons",
      type: "array",
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
              title: "Style Variant",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                  { title: "Tertiary", value: "tertiary" },
                  { title: "Outline", value: "outline" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Icon",
              description:
                "Icon name from Lucide icons (e.g., 'arrow-right', 'phone', 'mail')",
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
          _key: "primary",
          label: "Get Started",
          variant: "primary",
          icon: "arrow-right",
          link: {
            href: "/contact",
            openInNewTab: false,
          },
        },
        {
          _key: "secondary",
          label: "Learn More",
          variant: "secondary",
          icon: "info",
          link: {
            href: "/about",
            openInNewTab: false,
          },
        },
      ],
    }),
    defineField({
      name: "backgroundStyle",
      title: "Background Style",
      type: "string",
      options: {
        list: [
          { title: "Dynamic Gradient", value: "gradient" },
          { title: "Geometric Pattern", value: "geometric" },
          { title: "Mesh Pattern", value: "mesh" },
          { title: "Simple", value: "simple" },
        ],
      },
      initialValue: "gradient",
    }),
  ],
  initialValue: {
    richText: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Transform your digital presence with our innovative solutions. Our team of experts is dedicated to delivering exceptional results that drive growth and success. Let us help you create something extraordinary that sets you apart from the competition.",
          },
        ],
      },
    ],
    buttons: [
      {
        _key: "primary",
        label: "Get Started",
        variant: "primary",
        icon: "arrow-right",
        link: {
          href: "/contact",
          openInNewTab: false,
        },
      },
      {
        _key: "secondary",
        label: "Learn More",
        variant: "secondary",
        icon: "info",
        link: {
          href: "/about",
          openInNewTab: false,
        },
      },
    ],
  },
  preview: {
    select: {
      title: "title",
      style: "style",
      backgroundStyle: "backgroundStyle",
    },
    prepare: ({ title, style, backgroundStyle }) => ({
      title,
      subtitle: `CTA Block - ${style} style with ${backgroundStyle} background`,
    }),
  },
});

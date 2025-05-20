import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";

export const newsletterBlockQuery = /* groq */ `
  _type == "newsletterBlock" => {
    _type,
    title,
    subtitle,
    eyebrow,
    description,
    style,
    backgroundStyle,
    alignment,
    features[] {
      _key,
      title,
      description,
      icon {
        asset-> {
          url
        },
        alt
      }
    },
    formConfig {
      buttonText,
      buttonStyle,
      placeholderText,
      successMessage,
      emailTo
    },
    backgroundImage {
      asset-> {
        url
      },
      alt
    }
  }
`;

export const newsletterBlock = defineType({
  name: "newsletterBlock",
  title: "Newsletter Block",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow Text",
      description: "Optional text that appears above the title",
      initialValue: "Newsletter",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The main heading for the newsletter section",
      initialValue: "Get Financial Insights Delivered to Your Inbox",
      validation: (Rule: Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
      description: "A brief subtitle below the heading",
      initialValue:
        "Join 10,000+ financial professionals receiving our weekly insights",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Main description text for the newsletter section",
      initialValue:
        "Stay ahead with expert analysis, market trends, and exclusive financial planning strategies delivered straight to your inbox.",
    }),
    defineField({
      name: "style",
      type: "string",
      title: "Style",
      description: "The visual style of the newsletter block",
      options: {
        list: [
          { title: "Modern", value: "modern" },
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
      },
      initialValue: "modern",
    }),
    defineField({
      name: "backgroundStyle",
      type: "string",
      title: "Background Style",
      description: "The style of the background",
      options: {
        list: [
          { title: "Gradient", value: "gradient" },
          { title: "Geometric", value: "geometric" },
          { title: "Simple", value: "simple" },
        ],
      },
      initialValue: "gradient",
    }),
    defineField({
      name: "alignment",
      type: "string",
      title: "Content Alignment",
      description: "Alignment of the content within the block",
      options: {
        list: [
          { title: "Center", value: "center" },
          { title: "Left", value: "left" },
        ],
      },
      initialValue: "center",
    }),
    defineField({
      name: "features",
      type: "array",
      title: "Newsletter Features",
      description: "Key benefits of subscribing to the newsletter",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Feature Title",
              validation: (Rule: Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Feature Description",
              validation: (Rule: Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              type: "image",
              title: "Feature Icon",
              description: "An icon representing this feature",
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alt Text",
                  initialValue: "Newsletter feature icon",
                }),
              ],
            }),
          ],
        },
      ],
      initialValue: [
        {
          _key: "feature1",
          title: "Weekly Market Analysis",
          description:
            "Get detailed breakdowns of market trends and expert predictions to inform your investment decisions.",
        },
        {
          _key: "feature2",
          title: "Exclusive Insights",
          description:
            "Access premium content and strategic advice from our team of financial experts.",
        },
        {
          _key: "feature3",
          title: "Investment Opportunities",
          description:
            "Be the first to know about emerging investment opportunities and market shifts.",
        },
      ],
    }),
    defineField({
      name: "formConfig",
      type: "object",
      title: "Form Configuration",
      fields: [
        defineField({
          name: "buttonText",
          type: "string",
          title: "Subscribe Button Text",
          initialValue: "Subscribe Now",
        }),
        defineField({
          name: "buttonStyle",
          type: "string",
          title: "Button Style",
          options: {
            list: [
              { title: "Default", value: "default" },
              { title: "Outline", value: "outline" },
              { title: "Secondary", value: "secondary" },
            ],
          },
          initialValue: "default",
        }),
        defineField({
          name: "placeholderText",
          type: "string",
          title: "Email Input Placeholder",
          initialValue: "Enter your email address",
        }),
        defineField({
          name: "successMessage",
          type: "string",
          title: "Success Message",
          initialValue:
            "Thank you for subscribing! Check your inbox to confirm your subscription.",
        }),
        defineField({
          name: "emailTo",
          type: "string",
          title: "Email Recipient",
          description: "Email address where subscriptions will be sent",
          initialValue: "newsletter@eschelsfinancial.com",
        }),
      ],
      initialValue: {
        buttonText: "Subscribe Now",
        buttonStyle: "default",
        placeholderText: "Enter your email address",
        successMessage:
          "Thank you for subscribing! Check your inbox to confirm your subscription.",
        emailTo: "newsletter@eschelsfinancial.com",
      },
    }),
    defineField({
      name: "backgroundImage",
      type: "image",
      title: "Background Image",
      description: "Optional background image for the newsletter section",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          initialValue: "Newsletter section background",
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
        title: title || "Newsletter Block",
        subtitle: subtitle,
      };
    },
  },
});

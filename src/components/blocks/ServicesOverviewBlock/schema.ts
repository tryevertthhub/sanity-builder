import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";

export const servicesOverviewBlockQuery = /* groq */ `
  _type == "servicesOverviewBlock" => {
    _type,
    title,
    subtitle,
    sectionHeading,
    productsHeading,
    servicesHeading,
    products[] {
      _key,
      name,
      icon {
        asset-> {
          url
        },
        alt
      }
    },
    services[] {
      _key,
      title,
      description,
      icon {
        asset-> {
          url
        },
        alt
      },
      link {
        href,
        openInNewTab
      }
    },
    brokerageDescription,
    additionalInfo
  }
`;

export const servicesOverviewBlock = defineType({
  name: "servicesOverviewBlock",
  title: "Services Overview Block",
  type: "object",
  fields: [
    defineField({
      name: "sectionHeading",
      type: "string",
      title: "Section Heading",
      description: "The small heading above the main title",
      initialValue: "Our Financial Services",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The main heading for the services section",
      initialValue: "Our Financial Services",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "text",
      title: "Subtitle",
      description: "A brief description below the title",
      initialValue:
        "As a Broker General Agent, Eschels Financial Group strives to be the Consultative Partner in the advisor's practice, allowing them to grow their business infinitely amongst this ever-changing insurance industry.",
    }),
    defineField({
      name: "productsHeading",
      type: "string",
      title: "Products Section Heading",
      description: "The heading for the products list section",
      initialValue:
        "With over 30 approved insurance and annuity carriers, we provide a vast selection of products",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "servicesHeading",
      type: "string",
      title: "Services Section Heading",
      description: "The heading for the services section",
      initialValue:
        "Our brokerage operation guides advisors step-by-step through the entire sales process",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "products",
      type: "array",
      title: "Insurance Products",
      description: "List of insurance and annuity products offered",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              type: "string",
              title: "Product Name",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              type: "image",
              title: "Product Icon",
              description: "An icon representing this product",
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alt Text",
                  initialValue: "Product icon",
                }),
              ],
            }),
          ],
        },
      ],
      initialValue: [
        { _key: "ul", name: "Universal Life" },
        { _key: "wl", name: "Whole Life" },
        { _key: "fe", name: "Final Expense" },
        { _key: "ltc", name: "Long Term Care" },
        { _key: "di", name: "Disability Income" },
        { _key: "rp", name: "Predictable Retirement Planning" },
        { _key: "an", name: "Annuities" },
      ],
    }),
    defineField({
      name: "services",
      type: "array",
      title: "Services",
      description: "Add financial services offered",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Service Title",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Service Description",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              type: "image",
              title: "Service Icon",
              description: "An icon representing this service",
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alt Text",
                  initialValue: "Service icon",
                }),
              ],
            }),
            defineField({
              name: "link",
              type: "object",
              title: "Service Link",
              description: "Optional link to service details page",
              fields: [
                defineField({
                  name: "href",
                  type: "string",
                  title: "URL",
                  validation: (Rule) => Rule.required(),
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
        },
      ],
      initialValue: [
        {
          _key: "service1",
          title: "Investment Management",
          description:
            "Professional portfolio management tailored to your investment goals and risk tolerance.",
        },
        {
          _key: "service2",
          title: "Retirement Planning",
          description:
            "Comprehensive retirement strategies to help you achieve financial security in your golden years.",
        },
        {
          _key: "service3",
          title: "Estate Planning",
          description:
            "Expert guidance in preserving and transferring wealth to future generations.",
        },
      ],
    }),
    defineField({
      name: "brokerageDescription",
      type: "text",
      title: "Brokerage Description",
      description: "Description of the brokerage operation",
      initialValue:
        "Our experience with personalized sales training, both in advanced markets and day-to-day client solutions, provides a concierge approach to the individualized needs of all advisors, regardless of tenure in the industry.",
    }),
    defineField({
      name: "additionalInfo",
      type: "text",
      title: "Additional Information",
      description: "Additional details about the services",
      initialValue:
        "In addition to helping advisors with their cases prior to the sale, Eschels also provides outstanding case support by shopping the case to several carriers prior to submission to determine how each carrier views the case. Once the application is submitted, we work with the underwriter to achieve the best possible outcome for the client.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Services Overview Block",
        subtitle: subtitle,
      };
    },
  },
});

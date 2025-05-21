import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";

export const servicesBlockQuery = /* groq */ `
  _type == "servicesBlock" => {
    _type,
    heading,
    description,
    services[] {
      _key,
      title,
      description,
      icon,
      features[] {
        title,
        description
      }
    }
  }
`;

export const servicesBlock = defineType({
  name: "servicesBlock",
  title: "Services Block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      description: "The main heading for the services section",
      initialValue: " ",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "A brief overview of your services",
      initialValue:
        "From business formation to real estate transactions, we provide expert legal guidance across Washington and Oregon. Our comprehensive approach ensures your business and property interests are protected at every step.",
    }),
    defineField({
      name: "services",
      type: "array",
      title: "Services",
      description: "List of detailed services with their features",
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
              type: "string",
              title: "Service Icon",
              description: "Icon name from the icon set",
            }),
            defineField({
              name: "features",
              type: "array",
              title: "Service Features",
              description: "Detailed features of this service",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      type: "string",
                      title: "Feature Title",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "description",
                      type: "text",
                      title: "Feature Description",
                      validation: (Rule) => Rule.required(),
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
          _key: "business-law",
          title: "Business Law",
          description:
            "Comprehensive legal services for businesses at every stage, from formation to ongoing operations and growth.",
          icon: "building",
          features: [
            {
              title: "Business Formation",
              description:
                "Expert guidance in choosing and establishing the right business structure, including corporations, LLCs, and partnerships. We handle all documentation and filings to ensure proper formation and compliance.",
            },
            {
              title: "Business Governance",
              description:
                "Development of operating agreements, bylaws, and governance structures. Ongoing support for corporate maintenance and compliance requirements.",
            },
            {
              title: "Commercial Contracts",
              description:
                "Drafting, review, and negotiation of all types of business contracts, from vendor agreements to employment contracts. Ensuring your interests are protected in every business relationship.",
            },
            {
              title: "Mergers & Acquisitions",
              description:
                "Comprehensive support for business transactions, including due diligence, deal structuring, and closing. Protecting your interests throughout the M&A process.",
            },
          ],
        },
        {
          _key: "real-estate",
          title: "Real Estate Law",
          description:
            "Expert legal guidance for all aspects of real estate transactions and development in Washington and Oregon.",
          icon: "home",
          features: [
            {
              title: "Property Development",
              description:
                "Legal support for development projects, including zoning compliance, permits, and construction contracts. Ensuring your development projects proceed smoothly and legally.",
            },
            {
              title: "Purchase & Sale",
              description:
                "Comprehensive handling of real estate transactions, from contract review to closing. Protection of your interests in property acquisitions and dispositions.",
            },
            {
              title: "Commercial Leasing",
              description:
                "Drafting and negotiation of commercial lease agreements. Protecting landlord and tenant interests in commercial property relationships.",
            },
            {
              title: "Property Management",
              description:
                "Legal support for ongoing property management, including tenant relationships, maintenance contracts, and regulatory compliance.",
            },
          ],
        },
        {
          _key: "specialized-services",
          title: "Specialized Services",
          description:
            "Additional legal services tailored to specific business and property needs.",
          icon: "sparkles",
          features: [
            {
              title: "Labor & Employment",
              description:
                "Comprehensive employment law services, including policy development, compliance, and dispute resolution. Protecting your business in all employment matters.",
            },
            {
              title: "Intellectual Property",
              description:
                "Protection of your business's intellectual property through trademarks, copyrights, and trade secrets. Strategic guidance for IP portfolio management.",
            },
            {
              title: "Nonprofit Organizations",
              description:
                "Specialized legal services for nonprofit formation, governance, and compliance. Supporting your charitable mission with proper legal foundation.",
            },
            {
              title: "E-commerce & Technology",
              description:
                "Legal support for online businesses, including website policies, terms of service, and regulatory compliance. Navigating the digital business landscape safely.",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Services Block",
        subtitle: subtitle || "",
      };
    },
  },
});

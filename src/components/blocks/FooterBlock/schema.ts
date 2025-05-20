import { defineField, defineType } from "sanity";
import { PanelBottom } from "lucide-react";

export const footerBlockQuery = /* groq */ `
  _type == "footerBlock" => {
    _type,
    _key,
    subtitle,
    columns[]{
      _key,
      title,
      links[]{
        _key,
        name,
        href,
        openInNewTab
      }
    },
    socialLinks[]{
      _key,
      platform,
      url
    }
  }
`;

export const footerBlock = defineType({
  name: "footerBlock",
  title: "Site Footer",
  type: "document",
  icon: PanelBottom,
  description: "Configure the footer structure for your site",
  fields: [
    defineField({
      name: "label",
      type: "string",
      initialValue: "Footer",
      title: "Footer Label",
      description:
        "Internal label to identify this footer configuration in the CMS",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
      description: "A short description or tagline displayed under the logo",
    }),
    defineField({
      name: "columns",
      type: "array",
      title: "Footer Columns",
      description: "Add columns of links to organize your footer content",
      of: [
        {
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Column Title",
              description:
                "The heading text displayed above this group of footer links",
            }),
            defineField({
              name: "links",
              type: "array",
              title: "Column Links",
              validation: (rule) => [rule.required(), rule.unique()],
              description: "The list of links to display in this column",
              of: [
                {
                  type: "object",
                  name: "footerLink",
                  fields: [
                    defineField({
                      name: "name",
                      type: "string",
                      title: "Link Text",
                      description:
                        "The text that will be displayed for this link",
                    }),
                    defineField({
                      name: "href",
                      type: "string",
                      title: "Link URL",
                      description:
                        "The URL that this link will navigate to when clicked",
                    }),
                    defineField({
                      name: "openInNewTab",
                      type: "boolean",
                      title: "Open in New Tab",
                      description: "Whether this link should open in a new tab",
                      initialValue: false,
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      title: "Social Links",
      description: "Add links to your social media profiles",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              title: "Platform",
              description: "Select the social media platform",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Twitter", value: "twitter" },
                  { title: "Instagram", value: "instagram" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "YouTube", value: "youtube" },
                ],
              },
            }),
            defineField({
              name: "url",
              type: "string",
              title: "Profile URL",
              description: "The URL to your profile on this platform",
            }),
          ],
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
    }),
  },
});

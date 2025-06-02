import { defineField, defineType } from "@sanity/types";

export type HeroBlockProps = {
  _type: "heroBlock";
  topBadges?: Array<{
    _key: string;
    text: string;
    icon: string;
  }>;
  animationBlocks?: Array<{
    _key: string;
    name: string;
    description: string;
    icon: string;
  }>;
  mainHeading?: string;
  subHeading?: string;
  description?: string;
  features?: Array<{
    _key: string;
    title: string;
    description: string;
    icon: string;
    highlight?: boolean;
  }>;
  ctaButtons?: Array<{
    _key?: string;
    label?: string;
    variant?: "primary" | "secondary" | "tertiary";
    icon?: string;
    link?: {
      href: string;
      openInNewTab?: boolean;
    };
  }>;
  image?: {
    asset: {
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
          aspectRatio: number;
        };
      };
    };
    alt?: string;
    hotspot?: {
      x: number;
      y: number;
    };
  };
  preview?: boolean;
  onEdit?: (field: string, value: any) => void;
};

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero Block",
  type: "object",
  fields: [
    defineField({
      name: "animationBlocks",
      title: "Animation Blocks", 
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Block Name" },
            { name: "description", type: "string", title: "Description" },
            { name: "icon", type: "string", title: "Icon Name" }
          ]
        }
      ],
      initialValue: [
        { _key: "header-block", name: "Header", description: "Navigation & branding", icon: "layout" },
        { _key: "hero-block", name: "Hero", description: "Hero section & CTA", icon: "sparkles" },
        { _key: "content-block", name: "Content", description: "Main content area", icon: "file-text" },
        { _key: "footer-block", name: "Footer", description: "Footer & links", icon: "grid-3x3" }
      ]
    }),
    defineField({
      name: "mainHeading",
      title: "Main Heading",
      type: "string",
      initialValue: "Build stunning websites with our visual page builder"
    }),
    defineField({
      name: "subHeading", 
      title: "Sub Heading",
      type: "text",
      initialValue: "Create professional websites in minutes with our intuitive drag-and-drop interface"
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array", 
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Feature Title" },
            { name: "description", type: "text", title: "Feature Description" },
            { name: "icon", type: "string", title: "Icon Name" },
            { name: "highlight", type: "boolean", title: "Highlight Feature" }
          ]
        }
      ],
      initialValue: [
        { _key: "visual-editor", title: "Visual Block Editor", description: "Intuitive drag-and-drop interface", icon: "blocks", highlight: true },
        { _key: "sanity-cms", title: "Sanity CMS Integration", description: "Seamless content management", icon: "database", highlight: false },
        { _key: "unlimited-custom", title: "Unlimited Customization", description: "Style everything to your needs", icon: "palette", highlight: false },
        { _key: "mobile-first", title: "Mobile-First Design", description: "Responsive on all devices", icon: "smartphone", highlight: false }
      ]
    }),
    defineField({
      name: "ctaButtons",
      title: "CTA Buttons",
      type: "array",
      of: [
        {
          type: "object", 
          fields: [
            { name: "label", type: "string", title: "Button Label" },
            { 
              name: "variant", 
              type: "string", 
              title: "Button Style",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" }, 
                  { title: "Tertiary", value: "tertiary" }
                ]
              }
            },
            { name: "icon", type: "string", title: "Icon Name" },
            {
              name: "link",
              type: "object",
              fields: [
                { name: "href", type: "string", title: "URL" },
                { name: "openInNewTab", type: "boolean", title: "Open in New Tab" }
              ]
            }
          ]
        }
      ],
      initialValue: [
        { _key: "start-building", label: "Start Building", variant: "primary", icon: "play", link: { href: "#", openInNewTab: false } },
        { _key: "watch-demo", label: "Watch Demo", variant: "secondary", icon: "external-link", link: { href: "#", openInNewTab: true } }
      ]
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true
      }
    })
  ]
});

export const heroBlockQuery = /* groq */ `
  _type == "heroBlock" => {
    _type,
    mainHeading,
    subHeading,
    topBadges[] {
      _key,
      text,
      icon
    },
    animationBlocks[] {
      _key,
      name,
      description,
      icon
    },
    features[] {
      _key,
      title,
      description,
      icon,
      highlight
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

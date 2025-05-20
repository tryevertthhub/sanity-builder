import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";
import { PhoneCall } from "lucide-react";

export const contactBlockQuery = /* groq */ `
  _type == "contactBlock" => {
    _type,
    sectionHeading,
    title,
    subtitle,
    phone,
    email,
    formConfig {
      heading,
      description,
      buttonText,
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

export const contactBlock = defineType({
  name: "contactBlock",
  title: "Contact Block",
  type: "object",
  icon: PhoneCall,
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Contact Block",
        subtitle: subtitle || "Get in touch section",
        media: () => "📞",
      };
    },
  },
  fields: [
    defineField({
      name: "sectionHeading",
      type: "string",
      title: "Section Heading",
      description: "The small heading text above the main title",
      validation: (Rule) => Rule.max(50),
      initialValue: "GET IN TOUCH",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The main heading for the contact section",
      initialValue: "Let's Start a Conversation",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "subtitle",
      type: "text",
      title: "Subtitle",
      description: "A brief description below the title",
      validation: (Rule) => Rule.max(200),
      initialValue:
        "Every inquiry is a priority - please describe your situation.",
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Phone Number",
      description: "Main contact phone number",
      initialValue: "503.877.4135",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email Address",
      description: "Main contact email address",
      initialValue: "garrett@cascadebusinesslaw.com",
    }),
    defineField({
      name: "formConfig",
      type: "object",
      title: "Contact Form Configuration",
      description: "Configure the contact form settings and messages",
      fields: [
        defineField({
          name: "heading",
          type: "string",
          title: "Form Heading",
          description: "Heading text above the contact form",
          initialValue: "Send Us a Message",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          type: "text",
          title: "Form Description",
          description:
            "Brief text explaining what happens when the form is submitted",
          initialValue:
            "Fill out the form below and we'll get back to you promptly. Your business matters to us.",
        }),
        defineField({
          name: "buttonText",
          type: "string",
          title: "Submit Button Text",
          description: "Text displayed on the form submit button",
          initialValue: "Send Message",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "successMessage",
          type: "string",
          title: "Success Message",
          description: "Message shown after successful form submission",
          initialValue:
            "Thank you for reaching out! We'll be in touch with you shortly.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "emailTo",
          type: "string",
          title: "Email Recipient",
          description: "Email address where form submissions will be sent",
          validation: (Rule) => Rule.required().email(),
          initialValue: "garrett@cascadebusinesslaw.com",
        }),
      ],
    }),
    defineField({
      name: "backgroundImage",
      type: "image",
      title: "Background Image",
      description:
        "Optional background image (will be overlaid with a gradient)",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "A description of the image for accessibility",
        },
      ],
    }),
  ],
});

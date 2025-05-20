import { defineField, defineType } from "@sanity/types";
import type { Rule } from "@sanity/types";

export const testimonialBlockQuery = /* groq */ `
  _type == "testimonialBlock" => {
    _type,
    sectionHeading,
    title,
    subtitle,
    testimonials[] {
      _key,
      quote,
      author,
      role,
      company,
      location,
      rating,
      image {
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

export const testimonialBlock = defineType({
  name: "testimonialBlock",
  title: "Testimonial Block",
  type: "object",
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Testimonial Block",
        subtitle: subtitle || "Client testimonials section",
        media: () => "💬",
      };
    },
  },
  fields: [
    defineField({
      name: "sectionHeading",
      title: "Section Heading",
      type: "string",
      description: "The small heading text above the main title",
      validation: (Rule) => Rule.max(50),
      initialValue: "CLIENT TESTIMONIALS",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The main heading for the testimonials section",
      validation: (Rule) => Rule.required().max(100),
      initialValue: "What Our Clients Say",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      description:
        "A brief description or subtitle for the testimonials section",
      validation: (Rule) => Rule.max(200),
      initialValue: "Discover why businesses trust us with their legal needs",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      description: "Add testimonials from your clients",
      validation: (Rule) => Rule.min(1).max(6),
      of: [
        {
          type: "object",
          preview: {
            select: {
              title: "author",
              subtitle: "quote",
              media: "image",
            },
          },
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              description: "The testimonial text",
              validation: (Rule) => Rule.required().min(20).max(300),
            }),
            defineField({
              name: "author",
              title: "Author Name",
              type: "string",
              description: "The name of the person giving the testimonial",
              validation: (Rule) => Rule.required().max(50),
            }),
            defineField({
              name: "role",
              title: "Role/Title",
              type: "string",
              description: "The job title or role of the person",
              validation: (Rule) => Rule.max(50),
            }),
            defineField({
              name: "company",
              title: "Company",
              type: "string",
              description: "The company or organization name",
              validation: (Rule) => Rule.max(50),
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
              description: "The location of the person or company (optional)",
              validation: (Rule) => Rule.max(50),
            }),
            defineField({
              name: "image",
              title: "Author Image",
              type: "image",
              description: "A photo of the person giving the testimonial",
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
            defineField({
              name: "rating",
              title: "Rating",
              type: "number",
              description: "Rating out of 5 stars",
              validation: (Rule) => Rule.min(1).max(5).precision(1),
              initialValue: 5,
            }),
          ],
        },
      ],
      initialValue: [
        {
          _key: "testimonial1",
          quote:
            "Working with this team has been transformative for our business. Their expertise and dedication to excellence have helped us navigate complex legal challenges with confidence.",
          author: "Sarah Anderson",
          role: "CEO",
          company: "TechVision Solutions",
          location: "San Francisco, CA",
          rating: 5,
        },
        {
          _key: "testimonial2",
          quote:
            "The level of professionalism and attention to detail is outstanding. They've consistently delivered results that exceed our expectations while maintaining clear communication throughout.",
          author: "Michael Chen",
          role: "Managing Director",
          company: "Global Ventures Inc.",
          location: "New York, NY",
          rating: 5,
        },
        {
          _key: "testimonial3",
          quote:
            "Their strategic approach to legal matters has been invaluable. They don't just solve problems – they anticipate and prevent them, saving us time and resources in the long run.",
          author: "Emily Roberts",
          role: "Legal Director",
          company: "Innovate Corp",
          location: "Chicago, IL",
          rating: 5,
        },
      ],
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      description:
        "A subtle background image for the testimonials section (optional)",
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

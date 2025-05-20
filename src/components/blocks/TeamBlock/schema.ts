import { UsersIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const teamBlockQuery = /* groq */ `
  _type == "team" => {
    ...,
    _type,
    heading,
    subheading,
    description,
    teamMembers[]{
      _key,
      name,
      credentials,
      role,
      roleDescription,
      email,
      specialties,
      image{
        asset->{
          _id,
          url,
          metadata{
            dimensions{
              width,
              height,
              aspectRatio
            }
          }
        },
        alt,
        hotspot{
          x,
          y
        }
      }
    }
  }
`;

export const teamBlock = defineType({
  name: "teamBlock",
  title: "Legal Team Block",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "The main heading for the team section",
      initialValue: "Leadership Team",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
      description: "A brief subheading that appears above the main heading",
      initialValue: "MEET OUR TEAM",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "A brief description of the legal team",
      initialValue:
        "At Cascade Business Law, we pride ourselves on our team's extensive experience and unwavering commitment to our clients' legal needs. Our attorneys bring a wealth of knowledge in business and real estate law, ensuring that we can provide comprehensive support for a wide range of legal challenges.",
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "credentials",
              title: "Credentials",
              type: "string",
              description: "Legal credentials and bar admissions",
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "roleDescription",
              title: "Role Description",
              type: "text",
              description:
                "A brief description of their expertise and focus areas",
            }),
            defineField({
              name: "specialties",
              title: "Practice Areas",
              type: "array",
              of: [{ type: "string" }],
              description: "Key areas of legal practice",
            }),
            defineField({
              name: "email",
              title: "Email",
              type: "string",
              validation: (Rule) => Rule.email(),
            }),
            defineField({
              name: "image",
              title: "Profile Image",
              type: "image",
              options: {
                hotspot: true,
              },
            }),
          ],
        },
      ],
      initialValue: [
        {
          name: "Garret Thompson",
          credentials: "J.D.",
          role: "Founder and Partner",
          roleDescription:
            "Leading our firm's strategic vision and practice, specializing in complex business transactions and real estate law with a focus on innovative legal solutions.",
          email: "garrett@cascadebusinesslaw.com",
          specialties: [
            "Business Law",
            "Real Estate Law",
            "Strategic Planning",
          ],
          _key: "garret-thompson",
        },
        {
          name: "Alexis Baello",
          credentials: "J.D.",
          role: "Of Counsel",
          roleDescription:
            "Providing expert counsel on sophisticated legal matters, with extensive experience in business law and complex commercial transactions.",
          email: "alexis@cascadebusinesslaw.com",
          specialties: [
            "Business Law",
            "Commercial Transactions",
            "Legal Strategy",
          ],
          _key: "alexis-baello",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Team Block",
    }),
  },
});

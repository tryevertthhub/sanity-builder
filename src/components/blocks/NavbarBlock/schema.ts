import { defineField, defineType } from "sanity";
import { PanelTop } from "lucide-react";
import { buttonsField } from "../../../sanity/schemaTypes/common";

export const navbarBlockQuery = /* groq */ `
  _type == "navbarBlock" => {
    _type,
    _key,
    buttons[]{
      _key,
      label,
      variant,
      link{
        href,
        openInNewTab
      }
    }
  }
`;

export const navbarBlock = defineType({
  name: "navbarBlock",
  title: "Site Navigation",
  type: "document",
  icon: PanelTop,
  description: "Configure the main navigation structure for your site",
  fields: [buttonsField],
  initialValue: {
    buttons: [
      {
        _key: "login",
        label: "Log in",
        variant: "outline",
        link: {
          href: "/login",
          openInNewTab: false,
        },
      },
      {
        _key: "signup",
        label: "Sign up",
        variant: "default",
        link: {
          href: "/signup",
          openInNewTab: false,
        },
      },
    ],
  },
  preview: {
    prepare: () => ({
      title: "Navigation",
    }),
  },
});

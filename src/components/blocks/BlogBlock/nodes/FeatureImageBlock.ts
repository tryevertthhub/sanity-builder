import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FeatureImageBlockNodeView } from "./FeatureImageBlockNodeView";

export const FeatureImageBlockExtension = {
  FeatureImageBlock: Node.create({
    name: "featureImageBlock",
    group: "block",
    content: "altBlock captionBlock", // Define child nodes
    draggable: true,

    addAttributes() {
      return {
        imageUrl: { default: "" },
        fullWidth: { default: true },
      };
    },

    parseHTML() {
      return [
        {
          tag: "feature-image-block",
          getAttrs: (node) => {
            const element = node as HTMLElement;
            return {
              imageUrl: element.getAttribute("data-image-url") || "",
              fullWidth: element.getAttribute("data-full-width") !== "false",
            };
          },
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "feature-image-block",
        mergeAttributes(HTMLAttributes, {
          "data-image-url": HTMLAttributes.imageUrl,
          "data-full-width": HTMLAttributes.fullWidth,
        }),
      ];
    },

    addNodeView() {
      return ReactNodeViewRenderer(FeatureImageBlockNodeView, {
        stopEvent: (event) => {
          const target = event.event.target as HTMLElement;
          return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
        },
      });
    },
  }),

  AltBlock: Node.create({
    name: "altBlock",
    group: "block",
    content: "inline*",

    parseHTML() {
      return [{ tag: "div.alt-block" }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "div",
        mergeAttributes(HTMLAttributes, { class: "alt-block" }),
        0,
      ];
    },
  }),

  CaptionBlock: Node.create({
    name: "captionBlock",
    group: "block",
    content: "inline*",

    parseHTML() {
      return [{ tag: "div.caption-block" }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "div",
        mergeAttributes(HTMLAttributes, { class: "caption-block" }),
        0,
      ];
    },
  }),
};

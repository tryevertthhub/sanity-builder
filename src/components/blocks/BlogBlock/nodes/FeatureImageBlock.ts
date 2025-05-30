import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Fragment } from "@tiptap/pm/model";
import { FeatureImageBlockNodeView } from "./FeatureImageBlockNodeView";

export const FeatureImageBlock = Node.create({
  name: "featureImageBlock",
  group: "block",
  content: "altBlock captionBlock",
  draggable: true,
  isolating: true,
  atom: false,

  addAttributes() {
    return {
      imageUrl: { default: "" },
      fullWidth: { default: true },
      altText: { default: "" },
      captionText: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "feature-image-block",
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          const imgElement = element.querySelector("img");
          const src = imgElement?.getAttribute("src") || "";
          const altElement = element.querySelector(".alt-block");
          const captionElement = element.querySelector(".caption-block");
          const altText = altElement?.textContent || "";
          const captionText = captionElement?.textContent || "";
          return { imageUrl: src, altText, captionText, fullWidth: true };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["feature-image-block", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FeatureImageBlockNodeView, {
      stopEvent: () => false,
    });
  },
});

const AltBlock = Node.create({
  name: "altBlock",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "div.alt-block" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: "alt-block" }), 0];
  },
});

const CaptionBlock = Node.create({
  name: "captionBlock",
  group: "block",
  content: "inline*",
  defining: true,

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
});

export const FeatureImageBlockExtension = {
  FeatureImageBlock,
  AltBlock,
  CaptionBlock,
};

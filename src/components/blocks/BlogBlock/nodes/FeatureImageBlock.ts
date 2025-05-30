import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FeatureImageBlockNodeView } from "./FeatureImageBlockNodeView";

export const FeatureImageBlock = Node.create({
  name: "featureImageBlock",
  group: "block",
  content: "",
  draggable: true,

  addAttributes() {
    return {
      imageUrl: { default: "" },
      alt: { default: "" },
      caption: { default: "" },
      fullWidth: { default: true },
    };
  },

  parseHTML() {
    return [{ tag: "feature-image-block" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["feature-image-block", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FeatureImageBlockNodeView, {
      stopEvent: (event) => {
        const target = event.event.target as HTMLElement;
        return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      },
    });
  },
});

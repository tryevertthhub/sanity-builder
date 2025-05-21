import { dataset, projectId } from "../lib/api";

export const getPreviewHook = (documentType: string) => {
  switch (documentType) {
    case "heroBlock":
      return {
        component: async () => {
          const { HeroBlockPreview } = await import(
            "../../components/blocks/HeroBlock/preview"
          );
          return HeroBlockPreview;
        },
      };
    default:
      return null;
  }
};

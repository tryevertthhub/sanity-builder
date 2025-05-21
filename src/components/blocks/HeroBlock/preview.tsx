import { type SanityDocument } from "@sanity/types";
import { HeroBlock, type HeroBlockProps } from "./index";

interface PreviewProps {
  document: SanityDocument & Partial<HeroBlockProps>;
  onEdit?: (field: string, value: any) => void;
}

export function HeroBlockPreview({ document, onEdit }: PreviewProps) {
  const {
    mainHeading = "",
    subHeading = "",
    description = "",
    serviceTags = [],
    featuredServices = [],
    ctaButtons = [],
    image,
  } = document;

  return (
    <HeroBlock
      _type="heroBlock"
      mainHeading={mainHeading}
      subHeading={subHeading}
      description={description}
      serviceTags={serviceTags}
      featuredServices={featuredServices}
      ctaButtons={ctaButtons}
      image={image}
      preview={true}
      onEdit={onEdit}
    />
  );
}

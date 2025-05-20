import { defineQuery } from "next-sanity";
import { testimonialBlockQuery } from "../../components/blocks/TestimonialBlock/schema";
import { statsBlockQuery } from "../../components/blocks/StatsBlock/schema";
import { servicesOverviewBlockQuery } from "../../components/blocks/ServicesOverviewBlock/schema";
import { processBlockQuery } from "../../components/blocks/ProcessBlock/schema";
import { newsletterBlockQuery } from "../../components/blocks/NewsletterBlock/schema";
import { contactBlockQuery } from "../../components/blocks/ContactBlock/schema";
import { blogPreviewBlockQuery } from "../../components/blocks/BlogPreviewBlock/schema";
import { whyChooseBlockQuery } from "../../components/blocks/WhyChooseBlock/schema";
import { teamBlockQuery } from "../../components/blocks/TeamBlock/schema";
import { servicesBlockQuery } from "../../components/blocks/ServicesBlock/schema";
import { heroBlockQuery } from "../../components/blocks/HeroBlock/schema";
import { ctaBlockQuery } from "@/src/components/blocks/CtaBlock/schema";

const imageFragment = /* groq */ `
  image{
    ...,
    "alt": coalesce(asset->altText, asset->originalFilename, "Image-Broken"),
    "blurData": asset->metadata.lqip,
    "dominantColor": asset->metadata.palette.dominant.background,
  }
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    ${markDefsFragment}
  }
`;

const blogAuthorFragment = /* groq */ `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

const blogCardFragment = /* groq */ `
  _type,
  _id,
  title,
  description,
  "slug":slug.current,
  richText,
  orderRank,
  ${imageFragment},
  publishedAt,
  ${blogAuthorFragment}
`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,
    ${testimonialBlockQuery},
    ${statsBlockQuery},
    ${servicesOverviewBlockQuery},
    ${processBlockQuery},
    ${newsletterBlockQuery},
    ${contactBlockQuery},
    ${blogPreviewBlockQuery},
    ${whyChooseBlockQuery},
    ${ctaBlockQuery},
    ${teamBlockQuery},
    ${servicesBlockQuery},
    ${heroBlockQuery}
  }
`;

export const queryHomePageData =
  defineQuery(/* groq */ `*[_type == "homePage" && _id == "homePage"][0]{
    ...,
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    ${pageBuilderFragment}
  }`);

export const querySlugPageData = defineQuery(/* groq */ `
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
  `);

export const querySlugPagePaths = defineQuery(/* groq */ `
  *[_type == "page" && defined(slug.current)].slug.current
`);

export const queryBlogIndexPageData = defineQuery(/* groq */ `
  *[_type == "blogIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "displayFeaturedBlogs" : displayFeaturedBlogs == "yes",
    "featuredBlogsCount" : featuredBlogsCount,
    ${pageBuilderFragment},
    "slug": slug.current,
    "blogs": *[_type == "blog" && (seoHideFromLists != true)] | order(orderRank asc){
      ${blogCardFragment}
    }
  }
`);

export const queryBlogSlugPageData = defineQuery(/* groq */ `
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current)].slug.current
`);

const ogFieldsFragment = /* groq */ `
  _id,
  _type,
  "title": select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    title
  ),
  "description": select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    description
  ),
  "image": image.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max", 
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max&q=100",
  "date": coalesce(date, _createdAt)
`;

export const queryHomePageOGData = defineQuery(/* groq */ `
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
  `);

export const querySlugPageOGData = defineQuery(/* groq */ `
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryBlogPageOGData = defineQuery(/* groq */ `
  *[_type == "blog" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryGenericPageOGData = defineQuery(/* groq */ `
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryFooterData = defineQuery(/* groq */ `
  *[_type == "footer" && _id == "footer"][0]{
    _id,
    subtitle,
    contactInfo{
      phone,
      email,
      address
    },
    socialLinks[]{
      _key,
      platform,
      url
    },
    columns[]{
      _key,
      title,
      links[]{
        _key,
        name,
        url{
          "href": select(
            type == "internal" => internal->slug.current,
            type == "external" => external,
            "#"
          ),
          "openInNewTab": openInNewTab
        }
      }
    },
    legalLinks[]{
      _key,
      name,
      url{
        "href": select(
          type == "internal" => internal->slug.current,
          type == "external" => external,
          "#"
        ),
        "openInNewTab": openInNewTab
      }
    },
    "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
    "siteTitle": *[_type == "settings"][0].siteTitle
  }
`);

export const queryNavbarData = defineQuery(/* groq */ `
  *[_type == "navbar" && _id == "navbar"][0]{
    _id,
    label,
    columns[]{
      _key,
      _type,
      name,
      title,
      url{
        "href": select(
          type == "internal" => internal->slug.current,
          type == "external" => external,
          "#"
        ),
        "openInNewTab": openInNewTab
      },
      links[]{
        _key,
        name,
        description,
        url{
          "href": select(
            type == "internal" => internal->slug.current,
            type == "external" => external,
            "#"
          ),
          "openInNewTab": openInNewTab
        }
      }
    },
    buttons[]{
      _key,
      label,
      variant,
      url{
        "href": select(
          type == "internal" => internal->slug.current,
          type == "external" => external,
          "#"
        ),
        "openInNewTab": openInNewTab
      }
    },
    "logo": coalesce(
      *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
      null
    ),
    "siteTitle": coalesce(*[_type == "settings"][0].siteTitle, "Site Title")
  }
`);

export const querySitemapData = defineQuery(/* groq */ `{
  "slugPages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "blogPages": *[_type == "blog" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  }
}`);

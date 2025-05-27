"use client";

import Link from "next/link";
import { Logo } from "../../logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "../../social-icons";

interface SocialLinksProps {
  data: Array<{
    _key: string;
    platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube";
    url: string;
  }>;
}

function SocialLinks({ data }: SocialLinksProps) {
  const iconMap = {
    facebook: FacebookIcon,
    twitter: XIcon,
    instagram: InstagramIcon,
    linkedin: LinkedinIcon,
    youtube: YoutubeIcon,
  };

  return (
    <div className="flex items-center justify-center gap-4 lg:justify-start">
      {data.map((link) => {
        const Icon = iconMap[link.platform];
        return (
          <Link
            key={link._key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white"
            aria-label={`Visit our ${link.platform} page`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}

interface FooterBlockProps {
  _type: "footerBlock";
  subtitle?: string;
  columns?: Array<{
    _key: string;
    title: string;
    links: Array<{
      _key: string;
      name: string;
      href: string;
      openInNewTab?: boolean;
    }>;
  }>;
  socialLinks?: Array<{
    _key: string;
    platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube";
    url: string;
  }>;
  logo?: string;
  siteTitle?: string;
}

export function FooterBlock({
  subtitle,
  columns = [],
  socialLinks = [],
  logo,
  siteTitle = "Site Title",
}: FooterBlockProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 pb-8" aria-label="Site footer">
      <div className="container mx-auto">
        <div className="h-[500px] lg:h-auto">
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 md:gap-8 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <Logo src={logo} alt={siteTitle} priority />
                </span>
                {subtitle && (
                  <p className="mt-6 text-sm text-muted-foreground dark:text-zinc-400">
                    {subtitle}
                  </p>
                )}
              </div>
              {socialLinks && <SocialLinks data={socialLinks} />}
            </div>
            {Array.isArray(columns) && columns?.length > 0 && (
              <div className="grid grid-cols-3 gap-6 lg:gap-28 lg:mr-20">
                {columns.map((column, index) => (
                  <div key={`column-${column?._key}-${index}`}>
                    <h3 className="mb-6 font-semibold">{column?.title}</h3>
                    {column?.links && column?.links?.length > 0 && (
                      <ul className="space-y-4 text-sm text-muted-foreground dark:text-zinc-400">
                        {column?.links?.map((link, index) => (
                          <li
                            key={`${link?._key}-${index}-column-${column?._key}`}
                            className="font-medium hover:text-primary"
                          >
                            <Link
                              href={link.href ?? "#"}
                              target={link.openInNewTab ? "_blank" : undefined}
                              rel={
                                link.openInNewTab
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
              <p className="text-xs leading-5 text-gray-500">
                &copy; {year} {siteTitle}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";
import Link from "next/link";
import { Logo } from "./logo";
import { MapPin, Mail, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "./social-icons";
import { usePathname } from "next/navigation";

interface FooterContentProps {
  subtitle?: string;
  columns?: Array<{
    title: string;
    links?: Array<{
      name: string;
      url?: {
        href: string;
        openInNewTab?: boolean;
      };
    }>;
  }>;
  socialLinks?: Array<{
    platform: "linkedin" | "facebook" | "twitter" | "instagram" | "youtube";
    url: string;
  }>;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  legalLinks?: Array<{
    name: string;
    url?: {
      href: string;
      openInNewTab?: boolean;
    };
  }>;
}

export function FooterContent({
  subtitle,
  columns,
  socialLinks,
  contactInfo,
  legalLinks,
}: FooterContentProps) {
  const pathname = usePathname();

  if (pathname === "/create" || pathname === "/studio") {
    return null;
  }

  const year = new Date().getFullYear();

  const socialIcons = {
    linkedin: LinkedinIcon,
    facebook: FacebookIcon,
    twitter: XIcon,
    instagram: InstagramIcon,
    youtube: YoutubeIcon,
  };

  return (
    <footer
      className="relative overflow-hidden bg-black py-24"
      aria-label="Site footer"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.gray.800/[0.05])_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.gray.800/[0.05])_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute -left-[40%] top-0 h-[1000px] w-[1000px] rounded-full bg-gradient-to-tr from-gray-800 to-gray-900 opacity-20 blur-3xl" />
        <div className="absolute -right-[40%] bottom-0 h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-gray-800 to-gray-900 opacity-20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-16 pb-16 lg:grid-cols-12">
            {/* Brand Column */}
            <div className="space-y-8 lg:col-span-4">
              <div className="space-y-6">
                <Logo priority width={110} height={20} />
                {subtitle && (
                  <p className="max-w-sm text-base leading-relaxed text-gray-400">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              {contactInfo && (
                <div className="space-y-4">
                  {contactInfo.phone && (
                    <div className="group flex items-center gap-3 text-sm text-gray-400">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:ring-white/20"
                        aria-hidden="true"
                      >
                        <Phone className="h-4 w-4" />
                      </div>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="transition-colors group-hover:text-white"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {contactInfo.email && (
                    <div className="group flex items-center gap-3 text-sm text-gray-400">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:ring-white/20"
                        aria-hidden="true"
                      >
                        <Mail className="h-4 w-4" />
                      </div>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="transition-colors group-hover:text-white"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  )}
                  {contactInfo.address && (
                    <div className="group flex items-start gap-3 text-sm text-gray-400">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:ring-white/20"
                        aria-hidden="true"
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                      <p className="transition-colors group-hover:text-white">
                        {contactInfo.address}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Social Links */}
              {socialLinks?.length > 0 && (
                <div className="flex items-center gap-4">
                  {socialLinks.map((link) => {
                    const Icon = socialIcons[link.platform];
                    return Icon ? (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:text-white hover:ring-white/20"
                      >
                        <Icon
                          className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          Follow us on {link.platform}
                        </span>
                      </a>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:gap-12">
                {columns?.map((column, columnIndex) => (
                  <div
                    key={`${column.title}-${columnIndex}`}
                    className="space-y-6"
                  >
                    <h3 className="relative inline-block text-sm font-semibold text-white">
                      {column.title}
                      <div
                        className="absolute -bottom-2 left-0 h-px w-12 bg-gradient-to-r from-white/30 to-transparent"
                        aria-hidden="true"
                      />
                    </h3>
                    {column.links?.length > 0 && (
                      <ul className="space-y-4">
                        {column.links.map((link, linkIndex) => (
                          <li key={`${link.name}-${linkIndex}`}>
                            <Link
                              href={link.url?.href || "#"}
                              prefetch={true}
                              target={
                                link.url?.openInNewTab ? "_blank" : undefined
                              }
                              rel={
                                link.url?.openInNewTab
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                            >
                              <span
                                className="h-1 w-1 rounded-full bg-white/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                              />
                              <span>{link.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="relative border-t border-white/10 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">
              <p className="relative">
                <span
                  className="absolute -left-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/30"
                  aria-hidden="true"
                />
                © {year} Cascade Business Law. All rights reserved.
              </p>

              {/* Legal Links */}
              {legalLinks?.length > 0 && (
                <div className="flex items-center gap-6">
                  {legalLinks.map((link, index) => (
                    <Link
                      key={`${link.name}-${index}`}
                      href={link.url?.href || "#"}
                      prefetch={true}
                      className="group relative text-gray-400 transition-colors hover:text-white"
                    >
                      <span className="relative z-10">{link.name}</span>
                      <span
                        className="absolute bottom-0 left-0 h-px w-full scale-x-0 bg-white/30 transition-transform duration-300 group-hover:scale-x-100"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Decorative bottom gradient line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

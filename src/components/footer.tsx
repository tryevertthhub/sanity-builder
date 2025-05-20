import Link from "next/link";
import { sanityFetch } from "@/src/sanity/lib/live";
import { queryFooterData } from "@/src/sanity/lib/query";
import { Logo } from "./logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "./social-icons";
import { MapPin, Mail, Phone } from "lucide-react";
import { FooterContent } from "./footer-content";

export function FooterSkeleton() {
  return (
    <section className="relative mt-20 pb-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-white" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.slate.100/[0.05])_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.100/[0.05])_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="container mx-auto">
        <footer className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-6">
                <div className="h-12 w-32 bg-blue-100/50 rounded-lg animate-pulse" />
                <div className="h-20 w-full max-w-sm bg-blue-100/50 rounded-lg animate-pulse" />
              </div>

              {/* Contact Info Skeleton */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-blue-100/50 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-blue-100/50 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Social Links Skeleton */}
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 bg-blue-100/50 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((col) => (
                  <div key={col} className="space-y-6">
                    <div className="h-4 w-24 bg-blue-100/50 rounded animate-pulse" />
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="h-4 w-full bg-blue-100/50 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="relative pt-8 border-t border-blue-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="h-4 w-48 bg-blue-100/50 rounded animate-pulse" />
              <div className="flex gap-6">
                <div className="h-4 w-24 bg-blue-100/50 rounded animate-pulse" />
                <div className="h-4 w-24 bg-blue-100/50 rounded animate-pulse" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          </div>
        </footer>
      </div>
    </section>
  );
}

export async function FooterServer() {
  const footerData = await sanityFetch({ query: queryFooterData });
  // console.log("Footer Response:", footerData);
  if (!footerData?.data) {
    console.log("No footer data found");
    return null;
  }

  const { subtitle, columns, socialLinks, contactInfo, legalLinks } =
    footerData.data;

  return (
    <FooterContent
      subtitle={subtitle}
      columns={columns}
      socialLinks={socialLinks}
      contactInfo={contactInfo}
      legalLinks={legalLinks}
    />
  );
}

"use client";

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { SanityImage } from "@/src/components/sanity-image";

interface NavbarContentProps {
  columns?: Array<{
    _key: string;
    _type: string;
    title?: string;
    name?: string;
    url?: {
      href: string;
      openInNewTab?: boolean;
    };
    links?: Array<{
      _key: string;
      name: string;
      description?: string;
      url?: {
        href: string;
        openInNewTab?: boolean;
      };
    }>;
  }>;
  buttons?: Array<{
    _key: string;
    label: string;
    variant?: "primary" | "secondary";
    url?: {
      href: string;
      openInNewTab?: boolean;
    };
  }>;
  logo?: string;
  siteTitle?: string;
}

export function NavbarContent({
  columns,
  buttons,
  logo,
  siteTitle,
}: NavbarContentProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuId = useId();

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const menuButton = document.querySelector('[aria-label="Toggle menu"]');

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        menuButton &&
        !menuButton.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Early return for excluded paths
  if (
    pathname === "/create" ||
    pathname === "/studio" ||
    pathname === "studio/presentation"
  ) {
    return null;
  }

  return (
    <>
      {/* Navbar Container */}
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "backdrop-blur-2xl shadow-xl shadow-black/10"
            : "bg-transparent"
        }`}
      >
        {/* Gradient Border Bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden="true"
        />

        <nav
          className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link
              href="/"
              prefetch={true}
              className="group relative -m-1.5 p-1.5 transition-transform duration-200 hover:scale-105"
            >
              <span className="sr-only">{siteTitle}</span>
              <Logo
                src={logo}
                alt={siteTitle}
                priority
                width={110}
                height={20}
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="group -m-3 inline-flex items-center justify-center rounded-full p-3 text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
              aria-controls={mobileMenuId}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X
                      className="h-6 w-6 transition-transform duration-200 group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu
                      className="h-6 w-6 transition-transform duration-200 group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            <Link href="/pages">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Pages
              </Button>
            </Link>
            {Array.isArray(columns) &&
              columns.map((item) => {
                if (!item?._key) return null;

                if (!item.links) {
                  return (
                    <Link
                      key={item._key}
                      href={item.url?.href || "#"}
                      prefetch={true}
                      target={item.url?.openInNewTab ? "_blank" : undefined}
                      rel={
                        item.url?.openInNewTab
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group relative text-sm font-medium text-gray-300 transition-all duration-200 hover:text-white"
                    >
                      {item.name}
                      <span
                        className="absolute -bottom-1 left-0 h-px w-full scale-x-0 bg-gradient-to-r from-white/60 via-white to-white/60 transition-transform duration-300 ease-out group-hover:scale-x-100"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                }

                const dropdownId = `${item._key}-dropdown`;
                return (
                  <div
                    key={item._key}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item._key)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    ref={dropdownRef}
                  >
                    <button
                      className="group flex items-center gap-x-1.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:text-white"
                      aria-haspopup="true"
                      aria-expanded={activeDropdown === item._key}
                      aria-controls={dropdownId}
                    >
                      {item.title}
                      <ChevronDown
                        className="h-4 w-4 flex-none text-gray-400 transition-all duration-300 ease-out group-hover:text-white group-hover:rotate-180"
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item._key && (
                        <motion.div
                          id={dropdownId}
                          role="menu"
                          aria-labelledby={item.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-xl bg-gray-900 p-2 shadow-xl shadow-black/20 ring-1 ring-white/10 backdrop-blur-lg"
                        >
                          <div className="relative">
                            {/* Subtle gradient overlay */}
                            <div
                              className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-50"
                              aria-hidden="true"
                            />

                            {Array.isArray(item.links) &&
                              item.links.map((link) => (
                                <Link
                                  key={link._key}
                                  href={link.url?.href || "#"}
                                  prefetch={true}
                                  target={
                                    link.url?.openInNewTab
                                      ? "_blank"
                                      : undefined
                                  }
                                  rel={
                                    link.url?.openInNewTab
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  role="menuitem"
                                  className="relative block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <span className="block font-medium">
                                    {link.name}
                                  </span>
                                  {link.description && (
                                    <span className="mt-1 block text-sm text-gray-500">
                                      {link.description}
                                    </span>
                                  )}
                                </Link>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
            {Array.isArray(buttons) &&
              buttons.map((button) => (
                <Link
                  key={button._key}
                  href={button.url?.href || "#"}
                  prefetch={true}
                  target={button.url?.openInNewTab ? "_blank" : undefined}
                  rel={
                    button.url?.openInNewTab ? "noopener noreferrer" : undefined
                  }
                  className={
                    button.variant === "primary"
                      ? "group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-gray-800 to-black px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
                      : "group relative text-sm font-medium text-gray-300 transition-all duration-200 hover:text-white"
                  }
                >
                  {button.variant === "primary" && (
                    <>
                      {/* Gradient hover effect */}
                      <div
                        className="absolute inset-0 flex translate-y-[101%] items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 transition-transform duration-300 group-hover:translate-y-0"
                        aria-hidden="true"
                      >
                        <span className="absolute">{button.label}</span>
                      </div>
                      <span className="transition-opacity duration-200 group-hover:opacity-0">
                        {button.label}
                      </span>
                    </>
                  )}
                  {button.variant !== "primary" && (
                    <>
                      {button.label}
                      <span
                        className="absolute -bottom-1 left-0 h-px w-full scale-x-0 bg-gradient-to-r from-white/60 via-white to-white/60 transition-transform duration-300 ease-out group-hover:scale-x-100"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Link>
              ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md lg:hidden"
              aria-hidden="true"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 top-24 z-40 mx-4 overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/20 ring-1 ring-white/10 backdrop-blur-lg lg:hidden"
              id={mobileMenuId}
            >
              {/* Subtle gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"
                aria-hidden="true"
              />

              <div className="relative px-4 py-6">
                <div className="space-y-1">
                  {Array.isArray(columns) &&
                    columns.map((item) => {
                      const label = item.name || item.title;
                      const href = item.url?.href || "#";

                      return (
                        <Link
                          key={item._key}
                          href={href}
                          prefetch={true}
                          className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {label}
                        </Link>
                      );
                    })}
                </div>
                {Array.isArray(buttons) && buttons.length > 0 && (
                  <div className="mt-6 border-t border-white/10 pt-6">
                    {buttons.map((button) => (
                      <Link
                        key={button._key}
                        href={button.url?.href || "#"}
                        prefetch={true}
                        className={
                          button.variant === "primary"
                            ? "group relative mb-3 block w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 text-center text-base font-medium text-white shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
                            : "block w-full rounded-lg px-3 py-2.5 text-base font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                        }
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {button.variant === "primary" && (
                          <>
                            {/* Gradient hover effect */}
                            <div
                              className="absolute inset-0 flex translate-y-[101%] items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 transition-transform duration-300 group-hover:translate-y-0"
                              aria-hidden="true"
                            >
                              <span className="absolute">{button.label}</span>
                            </div>
                            <span className="transition-opacity duration-200 group-hover:opacity-0">
                              {button.label}
                            </span>
                          </>
                        )}
                        {button.variant !== "primary" && button.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import { Logo } from "../../logo";

type ButtonType = {
  _key?: string;
  _type?: string;
  label?: string;
  link?: {
    href?: string;
    openInNewTab?: boolean;
  };
  variant?: "default" | "outline" | "secondary" | "link";
};

interface NavbarBlockProps {
  _type: "navbarBlock";
  columns?: Array<{
    _key: string;
    _type: "navbarLink" | "navbarColumn";
    name?: string;
    title?: string;
    links?: Array<{
      _key: string;
      name: string;
      description?: string;
      icon?: string;
      openInNewTab?: boolean;
      href: string;
    }>;
    href?: string;
    openInNewTab?: boolean;
  }>;
  buttons?: ButtonType[];
  logo?: string;
  siteTitle?: string;
}

// Custom SanityButtons component optimized for navbar
const SanityButtons = ({
  buttons,
  className = "",
  buttonClassName = "",
}: {
  buttons?: ButtonType[];
  className?: string;
  buttonClassName?: string;
}) => {
  if (!buttons || buttons.length === 0) return null;

  return (
    <div className={className}>
      {buttons.map((button, index) => {
        if (!button.link?.href) return null;

        const getButtonVariantClasses = () => {
          switch (button.variant) {
            case "outline":
              return "border border-violet-200/20 text-slate-800 hover:bg-violet-500/10 dark:border-violet-400/20 dark:text-slate-800 dark:hover:bg-violet-500/20 backdrop-blur-xl transition-all duration-300";
            case "secondary":
              return "bg-white/10 text-slate-800 hover:bg-white/20 dark:bg-gray-800/50 dark:text-slate-800 dark:hover:bg-gray-700/50 backdrop-blur-xl";
            case "link":
              return "text-violet-600 hover:text-violet-500 dark:text-violet-500 dark:hover:text-violet-400 p-0 hover:scale-105";
            default:
              return "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 dark:from-violet-500 dark:to-fuchsia-500 dark:hover:from-violet-400 dark:hover:to-fuchsia-400 shadow-lg shadow-violet-500/25 dark:shadow-violet-500/20";
          }
        };

        return (
          <Link
            key={button._key || index}
            href={button.link.href}
            target={button.link.openInNewTab ? "_blank" : "_self"}
            className={`${buttonClassName} inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-full transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${getButtonVariantClasses()}`}
          >
            {button.label}
          </Link>
        );
      })}
    </div>
  );
};

export function NavbarBlock({
  columns = [],
  buttons = [],
  logo,
  siteTitle = "Site Title",
}: NavbarBlockProps) {
  return (
    <div className="relative w-full">
      <header className="absolute inset-x-0 top-0 z-50 backdrop-blur-lg">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">{siteTitle}</span>
              <Logo src={logo} alt={siteTitle} priority />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {columns?.map((item) => {
              if (item._type === "navbarLink") {
                return (
                  <Link
                    key={item._key}
                    href={item.href || "#"}
                    target={item.openInNewTab ? "_blank" : undefined}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600"
                  >
                    {item.name}
                  </Link>
                );
              }

              if (item._type === "navbarColumn") {
                return (
                  <div key={item._key} className="relative group">
                    <button
                      type="button"
                      className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                    >
                      {item.title}
                      <svg
                        className="h-5 w-5 flex-none text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {item.links?.map((link) => (
                            <Link
                              key={link._key}
                              href={link.href}
                              target={link.openInNewTab ? "_blank" : undefined}
                              rel={
                                link.openInNewTab
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                            >
                              {link.icon && (
                                <img
                                  src={link.icon}
                                  alt=""
                                  className="h-6 w-6 flex-shrink-0 text-gray-600"
                                />
                              )}
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">
                                  {link.name}
                                </p>
                                {link.description && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {link.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-1 justify-end">
            <SanityButtons
              buttons={buttons}
              buttonClassName="mx-1.5"
              className="flex items-center gap-x-2"
            />
          </div>
        </nav>
      </header>
      {/* Add spacing below the navbar */}
      <div className="h-16" />
    </div>
  );
}

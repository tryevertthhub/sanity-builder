"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export type ServicesOverviewBlockProps = {
  _type: "servicesOverviewBlock";
  sectionHeading?: string;
  title?: string;
  subtitle?: string;
  productsHeading?: string;
  servicesHeading?: string;
  products?: {
    _key: string;
    name: string;
    icon?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
  }[];
  services?: {
    _key: string;
    title: string;
    description: string;
    icon?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
    link?: {
      href: string;
      openInNewTab: boolean;
    };
  }[];
  brokerageDescription?: string;
  additionalInfo?: string;
};

export function ServicesOverviewBlock({
  sectionHeading = "Our Financial Services",
  title,
  subtitle,
  productsHeading = "With over 30 approved insurance and annuity carriers, we provide a vast selection of products:",
  servicesHeading = "Our brokerage operation guides advisors step-by-step through the entire sales process",
  products = [],
  services = [],
  brokerageDescription,
  additionalInfo,
}: ServicesOverviewBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white z-0 py-12 sm:py-20"
    >
      {/* Background Patterns */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 -z-10"
      >
        {/* Grid pattern */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={isInView ? { scale: 1 } : { scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.slate.100/[0.05])_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.100/[0.05])_1px,transparent_1px)] bg-[size:80px_80px]"
        />
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl lg:max-w-4xl text-center mb-24"
        >
          {/* Decorative shine effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -inset-x-20 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl"
          >
            <motion.div
              animate={{
                rotate: [30, 35, 30],
                opacity: [0.3, 0.4, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-100 to-blue-50"
            />
          </motion.div>

          {/* Section heading with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative inline-flex items-center justify-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-50 via-blue-100/80 to-blue-50 shadow-sm"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative text-sm font-semibold tracking-wider uppercase bg-gradient-to-br from-blue-600 to-blue-800 text-transparent bg-clip-text"
              >
                {sectionHeading}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Main heading with gradient text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative mt-8 text-4xl font-bold tracking-tight sm:text-5xl [text-wrap:balance] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-transparent bg-clip-text"
          >
            {title}
          </motion.h2>

          {/* Subtitle with enhanced styling */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative mt-6"
            >
              <motion.p
                whileHover={{ x: 5 }}
                className="text-lg leading-8 text-slate-600 max-w-xl mx-auto [text-wrap:balance]"
              >
                {subtitle}
              </motion.p>
              {/* Decorative underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute left-1/2 bottom-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-200 to-transparent"
              />
            </motion.div>
          )}

          {/* Decorative corner lines */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-blue-100/50 rounded-tl-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-blue-100/50 rounded-br-xl"
          />
        </motion.div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative mb-20"
        >
          {/* Section Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute inset-0 -z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.4, 0.5, 0.4],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/40 via-white to-slate-50/40"
            />
            <motion.div
              initial={{ scale: 0.95 }}
              animate={isInView ? { scale: 1 } : { scale: 0.95 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="absolute inset-0 rounded-3xl bg-[linear-gradient(to_right,theme(colors.slate.100/[0.05])_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.100/[0.05])_1px,transparent_1px)] bg-[size:24px_24px]"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 backdrop-blur-sm"
          >
            <div className="px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 1.3 }}
                className="max-w-2xl mx-auto text-center mb-16"
              >
                <motion.h3
                  whileHover={{ x: 5 }}
                  className="relative inline-flex text-xl font-semibold text-slate-900 before:absolute before:-bottom-2 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-200 before:to-transparent"
                >
                  {productsHeading}
                </motion.h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.4, delay: 1.5 + index * 0.1 }}
                    whileHover={{
                      y: -5,
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                    }}
                    className="group relative rounded-xl p-4"
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="relative flex items-center gap-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-blue-600/5 text-blue-600 ring-1 ring-blue-100"
                      >
                        {product.icon ? (
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            src={product.icon.asset.url}
                            alt={product.icon.alt || ""}
                            className="h-6 w-6"
                          />
                        ) : (
                          <motion.svg
                            whileHover={{ scale: 1.1 }}
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </motion.svg>
                        )}
                      </motion.div>
                      <motion.p
                        whileHover={{ x: 5, color: "rgb(37, 99, 235)" }}
                        className="text-base font-medium text-slate-900"
                      >
                        {product.name}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <motion.h3
              whileHover={{ x: 5 }}
              className="text-xl font-semibold text-slate-900 mb-4"
            >
              {servicesHeading}
            </motion.h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {services.map((service, index) => (
              <motion.div
                key={service._key}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.4, delay: 1.9 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-xl shadow-blue-900/5"
              >
                {/* Service Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-600/5 text-blue-600 ring-1 ring-blue-100"
                >
                  {service.icon ? (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={service.icon.asset.url}
                      alt={service.icon.alt || ""}
                      className="h-6 w-6"
                    />
                  ) : (
                    <motion.svg
                      whileHover={{ scale: 1.1 }}
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </motion.svg>
                  )}
                </motion.div>

                {/* Service Content */}
                <motion.div whileHover={{ x: 5 }} className="space-y-4">
                  <motion.dt
                    whileHover={{ x: 5 }}
                    className="text-xl font-semibold leading-7 text-slate-900"
                  >
                    {service.link ? (
                      <motion.a
                        whileHover={{ color: "rgb(37, 99, 235)" }}
                        href={service.link.href}
                        target={service.link.openInNewTab ? "_blank" : "_self"}
                        rel={
                          service.link.openInNewTab
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {service.title}
                      </motion.a>
                    ) : (
                      service.title
                    )}
                  </motion.dt>
                  <motion.dd
                    whileHover={{ x: 5 }}
                    className="text-base leading-7 text-slate-600"
                  >
                    {service.description}
                  </motion.dd>
                </motion.div>

                {/* Decorative corner gradients */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent"
                />
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -bottom-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Content */}
          {(brokerageDescription || additionalInfo) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="relative mt-24 rounded-2xl p-8 sm:p-10 lg:p-12"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative grid gap-12 sm:grid-cols-2"
              >
                {brokerageDescription && (
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-xl bg-white/50 p-6 shadow-sm"
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-base leading-7 text-slate-600"
                    >
                      {brokerageDescription}
                    </motion.div>
                  </motion.div>
                )}
                {additionalInfo && (
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-xl bg-white/50 p-6 shadow-sm"
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="text-base leading-7 text-slate-600"
                    >
                      {additionalInfo}
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

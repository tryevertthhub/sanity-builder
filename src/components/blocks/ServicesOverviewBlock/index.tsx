"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { InlineEdit } from "@/src/components/shared/InlineEdit";

export type ServicesOverviewBlockProps = {
  _type: "servicesOverviewBlock";
  id?: string;
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
  onEdit?: (field: string, value: any) => void;
};

export function ServicesOverviewBlock({
  id,
  sectionHeading = "Our Financial Services",
  title,
  subtitle,
  productsHeading = "With over 30 approved insurance and annuity carriers, we provide a vast selection of products:",
  servicesHeading = "Our brokerage operation guides advisors step-by-step through the entire sales process",
  products = [],
  services = [],
  brokerageDescription,
  additionalInfo,
  onEdit,
}: ServicesOverviewBlockProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleFieldChange = (field: string, value: any) => {
    if (onEdit) {
      onEdit(field, value);
    }
  };

  const handleProductField = (index: number, field: string, value: string) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    handleFieldChange("products", newProducts);
  };

  const handleServiceField = (index: number, field: string, value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    handleFieldChange("services", newServices);
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-black py-12 sm:py-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(75,85,99,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-2xl lg:max-w-4xl text-center mb-24"
        >
          <InlineEdit
            value={sectionHeading}
            onChange={(val) => handleFieldChange("sectionHeading", val)}
            fieldName="sectionHeading"
            as="span"
            className="relative inline-flex items-center justify-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-50/10 via-blue-100/10 to-blue-50/10 text-blue-100"
          />

          <InlineEdit
            value={title}
            onChange={(val) => handleFieldChange("title", val)}
            fieldName="title"
            as="h2"
            className="relative mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          />

          {subtitle && (
            <InlineEdit
              value={subtitle}
              onChange={(val) => handleFieldChange("subtitle", val)}
              fieldName="subtitle"
              as="p"
              className="mt-6 text-lg leading-8 text-gray-400"
              multiline
            />
          )}
        </motion.div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-3xl border border-gray-800/50 bg-black/20 p-8 backdrop-blur-sm"
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
                <InlineEdit
                  value={productsHeading}
                  onChange={(val) => handleFieldChange("productsHeading", val)}
                  fieldName="productsHeading"
                  as="h3"
                  className="text-xl font-semibold text-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-8"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.4, delay: 1.5 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group relative rounded-xl p-6 bg-black/20 border border-gray-800/50 hover:border-gray-700/70 hover:bg-black/40 transition-all duration-300"
                  >
                    <motion.div className="relative flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 via-gray-900 to-black"
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
                            className="h-6 w-6 text-gray-300"
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
                      <InlineEdit
                        value={product.name}
                        onChange={(val) =>
                          handleProductField(index, "name", val)
                        }
                        fieldName={`products.${index}.name`}
                        as="p"
                        className="text-base font-medium text-white"
                      />
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
            <InlineEdit
              value={servicesHeading}
              onChange={(val) => handleFieldChange("servicesHeading", val)}
              fieldName="servicesHeading"
              as="h3"
              className="text-xl font-semibold text-white mb-4"
            />
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
                className="group relative bg-black/20 rounded-2xl p-8 border border-gray-800/50 hover:border-gray-700/70 hover:bg-black/40 transition-all duration-300"
              >
                {/* Service Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-black"
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
                      className="h-6 w-6 text-gray-300"
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
                  <InlineEdit
                    value={service.title}
                    onChange={(val) => handleServiceField(index, "title", val)}
                    fieldName={`services.${index}.title`}
                    as="dt"
                    className="text-xl font-semibold text-white"
                  />
                  <InlineEdit
                    value={service.description}
                    onChange={(val) =>
                      handleServiceField(index, "description", val)
                    }
                    fieldName={`services.${index}.description`}
                    as="dd"
                    className="text-base leading-7 text-gray-400"
                    multiline
                  />
                </motion.div>
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
                    className="relative rounded-xl bg-black/20 p-6 border border-gray-800/50 hover:border-gray-700/70 hover:bg-black/40 transition-all duration-300"
                  >
                    <InlineEdit
                      value={brokerageDescription}
                      onChange={(val) =>
                        handleFieldChange("brokerageDescription", val)
                      }
                      fieldName="brokerageDescription"
                      as="p"
                      className="text-base leading-7 text-gray-400"
                      multiline
                    />
                  </motion.div>
                )}
                {additionalInfo && (
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="relative rounded-xl bg-black/20 p-6 border border-gray-800/50 hover:border-gray-700/70 hover:bg-black/40 transition-all duration-300"
                  >
                    <InlineEdit
                      value={additionalInfo}
                      onChange={(val) =>
                        handleFieldChange("additionalInfo", val)
                      }
                      fieldName="additionalInfo"
                      as="p"
                      className="text-base leading-7 text-gray-400"
                      multiline
                    />
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
